import type { LoadingHook } from '../util';
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export type IDOptions<T> = {
  idField?: string;
  refField?: string;
  transform?: (val: any) => T;
};
export type Options = {
  snapshotListenOptions?: FirebaseFirestoreTypes.SnapshotListenOptions;
};
export type DataOptions<T> = Options & IDOptions<T>;
export type OnceOptions = {
  getOptions?: GetOptions;
};
export type GetOptions = {
  source?: 'default' | 'server' | 'cache';
};
export type OnceDataOptions<T> = OnceOptions & IDOptions<T>;
export type Data<
  T = FirebaseFirestoreTypes.DocumentData,
  IDField extends string = '',
  RefField extends string = ''
> = T &
  Record<IDField, string> &
  Record<RefField, FirebaseFirestoreTypes.DocumentReference<T>>;

export type CollectionHook<T = FirebaseFirestoreTypes.DocumentData> =
  LoadingHook<FirebaseFirestoreTypes.QuerySnapshot<T>, Error>;
export type CollectionDataHook<
  T = FirebaseFirestoreTypes.DocumentData,
  IDField extends string = '',
  RefField extends string = ''
> = LoadingHook<Data<T, IDField, RefField>[], Error>;

export type DocumentHook<T = FirebaseFirestoreTypes.DocumentData> = LoadingHook<
  FirebaseFirestoreTypes.DocumentSnapshot<T>,
  Error
>;
export type DocumentDataHook<
  T = FirebaseFirestoreTypes.DocumentData,
  IDField extends string = '',
  RefField extends string = ''
> = LoadingHook<Data<T, IDField, RefField>, Error>;
