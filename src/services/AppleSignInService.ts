import { NativeModules } from 'react-native';

const { RNAppleSignIn } = NativeModules;

export interface AppleSignInConfig {
  clientId: string,
  clientSecret: string,
  urlScheme: string,
}

class AppleSignInService {
  private config?: AppleSignInConfig;

  private requestState: string = '';

  constructor() {
    if (__DEV__ && !RNAppleSignIn) {
      console.error('react-native-naver-signin module is not correctly linked.');
    }
  }

  public configure(options: AppleSignInConfig) {
    this.config = options;
  }

  public verifyConfig = () => {
    if (Object.keys(this.config || {}).length === 0) {
      throw new Error('You need to call configure() method first.');
    }
  }

  public async signIn() {
    this.verifyConfig();
    this.requestState = this.generateState();

    const { code, state } = await RNAppleSignIn.signIn({
      ...this.config,
      state: this.requestState,
    });

    if (state !== this.requestState) {
      throw new Error('State is not identical.');
    }

    return code;
    // const result = await this._requestAccessToken({ code, state });
    // return result.accessToken;
  }

  private generateState = () => {
    const candidates = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let state = '';
    for (var i = 32; i > 0; --i) {
      state += candidates[Math.floor(Math.random() * candidates.length)];
    }
    return state;
  }
}

export default new AppleSignInService();
