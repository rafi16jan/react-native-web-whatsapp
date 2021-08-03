import React from 'react';
import { Platform, ToastAndroid } from 'react-native';
import { WebView } from 'react-native-webview'
import * as Linking from 'expo-linking';
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
document.head.insertAdjacentHTML('beforeend', '<style>a[rel] {pointer-events: none}</style>');
`;

/*const html = `
<html>
<head>
<script>
fetch('/').then(function (response) {
  return response.text();
}).then(function (body) {
  document.write(body);
});
</script>
</head>
</html>
`;*/

const download = Platform.OS === 'android' ? async (file) => !(await FileSystem.writeAsStringAsync(FileSystem.cacheDirectory + file.name, file.data.split(';base64,')[1], {encoding: FileSystem.EncodingType.Base64})) && (await MediaLibrary.requestPermissionsAsync()) && !(await MediaLibrary.saveToLibraryAsync(FileSystem.cacheDirectory + file.name,)) && ToastAndroid.show('File Downloaded in DCIM', ToastAndroid.LONG) : () => Linking.openURL('https://solu.js.org/hash-downloader.html#' + file.data);

const userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.80 Safari/537.36';

export default function App() {
  const [html, setHTML] = React.useState(null);
  if (!html) {
    fetch('https://web.whatsapp.com', {headers: {'User-Agent': userAgent}}).then(response => response.text()).then(body => setHTML(body));
    return <React.Fragment/>;
  }
  return (
    <WebView allowFileAccess allowsInlineMediaPlayback originWhitelist={['*']} onMessage={(event) => download(JSON.parse(event.nativeEvent.data))} injectedJavaScript={js} source={{header: {Referer: 'https://web.whatsapp.com/'}, html, baseUrl: 'https://web.whatsapp.com'}} userAgent={userAgent}/>
  )
}
