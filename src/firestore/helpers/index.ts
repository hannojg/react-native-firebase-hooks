import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export const snapshotToData = <T = FirebaseFirestoreTypes.DocumentData>(
  snapshot: FirebaseFirestoreTypes.DocumentSnapshot<T>,
  idField?: string,
  refField?: string,
  transform?: (val: any) => T
) => {
  if (!snapshot.exists) {
    return undefined;
  }

  let data = snapshot.data() as FirebaseFirestoreTypes.DocumentData;
  if (transform) {
    data = transform(data);
  }
  if (idField) {
    data[idField] = snapshot.id;
  }
  if (refField) {
    data[refField] = snapshot.ref;
  }

  return data;
};
