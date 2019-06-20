import React from 'react';
import {
  FlatList,
  StyleSheet,
} from 'react-native';
import {
  inject,
  observer,
} from 'mobx-react/native';
import {
  TagItem,
  LoadingIndicator,
} from 'components';
import { readPopularTagsAction } from 'stores/actions';
import { SearchState } from 'stores/states';
import { LoadingType } from 'constants/enums';

export interface TagListProps {
  searchState?: SearchState;
}

@inject('searchState')
@observer
class TagList extends React.Component<TagListProps> {
  public componentDidMount() {
    readPopularTagsAction();
  }

  public render() {
    const {
      tags,
      isLoading,
    } = this.props.searchState!;

    return (
      <FlatList
        data={tags}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        contentContainerStyle={styles.container}
        ListFooterComponent={isLoading === LoadingType.LIST ? <LoadingIndicator /> : null}
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
