import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  UIManager,
  LayoutAnimation,
} from 'react-native';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface State {
  portals: Record<string, any>;
}

class Portal extends React.PureComponent<{}, State> {
  public state: State = {
    portals: {},
  };

  public static ref = React.createRef<Portal>();

  public static show(component: any, props: Record<string, any> = {}) {
    if (!this.ref.current) {
      return;
    }

    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
      },
    });
    this.ref.current.setState(({ portals }) => ({
      portals: {
        ...portals,
        [component.NAME]: {
          component,
          props,
        },
      },
    }));
  }

  public static hide(component: any) {
    if (!this.ref.current) {
      return;
    }

    LayoutAnimation.configureNext({
      duration: 300,
      delete: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
      },
    });
    this.ref.current.setState(({ portals }) => ({
      portals: Object.keys(portals)
        .filter(k => k !== component.NAME)
        .reduce((r, c) => Object.assign(r, { [c]: portals[c] }), {}),
    }));
  }

  render() {
    const { portals } = this.state;

    return (
      <View style={StyleSheet.absoluteFill}>
        {
          Object.keys(portals).map((key) => {
            const Component = portals[key].component;
            return <Component key={key} {...portals[key].props} />;
          })
        }
      </View>
    );
  }
}

export default Portal;
