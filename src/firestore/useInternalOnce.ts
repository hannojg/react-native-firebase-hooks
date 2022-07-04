import { useEffect, useMemo, useRef } from 'react';
import { useIsEqualRef, useLoadingValue } from '../util';
import type {
  CollectionOnceHook,
  DocumentOnceHook,
  OnceOptions,
  Options,
} from './types';
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

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
  let effectActive = useRef(true);
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
      if (effectActive.current) {
        setValue(result as ValueType); // TODO: can we improve on this as cast?
      }
    } catch (e) {
      if (effectActive.current) {
        setError(e as Error);
      }
    }
  };

  useEffect(() => {
    loadData(ref.current, options);

    return () => {
      effectActive.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current]);

  // @ts-expect-error No idea how to make that work in TS
  const resArray: ReturnTypeHook = [
    value,
    loading,
    error,
    () => loadData(ref.current, options),
  ];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => resArray, resArray);
};
