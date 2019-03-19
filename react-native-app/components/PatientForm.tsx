import React from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import t from 'tcomb-form-native';
import moment from 'moment';
import { NavigationScreenProps, NavigationScreenOptions } from 'react-navigation';

export enum GenderEnum { M = "Male", F = "Femail" }

export interface Patient {
  name: string;
  birthDate: Date;
  gender: GenderEnum;
  email?: string;
}

const Gender = t.enums({
  M: 'Male',
  F: 'Female'
});

const BirthDate = {
  label: 'Birth Date',
  mode: 'date',
  config: {
    format: (date: Date) => moment(date).format('MM/DD/YYYY')
  }
};

const Patient = t.struct({
  name: t.String,
  birthDate: t.Date,
  gender: Gender,
  email: t.maybe(t.String)
});

let options = {
  fields: {
    "birthDate": BirthDate
  }
};

const Form = t.form.Form;

export class PatientForm extends React.Component<NavigationScreenProps> {
  static navigationOptions: NavigationScreenOptions = {
    title: 'Patient'
  };

  constructor(props: NavigationScreenProps) {
    super(props);
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    var value = (this.refs.form as FIXME).getValue();
    if (value != null) {
      const { navigate } = this.props.navigation;
      navigate('Info', { patient: value });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Form ref="form"
          type={Patient}
          options={options}
        />
        <TouchableHighlight style={styles.button} onPress={this.onPress} underlayColor='#99d9f4'>
          <Text style={styles.buttonText}>Save and Proceed</Text>
        </TouchableHighlight>
      </View>
    );
  }

}

var styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 50,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 10,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 10,
    alignSelf: 'flex-start',
    justifyContent: 'center'
  }
});