import { FETCH_COVERS } from 'graphqls';

export default {
  Query: {
    randomCover: (_: any, _args: Params, { cache }: Context) => {
      const data = cache.readQuery<{ covers: string[] }>({ query: FETCH_COVERS });

      if (!data) {
        return null;
      }

      const index = Math.floor(Math.random() * data.covers.length);
      return data.covers[index];
    },
  },
};
