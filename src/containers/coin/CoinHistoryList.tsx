import React from 'react';
import { CoinHistoryList } from 'components';

const COIN_HISTORY_LIST = [{
  id: '4',
  description: '빛나는 강아지님의 이야기 듣기',
  amount: -1,
  createdAt: 1567593990123,
}, {
  id: '3',
  description: '성실한 꿀꿀이님의 이야기 듣기',
  amount: -1,
  createdAt: 1567497990123,
}, {
  id: '2',
  description: '성실한 꿀꿀이님의 이야기 듣기',
  amount: -1,
  createdAt: 1567493990123,
}, {
  id: '1',
  description: '코인 결제',
  amount: 30,
  createdAt: 1567493590123,
}];

const Container: React.FunctionComponent<{}> = () => {
  return (
    <CoinHistoryList items={COIN_HISTORY_LIST} />
  );
};

export default React.memo(Container);
