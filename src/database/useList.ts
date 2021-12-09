import { useEffect, useMemo } from 'react';
import { snapshotToData, ValOptions } from './helpers';
import useListReducer from './helpers/useListReducer';
import type { ListHook, ListKeysHook, ListValsHook, Val } from './types';
import { useIsEqualRef } from '../util';
import type { FirebaseDatabaseTypes } from '@react-native-firebase/database';
import database from '@react-native-firebase/database';
database().ref().off();
// import {
//   DataSnapshot,
//   Query,
//   onChildAdded as firebaseOnChildAdded,
//   onChildChanged as firebaseOnChildChanged,
//   onChildMoved as firebaseOnChildMoved,
//   onChildRemoved as firebaseOnChildRemoved,
//   onValue as firebaseOnValue,
//   off,
// } from 'firebase/database';

export const useList = (
  query?: FirebaseDatabaseTypes.Query | null
): ListHook => {
  const [state, dispatch] = useListReducer();

  const queryRef = useIsEqualRef(query, () => dispatch({ type: 'reset' }));
  const ref: FirebaseDatabaseTypes.Query | null | undefined = queryRef.current;

  useEffect(() => {
    if (!ref) {
      dispatch({ type: 'empty' });
      return;
    }

    const onChildAdded = (
      snapshot: FirebaseDatabaseTypes.DataSnapshot | null,
      previousKey?: string | null
    ) => {
      dispatch({ type: 'add', previousKey, snapshot });
    };

    const onChildChanged = (
      snapshot: FirebaseDatabaseTypes.DataSnapshot | null
    ) => {
      dispatch({ type: 'change', snapshot });
    };

    const onChildMoved = (
      snapshot: FirebaseDatabaseTypes.DataSnapshot | null,
      previousKey?: string | null
    ) => {
      dispatch({ type: 'move', previousKey, snapshot });
    };

    const onChildRemoved = (
      snapshot: FirebaseDatabaseTypes.DataSnapshot | null
    ) => {
      dispatch({ type: 'remove', snapshot });
    };

    const onError = (error: Error) => {
      dispatch({ type: 'error', error });
    };

    const onValue = (
      snapshots: FirebaseDatabaseTypes.DataSnapshot[] | null
    ) => {
      dispatch({ type: 'value', snapshots });
    };

    let childAddedHandler:
      | ReturnType<FirebaseDatabaseTypes.Query['on']>
      | undefined;
    const onInitialLoad = (snapshot: FirebaseDatabaseTypes.DataSnapshot) => {
      const snapshotVal = snapshot.val();
      let childrenToProcess = snapshotVal
        ? Object.keys(snapshot.val()).length
        : 0;

      // If the list is empty then initialise the hook and use the default `onChildAdded` behaviour
      if (childrenToProcess === 0) {
        childAddedHandler = ref.on('child_added', onChildAdded, onError);
        onValue([]);
      } else {
        // Otherwise, we load the first batch of children all to reduce re-renders
        const children: FirebaseDatabaseTypes.DataSnapshot[] = [];

        const onChildAddedWithoutInitialLoad = (
          addedChild: FirebaseDatabaseTypes.DataSnapshot,
          previousKey?: string | null
        ) => {
          if (childrenToProcess > 0) {
            childrenToProcess--;
            children.push(addedChild);

            if (childrenToProcess === 0) {
              onValue(children);
            }

            return;
          }

          onChildAdded(addedChild, previousKey);
        };

        childAddedHandler = ref.on(
          'child_added',
          onChildAddedWithoutInitialLoad,
          onError
        );
      }
    };

    ref.on('value', onInitialLoad, onError, { onlyOnce: true });
    const childChangedHandler = ref.on(
      'child_changed',
      onChildChanged,
      onError
    );
    const childMovedHandler = ref.on('child_moved', onChildMoved, onError);
    const childRemovedHandler = ref.on(
      'child_removed',
      onChildRemoved,
      onError
    );

    return () => {
      ref.off('child_added', childAddedHandler);
      ref.off('child_changed', childChangedHandler);
      ref.off('child_moved', childMovedHandler);
      ref.off('child_removed', childRemovedHandler);
    };
  }, [dispatch, ref]);

  return useMemo<ListHook>(
    () => [state.value.values, state.loading, state.error],
    [state.value.values, state.loading, state.error]
  );
};

export const useListKeys = (
  query?: FirebaseDatabaseTypes.Query | null
): ListKeysHook => {
  const [snapshots, loading, error] = useList(query);
  const values = useMemo(
    () =>
      snapshots
        ? snapshots.map((snapshot) => snapshot.key as string)
        : undefined,
    [snapshots]
  );

  return useMemo<ListKeysHook>(
    () => [values, loading, error],
    [values, loading, error]
  );
};

export const useListVals = <
  T,
  KeyField extends string = '',
  RefField extends string = ''
>(
  query?: FirebaseDatabaseTypes.Query | null,
  options?: ValOptions<T>
): ListValsHook<T, KeyField, RefField> => {
  const keyField = options ? options.keyField : undefined;
  const refField = options ? options.refField : undefined;
  const transform = options ? options.transform : undefined;
  const [snapshots, loading, error] = useList(query);
  const values = useMemo(
    () =>
      (snapshots
        ? snapshots.map((snapshot) =>
            snapshotToData(snapshot, keyField, refField, transform)
          )
        : undefined) as Val<T, KeyField, RefField>[],
    [snapshots, keyField, refField, transform]
  );

  return useMemo<ListValsHook<T, KeyField, RefField>>(
    () => [values, loading, error],
    [values, loading, error]
  );
};
