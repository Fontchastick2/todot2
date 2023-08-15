import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Button, Dimensions } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

const screenWidth= Dimensions.get('window').width;
const screenHeight= Dimensions.get('screen').height;

const myTasks= [
  {id:"0", title: "Money"},
  {id:"1", title: "Reality check"}
]

class Home extends React.Component {
  constructor(props:any) {
    super(props)
    this.state = {
    }
  }
  render() {
    return (
      <View style={{height: screenHeight, paddingTop: 40}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', width: screenWidth * 0.8, marginHorizontal: screenWidth * 0.1, marginVertical: 15}}>
        <LinearGradient
        // Background Linear Gradient
        style={{borderRadius: 10}}
        start={{ x: 0.5, y: 0.5 }}
        colors={['#99C3FC','#6498E1']}>
        <TouchableOpacity style={styles.navButton}>
        <Ionicons name="chevron-back" size={32} color="white" />
        </TouchableOpacity>
        </LinearGradient>

          <Text style={{fontSize: 24, fontWeight: '600', color: "rgba(33, 33, 33, 0.76)"}}>Today</Text>
          <LinearGradient
        // Background Linear Gradient
        style={{borderRadius: 10}}
        colors={['#99C3FC','#6498E1']}>
          <TouchableOpacity>
          <Ionicons name="chevron-forward" size={32} color="white" />
        </TouchableOpacity>
        </LinearGradient>
        </View>
        <View style={styles.tasks}>
        {myTasks.map((task) => (
          <TouchableOpacity style={styles.task}>
            <Text>{task.title}</Text>
          </TouchableOpacity>
        ))}
        </View>
        <TouchableOpacity         onPress={() => this.props.navigation.navigate('AddTask')}
 style={{width: 26, height: 26, borderRadius: 13, backgroundColor: "#525252", position: "absolute", bottom: 70, left: screenWidth * .5 -13 }}>
          <Ionicons name="add-outline" size={26} color="#67ADFF" style={{position: "relative", bottom: 1, left: 1}}/>
        </TouchableOpacity>
      </View>

    )
  }
}

const styles = StyleSheet.create({
  navButton: {
    paddingTop: 4,
    width: 28,
    height: 37,
    fontSize: 28,
    fontWeight: 100, 
    color: 'white'
  },
  tasks: {
    backgroundColor: '#D9D9D9',
    maxHeight: screenHeight * 0.6,
    overflow: 'scroll',
    marginHorizontal: screenWidth * 0.04,
    width: screenWidth * 0.92,
    borderRadius: 15,
  },
  task: {
    padding: 10,
    backgroundColor: "white",
    margin: 5,
    borderRadius: 6
  }
});
export default Home
// Styles are removed purpose-fully 
