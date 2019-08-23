import gql from 'graphql-tag';

export default {
  Query: {
    modal: (_: any, args: Params, { cache, getCacheKey }: Context) => {
      const id = getCacheKey({ __typename: 'Modal', id: args.id });
      const fragment = gql`
        fragment visibleModal on Modal {
          id
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
          isVisible: false,
        },
      });

      return true;
    },
  },
};
