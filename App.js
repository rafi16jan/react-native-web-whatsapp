import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { WebView } from 'react-native-webview';
//import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <WebView allowFileAccess allowsInlineMediaPlayback source={{uri: 'https://web.whatsapp.com'}} userAgent={'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.80 Safari/537.36'}/>
  )
}
  /*return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});*/
