package com.about;

import android.content.Context;
import android.media.AudioDeviceInfo;
import android.media.AudioFormat;
import android.media.AudioManager;
import android.media.AudioRecord;
import android.media.MediaRecorder;
import android.media.audiofx.AcousticEchoCanceler;
import android.media.audiofx.AutomaticGainControl;
import android.media.audiofx.NoiseSuppressor;
import android.util.Base64;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.IOException;
import java.io.RandomAccessFile;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.HashMap;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

public class RNAudioRecorderModule extends ReactContextBaseJavaModule {

    private static final String LOG_TAG = "RNAudioRecorder";

    private static final String DocumentDirectoryPath = "DocumentDirectoryPath";

    private AudioRecord recorder = null;
    private AudioManager audioManager = null;

    private boolean isRecording = false;
    private boolean isBluetoothOn = false;

    private int bufferSize;
    private int sampleRate;
    private short[] buffer;

    private int currentAmplitude;
    private Timer timer;
    private int secondsElapsed;

    private String outputPath;
    private RandomAccessFile outputStream;

    RNAudioRecorderModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "RNAudioRecorder";
    }

    @Override
    public Map<String, Object> getConstants() {
        Map<String, Object> constants = new HashMap<>();
        constants.put(DocumentDirectoryPath, this.getReactApplicationContext().getFilesDir().getAbsolutePath());

        return constants;
    }

    @ReactMethod
    @SuppressWarnings("unused")
    public void setup(ReadableMap settings, Promise promise) {
        outputPath = settings.getString("outputPath");
        sampleRate = settings.getInt("sampleRate");

        audioManager = (AudioManager) getReactApplicationContext().getSystemService(Context.AUDIO_SERVICE);

        if (audioManager != null) {
            audioManager.setParameters("noise_suppression=auto");
        }

        if (isBluetoothConnected()) {
            audioManager.startBluetoothSco();
            isBluetoothOn = true;
        }

        promise.resolve(true);
    }

    @ReactMethod
    @SuppressWarnings("unused")
    public void start(Promise promise) {
        if (isRecording) {
            abort(promise, "INVALID_STATE", "Please call stop before starting recording");
            return;
        }

        currentAmplitude = 0;

        bufferSize = AudioRecord.getMinBufferSize(
            sampleRate,
            AudioFormat.CHANNEL_IN_MONO,
            AudioFormat.ENCODING_PCM_16BIT
        );

        if (bufferSize == AudioRecord.ERROR || bufferSize == AudioRecord.ERROR_BAD_VALUE) {
            bufferSize = sampleRate * 2;
        }

        if (isBluetoothConnected() && !isBluetoothOn) {
            audioManager.startBluetoothSco();
            isBluetoothOn = true;
        }

        try {
            recorder = new AudioRecord(
                MediaRecorder.AudioSource.MIC,
                sampleRate,
                AudioFormat.CHANNEL_IN_MONO,
                AudioFormat.ENCODING_PCM_16BIT,
                bufferSize
            );
        } catch (IllegalArgumentException ex) {
            abort(promise, "FAILED_TO_INITIALIZE", "Audio Record can't initialize!");
            return;
        }

        if (recorder.getState() != AudioRecord.STATE_INITIALIZED) {
            recorder.release();
            abort(promise, "FAILED_TO_INITIALIZE", "Audio Record can't initialize!");
            return;
        }

        buffer = new short[bufferSize];

        try {
            outputStream = new RandomAccessFile(outputPath, "rw");
            writeWavHeader();
        } catch (Exception e) {
            recorder.release();
            abort(promise, "FAILED_TO_CREATE_FILE", e.getMessage());
            return;
        }

        recorder.read(buffer, 0, bufferSize);

        isRecording = true;
        recorder.startRecording();

        int audioSessionId = recorder.getAudioSessionId();
        AutomaticGainControl automaticGainControl = AutomaticGainControl.create(audioSessionId);
        NoiseSuppressor noiseSuppressor = NoiseSuppressor.create(audioSessionId);
        AcousticEchoCanceler acousticEchoCanceler = AcousticEchoCanceler.create(audioSessionId);

        if (AutomaticGainControl.isAvailable() && automaticGainControl != null) {
            automaticGainControl.setEnabled(true);
        }

        if (NoiseSuppressor.isAvailable() && noiseSuppressor != null) {
            noiseSuppressor.setEnabled(true);
        }

        if (AcousticEchoCanceler.isAvailable() && acousticEchoCanceler != null) {
            acousticEchoCanceler.setEnabled(true);
        }

        new Thread(() -> {
            android.os.Process.setThreadPriority(android.os.Process.THREAD_PRIORITY_URGENT_AUDIO);
            readData();
        }, "AudioRawRecorder Thread").start();

        startTimer();

        promise.resolve(null);
    }

    @ReactMethod
    @SuppressWarnings("unused")
    public void stop(ReadableMap options, Promise promise) {
        stopTimer();

        if (isBluetoothOn) {
            audioManager.stopBluetoothSco();
            isBluetoothOn = false;
        }

        if (!isRecording) {
            promise.resolve("");
            return;
        }

        isRecording = false;

        if (recorder.getRecordingState() == AudioRecord.RECORDSTATE_RECORDING) {
            try {
                recorder.stop();
            } catch (IllegalStateException e) {
            }
        }

        recorder.release();

        String base64Content = null;

        double startTime = options.getDouble("startTime");
        boolean isAuto = options.getBoolean("isAuto");

        if (outputStream != null) {
            try {
                byte[] rawBuffer = updateWavHeader(startTime, isAuto);
                base64Content = Base64.encodeToString(rawBuffer, Base64.NO_WRAP);
            } catch (IOException e) {
                abort(promise, "FAILED_TO_CREATE_FILE", e.getMessage());
                return;
            } finally {
                try {
                    outputStream.close();
                } catch (IOException e) {
                }

                outputStream = null;
            }
        }

        promise.resolve(base64Content);
    }

    @ReactMethod
    @SuppressWarnings("unused")
    public void cancel(Promise promise) {
        stopTimer();

        if (isBluetoothOn) {
            audioManager.stopBluetoothSco();
            isBluetoothOn = false;
        }

        if (!isRecording) {
            promise.resolve(false);
            return;
        }

        isRecording = false;

        if (recorder.getRecordingState() == AudioRecord.RECORDSTATE_RECORDING) {
            try {
                recorder.stop();
            } catch (IllegalStateException e) {
            }
        }

        recorder.release();

        if (outputStream != null) {
            try {
                outputStream.close();
            } catch (IOException e) {
            }

            outputStream = null;
        }

        promise.resolve(true);
    }

    private void readData() {
        while (isRecording) {
            int bufferReadSize = recorder.read(buffer, 0, bufferSize);

            if (bufferReadSize > 0) {
                // volume
                double sum = 0;
                int zeroCount = 0;
                for (int i = 0; i < bufferReadSize; i++) {
                    if (buffer[i] == 0) {
                        zeroCount++;
                    }
                    sum += Math.pow(buffer[i], 2);
                }

                double amplitudeRms = Math.sqrt(sum / bufferReadSize);
                if (amplitudeRms > 0 && zeroCount < (bufferReadSize * 0.5)) {
                    currentAmplitude = (int) Math.ceil(1000 * amplitudeRms / 32768); // signed 16bit range
                } else {
                    currentAmplitude = 0;
                }

                if (outputStream != null) {
                    ByteBuffer bufferBytes = ByteBuffer.allocate(bufferReadSize * 2); // 2 bytes per short
                    bufferBytes.order(ByteOrder.LITTLE_ENDIAN); // save little-endian byte from short buffer
                    bufferBytes.asShortBuffer().put(buffer, 0, bufferReadSize);
                    byte[] bytes = bufferBytes.array();

                    try {
                        outputStream.write(bytes);
                    } catch (IOException e) {
                        Log.e(LOG_TAG, e.getMessage());
                    }
                }
            } else {
                Log.e(LOG_TAG, "Error while reading bytes: " + bufferReadSize);
            }
        }
    }

    private void startTimer() {
        stopTimer();

        secondsElapsed = 0;

        timer = new Timer();
        timer.scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                secondsElapsed++;

                WritableMap event = Arguments.createMap();
                event.putDouble("currentTime", secondsElapsed / 10.0);
                event.putDouble("currentMetering", currentAmplitude);

                emitEvent(event);
            }
        }, 0, 100);
    }

    private void stopTimer() {
        if (timer != null) {
            timer.cancel();
            timer.purge();
            timer = null;
        }
    }

    private boolean isBluetoothConnected() {
        if (audioManager == null || !audioManager.isBluetoothScoAvailableOffCall()) return false;

        boolean hasBluetoothInput = false;
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
            for (AudioDeviceInfo deviceInfo : audioManager.getDevices(AudioManager.GET_DEVICES_INPUTS)) {
                if (deviceInfo.getType() == AudioDeviceInfo.TYPE_BLUETOOTH_SCO
                    || deviceInfo.getType() == AudioDeviceInfo.TYPE_BLUETOOTH_A2DP) {
                    hasBluetoothInput = true;
                }
            }
        } else {
            hasBluetoothInput = audioManager.isBluetoothScoOn() || audioManager.isBluetoothA2dpOn();
        }

        return hasBluetoothInput;
    }

    private void writeWavHeader() throws IOException {
        short channels = 1;
        short bitDepth = 16;

        // Convert the multi-byte integers to raw bytes in little endian format as required by the spec
        byte[] littleBytes = ByteBuffer
            .allocate(14)
            .order(ByteOrder.LITTLE_ENDIAN)
            .putShort(channels)
            .putInt(sampleRate)
            .putInt(sampleRate * channels * (bitDepth / 8))
            .putShort((short) (channels * (bitDepth / 8)))
            .putShort(bitDepth)
            .array();

        // Not necessarily the best, but it's very easy to visualize this way
        outputStream.setLength(0);
        outputStream.write(new byte[]{
            // RIFF header
            'R', 'I', 'F', 'F', // ChunkID
            0, 0, 0, 0, // ChunkSize (must be updated later)
            'W', 'A', 'V', 'E', // Format
            // fmt subchunk
            'f', 'm', 't', ' ', // Subchunk1ID
            16, 0, 0, 0, // Subchunk1Size
            1, 0, // AudioFormat
            littleBytes[0], littleBytes[1], // NumChannels
            littleBytes[2], littleBytes[3], littleBytes[4], littleBytes[5], // SampleRate
            littleBytes[6], littleBytes[7], littleBytes[8], littleBytes[9], // ByteRate
            littleBytes[10], littleBytes[11], // BlockAlign
            littleBytes[12], littleBytes[13], // BitsPerSample
            // data subchunk
            'd', 'a', 't', 'a', // Subchunk2ID
            0, 0, 0, 0, // Subchunk2Size (must be updated later)
        });
    }

    private byte[] updateWavHeader(double startTime, boolean isAuto) throws IOException {
        boolean isChanged = false;

        int payloadSize = (int) (outputStream.length() - 44);
        byte[] rawBuffer = null;

        if (payloadSize < 0) {
            payloadSize = 0;
        } else {
            int endPos = payloadSize;

            if (isAuto && payloadSize > 32000) {
                isChanged = true;
                payloadSize = Math.max(0, payloadSize - 32000);
                if (payloadSize % 2 != 0) {
                    payloadSize += 1;
                }

                endPos = payloadSize;
            }

            if (startTime > 0) {
                int startPos = (int) (startTime * 32000);
                if (startPos % 2 != 0) {
                    startPos += 1;
                }

                if (startPos > 0 && endPos > startPos) {
                    isChanged = true;
                    payloadSize = endPos - startPos;
                    rawBuffer = new byte[payloadSize];

                    outputStream.seek(startPos + 44);
                    outputStream.read(rawBuffer);

                    outputStream.seek(44);
                    outputStream.write(rawBuffer);
                }
            }
        }

        outputStream.seek(4); // Write size to RIFF header
        outputStream.writeInt(Integer.reverseBytes(36 + payloadSize));

        outputStream.seek(40); // Write size to Subchunk2Size field
        outputStream.writeInt(Integer.reverseBytes(payloadSize));

        if (rawBuffer == null) {
            rawBuffer = new byte[payloadSize];

            outputStream.seek(44);
            outputStream.read(rawBuffer);
        }

        if (isChanged) {
            outputStream.setLength(payloadSize + 44);
        }

        return rawBuffer;
    }

    private void emitEvent(Object params) {
        getReactApplicationContext()
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit("AudioRecorder:progress", params);
    }

    private void abort(Promise promise, String errorCode, String errorMessage) {
        Log.e(LOG_TAG, errorCode + ":" + errorMessage);
        promise.reject(errorCode, errorMessage);
    }
}
