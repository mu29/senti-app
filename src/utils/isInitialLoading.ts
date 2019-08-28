import { NetworkStatus } from 'apollo-client';

export default (status: NetworkStatus) => [NetworkStatus.loading, NetworkStatus.refetch].includes(status);
