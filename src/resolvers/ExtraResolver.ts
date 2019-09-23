import { FETCH_DRAFT } from 'graphqls';
import covers from 'constants/covers';

export default {
  Mutation: {
    shuffleCovers: (_: any, _args: Params, { cache }: Context) => {
      const draftData = cache.readQuery<{ draft: Draft }>({ query: FETCH_DRAFT });

      if (!draftData) {
        return false;
      }

      const index = Math.floor(Math.random() * covers.length);

      cache.writeData({
        data: {
          draft: {
            ...draftData.draft,
            cover: covers[index].original,
          },
        },
      });

      return true;
    },
  },
};
