import type { LoadingHook } from '../util';
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export type IDOptions<
  T,
  IDField extends string | undefined = undefined,
  RefField extends string | undefined = undefined
> = {
  idField?: IDField;
  refField?: RefField;
  transform?: (val: any) => T;
};
export type Options = {
  snapshotListenOptions?: FirebaseFirestoreTypes.SnapshotListenOptions;
};
export type DataOptions<
  T,
  IDField extends string | undefined = undefined,
  RefField extends string | undefined = undefined
> = Options & IDOptions<T, IDField, RefField>;
export type OnceOptions = {
  getOptions?: GetOptions;
};
export type GetOptions = {
  source?: 'default' | 'server' | 'cache';
};
export type OnceDataOptions<
  T,
  IDField extends string | undefined = undefined,
  RefField extends string | undefined = undefined
> = OnceOptions & IDOptions<T, IDField, RefField>;
export type Data<
  T = FirebaseFirestoreTypes.DocumentData,
  IDField extends string | undefined = undefined,
  RefField extends string | undefined = undefined,
  // This is the type used with IDField and RefField merged onto the type
  ResultType = T &
    (IDField extends string ? Record<IDField, string> : {}) &
    (RefField extends string
      ? Record<RefField, FirebaseFirestoreTypes.DocumentReference<T>>
      : {})
> = IDField extends undefined
  ? RefField extends undefined
    ? // Here IDField and RefField are both undefined, so our type is really just the input type T
      T
    : // In any other case (ID or Ref possibly null) return the result type
      ResultType
  : ResultType;

export type CollectionHook<T = FirebaseFirestoreTypes.DocumentData> =
  LoadingHook<FirebaseFirestoreTypes.QuerySnapshot<T>, Error>;

export type CollectionOnceHook<T = FirebaseFirestoreTypes.DocumentData> = [
  ...CollectionHook<T>,
  () => Promise<void>
];

export type CollectionDataHook<
  T = FirebaseFirestoreTypes.DocumentData,
  IDField extends string | undefined = undefined,
  RefField extends string | undefined = undefined
> = LoadingHook<Data<T, IDField, RefField>[], Error>;

export type CollectionDataOnceHook<
  T = FirebaseFirestoreTypes.DocumentData,
  IDField extends string | undefined = undefined,
  RefField extends string | undefined = undefined
> = [...CollectionDataHook<T, IDField, RefField>];

export type DocumentHook<T = FirebaseFirestoreTypes.DocumentData> = LoadingHook<
  FirebaseFirestoreTypes.DocumentSnapshot<T>,
  Error
>;

export type DocumentOnceHook<T = FirebaseFirestoreTypes.DocumentData> = [
  ...DocumentHook<T>,
  () => Promise<void>
];

export type DocumentDataHook<
  T = FirebaseFirestoreTypes.DocumentData,
  IDField extends string | undefined = undefined,
  RefField extends string | undefined = undefined
> = LoadingHook<Data<T, IDField, RefField>, Error>;

export type DocumentDataOnceHook<
  T = FirebaseFirestoreTypes.DocumentData,
  IDField extends string | undefined = undefined,
  RefField extends string | undefined = undefined
> = [...DocumentDataHook<T, IDField, RefField>, () => Promise<void>];
