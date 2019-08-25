import gql from 'graphql-tag';

export const CREATE_USER = gql`
  mutation createUser($id: ID, $email: String) {
    createUser(id: $id, email: $email)
  }
`;

export const FETCH_USER = gql`
  query fetchUser($id: ID) {
    user(id: $id) {
      id
      email
      name
      photoUrl
      gender
      useFreeTicketAt
    }
  }
`;
