import gql from 'graphql-tag';

export const CREATE_USER = gql`
  mutation createUser($id: ID, $email: String) {
    createUser(id: $id, email: $email)
  }
`;
