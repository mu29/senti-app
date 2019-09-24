import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Platform,
  Keyboard,
} from 'react-native';
import {
  Text,
  Button,
} from 'components';
import { palette } from 'constants/style';
import { LocalizedStrings } from 'constants/translations';

interface Props {
  updateTags: (tags: string[]) => void;
}

const CreateStoryTags: React.FunctionComponent<Props> = ({
  updateTags,
}) => {
  const [input, setInput] = useState('');

  const [tags, setTags] = useState([]);

  const dismissKeyboard = useCallback(() => {
    Keyboard.dismiss();
    return false;
  }, []);

  const onChangeText = useCallback((text) => {
    const lastText = text.slice(-1);

    if (/^\s$/.test(lastText)) {
      setInput('');
      if (text.length > 1) {
        setTags(prevTags => prevTags.concat(text.slice(0, -1)));
      }
    } else {
      setInput(text);
    }
  }, [setInput, setTags]);

  const deleteTag = useCallback((index) => {
    setTags(prevTags => prevTags.filter((_, i) => i !== index));
  }, [setTags]);

  useEffect(() => {
    updateTags(tags);
  }, [tags, updateTags]);

  const TagList = useMemo(() => tags.map((tag, index) => (
    <Button onPress={() => deleteTag(index)} key={`${tag}-${index}`}>
      <Text style={styles.tag}>
        #{tag}
      </Text>
    </Button>
  )), [deleteTag, tags]);

  return (
    <View
      onStartShouldSetResponder={dismissKeyboard}
      style={styles.container}
    >
      <View style={styles.tagList}>
        {TagList}
      </View>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        numberOfLines={5}
        multiline
        placeholder={LocalizedStrings.ADD_TAG_PLACEHOLDER}
        placeholderTextColor={palette.gray[30]}
        selectionColor={palette.white.default}
        onChangeText={onChangeText}
        value={input}
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagList: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  tag: {
    margin: 4,
    color: palette.white.default,
    fontSize: 18,
  },
  input: {
    width: '100%',
    maxHeight: Platform.select({
      ios: undefined,
      android: 164,
    }),
    padding: 24,
    marginBottom: 48,
    textAlign: 'center',
    color: palette.white.default,
    fontSize: 18,
  },
});

export default React.memo(CreateStoryTags);
