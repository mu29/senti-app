import { FETCH_COVERS } from 'graphqls';

export default {
  Mutation: {
    shuffleCovers: (_: any, _args: Params, { client }: Context) => {
      const data = client.cache.readQuery<{ covers: string[] }>({ query: FETCH_COVERS });

      if (!data) {
        return false;
      }

      const index = Math.floor(Math.random() * data.covers.length);

      client.writeData({
        data: {
          cover: data.covers[index],
        },
      });

      return true;
    },
  },
};
