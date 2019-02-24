import React from 'react';
import Welcome from './components/Welcome';
import Info from './components/Info';
import PatientForm from './components/PatientForm';
import Anp from './components/Anp';
import { createStackNavigator, createAppContainer } from 'react-navigation';

const AppNavigatior = createStackNavigator({
  Home: {screen: Welcome},
  Info: {screen: Info},
  PatientForm: {screen: PatientForm},
  Anp: {screen: Anp}
});

const App = createAppContainer(AppNavigatior);

export default App;