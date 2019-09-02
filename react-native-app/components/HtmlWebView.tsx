import React from 'react';
import { StyleSheet, Text, View, WebView, NativeSyntheticEvent, WebViewMessageEventData } from 'react-native';

interface HtmlWebViewProps {
    uri: string;
}

export class HtmlWebView extends React.Component<HtmlWebViewProps> {

    constructor(props : HtmlWebViewProps) {
        super(props);
    }

    render() {
        return(
            <WebView style={styles.webView}
            source={{ uri: this.props.uri }}
            scalesPageToFit />
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
    },
    webView: {
      flex: 1,
      alignItems: 'center',
    },
    header: {
      alignItems: 'center'
    },
    title: {
      fontSize: 30,
    },
    anpButton: {
      fontSize: 30,
      margin: 10,
      padding: 10,
      borderWidth: 2,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center'
    }
  });