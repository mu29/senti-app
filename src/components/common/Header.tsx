import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import { Text } from 'components';
import {
  palette,
  typography,
} from 'constants/style';

export interface HeaderProps {
  children: React.ReactNode;
}

const Header: React.FunctionComponent<HeaderProps> = ({
  children,
}) => (
  <View style={styles.container}>
    <Text style={typography.heading1}>
      {children}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: Platform.select({
      ios: 12,
      android: 15,
    }),
    borderBottomColor: palette.gray[80],
    borderBottomWidth: 0.5,
  },
});

export default React.memo(Header);
