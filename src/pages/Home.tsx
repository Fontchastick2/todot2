import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Button, Dimensions, ImageBackground } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Database, Day, Mission, TaskStatut } from '../services/database.service';
import { BottomSheet } from 'react-native-btr';
import { Dialog } from "react-native-simple-dialogs";

import * as SQLite from 'expo-sqlite'
import TaskInfo from '../components/Task-Info';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('screen').height;
const dab = SQLite.openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024) // returns Database object

class Home extends React.Component {
  db = new Database(dab);
  tasks: Mission[] = [];
  selectedtask: Mission = new Mission("");

  state = {
    selectedDate: new Date(),
    showBottomSheet: false,
    taskId: 0,
    missionId: 0,
    showDialog: false
  }

  constructor(props: any) {
    super(props)

    //this.initialise()
    //this.db.testTasks()

  }

  bottomButtons = [
    { title: 'Update all occurences', icon: "pencil-outline", onPress: () => { this.props.navigation.navigate('AddTask', { date: this.state.selectedDate, missionId: this.state.missionId }); this.setState({ showBottomSheet: false }) } },
    { title: 'Delete this occurence', icon: "trash-outline", onPress: () => { this.db.removeTask(this.state.taskId).then(() => this.updateTasks()); this.setState({ showBottomSheet: false }) } },
    { title: 'Delete all occurences', icon: "trash-outline", onPress: () => { this.db.removeMission(this.state.missionId).then(() => this.updateTasks()); this.setState({ showBottomSheet: false }) } },
    {
      title: 'Cancel',
      backgroundColor: 'red',
      color: 'white',
      icon: "close-outline",
      onPress: () => this.setState({ showBottomSheet: false }),
    },
  ];

  initialise() {
    let today: Day;
    if (this.db.getDay(new Date().toLocaleDateString()) === undefined) {
      today = new Day(new Date().toLocaleDateString(), "Awaiting for results");
    } else {
      today = this.db.getDay(new Date().toLocaleDateString()) as unknown as Day;
    }
  }

  getDateString(date: Date) {
    let compDate = new Date();
    if (date.toLocaleDateString() === compDate.toLocaleDateString()) {
      return "Today";
    } else if (date.toLocaleDateString() === new Date(compDate.setDate(compDate.getDate() + 1)).toLocaleDateString()) {
      return "Tomorrow";
    } else if (date.toLocaleDateString() === new Date(compDate.setDate(compDate.getDate() - 2)).toLocaleDateString()) {
      return "Yesterday";
    }
    return date.toDateString();
  }

  componentDidMount() {
    this.updateTasks()
    this.props.navigation.addListener('focus', () => {
      this.updateTasks()
    });

  }

  changeDate(day: number) {
    let newDate = new Date(this.state.selectedDate.setDate(this.state.selectedDate.getDate() + day))
    this.setState({ selectedDate: newDate })
    this.updateTasks(newDate)
  }

  updateTasks(date?: Date) {
    this.db.getTasks((date || this.state.selectedDate).toDateString()).then(value => {
      this.tasks = value;
      this.forceUpdate()
    })
  }

  getTaskIcon(task: Mission) {
    switch (task.status) {
      case TaskStatut.DONE:
        return <Ionicons name="checkmark-circle-outline" size={32} color="green" />
      case TaskStatut.FAILED:
        return <Ionicons name="close-circle-outline" size={32} color="red" />
      case TaskStatut.PENDING:
        return <Ionicons name="ellipsis-horizontal-circle-outline" size={32} color="orange" />
    }
  }

  changeTaskStatut = (task: Mission) => {
    let status: TaskStatut;
    switch (task.status) {
      case TaskStatut.DONE:
        status = TaskStatut.FAILED;
        break;
      case TaskStatut.FAILED:
        status = TaskStatut.PENDING
        break;
      case TaskStatut.PENDING:
        status = TaskStatut.DONE
        break;
    }
    this.db.updateTaskStatut(task.taskId, status).then(() => this.updateTasks())
  }

  openCalendar() {
    DateTimePickerAndroid.open({
      value: this.state?.selectedDate || new Date(),
      onChange: (event: any, value: Date | undefined) => {
        this.setState({ selectedDate: value }, () => {
          if (value) {
            this.updateTasks(value)
          }
        })
      },
      mode: "date",
    });
  };

