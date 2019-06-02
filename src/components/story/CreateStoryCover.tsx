import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  inject,
  observer,
} from 'mobx-react/native';
import imageCacheHoc from 'react-native-image-cache-hoc';
import { CoverState } from 'stores/states';
import { shuffleCoverAction } from 'stores/actions';
import { palette } from 'constants/style';

const { width, height } = Dimensions.get('window');

const CachableImage = imageCacheHoc(Image, {
  fileDirName: 'covers',
  cachePruneTriggerLimit: 1024 * 1024 * 50,
});

interface CreateStoryCoverProps {
  coverState?: CoverState;
}

@inject('coverState')
@observer
class CreateStoryCover extends React.Component<CreateStoryCoverProps> {
  public componentDidMount() {
    shuffleCoverAction();
  }

  public render() {
    return (
      <React.Fragment>
        <CachableImage
          source={{ uri: this.props.coverState!.current }}
          style={styles.background}
          permanent
        />
        <View style={styles.filter} />
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
    width,
    height,
    backgroundColor: palette.gray[100],
  },
  filter: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: palette.transparent.black[40],
  },
});

export default CreateStoryCover;
