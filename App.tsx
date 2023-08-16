import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Button } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Intro from './src/pages/Intro';
import Home from './src/pages/Home';
import AddTask from './src/pages/Add-Task';

const Stack = createNativeStackNavigator();

class App extends React.Component {
  constructor(props: any) {
    super(props)
    this.state = {
      data: null
    }
  }

  render() {
    return (
      <NavigationContainer>
      <Stack.Navigator initialRouteName="Intro" screenOptions={{headerShown: false}}>
        <Stack.Screen name='Intro' component={Intro}/>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="AddTask" component={AddTask} />
      </Stack.Navigator>
    </NavigationContainer>
    )
  }
}
export default App
// Styles are removed purpose-fully 
