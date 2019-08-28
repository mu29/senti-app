import gql from 'graphql-tag';

export const FETCH_COVERS = gql`
  query covers {
    covers
  }
`;

export const FETCH_RANDOM_COVER = gql`
  query fetchRandomCover {
    randomCover @client(always: true)
  }
`;
