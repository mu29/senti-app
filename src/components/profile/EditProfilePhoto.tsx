import React from 'react';
import {
  View,
  Image,
  StyleSheet,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {
  inject,
  observer,
} from 'mobx-react/native';
import {
  Button,
  Text,
} from 'components';
import { AuthState } from 'stores/states';
import { typography, palette } from 'constants/style';

interface EditProfilePhotoProps {
  authState?: AuthState;
}

console.log(ImagePicker)

@inject('authState')
@observer
class EditProfilePhoto extends React.Component<EditProfilePhotoProps> {
  public render() {
    const { user } = this.props.authState!;

    if (!user) {
      return null;
    }

    return (
      <View style={styles.container}>
        <Button onPress={this.openImagePicker} style={styles.button}>
          <Image
            source={{ uri: user.photoUrl || '' }}
            style={styles.photo}
          />
          <Text style={[typography.tiny3, styles.description]}>
            프로필 사진 변경
          </Text>
        </Button>
      </View>
    );
  }

  private openImagePicker = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    }).then(image => {
      console.log(image);
    });
  }
}

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
  },
  description: {
    marginTop: 16,
  },
});

export default EditProfilePhoto;
