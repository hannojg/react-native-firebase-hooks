# react-native-firebase-hooks

React Hooks for React Native Firebase

## Installation

```
yarn add @skillnation/react-native-firebase-hooks
```

_Note:_ This assumes you have setup [react-native-firebase](https://rnfirebase.io/) in your project.

## Usage



### Example

### Documentation

The API is exactly the same as [react-firebase-hooks](https://github.com/CSFrequency/react-firebase-hooks).
Only the imports are different:

```diff
- import {} from 'react-firebase-hooks/MODULE_NAME'
+ import {} from '@skillnation/react-native-firebase-hooks/MODULE_NAME'
```

- [Authentication Hooks](https://github.com/CSFrequency/react-firebase-hooks/tree/master/auth)
- [Cloud Firestore Hooks](https://github.com/CSFrequency/react-firebase-hooks/tree/master/firestore)
- [Cloud Functions Hooks](https://github.com/CSFrequency/react-firebase-hooks/tree/master/functions)
- [Cloud Messaging Hooks](https://github.com/CSFrequency/react-firebase-hooks/tree/master/messaging)
- [Cloud Storage Hooks](https://github.com/CSFrequency/react-firebase-hooks/tree/master/storage)
- [Realtime Database Hooks](https://github.com/CSFrequency/react-firebase-hooks/tree/master/database)

## Why use this instead of react-firebase-hooks?

`react-firebase-hooks` is [incompatible](https://github.com/CSFrequency/react-firebase-hooks/issues/181#issue-1046383491) with the latest versions of `react-native-firebase`, especially from a types perspective.
This works internally the mostly the same as react-firebase-hooks.
So you really only want to use that for react native.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
