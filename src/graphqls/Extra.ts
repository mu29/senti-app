import gql from 'graphql-tag';

export const FETCH_COVER = gql`
  query fetchCover {
    cover @client
  }
`;

export const FETCH_COVERS = gql`
  query fetchCovers {
    covers @client
  }
`;

export const SHUFFLE_COVERS = gql`
  mutation shuffleCovers {
    shuffleCovers @client
  }
`;
