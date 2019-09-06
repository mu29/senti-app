import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'components';
import {
  TabBar as RNTabBar,
  Route,
  SceneRendererProps,
  NavigationState,
} from 'react-native-tab-view';
import {
  palette,
  typography,
} from 'constants/style';

export interface Props extends SceneRendererProps {
  navigationState: NavigationState<Route>;
}

const TabBar: React.FunctionComponent<Props> = ({
  ...props
}) => {
  const renderLabel = useCallback(({
    route,
    focused,
  }: {
    route: Route;
    focused: boolean;
  }) => (
    <Text style={[typography.body2, focused && styles.focused]}>{route.title}</Text>
  ), []);

  return (
    <RNTabBar
      pressOpacity={0.8}
      renderLabel={renderLabel}
      style={styles.container}
      indicatorStyle={styles.indicator}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  focused: {
    color: palette.gray[90],
    fontWeight: 'bold',
  },
  container: {
    height: 48,
    backgroundColor: palette.white.default,
  },
  indicator: {
    backgroundColor: palette.yellow.default,
  },
});

export default TabBar;
