import {
  useRef,
  useCallback,
  useEffect,
  EffectCallback,
} from 'react';
import {
  AppState,
} from 'react-native';

function useAppState(effect: () => EffectCallback | void) {
  const effectRef = useRef(effect);

  const cleanUps = useRef<EffectCallback[]>([]);

  const isInBackground = useRef(false);

  const handleAppStateChange = useCallback((nextAppState: 'active' | 'inactive' | 'background') => {
    if (isInBackground.current && nextAppState === 'active') {
      isInBackground.current = false;
      const cleanUp = effectRef.current();
      if (cleanUp) {
        cleanUps.current.push(cleanUp);
      }
    } else if (!isInBackground.current && (nextAppState === 'inactive' || nextAppState === 'background')) {
      isInBackground.current = true;
      cleanUps.current.forEach(c => c && c());
      cleanUps.current = [];
    }
  }, []);

  useEffect(() => {
    const cleanUp = effectRef.current();
    if (cleanUp) {
      cleanUps.current.push(cleanUp);
    }
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      cleanUps.current.forEach(c => c && c());
      cleanUps.current = [];
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, [handleAppStateChange]);
}

export default useAppState;
