import firebase from 'react-native-firebase';
import {
  WEBSITE_URL,
  DYNAMIC_LINK_HOST,
  PACKAGE_NAME,
} from 'constants/config';
import { LocalizedStrings } from 'constants/translations';

class DynamicLinkService {
  public async createReferralLink(userId: string) {
    const link = new firebase.links.DynamicLink(`https://${DYNAMIC_LINK_HOST}/referral?id=${userId}`, `https://${DYNAMIC_LINK_HOST}`)
      .android.setPackageName(PACKAGE_NAME)
      .ios.setBundleId(PACKAGE_NAME)
      .ios.setAppStoreId('1483156767')
      .social.setTitle(LocalizedStrings.COMMON_APP_NAME)
      .social.setDescriptionText(LocalizedStrings.COMMON_APP_DESCRIPTION)
      .social.setImageUrl(`${WEBSITE_URL}/assets/opengraph.png`);

    return firebase.links().createShortDynamicLink(link, 'SHORT');
  }
}

export default new DynamicLinkService();
