import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  SafeAreaView,
  SafeAreaViewForceInsetValue,
} from 'react-navigation';
import { LoadingLayer } from 'components';
import { RecordController } from 'containers';
import { palette } from 'constants/style';

const SAFE_AREA_INSET: {
  top: SafeAreaViewForceInsetValue;
  bottom: SafeAreaViewForceInsetValue;
} = {
  top: 'never',
  bottom: 'always',
};

interface Props {
  create: ({
    url,
    duration,
  }: {
    url: string | null;
    duration: number;
  }) => Promise<void>;
}

const MessageReply: React.FunctionComponent<Props> = ({
  create,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <React.Fragment>
      {isLoading && <LoadingLayer />}
      <SafeAreaView forceInset={SAFE_AREA_INSET} style={styles.container}>
        <RecordController
          setIsLoading={setIsLoading}
          onCreate={create}
        />
      </SafeAreaView>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    paddingBottom: 32,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: palette.black.default,
  },
});

export default React.memo(MessageReply);
