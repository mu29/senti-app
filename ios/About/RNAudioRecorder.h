//
//  RNAudioRecorder.m
//  About
//
//  Created by injung on 15/05/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <AVFoundation/AVFoundation.h>

@interface RNAudioRecorder : RCTEventEmitter <RCTBridgeModule, AVAudioRecorderDelegate>

@end
