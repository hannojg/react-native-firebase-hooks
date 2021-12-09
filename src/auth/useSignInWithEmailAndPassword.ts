import { useState, useMemo, useCallback } from 'react';
import type { EmailAndPasswordActionHook } from './types';
import type { AuthError, FirebaseModuleAuth } from '../util/types';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';

export default (auth: FirebaseModuleAuth): EmailAndPasswordActionHook => {
  const [error, setError] = useState<AuthError>();
  const [loggedInUser, setLoggedInUser] =
    useState<FirebaseAuthTypes.UserCredential>();
  const [loading, setLoading] = useState<boolean>(false);

  const signInWithEmailAndPassword = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        const user = await auth().signInWithEmailAndPassword(email, password);
        setLoggedInUser(user);
      } catch (err) {
        setError(err as AuthError);
      } finally {
        setLoading(false);
      }
    },
    [auth]
  );

  return useMemo<EmailAndPasswordActionHook>(
    () => [signInWithEmailAndPassword, loggedInUser, loading, error],
    [signInWithEmailAndPassword, loggedInUser, loading, error]
  );
};
