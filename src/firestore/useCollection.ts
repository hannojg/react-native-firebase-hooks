import { useEffect, useMemo, useRef } from 'react';
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

export const useCollection = <T = FirebaseFirestoreTypes.DocumentData>(
  query?: FirebaseFirestoreTypes.Query<T> | null,
  optionsProp?: Options
) => {
  // we capture the options prop here once, as it is an object that is most likely not memoized
  // and thus would cause a "loop"-like re-execution of this hook
  const options = useRef(optionsProp).current;
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
  }, [options, ref.current, setError, setValue]);

  return useMemo<CollectionHook<T>>(
    () => [value, loading, error],
    [value, loading, error]
  );
};

export const useCollectionOnce = <T = FirebaseFirestoreTypes.DocumentData>(
  query?: FirebaseFirestoreTypes.Query<T> | null,
  options?: Options & OnceOptions
) => {
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<
    FirebaseFirestoreTypes.QuerySnapshot<T>,
    Error
  >();
  let effectActive = useRef(true);
  const ref = useIsEqualRef<FirebaseFirestoreTypes.Query<T>>(query, reset);

  const loadData = async (
    queryArg?: FirebaseFirestoreTypes.Query<T> | null,
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
        setValue(result);
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

  const resArray: CollectionOnceHook<T> = [
    value,
    loading,
    error,
    () => loadData(ref.current, options),
  ];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => resArray, resArray);
};

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
