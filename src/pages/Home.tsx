import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Button, Dimensions } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { Database, Day, Mission } from '../services/database.service';
import { BottomSheet } from '@rneui/themed';

import * as SQLite from 'expo-sqlite'

const screenWidth= Dimensions.get('window').width;
const screenHeight= Dimensions.get('screen').height;
const dab = SQLite.openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024) // returns Database object

class Home extends React.Component {
  db = new Database(dab);
  tasks: Mission[]= [];
  state = {
    selectedDate: new Date()
  }

  constructor(props:any) {
    super(props)

    this.initialise()

  }

  initialise() {
    //this.db.getMissions();
    let today: Day;
    if(this.db.getDay(new Date().toLocaleDateString()) === undefined) {
      today = new Day(new Date().toLocaleDateString(), "Awaiting for results");
    }else{
      today = this.db.getDay(new Date().toLocaleDateString()) as unknown as Day;
    }
  }

  getDateString(date: Date) {
    let compDate = new Date();
    if(date.toLocaleDateString() === compDate.toLocaleDateString()){
      return "Today";
    }else if(date.toLocaleDateString() === new Date(compDate.setDate(compDate.getDate() + 1)).toLocaleDateString()){
      return "Tomorrow";
    }else if(date.toLocaleDateString() === new Date(compDate.setDate(compDate.getDate() -2)).toLocaleDateString()){
      return "Yesterday";
    }
    return date.toDateString();
  }

  componentDidMount(){
    this.db.getTasks(this.state.selectedDate.toDateString()).then(value => {
      this.tasks = value._array;
      this.forceUpdate()
    })
  }

  componentDidUpdate(prev: any, next: any){
    if(prev.selectedDate !== prev.selectedDate){
    }else{
      
    }
  }

  changeDate(day: number) {
    this.setState((prev: any) => ({selectedDate: new Date(prev.selectedDate.setDate(prev.selectedDate.getDate() + day))}))
    this.db.getTasks(this.state.selectedDate.toDateString()).then(value => {
      this.tasks = value._array;
      this.forceUpdate()
    })
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
        <TouchableOpacity onPress={() =>this.changeDate(-1)} style={styles.navButton}>
        <Ionicons name="chevron-back" size={32} color="white" />
        </TouchableOpacity>
        </LinearGradient>

          <Text style={{fontSize: 24, fontWeight: '600', color: "rgba(33, 33, 33, 0.76)"}}>{this.getDateString(this.state.selectedDate)}</Text>
          <LinearGradient
        // Background Linear Gradient
            style={{borderRadius: 10}}
            colors={['#99C3FC','#6498E1']}>
          <TouchableOpacity onPress={() => this.changeDate( 1)}>
          <Ionicons name="chevron-forward" size={32} color="white" />
        </TouchableOpacity>
        </LinearGradient>
        </View>
        <View style={styles.tasks}>
        {this.tasks.map((task) => (
          <TouchableOpacity style={styles.task}>
            <Text>{task.title}</Text>
          </TouchableOpacity>
        ))}
        </View>
        <TouchableOpacity         onPress={() => this.props.navigation.navigate('AddTask', {date: new Date().toDateString()})}
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
