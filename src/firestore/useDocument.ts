import { useMemo } from 'react';
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
import { useInternal } from './useInternal';

export const useDocument = <T = FirebaseFirestoreTypes.DocumentData>(
  docRef?: FirebaseFirestoreTypes.DocumentReference<T> | null,
  optionsProp?: Options
): DocumentHook<T> => useInternal<T, DocumentHook<T>>(docRef, optionsProp);

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
