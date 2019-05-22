import React from 'react';
import { Provider } from 'mobx-react/native';
import { LoginModal } from 'components';
import LoginViewModel from './LoginViewModel';

interface LoginContainerProps {}

class LoginContainer extends React.Component<LoginContainerProps> {
  private recordViewModel = new LoginViewModel();

  render() {
    return (
      <Provider viewModel={this.recordViewModel}>
        <LoginModal />
      </Provider>
    );
  }
}

export default LoginContainer;
