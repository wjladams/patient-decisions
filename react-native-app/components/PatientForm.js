import React from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import t from 'tcomb-form-native';
import moment from 'moment';

const Gender = t.enums({
    M: 'Male',
    F: 'Female'
});

const BirthDate = {
    label: 'Birth Date',
    mode: 'date',
    config: {
        format: (date) => moment(date).format('MM/DD/YYYY')
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

export default class PatientForm extends React.Component {
    static navigationOptions = {
        title: 'Patient'
    };

    constructor(props) {
        super(props);
        this.onPress = this.onPress.bind(this);
    }

    onPress() {
        var value = this.refs.form.getValue();
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