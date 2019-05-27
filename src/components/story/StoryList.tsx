import React from 'react';
import {
  View,
} from 'react-native';
import {
  observer,
  inject,
} from 'mobx-react/native';
import { StoryStore } from 'stores';

interface StoryListProps {
  storyStore?: StoryStore;
}

@inject('storyStore')
@observer
class StoryList extends React.Component<StoryListProps> {
  componentDidMount() {
    this.props.storyStore!.readStories();
  }

  render() {
    console.log(this.props.storyStore);
    return <View />;
  }
}

export default StoryList;
