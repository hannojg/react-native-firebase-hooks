import type { firebase } from '@react-native-firebase/auth';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';

export type FirebaseModuleAuth = typeof firebase.auth;
export type AuthError = FirebaseAuthTypes.NativeFirebaseAuthError;
