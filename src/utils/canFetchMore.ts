import { NetworkStatus } from 'apollo-client';

export default (status: NetworkStatus, error?: Error) => !error && ![
  NetworkStatus.loading,
  NetworkStatus.setVariables,
  NetworkStatus.fetchMore,
  NetworkStatus.refetch,
].includes(status);
