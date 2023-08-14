import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Button } from 'react-native';

import * as SQLite from 'expo-sqlite'
const db = SQLite.openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024) // returns Database object

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
        <View>
        <Text>Add Random Name with Counts</Text>
        <TouchableOpacity>
        <Button onPress={this.transaction} title="Press Me" />        
        </TouchableOpacity>
      </View >
    )
  }
}
export default App
// Styles are removed purpose-fully 
