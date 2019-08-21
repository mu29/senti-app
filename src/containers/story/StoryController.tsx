import React, { useCallback } from 'react';
import { StoryController } from 'components';
import { SoundService } from 'services';

interface Props {
  item: Story;
}

const StoryControllerContainer: React.FunctionComponent<Props> = (
  props,
) => {
  const openReplyModal = useCallback(() => {
    // 로그인 확인
    SoundService.pause();
    // 모달 표시
  }, [props.item.id]);

  return (
    <StoryController
      openReplyModal={openReplyModal}
      {...props}
    />
  );
};

export default React.memo(StoryControllerContainer);
