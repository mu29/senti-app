//
//  RNAppleSignIn.m
//  Senti
//
//  Created by injung on 10/10/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#else
#import <React/RCTBridgeModule.h>
#endif

#import <React/RCTUtils.h>
#import <AuthenticationServices/AuthenticationServices.h>

@interface RNPromiseManager : NSObject

-(void) setPromise: (RCTPromiseResolveBlock) resolve rejector: (RCTPromiseRejectBlock) reject;
-(void) resolve: (NSDictionary*) result;
-(void) reject: (NSError*) error;

@end

@interface RNPromiseManager ()

@property (nonatomic, strong) RCTPromiseResolveBlock promiseResolve;
@property (nonatomic, strong) RCTPromiseRejectBlock promiseReject;

@end

@implementation RNPromiseManager

-(void) setPromise: (RCTPromiseResolveBlock) resolve rejector: (RCTPromiseRejectBlock) reject {
    if (self.promiseResolve) {
        NSMutableDictionary* details = [NSMutableDictionary dictionary];
        [details setValue:@"Promise cancelled" forKey: NSLocalizedDescriptionKey];
        [self reject: [NSError errorWithDomain: @"RNAppleSignIn" code: 200 userInfo: details]];
    }
    self.promiseResolve = resolve;
    self.promiseReject = reject;
}

-(void) resolve: (NSDictionary*) result {
    if (self.promiseResolve != nil) {
        self.promiseResolve(result);
        [self reset];
    }
}

-(void) reject: (NSError *)error {
    if (self.promiseReject != nil) {
        NSString* code = [NSString stringWithFormat:@"%ld", (long) error.code];
        NSString* message = error.localizedDescription;

        self.promiseReject(code, message, error);
        [self reset];
    }
}

-(void) reset {
    self.promiseResolve = nil;
    self.promiseReject = nil;
}

@end

@import SafariServices;

@interface RNAppleSignIn : NSObject <RCTBridgeModule, SFSafariViewControllerDelegate, ASWebAuthenticationPresentationContextProviding>

@end

@interface RNAppleSignIn()

@property (nonatomic) RNPromiseManager* _promiseManager;
@property (nonatomic) API_AVAILABLE(ios(12.0)) ASWebAuthenticationSession* _webAuthenticationVC;
@property (nonatomic) API_AVAILABLE(ios(11.0)) SFAuthenticationSession* _authenticationVC;
@property (nonatomic) SFSafariViewController* _safariVC;

@end

@implementation RNAppleSignIn

RCT_EXPORT_MODULE()

-(instancetype) init {
    self = [super init];
    if (self != nil) {
        self._promiseManager = [[RNPromiseManager alloc] init];
    }
    return self;
}

+(BOOL) requiresMainQueueSetup {
    return NO;
}

RCT_EXPORT_METHOD(signIn: (NSDictionary*) config
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject)
{
    NSURLComponents* loginUrl = [[NSURLComponents alloc] init];
    loginUrl.scheme = @"https";
    loginUrl.host = @"appleid.apple.com";
    loginUrl.path = @"/auth/authorize";
    loginUrl.queryItems = @[
       [NSURLQueryItem queryItemWithName: @"client_id" value: config[@"clientId"]],
       [NSURLQueryItem queryItemWithName: @"redirect_uri" value: config[@"urlScheme"]],
       [NSURLQueryItem queryItemWithName: @"state" value: config[@"state"]],
       [NSURLQueryItem queryItemWithName: @"scope" value: @"name email"],
       [NSURLQueryItem queryItemWithName: @"response_mode" value: @"form_post"],
       [NSURLQueryItem queryItemWithName: @"response_type" value: @"code"]
    ];

    [self._promiseManager setPromise: resolve rejector: reject];

//    if (@available(iOS 12.0, *)) {
//        self._webAuthenticationVC = [[ASWebAuthenticationSession alloc]
//                                initWithURL: loginUrl.URL
//                                callbackURLScheme: config[@"urlScheme"]
//                                completionHandler: ^(NSURL * _Nullable callbackURL, NSError * _Nullable error) {
//                                    if (callbackURL) {
//                                        [self handleOAuthResult: callbackURL];
//                                    } else {
//                                        [self._promiseManager reject: error];
//                                        [self reset];
//                                    }
//                                }];
//
//        [self._webAuthenticationVC start];
    if (@available(iOS 11.0, *)) {
        self._authenticationVC = [[SFAuthenticationSession alloc]
                             initWithURL: loginUrl.URL
                             callbackURLScheme: config[@"urlScheme"]
                             completionHandler: ^(NSURL * _Nullable callbackURL, NSError * _Nullable error) {
                                 if (callbackURL) {
                                     [self handleOAuthResult: callbackURL];
                                 } else {
                                     [self._promiseManager reject: error];
                                     [self reset];
                                 }
                            }];
        [self._authenticationVC start];
    } else {
        [[NSNotificationCenter defaultCenter] addObserver: self
                                                 selector: @selector(receiveCallbackUrl:)
                                                     name: @"RNAppleSignIn"
                                                   object: nil];

        self._safariVC = [[SFSafariViewController alloc] initWithURL: loginUrl.URL];
        self._safariVC.delegate = self;
        [RCTPresentedViewController() presentViewController: self._safariVC animated: true completion: nil];
    }
}

-(void) handleOAuthResult: (NSURL*) url {
    NSURLComponents* components = [[NSURLComponents alloc] initWithURL: url resolvingAgainstBaseURL: NO];
    NSArray* queries = components.queryItems;
    
    NSMutableDictionary* params = [[NSMutableDictionary alloc] init];
    for (NSURLQueryItem* item in queries) {
        [params setValue: item.value forKey: item.name];
    }

    [self._promiseManager resolve: params];
    [self reset];
}

-(void) receiveCallbackUrl: (NSNotification*) notification {
    [self._safariVC dismissViewControllerAnimated: YES completion: nil];
    [self handleOAuthResult: notification.object];
}

-(void) safariViewControllerDidFinish:(nonnull SFSafariViewController *)controller
{
    NSMutableDictionary* details = [NSMutableDictionary dictionary];
    [details setValue:@"User cancelled login process" forKey: NSLocalizedDescriptionKey];
    [self._promiseManager reject: [NSError errorWithDomain: @"RNAppleSignIn" code: 201 userInfo: details]];
    [self reset];
}

-(void) reset {
    [[NSNotificationCenter defaultCenter] removeObserver: self name: @"RNAppleSignIn" object: nil];
    if (@available(iOS 12.0, *)) {
        self._webAuthenticationVC = nil;
    } else if (@available(iOS 11.0, *)) {
        self._authenticationVC = nil;
    } else {
        self._safariVC = nil;
    }
}

@end
