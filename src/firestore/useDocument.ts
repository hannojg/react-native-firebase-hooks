import { useEffect, useMemo } from 'react';
import { useIsEqualRef, useLoadingValue } from '../util';
import { snapshotToData } from './helpers';
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import type {
  Data,
  DataOptions,
  DocumentDataHook,
  DocumentHook,
  OnceDataOptions,
  OnceOptions,
  Options,
} from './types';

export const useDocument = <T = FirebaseFirestoreTypes.DocumentData>(
  docRef?: FirebaseFirestoreTypes.DocumentReference<T> | null,
  options?: Options
): DocumentHook<T> => {
  return useDocumentInternal<T>(true, docRef, options);
};

export const useDocumentOnce = <T = FirebaseFirestoreTypes.DocumentData>(
  docRef?: FirebaseFirestoreTypes.DocumentReference<T> | null,
  options?: OnceOptions
): DocumentHook<T> => {
  return useDocumentInternal<T>(false, docRef, options);
};

export const useDocumentData = <
  T = FirebaseFirestoreTypes.DocumentData,
  IDField extends string = '',
  RefField extends string = ''
>(
  docRef?: FirebaseFirestoreTypes.DocumentReference<T> | null,
  options?: DataOptions<T>
): DocumentDataHook<T, IDField, RefField> => {
  return useDocumentDataInternal<T, IDField, RefField>(true, docRef, options);
};

export const useDocumentDataOnce = <
  T = FirebaseFirestoreTypes.DocumentData,
  IDField extends string = '',
  RefField extends string = ''
>(
  docRef?: FirebaseFirestoreTypes.DocumentReference<T> | null,
  options?: OnceDataOptions<T>
): DocumentDataHook<T, IDField, RefField> => {
  return useDocumentDataInternal<T, IDField, RefField>(false, docRef, options);
};

const useDocumentInternal = <T = FirebaseFirestoreTypes.DocumentData>(
  listen: boolean,
  docRef?: FirebaseFirestoreTypes.DocumentReference<T> | null,
  options?: Options & OnceOptions
): DocumentHook<T> => {
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
    if (listen) {
      const listener =
        options && options.snapshotListenOptions
          ? ref.current.onSnapshot(
              options.snapshotListenOptions,
              setValue,
              setError
            )
          : ref.current.onSnapshot(setValue, setError);

      return () => {
        listener();
      };
    } else {
      const getOptionsSource = options?.getOptions?.source;
      ref.current
        .get(
          getOptionsSource != null
            ? {
                source: getOptionsSource,
              }
            : undefined
        )
        .then(setValue)
        .catch(setError);
    }
    return undefined;
  }, [listen, options, ref, setError, setValue]);

  return useMemo<DocumentHook<T>>(
    () => [value, loading, error],
    [value, loading, error]
  );
};

const useDocumentDataInternal = <
  T = FirebaseFirestoreTypes.DocumentData,
  IDField extends string = '',
  RefField extends string = ''
>(
  listen: boolean,
  docRef?: FirebaseFirestoreTypes.DocumentReference<T> | null,
  options?: DataOptions<T>
): DocumentDataHook<T, IDField, RefField> => {
  const idField = options ? options.idField : undefined;
  const refField = options ? options.refField : undefined;
  const transform = options ? options.transform : undefined;
  const [snapshot, loading, error] = useDocumentInternal<T>(
    listen,
    docRef,
    options
  );
  const value = useMemo(
    () =>
      (snapshot
        ? snapshotToData<T>(snapshot, idField, refField, transform)
        : undefined) as Data<T, IDField, RefField>,
    [snapshot, idField, refField, transform]
  );

  return useMemo<DocumentDataHook<T, IDField, RefField>>(
    () => [value, loading, error],
    [value, loading, error]
  );
};
