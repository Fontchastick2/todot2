import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Intro from './src/pages/Intro';
import Home from './src/pages/Home';
import AddTask from './src/pages/Add-Task';
import { Database } from './src/services/database.service';

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
      <Stack.Navigator initialRouteName="Intro">
        <Stack.Screen name='Intro' component={Intro} options={{headerShown: false}}/>
        <Stack.Screen name="Home" component={Home} options={{headerShown: false}}/>
        <Stack.Screen name="AddTask" component={AddTask} options={{headerShown: false}}/>
        {/*options={{headerStyle: { backgroundColor: 'black'}, headerTitleStyle: {color: 'white'}}}*/}
      </Stack.Navigator>
    </NavigationContainer>
    )
  }
}
export default App
// Styles are removed purpose-fully 
