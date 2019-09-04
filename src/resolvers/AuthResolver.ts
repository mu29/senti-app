import { FETCH_CANDIDATE } from 'graphqls';

export default {
  Mutation: {
    updateCandidate: (_: any, { name, gender }: Params, { cache }: Context) => {
      const data = cache.readQuery<{ candidate: Candidate }>({ query: FETCH_CANDIDATE });

      if (!data) {
        return false;
      }

      cache.writeData({
        data: {
          candidate: {
            ...data.candidate,
            ...(name && { name } || {}),
            ...(gender && { gender } || {}),
          },
        },
      });

      return true;
    },
    clearCandidate: (_: any, _args: Params, { cache }: Context) => {
      cache.writeData({
        data: {
          candidate: {
            __typename: 'Candidate',
            name: null,
            gender: null,
          },
        },
      });

      return true;
    },
  },
};
