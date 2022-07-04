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

## Why use this instead of react-firebase-hooks?

`react-firebase-hooks` is [incompatible](https://github.com/CSFrequency/react-firebase-hooks/issues/181#issue-1046383491) with the latest versions of [`react-native-firebase`](https://rnfirebase.io/), especially from a types perspective.
This library works internally mostly the same as react-firebase-hooks.
So you really only want to use this lib for react-native if you are using [`react-native-firebase`](https://rnfirebase.io/).

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
