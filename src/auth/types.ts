import type { FirebaseAuthTypes } from '@react-native-firebase/auth';

export type AuthActionHook<T, E> = [
  (email: string, password: string) => Promise<void>,
  T | undefined,
  boolean,
  E | undefined
];
export type CreateUserOptions = {
  emailVerificationOptions?: FirebaseAuthTypes.ActionCodeSettings;
  sendEmailVerification?: boolean;
};
export type EmailAndPasswordActionHook = AuthActionHook<
  FirebaseAuthTypes.UserCredential,
  FirebaseAuthTypes.NativeFirebaseAuthError
>;
