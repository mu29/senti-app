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

export const UPDATE_PROFILE = gql`
  mutation updateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      name
      email
      photoUrl
    }
  }
`;
