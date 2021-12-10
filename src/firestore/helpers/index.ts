import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import type { Data } from '../types';

export const snapshotToData = <
  T = FirebaseFirestoreTypes.DocumentData,
  IDField extends string | undefined = undefined,
  RefField extends string | undefined = undefined
>(
  snapshot: FirebaseFirestoreTypes.DocumentSnapshot<T>,
  idField?: IDField,
  refField?: RefField,
  transform?: (val: any) => T
): Data<T, IDField, RefField> | undefined => {
  if (!snapshot.exists) {
    return undefined;
  }

  let data = snapshot.data();
  // this case should never happen as, we did a earlier exists check
  // so this line here is more to satisfy TS
  if (data == null) return undefined;

  if (transform) {
    data = transform(data);
  }
  if (typeof idField === 'string') {
    // @ts-expect-error We add a new field to a predefined object
    data[idField] = snapshot.id;
  }
  if (typeof refField === 'string') {
    // @ts-expect-error We add a new field to a predefined object
    data[refField] = snapshot.ref;
  }

  // @ts-expect-error TODO: is there any way we can convince it, that it conforms the Data type?
  return data;
};
