import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Button } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Intro from './src/pages/Intro';
import * as SQLite from 'expo-sqlite'
import Home from './src/pages/Home';
import AddTask from './src/pages/Add-Task';

const db = SQLite.openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024) // returns Database object
const Stack = createNativeStackNavigator();

class App extends React.Component {
  constructor(props: any) {
    super(props)
    this.state = {
      data: null
    }

    db.transaction(function (tx) { 
      tx.executeSql('CREATE TABLE IF NOT EXISTS LOGS (id unique, log)'); 
      tx.executeSql('INSERT INTO LOGS (id, log) VALUES (1, "foobar")'); 
      tx.executeSql('INSERT INTO LOGS (id, log) VALUES (2, "logmsg")'); 
   });
  }

  transaction() {
    db.transaction(function (tx) { 
      tx.executeSql('SELECT * FROM LOGS',[], (_, { rows }) =>
      console.log(JSON.stringify(rows))
    ); 
    });
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
