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
      tags
      coin
      useFreeCoinAt
    }
  }
`;

export const FETCH_CANDIDATE = gql`
  query fetchCandidate {
    candidate @client {
      name
      gender
    }
  }
`;

export const UPDATE_CANDIDATE = gql`
  mutation updateCandidate($name: String, $gender: String) {
    updateCandidate(name: $name, gender: $gender) @client
  }
`;

export const CLEAR_CANDIDATE = gql`
  mutation clearCandidate {
    clearCandidate @client
  }
`;

export const UPDATE_PROFILE = gql`
  mutation updateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      name
      gender
      photoUrl
    }
  }
`;

export const REPORT_USER = gql`
  mutation reportUser($id: ID!, $storyId: ID!, $audioUrl: String) {
    reportUser(id: $id, storyId: $storyId, audioUrl: $audioUrl)
  }
`;
