import React, { useCallback } from 'react';
import { ReplyModal } from 'components';

const ReplyModalContainer: React.FunctionComponent<{}> = () => {
  const create = useCallback((_path: string, _duration: number) => {
    // 업로드 하고 audio id를 넘겨 받아서 처리해야 함
    return Promise.resolve();
  }, []);

  const hide = useCallback(() => {
    // 모달이 표시된 경우에만 숨기도록 수정
  }, []);

  return (
    <ReplyModal
      isVisible={true}
      isLoading={false}
      create={create}
      hide={hide}
    />
  );
};

export default React.memo(ReplyModalContainer);
