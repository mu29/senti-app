import {
  FETCH_COVERS,
  FETCH_DRAFT,
} from 'graphqls';

export default {
  Mutation: {
    shuffleCovers: (_: any, _args: Params, { cache }: Context) => {
      const coverData = cache.readQuery<{ covers: string[] }>({ query: FETCH_COVERS });
      const draftData = cache.readQuery<{ draft: Draft }>({ query: FETCH_DRAFT });

      if (!coverData || !draftData) {
        return false;
      }

      const index = Math.floor(Math.random() * coverData.covers.length);

      cache.writeData({
        data: {
          draft: {
            ...draftData.draft,
            cover: coverData.covers[index],
          },
        },
      });

      return true;
    },
  },
};
