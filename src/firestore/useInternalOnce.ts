import { useEffect, useMemo } from 'react';
import { useIsEqualRef, useLoadingValue } from '../util';
import type {
  CollectionOnceHook,
  DocumentOnceHook,
  OnceOptions,
  Options,
} from './types';
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

/**
 * Common abstraction for useDocument*Once and useCollection*Once.
 * It's not recommended using it directly, please use the documented hooks.
 * @param query
 * @param options
 */
export const useInternalOnce = <
  T = FirebaseFirestoreTypes.DocumentData,
  ReturnTypeHook extends CollectionOnceHook<T> | DocumentOnceHook<T> =
    | CollectionOnceHook<T>
    | DocumentOnceHook<T>,
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
  options?: Options & OnceOptions
) => {
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<
    ValueType,
    Error
  >();
  let effectActive = true;
  const ref = useIsEqualRef<QueryType>(query, reset);

  const loadData = async (
    queryArg?: QueryType | null,
    optionsArg?: Options & OnceOptions
  ) => {
    if (!queryArg) {
      setValue(undefined);
      return;
    }

    const getOptionsSource = optionsArg?.getOptions?.source;
    try {
      const result = await queryArg.get(
        getOptionsSource != null
          ? {
              source: getOptionsSource,
            }
          : undefined
      );
      if (effectActive) {
        setValue(result as ValueType); // TODO: can we improve on this as cast?
      }
    } catch (e) {
      if (effectActive) {
        setError(e as Error);
      }
    }
  };

  useEffect(() => {
    loadData(ref.current, options);

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      effectActive = false;
    };
  }, [ref.current]);

  const resArray = [
    value,
    loading,
    error,
    () => loadData(ref.current, options),
  ];
  // @ts-expect-error No idea how to make that work in TS
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo<ReturnTypeHook>(() => resArray, resArray);
};
