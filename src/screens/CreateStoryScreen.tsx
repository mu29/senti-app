import React, { useCallback } from 'react';
import { NavigationEvents } from 'react-navigation';
import {
  View,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
  CoverModal,
  CreateStoryCover,
  CreateStoryHeader,
  CreateStoryTags,
  CreateStoryController,
} from 'containers';
import {
  Portal,
  TutorialLayer,
} from 'components';
import { AnalyticsService } from 'services';
import { LocalizedStrings } from 'constants/translations';

const CreateStoryScreen: React.FunctionComponent<{}> = () => {
  const onDidFocus = useCallback(() => {
    AsyncStorage.getItem('@CreateStoryTutorialFinished').then((finished) => {
      if (finished) {
        return;
      }

      AsyncStorage.setItem('@CreateStoryTutorialFinished', 'true');
      setTimeout(() => Portal.show(TutorialLayer, {
        title: LocalizedStrings.TUTORIAL_CREATE_STORY_TITLE,
        description: LocalizedStrings.TUTORIAL_CREATE_STORY_DESCRIPTION,
        steps: [{
          icon: 'ic_grid',
          message: LocalizedStrings.TUTORIAL_CREATE_STORY_STEP_1,
        }, {
          icon: 'ic_tag',
          message: LocalizedStrings.TUTORIAL_CREATE_STORY_STEP_2,
        }],
      }), 500);
    });
    AnalyticsService.setScreen('CreateStoryScreen');
  }, []);

  return (
    <React.Fragment>
      <CreateStoryCover />
      <View style={styles.container}>
        <CreateStoryHeader />
        <CreateStoryTags />
        <CreateStoryController />
      </View>
      <CoverModal />
      <NavigationEvents onDidFocus={onDidFocus} />
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 24,
  },
});

export default CreateStoryScreen;
