import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { CachableImage } from 'components';
import { palette } from 'constants/style';

const { width, height } = Dimensions.get('window');

interface Props {
  cover: string;
}

const CreateStoryCover: React.FunctionComponent<Props> = ({
  cover,
}) => (
  <React.Fragment>
    <CachableImage prefix="covers" source={cover} style={styles.background} />
    <View style={styles.filter} />
  </React.Fragment>
);

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
