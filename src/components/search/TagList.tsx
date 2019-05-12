import React from 'react';
import {
  FlatList,
  StyleSheet,
} from 'react-native';
import { TagItem } from 'components';

export interface TagListProps {
  data: Tag[];
}

class TagList extends React.PureComponent<TagListProps> {
  public render() {
    const { data } = this.props;

    return (
      <FlatList
        data={data}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        contentContainerStyle={styles.container}
      />
    );
  }

  private renderItem = ({ item }: { item: Tag }) => (
    <TagItem tag={item} />
  )

  private keyExtractor = (item: Tag) => `tag-${item.id}`;
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
});

export default TagList;
