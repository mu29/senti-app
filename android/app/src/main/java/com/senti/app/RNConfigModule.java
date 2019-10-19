package com.senti.app;

import android.annotation.TargetApi;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.os.Build;
import android.os.LocaleList;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

public class RNConfigModule extends ReactContextBaseJavaModule {
    private static final String LOG_TAG = "RNConfig";

    private final ReactApplicationContext reactContext;

    public RNConfigModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "RNConfig";
    }

    @Override
    public Map<String, Object> getConstants() {
        Map<String, Object> constants = new HashMap<>();

        constants.put("systemVersion", Build.VERSION.RELEASE);
        constants.put("appVersion", "1.0.0");

        try {
            PackageManager packageManager = this.reactContext.getPackageManager();
            String packageName = this.reactContext.getPackageName();
            PackageInfo info = packageManager.getPackageInfo(packageName, 0);

            constants.put("packageName", packageName);
            constants.put("appVersion", info.versionName);
        } catch (PackageManager.NameNotFoundException e) {
            Log.e(LOG_TAG, e.getMessage());
        }

        constants.put("apiUrl", BuildConfig.API_URL);
        constants.put("dynamicLinkHost", this.reactContext.getResources().getString(R.string.dynamic_link_host));
        constants.put("websiteUrl", BuildConfig.WEBSITE_URL);
        constants.put("webClientId", BuildConfig.FIREBASE_WEB_CLIENT_ID);
        constants.put("language", getLanguage());

        return constants;
    }


    private String getLanguage() {
        Configuration config = getReactApplicationContext().getResources().getConfiguration();
        Locale locale = (Build.VERSION.SDK_INT < Build.VERSION_CODES.N) ? config.locale : getLocale(config);

        if (locale == null) return "en";

        return locale.getLanguage();
    }

    @TargetApi(Build.VERSION_CODES.N)
    private Locale getLocale(Configuration config) {
        LocaleList localeList = config.getLocales();
        if (localeList.isEmpty()) return null;

        return localeList.get(0);
    }
}
