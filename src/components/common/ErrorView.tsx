import React, { useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  Text,
  Button,
} from 'components';
import {
  palette,
  typography,
} from 'constants/style';
import { LocalizedStrings } from 'constants/translations';

interface Props {
  reload: () => void;
  message: string;
  scrollable?: boolean;
}

const ErrorView: React.FunctionComponent<Props> = ({
  reload,
  message,
  scrollable,
}) => {
  const ContentView = useMemo(() => (
    <View style={styles.container}>
      <Icon name="ios-alert" size={56} color={palette.yellow.default} />
      <Text style={[typography.heading1, styles.title]}>
        {LocalizedStrings.ERROR_VIEW_TITLE}
      </Text>
      <Text style={[typography.body2, styles.message]}>
        {LocalizedStrings.ERROR_VIEW_MESSAGE(message)}
      </Text>
      <Button style={styles.button} onPress={reload}>
        <Text style={typography.body1}>
          {LocalizedStrings.ERROR_VIEW_REFRESH_BUTTON}
        </Text>
      </Button>
    </View>
  ), [reload, message]);

  return scrollable ? (
    <ScrollView showsVerticalScrollIndicator={false}>
      {ContentView}
    </ScrollView>
  ) : ContentView;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: palette.gray[100],
  },
  title: {
    marginTop: 12,
    marginBottom: 6 ,
  },
  message: {
    textAlign: 'center',
  },
  button: {
    marginTop: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: palette.gray[80],
  },
  reload: {
    fontSize: 16,
    color: palette.gray[10],
  },
});

export default React.memo(ErrorView);
