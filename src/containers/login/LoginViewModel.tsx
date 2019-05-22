import {
  observable,
  action,
} from 'mobx';

class LoginViewModel {
  @observable
  isModalVisible = false;

  @action
  public toggleModal = () => {
    this.isModalVisible = !this.isModalVisible;
  }
}

export default LoginViewModel;
