import { useEffect, useMemo } from 'react';
import { LoadingHook, useLoadingValue } from '../util';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import type { FirebaseModuleAuth } from '../util/types';

export type AuthStateHook = LoadingHook<FirebaseAuthTypes.User | null, Error>;

export default (auth: FirebaseModuleAuth): AuthStateHook => {
  const { error, loading, setValue, value } = useLoadingValue<
    FirebaseAuthTypes.User | null,
    Error
  >(() => auth().currentUser);

  useEffect(() => {
    return auth().onAuthStateChanged({
      next: setValue,
    });
  }, [auth, setValue]);

  return useMemo<AuthStateHook>(
    () => [value, loading, error],
    [error, loading, value]
  );
};
