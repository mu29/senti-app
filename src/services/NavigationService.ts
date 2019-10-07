import {
  StackActions,
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

function reset(routeName: string) {
  const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName })],
  });

   navigator.dispatch(resetAction);
}

function goBack() {
  navigator.dispatch(NavigationActions.back());
}

export default {
  navigate,
  reset,
  goBack,
  setTopLevelNavigator,
};
