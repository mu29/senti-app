import gql from 'graphql-tag';

export default {
  Query: {
    modal: (_: any, args: Params, { cache, getCacheKey }: Context) => {
      const id = getCacheKey({ __typename: 'Modal', id: args.id });
      const fragment = gql`
        fragment visibleModal on Modal {
          id
          params
          isVisible
        }
      `;

      return cache.readFragment({ id, fragment });
    },
  },
  Mutation: {
    showModal: (_: any, args: Params, { cache, getCacheKey }: Context) => {
      const id = getCacheKey({ __typename: 'Modal', id: args.id });

      cache.writeData({
        id,
        data: {
          __typename: 'Modal',
          id: args.id,
          params: args.params || null,
          isVisible: true,
        },
      });

      return true;
    },
    hideModal: (_: any, args: Params, { cache, getCacheKey }: Context) => {
      const id = getCacheKey({ __typename: 'Modal', id: args.id });

      cache.writeData({
        id,
        data: {
          __typename: 'Modal',
          id: args.id,
          params: null,
          isVisible: false,
        },
      });

      return true;
    },
  },
};
