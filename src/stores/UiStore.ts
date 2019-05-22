import {
  observable,
  action,
} from 'mobx';

class UiStore {
  @observable
  isAuthModalVisible = false;

  @action
  public toggleAuthModal = () => {
    this.isAuthModalVisible = !this.isAuthModalVisible;
  }
}

export default UiStore;
