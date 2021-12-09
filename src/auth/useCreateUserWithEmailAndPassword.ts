import { useState, useMemo, useCallback } from 'react';
import type { CreateUserOptions, EmailAndPasswordActionHook } from './types';
import type { AuthError, FirebaseModuleAuth } from '../util/types';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';

export default (
  auth: FirebaseModuleAuth,
  options?: CreateUserOptions
): EmailAndPasswordActionHook => {
  const [error, setError] = useState<AuthError>();
  const [registeredUser, setRegisteredUser] =
    useState<FirebaseAuthTypes.UserCredential>();
  const [loading, setLoading] = useState<boolean>(false);

  const createUserWithEmailAndPassword = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        const user = await auth().createUserWithEmailAndPassword(
          email,
          password
        );
        if (options && options.sendEmailVerification && user.user) {
          await user.user.sendEmailVerification(
            options.emailVerificationOptions
          );
        }
        setRegisteredUser(user);
      } catch (_error) {
        setError(_error as AuthError);
      } finally {
        setLoading(false);
      }
    },
    [auth, options]
  );

  return useMemo<EmailAndPasswordActionHook>(
    () => [createUserWithEmailAndPassword, registeredUser, loading, error],
    [createUserWithEmailAndPassword, error, loading, registeredUser]
  );
};
