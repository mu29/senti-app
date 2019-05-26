import AuthStore from './AuthStore';
import CoverStore from './CoverStore';
import RecordStore from './RecordStore';
import StoryStore from './StoryStore';
import UiStore from './UiStore';

export {
  AuthStore,
  CoverStore,
  RecordStore,
  StoryStore,
  UiStore,
};

export default {
  authStore: new AuthStore(),
  coverStore: new CoverStore(),
  recordStore: new RecordStore(),
  storyStore: new StoryStore(),
  uiStore: new UiStore(),
};
