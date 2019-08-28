import React, { useMemo } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import imageCacheHoc from 'react-native-image-cache-hoc';
import { palette } from 'constants/style';

const { width, height } = Dimensions.get('window');

const CachableImage = imageCacheHoc(Image, {
  fileDirName: 'covers',
  cachePruneTriggerLimit: 1024 * 1024 * 50,
});

interface Props {
  cover: string;
}

const CreateStoryCover: React.FunctionComponent<Props> = ({
  cover,
}) => {
  const coverImage = useMemo(() => ({ uri: cover }), [cover]);

  return (
    <React.Fragment>
      <CachableImage
        source={coverImage}
        style={styles.background}
        permanent
      />
      <View style={styles.filter} />
    </React.Fragment>
  );
};

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

export default React.memo(CreateStoryCover);
