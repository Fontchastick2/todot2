import React, { Component } from 'react';
import Checkbox from 'expo-checkbox';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Button, Dimensions, TextInput } from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Database, Mission } from '../services/database.service';
import { FOR_EVER } from '../data/vars';
import * as SQLite from 'expo-sqlite'


const screenWidth= Dimensions.get('window').width;
const screenHeight= Dimensions.get('screen').height;
const dab = SQLite.openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024) // returns Database object

class AddTask extends Component {

  db = new Database(dab);

  state = {
    title: "",
    from: new Date(),
    repeat: false,
    to: new Date(),
    activeSections: [],
    days: [],
    motives: "",
    time: "",
    duration: 0,
    preparation: "",
    distractions: "",
    overcome: ""
  };

  actualDate: Date;

  constructor(props: any) {
    super(props)
    this.actualDate = props.route.params.date;
  }

  openCalendar (from: boolean) {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange: (event: any, value: Date | undefined) => {
        this.setState(from? {from: value} : {to: value})
      },
      mode: "date",
    });
  };

  openTimer () {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange: (event: any, value: Date | undefined) => {
        this.setState({time: value?.toDateString()!})
      },
      mode: "time",
    });
  };
  
  CONTENT = [
    {//it should be aligned with one of your longtime goals 
      title: "Why",
      content:"",
    },
    {// for, to dates
      title: 'When',
      content:"",
    },
    {// Duration, before you start, how to make sure you don't give up, after you do, one action each time
      title: 'How',
      content:
        'Our Return & Refund Policy template lets you get started with a Return and Refund Policy agreement. This template is free to download and use.According to TrueShip study, over 60% of customers review a Return/Refund Policy before they make a purchasing decision.',
    },
  ];

  _renderHeader = (section: any) => {
    return ;
  };

  _renderContent = (section: any) => {
    return (
      <View>
        <Text>{section.content}</Text>
      </View>
    );
  };

  _updateSections = (activeSections: any) => {
    this.setState({ activeSections });
  };

  addMission() {
    let data = new Mission(this.state.title);
    data.from = new Date(this.props.route.params.date);
    data.to = new Date(this.props.route.params.date);
    if(this.state.repeat === true){
      data.from = this.state.from;
      data.to = this.state.to;
    }
    data.time = this.state.time;
    data.duration = this.state.duration;
    data.description = this.state.motives;
    this.db.addMission(data)
  }

  render() {
    return (
      <View  style={{height: screenHeight, backgroundColor: "#525252", width: screenWidth, paddingHorizontal: screenWidth * 0.05}}>

      <View  style={{height: Dimensions.get('window').height, paddingTop: 40,}}>
      <ScrollView >
        <View >
          <Text style={{color: "white"}}>What do you want to do?</Text>
          <TextInput
          style={{backgroundColor: "white", borderRadius: 10,}}
          onChangeText={val=> this.setState({title: val})}
          />
        {/* <Accordion
        activeSections={this.state.activeSections}
        sections={this.CONTENT}
        renderHeader={(content) => this._renderHeader(content)}
        renderContent={this._renderContent}
        onChange={this._updateSections}
        /> */}
        </View>
        <View style={{backgroundColor: "#000000", width: screenWidth * 0.9, justifyContent: 'center', alignItems: 'center', paddingVertical: 5, marginVertical: 4}}>
      <Text style={{color: "white"}}>Why</Text>
    </View>
        <View>
        <Text style={{color: "white"}}>Why not do it? what makes it important?</Text>

        <TextInput
        style={{backgroundColor: "white", borderRadius: 10, width: screenWidth * 0.9-1}}
        onChangeText={val=> this.setState({motives: val})}
        multiline={true}
        numberOfLines={5}
        />
      </View>
      <View style={{backgroundColor: "#000000", width: screenWidth * 0.9, justifyContent: 'center', alignItems: 'center', paddingVertical: 5, marginVertical: 4}}>
        <Text style={{color: "white"}}>When</Text>
      </View>
      <View style={{flexDirection: "row", justifyContent: "space-between",width: screenWidth * 0.9-1}}>
        <View>
          <Text style={{color: "white"}}>At:</Text>
          <TouchableOpacity
          style={{backgroundColor: "white", borderRadius: 10, width: screenWidth * 0.4, flexDirection: "row", alignItems: "center"}}
          onPress={()=>this.openTimer()}>
            <Ionicons name="time-outline" size={26} color="#67ADFF" style={{position: "relative", bottom: 1, left: 3, width: 40}}/>
            <Text>{this.state.time}</Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text style={{color: "white"}}>Duration (in minutes):</Text>
          <View
          style={{backgroundColor: "white", borderRadius: 10, width: screenWidth * 0.4, flexDirection: "row", alignItems: "center"}}>
            <Ionicons name="hourglass-outline" size={26} color="#67ADFF" style={{position: "relative", bottom: 1, left: 3, width: 40}}/>
            <TextInput
              style={{backgroundColor: "white", borderRadius: 10, width: screenWidth * 0.4-40}}
              onChangeText={val=> this.setState({duration: val})}
              
          keyboardType={'numeric'}/>          
          </View>
        </View>
      </View>
      {this.state.repeat &&
      <View style={{flexDirection: "row", justifyContent: "space-between",width: screenWidth * 0.9-1}}>
        <View>
          <Text style={{color: "white"}}>From:</Text>
          <TouchableOpacity
          style={{backgroundColor: "white", borderRadius: 10, width: screenWidth * 0.4, flexDirection: "row", alignItems: "center"}}
          onPress={()=>this.openCalendar(true)}>
            <Ionicons name="calendar-outline" size={26} color="#67ADFF" style={{position: "relative", bottom: 1, left: 3, width: 40}}/>
            <Text>{this.state.from.toDateString()}</Text>
          </TouchableOpacity>
        </View>

         <View>
          <Text style={{color: "white"}}>To:</Text>
          <TouchableOpacity
          style={{backgroundColor: "white", borderRadius: 10, width: screenWidth * 0.4, flexDirection: "row", alignItems: "center"}}
          onPress={()=>this.openCalendar(false)}>
            <Ionicons name="calendar-outline" size={26} color="#67ADFF" style={{position: "relative", bottom: 1, left: 3, width: 40}}/>
            <Text>{this.state.to.toDateString()}</Text>
          </TouchableOpacity>
        </View>
      </View>}
      <View style={{marginVertical: 10, flexDirection: "row"}}>
        <Checkbox value={this.state.repeat} onValueChange={(value) => this.setState({repeat: value})} />
        <Text style={{color: "white", marginLeft: 5}}>Repeat event</Text>
      </View>


        <View style={{backgroundColor: "#000000", width: screenWidth * 0.9, justifyContent: 'center', alignItems: 'center', paddingVertical: 5, marginVertical: 4}}>
          <Text style={{color: "white"}}>How</Text>
        </View>
        <View>
          <Text style={{color: "white"}}>How do you prepare to?</Text>
          <TextInput
          style={{backgroundColor: "white", borderRadius: 10, width: screenWidth * 0.9-1}}
          onChangeText={val=> this.setState({preparation: val})}
          multiline={true}
          numberOfLines={3}
          />
        </View>
        <View>
          <Text style={{color: "white"}}>What major distractions?</Text>
          <TextInput
          style={{backgroundColor: "white", borderRadius: 10, width: screenWidth * 0.9-1}}
          onChangeText={val=> this.setState({distractions: val})}
          multiline={true}
          numberOfLines={3}
          />
        </View>
        <View>
          <Text style={{color: "white"}}>How do you overcome them?</Text>
          <TextInput
          style={{backgroundColor: "white", borderRadius: 10, width: screenWidth * 0.9-1}}
          onChangeText={val=> this.setState({overcome: val})}
          multiline={true}
          numberOfLines={3}
          />
        </View>
        <TouchableOpacity
        onPress={() => this.addMission()}
        style={styles.roundButton1}>
        <Text style={{color: "white"}}>get started</Text>
      </TouchableOpacity>
      </ScrollView>
      </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  roundButton1: {
    width: 300,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    backgroundColor: '#1882FF',
    marginTop: 40
  },
});
export default AddTask
// Styles are removed purpose-fully 
