import { NetworkStatus } from 'apollo-client';

export default (status: NetworkStatus) => [
  NetworkStatus.loading,
  NetworkStatus.setVariables,
  NetworkStatus.fetchMore,
].includes(status);
