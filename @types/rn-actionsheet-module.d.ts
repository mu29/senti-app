declare module 'rn-actionsheet-module' {
  function ActionSheet(
    options: {
      title: string;
      optionsIOS: string[];
      optionsAndroid: string[];
      destructiveButtonIndex?: number;
      cancelButtonIndex?: number;
      onCancelAndroidIndex?: number;
    },
    onSelect: (index: number) => void,
  ): void;

  export default ActionSheet;
}
