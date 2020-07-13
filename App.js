import React from 'react';
import { ToastAndroid } from 'react-native';
import { WebView } from 'react-native-webview'
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

const js = `
var original_html_click = HTMLElement.prototype.click;
HTMLElement.prototype.click = function () {
  var element = this;
  if (this.href && this.href.slice(0, 5) === 'blob:') {
    fetch(this.href).then(function (response) {return response.blob()}).then(function (blob) {
      var reader = new FileReader();
      reader.onloadend = function() {
        window.ReactNativeWebView.postMessage(JSON.stringify({'name': element.download, 'data': reader.result}));
      }
      reader.readAsDataURL(blob);
    });
  }
  else return original_html_click.bind(this)();
}
document.head.insertAdjacentHTML('beforeend', '<style>a[href] {pointer-events: none}</style>');
`;

const download = async (file) => !(await FileSystem.writeAsStringAsync(FileSystem.cacheDirectory + file.name, file.data.split(';base64,')[1], {encoding: FileSystem.EncodingType.Base64})) && (await MediaLibrary.requestPermissionsAsync()) && !(await MediaLibrary.saveToLibraryAsync(FileSystem.cacheDirectory + file.name,)) && ToastAndroid.show('File Downloaded in DCIM', ToastAndroid.LONG); //{mimeType: file.data.split(';base64,')[0].split('data:')[1]});

export default function App() {
  return (
    <WebView allowFileAccess allowsInlineMediaPlayback onMessage={(event) => download(JSON.parse(event.nativeEvent.data))} injectedJavaScript={js} source={{uri: 'https://web.whatsapp.com'}} userAgent={'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.80 Safari/537.36'}/>
  )
}
