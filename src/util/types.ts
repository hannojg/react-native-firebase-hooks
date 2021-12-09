import type { firebase } from '@react-native-firebase/auth';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import type { ReactNativeFirebase } from '@react-native-firebase/app';

export type FirebaseModuleAuth = typeof firebase.auth;
export type AuthError = FirebaseAuthTypes.NativeFirebaseAuthError;
export type FirebaseError = ReactNativeFirebase.NativeFirebaseError;
