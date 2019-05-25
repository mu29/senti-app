declare module 'react-native-image-cache-hoc' {
  import React from 'react';
  import { ImageProps } from 'react-native';

  interface CachableImageProps {
    source: {
      uri: string;
    };
    permanent?: boolean;
    placeholder?: {
      component: React.ComponentType<any>;
      props: {
        style: any;
      }
    };    
  }

  function imageCacheHoc(
    Image: React.ComponentClass<any>,
    options?: {
      validProtocols?: ('http' | 'https')[];
      fileHostWhitelist?: string[];
      fileDirName?: string;
      cachePruneTriggerLimit?: number;
      defaultPlaceholder?: {
        component: React.ComponentType<any>;
        props: {
          style: any;
        }
      };
    }
  ): React.ComponentType<CachableImageProps & ImageProps>;

  export default imageCacheHoc
}
