# react-native-firebase-hooks

React Hooks for React Native Firebase

## Installation

```
yarn add @skillnation/react-native-firebase-hooks
```

_Note:_ This assumes you have setup [react-native-firebase](https://rnfirebase.io/) in your project.

## Usage


### Example

```tsx
import React from 'react';
import type { Product } from './types';
import firestore from '@react-native-firebase/firestore';
import { useCollectionData } from '@skillnation/react-native-firebase-hooks/firestore';

export const App: React.FC = () => {
  const [products, isLoading, error] = useCollectionData(
    firestore().collection<Product>('products')
  );

  if (isLoading) return <LoadingComponent />
  if (error) return <ErrorComponent error={error} />
  return <ProductList products={products} />;
};

```

### Documentation

⚠️ These doc links redirect to [`react-firebase-hooks`](https://github.com/CSFrequency/react-firebase-hooks).

The API is exactly the same as [`react-firebase-hooks`](https://github.com/CSFrequency/react-firebase-hooks).
Only the imports are different:

```diff
- import {} from 'react-firebase-hooks/MODULE_NAME'
+ import {} from '@skillnation/react-native-firebase-hooks/MODULE_NAME'
```

- [Authentication Hooks](https://github.com/CSFrequency/react-firebase-hooks/tree/v4.0.2/auth)
- [Cloud Firestore Hooks](https://github.com/CSFrequency/react-firebase-hooks/tree/v4.0.2/firestore)
- [Cloud Functions Hooks](https://github.com/CSFrequency/react-firebase-hooks/tree/v4.0.2/functions)
- [Cloud Messaging Hooks](https://github.com/CSFrequency/react-firebase-hooks/tree/v4.0.2/messaging)
- [Cloud Storage Hooks](https://github.com/CSFrequency/react-firebase-hooks/tree/v4.0.2/storage)
- [Realtime Database Hooks](https://github.com/CSFrequency/react-firebase-hooks/tree/v4.0.2/database)

## Why use this instead of `react-firebase-hooks`?

`react-firebase-hooks` is [incompatible](https://github.com/CSFrequency/react-firebase-hooks/issues/181#issue-1046383491) with the latest versions of [`react-native-firebase`](https://rnfirebase.io/), especially from a types perspective.
This library works internally mostly the same as react-firebase-hooks.
So you really only want to use this lib for react-native if you are using [`react-native-firebase`](https://rnfirebase.io/).

## Migrating from `react-firebase-hooks`

The only thing you have to do is to change the imports:

```diff
- import {} from 'react-firebase-hooks/MODULE_NAME'
+ import {} from '@skillnation/react-native-firebase-hooks/MODULE_NAME'
```

Note however, that this library is based on [`react-firebase-hooks` v4](https://github.com/CSFrequency/react-firebase-hooks/tree/v4.0.2), as this version was for the Firebase JS SDK v8, which had a very similar API to the native SDKs.
We **do** include features of newer versions of `react-firebase-hooks` (such as the `reload()` callback on `use*Once` hooks, which was added in v5).

However, any change in newer version that is for compatibility with Firebase Js SDJ v9 won't be added to this library. This is due to the fact that the firebase JS SDK has a different API from the native SDKs, so we can't have 100% feature parity.

As an example [FirestoreDataConverter](https://firebase.google.com/docs/reference/js/firestore_.firestoredataconverter) is something that just exists in the Firebase v9 JS SDK, and can't be added here.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
