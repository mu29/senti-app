declare module 'react-native-sound-recorder' {
  function start(path: string, options?: Object): Promise<void>;
  function stop(): Promise<{ path: string, duration: number }>;
  function pause(): Promise<void>;
  function resume(): Promise<void>;

  const PATH_DOCUMENT: string;
  const PATH_CACHE: string;

  const SOURCE_CAMCORDER: string;
  const SOURCE_MIC: string;
  const SOURCE_REMOTE_SUBMIX: string;
  const SOURCE_VOICE_CALL: string;
  const SOURCE_VOICE_COMMUNICATION: string;
  const SOURCE_VOICE_DOWNLINK: string;
  const SOURCE_VOICE_RECOGNITION: string;
  const SOURCE_VOICE_UPLINK: string;

  const FORMAT_AAC_ADTS: string;
  const FORMAT_AMR_NB: string;
  const FORMAT_AMR_WB: string;
  const FORMAT_MPEG_4: string;
  const FORMAT_THREE_GPP: string;
  const FORMAT_WEBM: string;

  const ENCODER_AAC: string;
  const ENCODER_AAC_ELD: string;
  const ENCODER_AMR_NB: string;
  const ENCODER_AMR_WB: string;
  const ENCODER_HE_AAC: string;
  const ENCODER_VORBIS: string;
}
