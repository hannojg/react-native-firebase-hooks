import { useEffect, useMemo } from 'react';
import { snapshotToData, ValOptions } from './helpers';
import type { ObjectHook, ObjectValHook, Val } from './types';
import { useIsEqualRef, useLoadingValue } from '../util';
import type { FirebaseDatabaseTypes } from '@react-native-firebase/database';

export const useObject = (
  query?: FirebaseDatabaseTypes.Query | null
): ObjectHook => {
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<
    FirebaseDatabaseTypes.DataSnapshot,
    Error
  >();
  const ref = useIsEqualRef(query, reset);

  useEffect(() => {
    const _query = ref.current;
    if (!_query) {
      setValue(undefined);
      return;
    }

    _query.on('value', setValue, setError);

    return () => {
      _query.off('value', setValue);
    };
  }, [ref, setError, setValue]);

  return useMemo<ObjectHook>(
    () => [value, loading, error],
    [value, loading, error]
  );
};

export const useObjectVal = <
  T,
  KeyField extends string = '',
  RefField extends string = ''
>(
  query?: FirebaseDatabaseTypes.Query | null,
  options?: ValOptions<T>
): ObjectValHook<T, KeyField, RefField> => {
  const keyField = options ? options.keyField : undefined;
  const refField = options ? options.refField : undefined;
  const transform = options ? options.transform : undefined;
  const [snapshot, loading, error] = useObject(query);
  const value = useMemo(
    () =>
      (snapshot
        ? snapshotToData(snapshot, keyField, refField, transform)
        : undefined) as Val<T, KeyField, RefField>,
    [snapshot, keyField, refField, transform]
  );

  return useMemo<ObjectValHook<T, KeyField, RefField>>(
    () => [value, loading, error],
    [value, loading, error]
  );
};
