import gql from 'graphql-tag';

export const CREATE_USER = gql`
  mutation createUser($email: String!) {
    createUser(email: $email)
  }
`;

export const FETCH_PROFILE = gql`
  query fetchProfile {
    me {
      id
      email
      name
      photoUrl
      gender
      tags {
        id
        name
      }
      useFreeTicketAt
    }
  }
`;
