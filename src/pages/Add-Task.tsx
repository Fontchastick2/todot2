import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Button, Dimensions, TextInput } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';


const screenWidth= Dimensions.get('window').width;
const screenHeight= Dimensions.get('screen').height;


class AddTask extends Component {
  
  state = {
    title: "",
    from: "",
    to: "",
    activeSections: [],
    motives: "",
  };

  constructor(props: any) {
    super(props)

  }

  showMode () {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange: (event: any, value: Date | undefined) => {
        this.setState({from: value?.toLocaleDateString()!})
      },
      mode: "date",
    });
  };

  returnFrom() {
    return this.state.from;
  }

  
  CONTENT = [
    {//it should be aligned with one of your longtime goals 
      title: "Why",
      content:(<View>
        <Text style={{color: "white"}}>Description</Text>

        <TextInput
        style={{backgroundColor: "white", borderRadius: 10, width: screenWidth * 0.9-1}}
        onChangeText={val=> this.setState({motives: val})}
        numberOfLines={5}
        />
      </View>),
    },
    {// for, to dates
      title: 'When',
      content:(<View>
        <View>
          <Text style={{color: "white"}}>From:</Text>
          <TouchableOpacity
          style={{backgroundColor: "white", borderRadius: 10, width: screenWidth * 0.4, flexDirection: "row", alignItems: "center"}}
          onPress={()=>this.showMode()}>
            <Ionicons name="calendar-outline" size={26} color="#67ADFF" style={{position: "relative", bottom: 1, left: 3, width: 40}}/>
            <Text>{this.returnFrom()}</Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text style={{color: "white"}}>To:</Text>
          <TextInput
          style={{backgroundColor: "white", borderRadius: 10, width: screenWidth * 0.4}}
          onChangeText={val=> this.setState({title: val})}
          numberOfLines={5}
          />
        </View>

      </View>),
    },
    {// Duration, before you start, how to make sure you don't give up, after you do, one action each time
      title: 'How',
      content:
        'Our Return & Refund Policy template lets you get started with a Return and Refund Policy agreement. This template is free to download and use.According to TrueShip study, over 60% of customers review a Return/Refund Policy before they make a purchasing decision.',
    },
  ];

  _renderHeader = (section: any) => {
    return (
      <View style={{backgroundColor: "#67ADFF", width: screenWidth * 0.9, justifyContent: 'center', alignItems: 'center', paddingVertical: 5, marginVertical: 4}}>
      <Text style={{color: "white"}}>{section.title}</Text>
    </View>
    );
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

  render() {
    return (
      <ScrollView style={{height: screenHeight, paddingTop: 40, backgroundColor: "#525252"}}>
        <View style={{width: screenWidth * 0.9, marginHorizontal: screenWidth * 0.05}}>
          <Text style={{color: "white"}}>Title</Text>
          <TextInput
          style={{backgroundColor: "white", borderRadius: 10,}}
          onChangeText={val=> this.setState({title: val})}
          />
        <Accordion
        activeSections={this.state.activeSections}
        sections={this.CONTENT}
        renderHeader={(content) => this._renderHeader(content)}
        renderContent={this._renderContent}
        onChange={this._updateSections}
        />
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({

});
export default AddTask
// Styles are removed purpose-fully 
