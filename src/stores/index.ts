import AuthStore from './AuthStore';
import RecordStore from './RecordStore';
import UiStore from './UiStore';

export {
  AuthStore,
  RecordStore,
  UiStore,
};

export default {
  authStore: new AuthStore(),
  recordStore: new RecordStore(),
  uiStore: new UiStore(),
};
