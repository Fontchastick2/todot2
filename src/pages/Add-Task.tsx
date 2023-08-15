import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Button, Dimensions } from 'react-native';

const screenWidth= Dimensions.get('window').width;
const screenHeight= Dimensions.get('screen').height;

class AddTask extends React.Component {
  constructor(props: any) {
    super(props)
    this.state = {
    }
  }
  render() {
    return (
      <View style={{height: screenHeight, paddingTop: 40}}>
        
      </View>
    )
  }
}

const styles = StyleSheet.create({

});
export default AddTask
// Styles are removed purpose-fully 
