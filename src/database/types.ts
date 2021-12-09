import type { LoadingHook } from '../util';
import type { FirebaseDatabaseTypes } from '@react-native-firebase/database';

export type Val<
  T,
  KeyField extends string = '',
  RefField extends string = ''
> = T &
  Record<KeyField, string> &
  Record<RefField, FirebaseDatabaseTypes.Reference>;

export type ObjectHook = LoadingHook<FirebaseDatabaseTypes.DataSnapshot, Error>;
export type ObjectValHook<
  T,
  KeyField extends string = '',
  RefField extends string = ''
> = LoadingHook<Val<T, KeyField, RefField>, Error>;

export type ListHook = LoadingHook<FirebaseDatabaseTypes.DataSnapshot[], Error>;
export type ListKeysHook = LoadingHook<string[], Error>;
export type ListValsHook<
  T,
  KeyField extends string = '',
  RefField extends string = ''
> = LoadingHook<Val<T, KeyField, RefField>[], Error>;
