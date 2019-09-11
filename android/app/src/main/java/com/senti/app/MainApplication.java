package com.senti.app;

import android.app.Application;

import com.facebook.CallbackManager;
import com.facebook.react.ReactApplication;
import com.microsoft.codepush.react.CodePush;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import net.yeoubi.iap.RNInAppPurchasePackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.reactnativecommunity.viewpager.RNCViewPagerPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.taluttasgiran.actionsheet.RNActionsheetPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.firestore.RNFirebaseFirestorePackage;
import io.invertase.firebase.storage.RNFirebaseStoragePackage;
import io.invertase.firebase.functions.RNFirebaseFunctionsPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.kevinresol.react_native_sound_recorder.RNSoundRecorderPackage;
import com.rnfs.RNFSPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected String getJSBundleFile(){
      return CodePush.getJSBundleFile();
    }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new CodePush(BuildConfig.CODEPUSH_KEY, getApplicationContext(), BuildConfig.DEBUG),
            new SplashScreenReactPackage(),
            new RNInAppPurchasePackage(),
            new ReanimatedPackage(),
            new RNCViewPagerPackage(),
            new AsyncStoragePackage(),
            new RNActionsheetPackage(),
            new PickerPackage(),
            new RNFetchBlobPackage(),
            new FBSDKPackage(mCallbackManager),
            new RNGoogleSigninPackage(),
            new RNFirebasePackage(),
            new RNFirebaseAuthPackage(),
            new RNFirebaseFirestorePackage(),
            new RNFirebaseStoragePackage(),
            new RNFirebaseFunctionsPackage(),
            new RNSoundPackage(),
            new RNSoundRecorderPackage(),
            new RNFSPackage(),
            new VectorIconsPackage(),
            new RNGestureHandlerPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }
}
