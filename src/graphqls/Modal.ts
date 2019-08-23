import gql from 'graphql-tag';

export const FETCH_MODAL = gql`
  query modal($id: ID) {
    modal(id: $id) @client(always: true)
  }
`;

export const FETCH_MODALS = gql`
  query modals {
    modals @client {
      id
      isVisible
    }
  }
`;

export const SHOW_MODAL = gql`
  mutation showModal($id: ID) {
    showModal(id: $id) @client
  }
`;
