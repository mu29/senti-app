import gql from 'graphql-tag';

export const FETCH_AUDIO = gql`
  query fetchAudio($id: ID!) {
    audio(id: $id) {
      id
      url
      duration
    }
  }
`;
