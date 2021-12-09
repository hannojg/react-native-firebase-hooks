import { useEffect } from 'react';
import { LoadingHook, useComparatorRef, useLoadingValue } from '../util';
import type { FirebaseStorageTypes } from '@react-native-firebase/storage';

export type DownloadURLHook = LoadingHook<string, Error>;

export default (
  storageRef?: FirebaseStorageTypes.Reference | null
): DownloadURLHook => {
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<
    string,
    Error
  >();
  const ref = useComparatorRef(storageRef, isEqual, reset);

  useEffect(() => {
    if (!ref.current) {
      setValue(undefined);
      return;
    }
    ref.current.getDownloadURL().then(setValue).catch(setError);
  }, [ref, setError, setValue]);

  return [value, loading, error];
};

const isEqual = (
  v1: FirebaseStorageTypes.Reference | null | undefined,
  v2: FirebaseStorageTypes.Reference | null | undefined
): boolean => {
  const bothNull: boolean = !v1 && !v2;
  const equal: boolean = !!v1 && !!v2 && v1.fullPath === v2.fullPath;
  return bothNull || equal;
};
