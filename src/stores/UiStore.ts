import {
  observable,
  action,
} from 'mobx';

class UiStore {
  @observable
  public isAuthModalVisible = false;

  @observable
  public isImagePickerModalVisible = false;

  @action
  public toggleAuthModal = () => {
    this.isAuthModalVisible = !this.isAuthModalVisible;
  }

  @action
  public toggleImagePickerModal = () => {
    this.isImagePickerModalVisible = !this.isImagePickerModalVisible;
  }
}

export default UiStore;
