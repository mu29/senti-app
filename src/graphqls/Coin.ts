import gql from 'graphql-tag';

export const FETCH_COIN_LIST = gql`
  query fetchCoinList {
    coins {
      id
      amount
      price
      retailPrice
      currency
    }
  }
`;
