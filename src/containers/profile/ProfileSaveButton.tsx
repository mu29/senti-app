import React, { useCallback, useEffect } from 'react';
import {
  useQuery,
  useMutation,
} from '@apollo/react-hooks';
import { ProfileSaveButton } from 'components';
import {
  FETCH_PROFILE,
  FETCH_CANDIDATE,
  CLEAR_CANDIDATE,
  UPDATE_PROFILE,
} from 'graphqls';

const Container: React.FunctionComponent<{}> = () => {
  const {
    data: {
      candidate,
    } = {
      candidate: undefined,
    },
  } = useQuery<{ candidate: Candidate }>(FETCH_CANDIDATE);

  const [clearCandidate] = useMutation(CLEAR_CANDIDATE);

  const [updateProfile, { loading }] = useMutation(UPDATE_PROFILE, {
    update: () => clearCandidate().catch(console.error),
  });

  const update = useCallback(() => {
    if (!candidate) {
      return;
    }

    const {
      name,
      gender,
    } = candidate;

    updateProfile({
      variables: {
        input: {
          ...(name && { name } || {}),
          ...(gender && { gender } || {}),
        },
      },
    });
  }, [candidate, updateProfile]);

  useEffect(() => {
    return () => {
      clearCandidate();
    };
  }, [clearCandidate]);

  const isEnabled = !!(candidate && (candidate.name || candidate.gender));

  return (
    <ProfileSaveButton
      isEnabled={isEnabled}
      isLoading={loading}
      updateProfile={update}
    />
  );
};

export default React.memo(Container);
