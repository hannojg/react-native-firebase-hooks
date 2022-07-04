import { useEffect, useMemo, useRef } from 'react';
import { useIsEqualRef, useLoadingValue } from '../util';
import { snapshotToData } from './helpers';
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import type {
  Data,
  DataOptions,
  DocumentDataHook,
  DocumentDataOnceHook,
  DocumentHook,
  DocumentOnceHook,
  OnceOptions,
  Options,
  OnceDataOptions,
} from './types';
import { useInternalOnce } from './useInternalOnce';

export const useDocument = <T = FirebaseFirestoreTypes.DocumentData>(
  docRef?: FirebaseFirestoreTypes.DocumentReference<T> | null,
  optionsProp?: Options
): DocumentHook<T> => {
  // we capture the options prop here once, as it is an object that is most likely not memoized
  // and thus would cause a "loop"-like re-execution of this hook
  const options = useRef(optionsProp).current;
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<
    FirebaseFirestoreTypes.DocumentSnapshot<T>,
    Error
  >();
  const ref = useIsEqualRef<FirebaseFirestoreTypes.DocumentReference<T>>(
    docRef,
    reset
  );

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

  return useMemo<DocumentHook<T>>(
    () => [value, loading, error],
    [value, loading, error]
  );
};

export const useDocumentOnce = <T = FirebaseFirestoreTypes.DocumentData>(
  docRef?: FirebaseFirestoreTypes.DocumentReference<T> | null,
  options?: Options & OnceOptions
) => useInternalOnce<T, DocumentOnceHook<T>>(docRef, options);

export const useDocumentData = <
  T = FirebaseFirestoreTypes.DocumentData,
  IDField extends string | undefined = undefined,
  RefField extends string | undefined = undefined
>(
  docRef?: FirebaseFirestoreTypes.DocumentReference<T> | null,
  options?: DataOptions<T, IDField, RefField>
): DocumentDataHook<T, IDField, RefField> => {
  const [snapshot, loading, error] = useDocument<T>(docRef, options);
  const value = useGetValuesFromSnapshots(snapshot, options);

  return useMemo<DocumentDataHook<T, IDField, RefField>>(
    () => [value, loading, error],
    [value, loading, error]
  );
};

export const useDocumentDataOnce = <
  T = FirebaseFirestoreTypes.DocumentData,
  IDField extends string | undefined = undefined,
  RefField extends string | undefined = undefined
>(
  docRef?: FirebaseFirestoreTypes.DocumentReference<T> | null,
  options?: DataOptions<T, IDField, RefField> &
    OnceDataOptions<T, IDField, RefField>
) => {
  const [snapshot, loading, error] = useDocumentOnce<T>(docRef, options);
  const values = useGetValuesFromSnapshots(snapshot, options);

  return useMemo<DocumentDataOnceHook<T, IDField, RefField>>(
    () => [values, loading, error],
    [values, loading, error]
  );
};

const useGetValuesFromSnapshots = <
  T,
  IDField extends string | undefined = undefined,
  RefField extends string | undefined = undefined
>(
  docRef?: FirebaseFirestoreTypes.DocumentSnapshot<T>,
  options?: DataOptions<T, IDField, RefField> &
    OnceDataOptions<T, IDField, RefField>
) => {
  return useMemo(
    () =>
      (docRef
        ? snapshotToData<T, IDField, RefField>(
            docRef,
            options?.idField,
            options?.refField,
            options?.transform
          )
        : undefined) as Data<T, IDField, RefField>,
    [docRef, options?.idField, options?.refField, options?.transform]
  );
};
