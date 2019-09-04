import React from 'react';
import { StyleSheet, Text, View, WebView, NativeSyntheticEvent, WebViewMessageEventData, Button } from 'react-native';
import Swiper from 'react-native-swiper';
import { NavigationScreenProps, NavigationScreenOptions } from 'react-navigation';
import { Patient } from './PatientForm';
import { HtmlWebView } from './HtmlWebView';
import { Config } from '../config/Config';

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
    const config = new Config();
    let views = [];
    for(let i = 1; i <= config.getPageCount(); i++) {
      views.push(<HtmlWebView uri={config.getUri(i)} navigation={this.props.navigation} patient={this.state.patient} key={i}/>);
    }

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}></Text>
          <Text style={styles.title}>{this.state.patient.name}</Text>
        </View>
        <Swiper showsButtons={true} loop={false}
          onMomentumScrollEnd={(e: FIXME, state: FIXME, context: FIXME) => console.log('index:', state.index)}>
           {views}
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

