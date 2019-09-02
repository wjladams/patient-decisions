import React from 'react';
import { StyleSheet, Text, View, WebView, NativeSyntheticEvent, WebViewMessageEventData } from 'react-native';
import { Patient } from './PatientForm';

interface HtmlWebViewButtonProps {
    uri: string;
    navigation: NavigationScreenProps;
    patient:Patient;
}

export class HtmlButtonWebView extends React.Component<HtmlWebViewButtonProps> {

    constructor(props : HtmlWebViewProps) {
        super(props);
        this.state = {
              patient: this.props.patient
        }
        this.onPress = this.onPress.bind(this);
    }

    onPress(event: NativeSyntheticEvent<WebViewMessageEventData>) {
        const { navigate } = this.props.navigation;
        navigate('Anp', { patient: this.state.patient });
      }

    render() {
        return(
           <WebView
               source={{ uri: this.props.uri }}
               scalesPageToFit
               onMessage={event => this.onPress(event)} />
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