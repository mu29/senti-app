import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {
  Button,
  Text,
} from 'components';
import Icon from 'react-native-vector-icons/Ionicons';
import { palette } from 'services/style';
import { ButtonProps } from '../bootstrap/Button';

interface SocialProviderButtonProps extends ButtonProps {
  icon: string;
  backgroundColor: string;
  children: any;
}

const SocialProviderButton: React.FunctionComponent<SocialProviderButtonProps> = ({
  icon,
  backgroundColor,
  children,
  ...props
}) => (
  <Button style={[styles.container, { backgroundColor }]} {...props}>
    <View style={styles.content}>
      <Icon name={`logo-${icon}`} color={palette.gray[10]} size={24} />
      <Text style={styles.text}>
        {children}
      </Text>
    </View>
  </Button>
);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
    marginBottom: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: palette.gray[10],
  },
});

export default React.memo(SocialProviderButton);
