import { useEffect, useMemo } from 'react';
import { useIsEqualRef, useLoadingValue } from '../util';
import { snapshotToData } from './helpers';
import type {
  CollectionDataHook,
  CollectionDataOnceHook,
  CollectionHook,
  CollectionOnceHook,
  Data,
  DataOptions,
  OnceDataOptions,
  OnceOptions,
  Options,
} from './types';
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { useInternalOnce } from './useInternalOnce';

export const useCollection = <T = FirebaseFirestoreTypes.DocumentData>(
  query?: FirebaseFirestoreTypes.Query<T> | null,
  options?: Options
) => {
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<
    FirebaseFirestoreTypes.QuerySnapshot<T>,
    Error
  >();
  const ref = useIsEqualRef<FirebaseFirestoreTypes.Query<T>>(query, reset);

  useEffect(() => {
    if (!ref.current) {
      setValue(undefined);
      return;
    }
    const unsubscribe =
      options && options.snapshotListenOptions
        ? ref.current.onSnapshot(
            options.snapshotListenOptions,
            setValue,
            setError
          )
        : ref.current.onSnapshot(setValue, setError);

    return () => {
      unsubscribe();
    };
    // we need to use ref.current here explicitly
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current, setError, setValue]);

  return useMemo<CollectionHook<T>>(
    () => [value, loading, error],
    [value, loading, error]
  );
};

export const useCollectionOnce = <T = FirebaseFirestoreTypes.DocumentData>(
  query?: FirebaseFirestoreTypes.Query<T> | null,
  options?: Options & OnceOptions
) => useInternalOnce<T, CollectionOnceHook<T>>(query, options);

export const useCollectionData = <
  T = FirebaseFirestoreTypes.DocumentData,
  IDField extends string | undefined = undefined,
  RefField extends string | undefined = undefined
>(
  query?: FirebaseFirestoreTypes.Query<T> | null,
  options?: DataOptions<T, IDField, RefField>
): CollectionDataHook<T, IDField, RefField> => {
  const [snapshots, loading, error] = useCollection<T>(query, options);
  const values = useGetValuesFromSnapshots(snapshots, options);

  return useMemo<CollectionDataHook<T, IDField, RefField>>(
    () => [values, loading, error],
    [values, loading, error]
  );
};

export const useCollectionDataOnce = <
  T = FirebaseFirestoreTypes.DocumentData,
  IDField extends string | undefined = undefined,
  RefField extends string | undefined = undefined
>(
  query?: FirebaseFirestoreTypes.Query<T> | null,
  options?: DataOptions<T, IDField, RefField> &
    OnceDataOptions<T, IDField, RefField>
) => {
  const [snapshots, loading, error] = useCollectionOnce<T>(query, options);
  const values = useGetValuesFromSnapshots(snapshots, options);

  return useMemo<CollectionDataOnceHook<T, IDField, RefField>>(
    () => [values, loading, error],
    [values, loading, error]
  );
};

const useGetValuesFromSnapshots = <
  T,
  IDField extends string | undefined = undefined,
  RefField extends string | undefined = undefined
>(
  snapshots?: FirebaseFirestoreTypes.QuerySnapshot<T>,
  options?: DataOptions<T, IDField, RefField> &
    OnceDataOptions<T, IDField, RefField>
) => {
  return useMemo(
    () =>
      snapshots?.docs.map((doc) =>
        snapshotToData<T, IDField, RefField>(
          doc,
          options?.idField,
          options?.refField,
          options?.transform
        )
      ) as Data<T, IDField, RefField>[],
    [snapshots, options?.idField, options?.refField, options?.transform]
  );
};
