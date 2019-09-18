import React, {
  useState,
  useMemo,
  useCallback,
} from 'react';
import {
  TabView as RNTabView,
  SceneMap,
} from 'react-native-tab-view';
import TabBar, { Props as TabBarProps } from './TabBar';

interface Props {
  routes: Array<{
    key: string;
    title: string;
  }>;
  children: React.ReactChild[];
}

const TabView: React.FunctionComponent<Props> = ({
  routes,
  children,
}) => {
  const [navigationState, setNavigationState] = useState({
    index: 0,
    routes,
  });

  const sceneMap = useMemo(() => SceneMap(
    routes.reduce<{ [key: string]: any }>((m, r, i) => ({
      ...m,
      [r.key]: () => children[i],
    }), {}),
  ), [children, routes]);

  const onIndexChange = useCallback((index: number) => {
    setNavigationState((prev) => ({
      ...prev,
      index,
    }));
  }, []);

  const renderTabBar = useCallback((props: TabBarProps) => (
    <TabBar {...props} />
  ), []);

  return (
    <RNTabView
      navigationState={navigationState}
      renderScene={sceneMap}
      onIndexChange={onIndexChange}
      renderTabBar={renderTabBar}
    />
  );
};

export default React.memo(TabView);
