import React from 'react';
import { StyleSheet, Text, View, WebView, NativeSyntheticEvent, WebViewMessageEventData } from 'react-native';
import Swiper from 'react-native-swiper';
import { NavigationScreenProps, NavigationScreenOptions } from 'react-navigation';
import { Patient } from './PatientForm';

interface InfoState {
  patient: Patient;
}

export class Info extends React.Component<NavigationScreenProps, InfoState> {
  static navigationOptions: NavigationScreenOptions = {
    title: 'WeDecide',
    headerLeft: null
  };

  constructor(props: NavigationScreenProps) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      patient: navigation.getParam('patient')
    }
    this.onPress = this.onPress.bind(this);
  }

  onPress(event: NativeSyntheticEvent<WebViewMessageEventData>) {
    const { navigate } = this.props.navigation;
    navigate('Anp', { patient: this.state.patient });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}></Text>
          <Text style={styles.title}>{this.state.patient.name}</Text>
        </View>
        <Swiper showsButtons={true} loop={false}
          onMomentumScrollEnd={(e: FIXME, state: FIXME, context: FIXME) => console.log('index:', state.index)}>
          <WebView style={styles.webView}
            source={{ uri: 'file:///android_asset/html/1.html' }}
            scalesPageToFit />
          <WebView
            source={{ uri: 'file:///android_asset/html/2.html' }}
            scalesPageToFit />
          <WebView
            source={{ uri: 'file:///android_asset/html/3.html' }}
            scalesPageToFit />
          <WebView
            source={{ uri: 'file:///android_asset/html/4.html' }}
            scalesPageToFit
            onMessage={event => this.onPress(event)} />
        </Swiper>
      </View>
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

