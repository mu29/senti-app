import gql from 'graphql-tag';

export const SHUFFLE_COVERS = gql`
  mutation shuffleCovers {
    shuffleCovers @client
  }
`;
