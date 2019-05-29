import {
  NavigationActions,
  NavigationParams,
} from 'react-navigation';

let navigator: any;

function setTopLevelNavigator(ref: any) {
  navigator = ref;
}

function navigate(routeName: string, params?: NavigationParams) {
  navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    }),
  );
}

function goBack() {
  navigator.dispatch(NavigationActions.back());
}

export default {
  navigate,
  goBack,
  setTopLevelNavigator,
};
