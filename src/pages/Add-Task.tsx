import React, { Component } from 'react';
import Checkbox from 'expo-checkbox';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Button, Dimensions, TextInput, ImageBackground } from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Database, Mission } from '../services/database.service';
import { FOR_EVER } from '../data/vars';
import * as SQLite from 'expo-sqlite'


const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('screen').height;
const dab = SQLite.openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024) // returns Database object
enum sections { WHY, WHEN, HOW };
class AddTask extends Component {

  db = new Database(dab);

  state = {
    id: null,
    title: "",
    from: new Date(),
    repeat: false,
    to: new Date(),
    activeSections: [],
    days: [],
    motives: "",
    time: new Date(),
    duration: 0,
    preparation: "",
    distraction: "",
    overcome: "",
    openedSection: null
  };

  actualDate: Date;

  constructor(props: any) {
    super(props)
    this.actualDate = props.route.params.date;
    console.log("mission id: " + props.route.params.missionId)
    if (props.route.params.missionId) {
      this.db.getTask(props.route.params.missionId).then((task: Mission) => {
        this.setState({
          id: task.id,
          title: task.title,
          from: new Date(task.from) || new Date(),
          repeat: task.from !== task.to,
          to: new Date(task.to) || new Date(),
          activeSections: [],
          days: [],
          motives: task.description,
          time: new Date(task.time!) || new Date(),
          duration: task.duration,
          preparation: task.preparation,
          distraction: task.distraction,
          overcome: task.overcome
        })
      });
    }
  }

