import { FETCH_DRAFT } from 'graphqls';

export default {
  Mutation: {
    updateDraft: (_: any, { cover, tags }: Params, { cache }: Context) => {
      const data = cache.readQuery<{ draft: Draft }>({ query: FETCH_DRAFT });

      if (!data) {
        return false;
      }

      cache.writeData({
        data: {
          draft: {
            ...data.draft,
            ...(cover && { cover } || {}),
            ...(tags && { tags } || {}),
          },
        },
      });

      return true;
    },
  },
};
