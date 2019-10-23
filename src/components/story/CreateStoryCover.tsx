import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { CachableImage } from 'components';
import { LayoutService } from 'services';
import { palette } from 'constants/style';

interface Props {
  cover: string;
}

const CreateStoryCover: React.FunctionComponent<Props> = ({
  cover,
}) => {
  const backgroundStyle = useMemo(() => ({
    ...StyleSheet.absoluteFillObject,
    width: LayoutService.screenWidth,
    height: LayoutService.screenHeight,
    backgroundColor: palette.gray[100],
  }), []);

  return (
    <React.Fragment>
      <CachableImage prefix="covers" source={cover} style={backgroundStyle} />
      <View style={styles.filter} />
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  filter: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: palette.transparent.black[40],
  },
});

export default React.memo(CreateStoryCover);
