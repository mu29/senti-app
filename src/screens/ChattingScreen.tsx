import React from 'react';
import {
  Header,
  ChattingList,
  withSafeArea,
} from 'components';

const ChattingScreen = () => (
  <React.Fragment>
    <Header>
      대화
    </Header>
    <ChattingList
      data={[{
        id: 1,
        partner: {
          id: '2',
          name: '뮤바보',
          email: '',
          photoUrl: 'https://avatars3.githubusercontent.com/u/8934513?s=460&v=4',
        },
        lastMessage: {
          audioUrl: '',
          duration: 29,
          createdAt: {
            seconds: 1559044858,
            nanoseconds: 9000000,
          },
        },
        messageCount: 2,
      }, {
        id: 2,
        partner: {
          id: '1',
          name: '정인중',
          email: '',
          // tslint:disable
          photoUrl: 'https://lh3.googleusercontent.com/-RMEOQ83RZvY/WoOiwZ6_NvI/AAAAAAAAAFU/SqSGd61TFbwGX0UJ0J1Q0QVqRJ8G9DPSgCEwYBhgL/w280-h280-p/d8bb8f6a-efa1-4132-a3d7-40a7bfd27ec6',
        },
        lastMessage: {
          audioUrl: '',
          duration: 29,
          createdAt: {
            seconds: 1559044858,
            nanoseconds: 9000000,
          },
        },
        messageCount: 8,
      }]}
    />
  </React.Fragment>
);

export default withSafeArea(ChattingScreen);
