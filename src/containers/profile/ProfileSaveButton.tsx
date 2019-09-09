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
  const { data } = useQuery<{ candidate: Candidate }>(FETCH_CANDIDATE);

  const [clearCandidate] = useMutation(CLEAR_CANDIDATE);

  const [updateProfile, { loading }] = useMutation(UPDATE_PROFILE, {
    update: (cache, { data: { updateProfile: newProfile } }) => {
      try {
        const savedProfile = cache.readQuery<{ me: Profile }>({ query: FETCH_PROFILE });

        if (!savedProfile) {
          return;
        }

        cache.writeQuery({
          query: FETCH_PROFILE,
          data: {
            me: {
              ...savedProfile.me,
              ...newProfile,
            },
          },
        });

        clearCandidate();
      } catch {}
    },
  });

  const update = useCallback(() => {
    if (!data || !data.candidate) {
      return;
    }

    const {
      name,
      gender,
    } = data.candidate;

    updateProfile({
      variables: {
        input: {
          ...(name && { name } || {}),
          ...(gender && { gender } || {}),
        },
      },
    });
  }, [data && data.candidate]);

  useEffect(() => {
    return () => {
      clearCandidate();
    };
  }, []);

  const isEnabled = !!(data && data.candidate && (data.candidate.name || data.candidate.gender));

  return (
    <ProfileSaveButton
      isEnabled={isEnabled}
      isLoading={loading}
      updateProfile={update}
    />
  );
};

export default React.memo(Container);