  openCalendar(from: boolean) {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange: (event: any, value: Date | undefined) => {
        this.setState(from ? { from: value } : { to: value })
      },
      mode: "date",
    });
  };

  openTimer() {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange: (event: any, value: Date | undefined) => {
        this.setState({ time: value! })
      },
      mode: "time",
    });
  };

  CONTENT = [
    {//it should be aligned with one of your longtime goals 
      title: "Why",
      content: "",
    },
    {// for, to dates
      title: 'When',
      content: "",
    },
    {// Duration, before you start, how to make sure you don't give up, after you do, one action each time
      title: 'How',
      content:
        'Our Return & Refund Policy template lets you get started with a Return and Refund Policy agreement. This template is free to download and use.According to TrueShip study, over 60% of customers review a Return/Refund Policy before they make a purchasing decision.',
    },
  ];

  _renderHeader = (section: any) => {
    return;
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
    data.id = this.state.id;
    data.from = new Date(this.actualDate);
    data.to = new Date(this.actualDate);
    if (this.state.repeat === true) {
      data.from = this.state.from;
      data.to = this.state.to;
    }
    data.time = this.state.time;
    data.duration = this.state.duration;
    data.description = this.state.motives!;
    data.preparation = this.state.preparation!;
    data.distraction = this.state.distraction!;
    data.overcome = this.state.overcome!;
    if (this.state.id) {
      this.db.updateMission(data).then(() => {
        this.props.navigation.goBack()
      })
    } else {
      this.db.addMission(data).then(() => {
        this.props.navigation.goBack()
      })
    }
  }

  render() {
    return (
      <ImageBackground source={require("../../assets/add-back.jpg")} resizeMode="cover" style={{ height: screenHeight, width: screenWidth, paddingHorizontal: screenWidth * 0.05 }}>
        <View style={{ height: Dimensions.get('window').height, paddingTop: 40}}>
          <View style={{ height: 30, flexDirection: "row"}}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Ionicons name="arrow-back-outline" size={26} color="black" style={{ position: "relative", bottom: 1, left: 3, width: 40 }} />
            </TouchableOpacity>
              <Text style={{fontSize: 18}}>{this.state.id? "Edit task" : "New task"}</Text>
          </View>
          <ScrollView>
            <View style={{marginVertical: 8}}>
              <Text style={{ textAlign: "center" }}>What do you want to do?</Text>
              <TextInput
                value={this.state.title}
                style={{ backgroundColor: "white", borderRadius: 10, }}
                onChangeText={val => this.setState({ title: val })}
              />
            </View>
            <TouchableOpacity onPress={() => this.setState({ openedSection: sections.WHY }) } style={styles.accordion}>
              <Text style={{color: "white"}}>Why</Text>
            </TouchableOpacity>
            {this.state.openedSection === sections.WHY &&
              <View>
                <Text>Why not do it? what makes it important?</Text>

                <TextInput
                  value={this.state.motives}
                  style={{ backgroundColor: "white", borderRadius: 10, width: screenWidth * 0.9 - 1 }}
                  onChangeText={val => this.setState({ motives: val })}
                  multiline={true}
                  numberOfLines={5}
                />
              </View>}
            <TouchableOpacity onPress={() => this.setState({ openedSection: sections.WHEN })} style={styles.accordion}>
              <Text style={{color: "white"}}>When</Text>
            </TouchableOpacity>
            {this.state.openedSection === sections.WHEN &&
              <View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", width: screenWidth * 0.9 - 1 }}>
                  <View>
                    <Text>At:</Text>
                    <TouchableOpacity
                      style={{ backgroundColor: "white", borderRadius: 10, width: screenWidth * 0.4, flexDirection: "row", alignItems: "center" }}
                      onPress={() => this.openTimer()}>
                      <Ionicons name="time-outline" size={26} color="#67ADFF" style={{ position: "relative", bottom: 1, left: 3, width: 40 }} />
                      <Text>{this.state.time.toLocaleTimeString()}</Text>
                    </TouchableOpacity>
                  </View>

                  <View>
                    <Text>Duration (in minutes):</Text>
                    <View
                      style={{ backgroundColor: "white", borderRadius: 10, width: screenWidth * 0.4, flexDirection: "row", alignItems: "center" }}>
                      <Ionicons name="hourglass-outline" size={26} color="#67ADFF" style={{ position: "relative", bottom: 1, left: 3, width: 40 }} />
                      <TextInput
                        value={this.state.duration.toString()}
                        style={{ backgroundColor: "white", borderRadius: 10, width: screenWidth * 0.4 - 40 }}
                        onChangeText={val => this.setState({ duration: val })}

                        keyboardType={'numeric'} />
                    </View>
                  </View>
                </View>

                {this.state.repeat &&
                  <View style={{ flexDirection: "row", justifyContent: "space-between", width: screenWidth * 0.9 - 1 }}>
                    <View>
                      <Text>From:</Text>
                      <TouchableOpacity
                        style={{ backgroundColor: "white", borderRadius: 10, width: screenWidth * 0.4, flexDirection: "row", alignItems: "center" }}
                        onPress={() => this.openCalendar(true)}>
                        <Ionicons name="calendar-outline" size={26} color="#67ADFF" style={{ position: "relative", bottom: 1, left: 3, width: 40 }} />
                        <Text>{this.state.from.toLocaleDateString()}</Text>
                      </TouchableOpacity>
                    </View>

                    <View>
                      <Text>To:</Text>
                      <TouchableOpacity
                        style={{ backgroundColor: "white", borderRadius: 10, width: screenWidth * 0.4, flexDirection: "row", alignItems: "center" }}
                        onPress={() => this.openCalendar(false)}>
                        <Ionicons name="calendar-outline" size={26} color="#67ADFF" style={{ position: "relative", bottom: 1, left: 3, width: 40 }} />
                        <Text>{this.state.to.toLocaleDateString()}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>}
                {!this.state.id &&
                  <View style={{ marginVertical: 10, flexDirection: "row" }}>
                    <Checkbox value={this.state.repeat} onValueChange={(value) => this.setState({ repeat: value })} />
                    <Text style={{ color: "white", marginLeft: 5 }}>Repeat event</Text>
                  </View>}
              </View>}


            <TouchableOpacity onPress={() => this.setState({ openedSection: sections.HOW })} style={styles.accordion}>
              <Text style={{color: "white"}}>How</Text>
            </TouchableOpacity>
            {this.state.openedSection === sections.HOW &&
              <View>
                <View>
                  <Text>How do you prepare to?</Text>
                  <TextInput
                    value={this.state.preparation}
                    style={{ backgroundColor: "white", borderRadius: 10, width: screenWidth * 0.9 - 1 }}
                    onChangeText={val => this.setState({ preparation: val })}
                    multiline={true}
                    numberOfLines={3}
                  />
                </View>
                <View>
                  <Text>What major distractions?</Text>
                  <TextInput
                    value={this.state.distraction}
                    style={{ backgroundColor: "white", borderRadius: 10, width: screenWidth * 0.9 - 1 }}
                    onChangeText={val => this.setState({ distraction: val })}
                    multiline={true}
                    numberOfLines={3}
                  />
                </View>
                <View>
                  <Text>How do you overcome them?</Text>
                  <TextInput
                    value={this.state.overcome}
                    style={{ backgroundColor: "white", borderRadius: 10, width: screenWidth * 0.9 - 1 }}
                    onChangeText={val => this.setState({ overcome: val })}
                    multiline={true}
                    numberOfLines={3}
                  />
                </View>

              </View>}
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity
                  disabled={!this.state.title}
                  onPress={() => this.addMission()}
                  style={[!this.state.title?styles.disabledButton:styles.enabledButton, styles.roundButton1]}>
                  <Text style={{color: "white"}}>Save task</Text>
                </TouchableOpacity>
              </View>
          </ScrollView>
        </View>
      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  roundButton1: {
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    marginTop: 8
  },
  disabledButton: {
    backgroundColor: '#c2c2c2',
  },
  enabledButton: {
    backgroundColor: 'gray',
  },
  accordion: {
    backgroundColor: "#000000",
    width: screenWidth * 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    marginVertical: 4,
    borderRadius: 5
  }
});
export default AddTask
// Styles are removed purpose-fully
