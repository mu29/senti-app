import React from 'react';
import {
  View,
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

interface Props {
  reload: () => void;
  message: string;
}

const ErrorView: React.FunctionComponent<Props> = ({
  reload,
  message,
}) => (
  <View style={styles.container}>
    <Icon name="ios-alert" size={56} color={palette.yellow.default} />
    <Text style={[typography.heading1, styles.title]}>
      일시적인 오류입니다.
    </Text>
    <Text style={[typography.body2, styles.description]}>
      {`아래 버튼을 눌러 다시 시도할 수 있습니다.\n문제가 반복된다면 저희에게 알려 주세요.\n\n${message}`}
    </Text>
    <Button style={styles.button} onPress={reload}>
      <Text style={typography.body1}>
        새로고침
      </Text>
    </Button>
  </View>
);

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
  description: {
    textAlign: 'center',
  },
  button: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    backgroundColor: palette.gray[80],
  },
  reload: {
    fontSize: 16,
    color: palette.gray[10],
  },
});

export default React.memo(ErrorView);
