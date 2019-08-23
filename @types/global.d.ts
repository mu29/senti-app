import { InMemoryCache } from 'apollo-cache-inmemory';

declare global {
  type Params = {
    [key: string]: any;
  }

  interface Context {
    cache: InMemoryCache;
    getCacheKey: ({ __typename, id }: { __typename: string, id: string }) => string;
  }
}
