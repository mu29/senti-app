import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { UserInfo } from 'components';
import { FETCH_PROFILE } from 'graphqls';

const Container: React.FunctionComponent<{}> = () => {
  const {
    data: {
      profile,
    } = {
      profile: undefined,
    },
  } = useQuery<{ profile: Profile }>(FETCH_PROFILE, {
    fetchPolicy: 'cache-only',
  });

  if (!profile) {
    return null;
  }

  return (
    <UserInfo item={profile} />
  );
};

export default React.memo(Container);
