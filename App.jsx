import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Hello from './src/components/Hello';

export default function App() {
  return (
    <View style={styles.container}>
      <Hello bang>World</Hello>
      <Hello bang style={{ fontSize: 16 }}>Small World</Hello>
      <Text>Open up App.js to start working on your app!</Text>
      {/* eslint-disable-next-line */}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
