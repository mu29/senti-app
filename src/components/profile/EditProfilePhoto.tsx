import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {
  Button,
  Text,
  CachableImage,
  LoadingLayer,
} from 'components';
import {
  palette,
  typography,
} from 'constants/style';
import { AnalyticsService } from 'services';
import { LocalizedStrings } from 'constants/translations';

interface Props {
  photoUrl: string | null;
  isLoading: boolean;
  updateProfilePhoto: (path: string) => void;
}

const EditProfilePhoto: React.FunctionComponent<Props> = ({
  photoUrl,
  isLoading,
  updateProfilePhoto,
}) => {
  const openImagePicker = useCallback(() => {
    ImagePicker.openPicker({
      width: 200,
      height: 200,
      cropping: true,
    }).then((image) => {
      const target = Array.isArray(image) ? image[0] : image;
      updateProfilePhoto(target.path);
    }).catch(() => {});
    AnalyticsService.logEvent('click_update_profile_photo');
  }, [updateProfilePhoto]);

  return (
    <React.Fragment>
      <View style={styles.container}>
        <Button onPress={openImagePicker} disabled={isLoading} style={styles.button}>
          <CachableImage prefix="profiles" source={photoUrl} style={styles.photo} />
          <Text style={[typography.tiny3, styles.description]}>
            {LocalizedStrings.PROFILE_PHOTO_CHANGE_BUTTON}
          </Text>
        </Button>
      </View>
      {isLoading && <LoadingLayer />}
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 12,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: 'hidden',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.transparent.black[60],
  },
  description: {
    marginTop: 16,
  },
});

export default React.memo(EditProfilePhoto);
