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

export const FETCH_TRANSACTION_FEED = gql`
  query transactionFeed($cursor: ID) {
    transactions {
      id
      description
      amount
      createdAt
    }
    cursor
  }
`;

export const VERIFY_COIN_RECEIPT = gql`
  mutation verifyCoinReceipt($input: VerifyCoinReceiptInput!) {
    verifyCoinReceipt(input: $input) {
      id
      description
      amount
      createdAt
    }
  }
`;
