import React from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';

const WebViewScreen = () => {
  const { url } = 'https://www.naver.com';

  return (
    <View style={{ flex: 1, width:'100%',height:'100%'}}>
      <WebView
        source={{ uri: url }}
        style={{ width:'100%',height:'100%' }}
      />
    </View>
  );
};

export default WebViewScreen;