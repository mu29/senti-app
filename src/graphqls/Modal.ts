import gql from 'graphql-tag';

export const FETCH_MODAL = gql`
  query modal($id: ID) {
    modal(id: $id) @client(always: true) {
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

export const HIDE_MODAL = gql`
  mutation hideModal($id: ID) {
    hideModal(id: $id) @client
  }
`;
