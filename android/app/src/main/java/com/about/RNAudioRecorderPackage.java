package com.about;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.Collections;
import java.util.List;

import javax.annotation.Nonnull;

public class RNAudioRecorderPackage implements ReactPackage {

    @Override
    @Nonnull
    public List<NativeModule> createNativeModules(@Nonnull ReactApplicationContext reactContext) {
        return Collections.singletonList(new RNAudioRecorderModule(reactContext));
    }

    @Override
    @Nonnull
    public List<ViewManager> createViewManagers(@Nonnull ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
