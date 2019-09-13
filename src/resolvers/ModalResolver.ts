import gql from 'graphql-tag';

export default {
  Query: {
    modal: (_: any, { id }: Params, { cache }: Context) => {
      const fragment = gql`
        fragment visibleModal on Modal {
          id
          params
          isVisible
        }
      `;

      return cache.readFragment({
        id: `Modal:${id}`,
        fragment,
      });
    },
  },
  Mutation: {
    showModal: (_: any, { id, params }: Params, { cache }: Context) => {
      cache.writeData({
        id: `Modal:${id}`,
        data: {
          __typename: 'Modal',
          id,
          params: params || null,
          isVisible: true,
        },
      });

      return true;
    },
    hideModal: (_: any, { id }: Params, { cache }: Context) => {
      cache.writeData({
        id: `Modal:${id}`,
        data: {
          __typename: 'Modal',
          id,
          params: null,
          isVisible: false,
        },
      });

      return true;
    },
  },
};
