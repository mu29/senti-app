//
//  RNConfig.m
//  Senti
//
//  Created by injung on 11/09/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <React/RCTBridgeModule.h>

@interface RNConfig : NSObject <RCTBridgeModule>
@end

@implementation RNConfig

RCT_EXPORT_MODULE(RNConfig)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

- (NSDictionary *)constantsToExport
{
  UIDevice *currentDevice = [UIDevice currentDevice];
  
  return @{
           @"systemVersion": currentDevice.systemVersion,
           @"appVersion": [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleShortVersionString"] ?: [NSNull null],
           @"apiUrl": [[NSBundle mainBundle] objectForInfoDictionaryKey:@"API_URL"] ?: [NSNull null],
           @"websiteUrl": [[NSBundle mainBundle] objectForInfoDictionaryKey:@"WEBSITE_URL"] ?: [NSNull null],
           @"webClientId": [[NSBundle mainBundle] objectForInfoDictionaryKey:@"FIREBASE_WEB_CLIENT_ID"] ?: [NSNull null],
           @"language": [self getLanguage]
           };
}

- (NSString *)getLanguage
{
  NSArray<NSString *> *preferredLanguages = [NSLocale preferredLanguages];
  NSString *preferredLanguage = [preferredLanguages firstObject];
  if (preferredLanguage == nil) return @"en";
  
  NSLocale *locale = [[NSLocale alloc] initWithLocaleIdentifier:preferredLanguage];
  return [locale objectForKey:NSLocaleLanguageCode];
}

@end
