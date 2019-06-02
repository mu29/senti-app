import RootStore from './RootStore';

class ChatStore {

  constructor(private rootStore: RootStore) { }

  public create = async ({
    path,
    duration,
  }: {
    path: string;
    duration: number;
  }) => {
  }
}

export default ChatStore;
