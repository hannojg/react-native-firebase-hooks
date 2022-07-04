import { useEffect, useMemo } from 'react';
import { useIsEqualRef, useLoadingValue } from '../util';
import type { CollectionHook, DocumentHook, Options } from './types';
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

/**
 * Common abstraction for useDocument and useCollection.
 * It's not recommended using it directly, please use the documented hooks.
 * @param query
 * @param options
 */
export const useInternal = <
  T = FirebaseFirestoreTypes.DocumentData,
  ReturnTypeHook extends CollectionHook<T> | DocumentHook<T> =
    | CollectionHook<T>
    | DocumentHook<T>,
  ValueType extends
    | FirebaseFirestoreTypes.QuerySnapshot<T>
    | FirebaseFirestoreTypes.DocumentSnapshot<T> =
    | FirebaseFirestoreTypes.QuerySnapshot<T>
    | FirebaseFirestoreTypes.DocumentSnapshot<T>,
  QueryType extends
    | FirebaseFirestoreTypes.Query<T>
    | FirebaseFirestoreTypes.DocumentReference<T> =
    | FirebaseFirestoreTypes.Query<T>
    | FirebaseFirestoreTypes.DocumentReference<T>
>(
  query?: QueryType | null,
  options?: Options
) => {
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<
    ValueType,
    Error
  >();
  const ref = useIsEqualRef<QueryType>(query, reset);

  useEffect(() => {
    if (!ref.current) {
      setValue(undefined);
      return;
    }

    const unsubscribe =
      options && options.snapshotListenOptions
        ? // @ts-expect-error Types are badly incompatible
          ref.current.onSnapshot(
            options.snapshotListenOptions,
            setValue,
            setError
          )
        : // @ts-expect-error Types are badly incompatible
          ref.current.onSnapshot(setValue, setError);

    return () => {
      unsubscribe();
    };
    // we need to use ref.current here explicitly
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current, setError, setValue]);

  return useMemo<ReturnTypeHook>(
    // @ts-expect-error No clue how to make that work with TS
    () => [value, loading, error],
    [value, loading, error]
  );
};
