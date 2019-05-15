//
//  RNAudioRecorder.m
//  About
//
//  Created by injung on 15/05/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "RNAudioRecorder.h"
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>
#import <math.h>

#define RIFF_ID 0x52494646 // "RIFF"
#define RIFF_FMT_ID 0x666d7420 // "fmt "
#define RIFF_DATA_ID 0x64617461 // "data"

typedef struct riffChunkHeader {
  UInt32 rsc_id; // big endian
  UInt32 rsc_size; // little endian
} riffChunkHeader_t;

@implementation RNAudioRecorder {
  AVAudioRecorder *recorder;
  AVAudioSession *recordSession;
  NSTimer *timer;
  int secondsElapsed;
  NSString *outputPath;
  int sampleRate;
}

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE(RNAudioRecorder);

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

- (NSDictionary *)constantsToExport
{
  return @{
           @"DocumentDirectoryPath": [self getPathForDirectory:NSDocumentDirectory]
           };
}

- (NSString *)getPathForDirectory:(int)directory
{
  NSArray *paths = NSSearchPathForDirectoriesInDomains(directory, NSUserDomainMask, YES);
  return [paths firstObject];
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"AudioRecorder:progress"];
}

- (NSString *) applicationDocumentsDirectory
{
  NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
  NSString *basePath = ([paths count] > 0) ? [paths objectAtIndex:0] : nil;
  return basePath;
}

- (void)startTimer {
  [self stopTimer];

  secondsElapsed = 0;

  timer = [NSTimer timerWithTimeInterval:0.1 target:self selector:@selector(updateProgress:) userInfo:nil repeats:YES];
  [[NSRunLoop mainRunLoop] addTimer:timer forMode:NSRunLoopCommonModes];
}

- (void)stopTimer {
  if (timer != nil) {
    [timer invalidate];
    timer = nil;
  }
}

- (void)updateProgress:(NSTimer *)timer {
  if (!recorder || !recorder.isRecording) {
    return;
  }

  secondsElapsed++;

  [recorder updateMeters];
  int currentMetering = [self getMeteringLevel];

  NSDictionary *body = @{
                         @"currentTime": @(secondsElapsed/10.0),
                         @"currentMetering": @(currentMetering)
                         };

  [self sendEventWithName:@"AudioRecorder:progress" body:body];
}

- (int)getMeteringLevel {
  float Amplitude;
  const float minDecibels = -120.0f;
  float decibels = [recorder averagePowerForChannel:0];

  if (decibels < minDecibels) {
    Amplitude = 0.0f;
  } else if (decibels >= 0.0f) {
    Amplitude = 1.0f;
  } else {
    Amplitude = powf(10.0f, 0.05f * decibels);
  }

  return (int) ceil(Amplitude * 1000.0);
}

#pragma mark - Reaction Methods

RCT_EXPORT_METHOD(setup:(NSString *)outputPath
                  sampleRate:(int)rate
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  sampleRate = rate;
  outputPath = outputPath;

  recordSession = [AVAudioSession sharedInstance];

  NSDictionary *settings = @{
                             AVEncoderAudioQualityKey: @(AVAudioQualityMedium),
                             AVFormatIDKey: @(kAudioFormatLinearPCM),
                             AVNumberOfChannelsKey: @1,
                             AVLinearPCMBitDepthKey: @16,
                             AVSampleRateKey: @(rate),
                             AVLinearPCMIsBigEndianKey: @NO,
                             AVLinearPCMIsFloatKey: @NO
                             };

  NSError *error = nil;

  recorder = [[AVAudioRecorder alloc]
               initWithURL:[NSURL fileURLWithPath:outputPath]
               settings:settings
               error:&error];

  if (error) {
    reject(@"FAILED_TO_SETUP", [error localizedDescription], nil);
  } else {
    recorder.meteringEnabled = YES;
    recorder.delegate = self;

    [recorder prepareToRecord];
  }

  resolve(@YES);
}

RCT_EXPORT_METHOD(start:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  if (!recorder || recorder.isRecording) {
    reject(@"INVALID_STATE", @"Please call stopRecording before starting recording", nil);
    return;
  }

  [self startTimer];

  [recordSession setCategory:AVAudioSessionCategoryPlayAndRecord
                  withOptions:AVAudioSessionCategoryOptionDefaultToSpeaker
   |AVAudioSessionCategoryOptionAllowBluetooth
                        error:nil];
  [recordSession setMode:AVAudioSessionModeDefault error:nil];

  AVAudioSessionDataSourceDescription *dataSource = [recordSession inputDataSource];
  if (dataSource && [[dataSource supportedPolarPatterns] containsObject:AVAudioSessionPolarPatternCardioid]) {
    [[recordSession inputDataSource] setPreferredPolarPattern:AVAudioSessionPolarPatternCardioid error:nil];
  }

  [recordSession setActive:YES error:nil];

  [recorder record];

  resolve(@YES);
}

