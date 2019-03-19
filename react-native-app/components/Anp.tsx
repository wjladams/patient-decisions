import React from 'react';
import { View, Text } from 'react-native';
import { NavigationScreenProps, NavigationScreenOptions } from 'react-navigation';

export class Anp extends React.Component<NavigationScreenProps> {

  static navigationOptions: NavigationScreenOptions = {
    title: 'ANP',
    headerLeft: null
  };


  render() {
    return (
      <View>
        <Text>ANP</Text>
      </View>
    );
  }
}