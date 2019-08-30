import gql from 'graphql-tag';

export const FETCH_MODAL = gql`
  query fetchModal($id: ID) {
    modal(id: $id) @client(always: true) {
      id
      params
      isVisible
    }
  }
`;

export const SHOW_MODAL = gql`
  mutation showModal($id: ID, $params: String) {
    showModal(id: $id, params: $params) @client
  }
`;

export const HIDE_MODAL = gql`
  mutation hideModal($id: ID) {
    hideModal(id: $id) @client
  }
`;