NSData *extractRiffChunk(NSData *riffData, UInt32 extractId, BOOL extractOnlyData) {
  NSUInteger offset = 0;

  while (([riffData length] - offset) >= sizeof(riffChunkHeader_t)) {
    NSData *riffChunkRange = [riffData subdataWithRange:
                              NSMakeRange(offset, sizeof(riffChunkHeader_t))];
    const riffChunkHeader_t *riffChunk = [riffChunkRange bytes];
    UInt32 riffId = NSSwapBigIntToHost(riffChunk->rsc_id);
    NSUInteger riffSize = NSSwapLittleIntToHost(riffChunk->rsc_size);
    // treat RIFF chunk as a subchunk containing format
    if (riffId == RIFF_ID) {
      riffSize = 4;
    }

    if (riffId != extractId) {
      offset += sizeof(riffChunkHeader_t) + riffSize;
      continue;
    }

    NSUInteger len;
    if (extractOnlyData) {
      offset += sizeof(riffChunkHeader_t);
      len = riffSize;
    } else {
      len = sizeof(riffChunkHeader_t) + riffSize;
    }

    if (([riffData length] - offset) < riffSize) {
      break;
    }

    return [riffData subdataWithRange:NSMakeRange(offset, len)];
  }

  return nil;
}

NSData *extractRiffChunkAll(NSData *riffData, UInt32 extractId) {
  return extractRiffChunk(riffData, extractId, NO);
}

NSData *extractRiffChunkData(NSData *riffData, UInt32 extractId) {
  return extractRiffChunk(riffData, extractId, YES);
}

RCT_EXPORT_METHOD(stop:(double)startTime
                  isAuto:(BOOL)isAuto
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  if (!recorder || !recorder.isRecording) {
    resolve(@"");
    return;
  }

  [self stopRecorder];

  // 파일 읽기
  NSData *outputFileData = [NSData dataWithContentsOfFile:outputPath];

  NSMutableData *riffData = [extractRiffChunkAll(outputFileData, RIFF_ID) mutableCopy];
  NSData *fmtData = extractRiffChunkAll(outputFileData, RIFF_FMT_ID);
  NSData *audioData = extractRiffChunkData(outputFileData, RIFF_DATA_ID);

  // 시간 자르기
  long audioDataLength = [audioData length];
  bool isChanged = false;
  long endPos = audioDataLength;
  long startPos = 0;

  if (isAuto && audioDataLength > 32000) {
    isChanged = true;
    endPos = fmax(0, audioDataLength - 32000);
    if (endPos % 2 != 0) {
      endPos += 1;
    }
  }

  if (startTime > 0) {
    isChanged = true;
    startPos = (long) (startTime * 32000.0);
    if (startPos % 2 != 0) {
      startPos += 1;
    }
  }

  if (isChanged) {
    audioData = [audioData subdataWithRange:NSMakeRange(startPos, (endPos - startPos))];
    audioDataLength = [audioData length];
  }

  NSString *base64Content = [audioData base64EncodedStringWithOptions:0];

  // 헤더 보정
  riffChunkHeader_t riffDataSubChunk;
  riffDataSubChunk.rsc_id = NSSwapHostIntToBig(RIFF_DATA_ID);
  riffDataSubChunk.rsc_size = NSSwapHostIntToLittle((UInt32)audioDataLength);

  NSData *headerData = [NSData dataWithBytes:&riffDataSubChunk
                                      length:sizeof(riffDataSubChunk)];

  @try {
    riffChunkHeader_t *riffChunk = [riffData mutableBytes];
    riffChunk->rsc_size = NSSwapHostIntToLittle(sizeof(riffChunkHeader_t) +
                                                (UInt32)[fmtData length] +
                                                (UInt32)[headerData length] +
                                                (UInt32)audioDataLength);

    // 파일 쓰기
    NSMutableData *wavDatas = [[NSMutableData alloc]init];
    [wavDatas appendData:riffData];
    [wavDatas appendData:fmtData];
    [wavDatas appendData:headerData];
    [wavDatas appendData:audioData];

    [wavDatas writeToFile:outputPath atomically:YES];
  }
  @catch (NSException *e) {
    reject(@"FAILED_TO_STOP",  e.reason, nil);
    return;
  }

  resolve(base64Content);
}

RCT_EXPORT_METHOD(cancel:(RCTPromiseResolveBlock)resolve
                  rejecter:(__unused RCTPromiseRejectBlock)reject)
{
  if (!recorder || !recorder.isRecording) {
    resolve(@NO);
    return;
  }

  [self stopRecorder];

  resolve(@YES);
}

- (void)stopRecorder {
  [self stopTimer];

  [recorder stop];

  [recordSession setCategory:AVAudioSessionCategoryPlayback error:nil];
  [recordSession setActive:NO error:nil];
}

RCT_EXPORT_METHOD(requestPermission:(RCTPromiseResolveBlock)resolve
                  rejecter:(__unused RCTPromiseRejectBlock)reject)
{
  [[AVAudioSession sharedInstance] requestRecordPermission:^(BOOL granted) {
    if(granted) {
      resolve(@YES);
    } else {
      resolve(@NO);
    }
  }];
}

@end