  openDialog = (show: boolean, task?: Mission) => {
    this.selectedtask = task!;
    this.setState({ showDialog: show })
  }

  openBottomSheet(value: boolean, mission?: Mission) {
    this.setState({ showBottomSheet: value, missionId: mission?.id, taskId: mission?.taskId })
  }


  render() {
    return (
      <ImageBackground source={require("../../assets/home-back.jpg")} resizeMode="cover" style={{ height: screenHeight, paddingTop: 40 }}>
        <View style={{height: screenHeight*0.25, backgroundColor: "blue", margin: 20, borderRadius: 10 }}></View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: screenWidth * 0.8, marginHorizontal: screenWidth * 0.1, marginVertical: 15 }}>
          <LinearGradient
            // Background Linear Gradient
            style={{ borderRadius: 10 }}
            colors={['#99C3FC', '#6498E1']}>
            <TouchableOpacity onPress={() => this.changeDate(-1)}>
              <Ionicons name="chevron-back" size={32} color="white" />
            </TouchableOpacity>
          </LinearGradient>

          <TouchableOpacity onPress={() => this.openCalendar()}>
            <Text style={{ fontSize: 24, fontWeight: '600', color: "rgba(33, 33, 33, 0.76)" }}>{this.getDateString(this.state.selectedDate)}</Text>
          </TouchableOpacity>
          <LinearGradient
            // Background Linear Gradient
            style={{ borderRadius: 10 }}
            colors={['#99C3FC', '#6498E1']}>
            <TouchableOpacity onPress={() => this.changeDate(1)}>
              <Ionicons name="chevron-forward" size={32} color="white" />
            </TouchableOpacity>
          </LinearGradient>
        </View>
        <ScrollView style={styles.tasks}>
          {this.tasks.map((task) => (
            <View style={styles.task} >
              <TouchableOpacity onPress={() => this.changeTaskStatut(task)} style={{ left: 5 }}>
                {this.getTaskIcon(task)}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.openDialog(true, task)}
                onLongPress={() => this.openBottomSheet(true, task)}
                style={{ width: "100%", padding: 10 }}>
                <Text style={{ fontWeight: 600, fontSize: 15 }}>I will {task.title}</Text>
                {task.description !== "" && <Text style={{ fontSize: 13 }}>because, {task.description}</Text>}

              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('AddTask', { date: this.state.selectedDate })}
          style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: "#525252", position: "absolute", bottom: 70, left: screenWidth * .5 - 13 }}>
          <Ionicons name="add-outline" size={26} color="#67ADFF" style={{ position: "relative", bottom: 1, left: 1 }} />
        </TouchableOpacity>


        <Dialog
          animationType="fade"
          onTouchOutside={() => this.openDialog(false)}
          visible={this.state.showDialog}
          dialogStyle={{ borderRadius: 25, borderColor: "gray", borderWidth: 4 }}
        >
          <TaskInfo task={this.selectedtask} close={this.openDialog}></TaskInfo>
        </Dialog>

        <BottomSheet
          visible={this.state.showBottomSheet}>
          <View style={styles.bottomNavigationView}>
            {this.bottomButtons.map(button => <TouchableOpacity onPress={button.onPress} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 10, backgroundColor: button.backgroundColor }}>
              <Ionicons name={button.icon} size={26} color={button.color} style={{ marginHorizontal: 15 }} />
              <Text style={{ fontSize: 22, color: button.color! }}>{button.title}</Text>
            </TouchableOpacity>)}
          </View>
        </BottomSheet>
      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  tasks: {
    backgroundColor: '#D9D9D9',
    maxHeight: screenHeight * 0.4,
    overflow: 'scroll',
    marginHorizontal: screenWidth * 0.04,
    width: screenWidth * 0.92,
    borderRadius: 15,
  },
  task: {
    backgroundColor: "white",
    margin: 5,
    flexDirection: "row",
    borderRadius: 6,
    alignItems: "center"
  },
  bottomNavigationView: {
    backgroundColor: '#fff',
    width: '100%',
    height: 200,
  },
});
export default Home
// Styles are removed purpose-fully
