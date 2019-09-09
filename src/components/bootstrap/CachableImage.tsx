import React, { useMemo } from 'react';
import {
  View,
  Image,
  StyleSheet,
  ImageProps,
} from 'react-native';
import imageCacheHoc from 'react-native-image-cache-hoc';
import { palette } from 'constants/style';

interface Props extends Omit<ImageProps, 'source'> {
  prefix: string;
  source: string | null;
}

const CachableImage: React.FunctionComponent<Props> = ({
  prefix,
  source,
  ...props
}) => {
  const CachedImage = useMemo(() => imageCacheHoc(Image, {
    fileDirName: prefix,
    cachePruneTriggerLimit: 1024 * 1024 * 50,
  }), [prefix]);

  const imageSource = useMemo(() => ({ uri: source || '' }), [source]);

  return source ? (
    <CachedImage source={imageSource} {...props} permanent />
  ) : (
    <View style={[styles.placeholder, props.style]} />
  );
};

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: palette.gray[50],
  },
});

export default CachableImage;
