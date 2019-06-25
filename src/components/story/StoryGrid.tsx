import React from 'react';
import { Dimensions } from 'react-native';
import {
  inject,
  observer,
} from 'mobx-react/native';
import { FlatGrid } from 'react-native-super-grid';
import { CompactStoryItem } from 'components';
import {
  subscribeMyStoriesAction,
  unsubscribeMyStoriesAction,
} from 'stores/actions';
import { StoryState } from 'stores/states';

const ITEM_SIZE = Dimensions.get('window').width / 3;

interface StoryGridProps {
  storyState?: StoryState;
}

@inject('storyState')
@observer
class StoryGrid extends React.Component<StoryGridProps> {
  public componentDidMount() {
    subscribeMyStoriesAction();
  }

  public componentWillUnmount() {
    unsubscribeMyStoriesAction();
  }

  public render() {
    const { myStoryIds } = this.props.storyState!;

    return (
      <FlatGrid
        itemDimension={ITEM_SIZE}
        spacing={0}
        items={myStoryIds}
        renderItem={this.renderItem}
      />
    );
  }

  private renderItem = ({ item, index }: { item: string; index: number }) => (
    <CompactStoryItem storyId={item} index={index} />
  )
}

export default StoryGrid;
