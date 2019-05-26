import {
  AuthStore,
  CoverStore,
  RecordStore,
  StoryStore,
  UiStore,
} from '.';

class RootStore {
  public authStore = new AuthStore(this);

  public coverStore = new CoverStore(this);

  public recordStore = new RecordStore(this);

  public storyStore = new StoryStore(this);

  public uiStore = new UiStore(this);
}

export default RootStore;
