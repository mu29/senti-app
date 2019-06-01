import RootStore from './RootStore';

const rootStore = new RootStore();

export { default as AuthStore } from './AuthStore';
export { default as ChatStore } from './ChatStore';
export { default as CoverStore } from './CoverStore';
export { default as RecordStore } from './RecordStore';
export { default as StoryStore } from './StoryStore';
export { default as UiStore } from './UiStore';

export default rootStore;
