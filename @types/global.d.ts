import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';

declare global {
  type Params = {
    [key: string]: any;
  }

  interface Context {
    client: ApolloClient<InMemoryCache>;
    cache: InMemoryCache;
    getCacheKey: ({ __typename, id }: { __typename: string, id: string }) => string;
  }

  interface Modal {
    id: string;
    params?: {
      [key: string]: any;
    };
    isVisible: boolean;
  }
}
