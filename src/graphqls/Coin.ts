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
    transactionFeed(cursor: $cursor) {
      transactions {
        id
        description
        amount
        createdAt
      }
      cursor
    }
  }
`;

export const VERIFY_RECEIPT = gql`
  mutation verifyReceipt($input: VerifyReceiptInput!) {
    verifyReceipt(input: $input) {
      transaction {
        id
        description
        amount
        createdAt
      }
      profile {
        id
        coin
      }
    }
  }
`;
