/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTLinkingManager.h>

#import <Firebase.h>
#import <RNGoogleSignin/RNGoogleSignin.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSString* language = [[NSLocale preferredLanguages] firstObject];
  // firebase
  NSString* bundleId = @"com.senti.app";
  NSString* googleAppId = @"1:515616876137:ios:62ad51c535020a86";
  NSString* gcmSenderId = @"515616876137";
  NSString* projectId = @"senti-en";
  NSString* apiKey = @"AIzaSyDs0m4RGQvjg6Y2HwLvoYrIu2VfOi6W5oo";
  NSString* clientId = @"515616876137-5nqdm0m2m7nflbi5cn5a92fgdq36mnuj.apps.googleusercontent.com";
  NSString* databaseUrl = @"https://senti-en.firebaseio.com";
  NSString* storageBucket = @"senti-en.appspot.com";

  if ([language hasPrefix: @"ko"]) {
    googleAppId = @"1:840017091759:ios:62ad51c535020a86";
    gcmSenderId = @"840017091759";
    projectId = @"senti-ko";
    apiKey = @"AIzaSyDYlkBCjvG4gJ13dA4IZZlPL5mKXZb6WIQ";
    clientId = @"840017091759-qmsf0g013i4ij2e6l6cdgm5s8qdj8doe.apps.googleusercontent.com";
    databaseUrl = @"https://senti-ko.firebaseio.com";
    storageBucket = @"senti-ko.appspot.com";
  }

  FIROptions* options = [[FIROptions alloc] initWithGoogleAppID: googleAppId GCMSenderID: gcmSenderId];
  [options setBundleID: bundleId];
  [options setAPIKey: apiKey];
  [options setClientID: clientId];
  [options setDatabaseURL: databaseUrl];
  [options setStorageBucket: storageBucket];
  [options setProjectID: projectId];
  [FIRApp configureWithOptions: options];

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"Senti"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  // facebook
  [[FBSDKApplicationDelegate sharedInstance] application:application
                           didFinishLaunchingWithOptions:launchOptions];
  return YES;
}

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication
         annotation:(id)annotation
{
  return [[FBSDKApplicationDelegate sharedInstance] application:application
                                                        openURL:url
                                              sourceApplication:sourceApplication
                                                     annotation:annotation
          ]
          ||
          [RNGoogleSignin application:application
                              openURL:url
                    sourceApplication:sourceApplication
                           annotation:annotation
          ];
}

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary *)options
{
  
  if ([[FBSDKApplicationDelegate sharedInstance] application:application
                                                     openURL:url
                                           sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]
                                                  annotation:options[UIApplicationOpenURLOptionsAnnotationKey]])
  {
    return YES;
  }

  if ([RNGoogleSignin application:application
                          openURL:url
                sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]
                       annotation:options[UIApplicationOpenURLOptionsAnnotationKey]]) {
    return YES;
  }
  
  return [RCTLinkingManager application:application openURL:url options:options];
}


- (BOOL)application:(UIApplication *)application
continueUserActivity:(NSUserActivity *)userActivity
 restorationHandler:(void (^)(NSArray *_Nullable))restorationHandler
{
  return [RCTLinkingManager application:application
                   continueUserActivity:userActivity
                     restorationHandler:restorationHandler];;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
