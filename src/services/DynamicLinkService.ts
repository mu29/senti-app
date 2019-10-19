import firebase from 'react-native-firebase';
import {
  WEBSITE_URL,
  DYNAMIC_LINK_HOST,
  PACKAGE_NAME,
} from 'constants/config';
import { LocalizedStrings } from 'constants/translations';

class DynamicLinkService {
  public async createReferralLink(userId: string) {
    const link = new firebase.links.DynamicLink(`${WEBSITE_URL}/referral?id=${userId}`, `https://${DYNAMIC_LINK_HOST}`)
      .android.setPackageName(PACKAGE_NAME)
      .ios.setBundleId(PACKAGE_NAME)
      .social.setTitle(LocalizedStrings.COMMON_APP_NAME)
      .social.setDescriptionText(LocalizedStrings.COMMON_APP_DESCRIPTION)
      .social.setImageUrl(`${WEBSITE_URL}/assets/opengraph.png`);

    return firebase.links()
      .createShortDynamicLink(link, 'SHORT')
      .catch(console.log);
  }
}

export default new DynamicLinkService();
