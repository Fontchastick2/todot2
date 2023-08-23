import React, {useState} from 'react';
import { Text, View, StyleSheet, Image, Button, TouchableOpacity, ScrollView} from 'react-native';
import { Dimensions } from 'react-native'

const screenWidth= Dimensions.get('window').width;

function TaskInfo(props: any) {

    const [isPending, setPending] = useState(false);
    const [isDone, setDone] = useState(false);

    function setStatus(value: boolean) {
        setPending(true);
        setDone(value);
    }

    console.log(props.task)

  return (    
    <View style={{backgroundColor:"white", height:  300 }}>
        <Text style={{fontSize: 24, textAlign: "center", fontWeight: 600}}>task description</Text>
        <View style={{flexDirection: "row", justifyContent: "space-evenly"}}>
            <View>
            <Text style={{fontSize: 24, textAlign: "center"}}>7</Text>
            <Text style={{fontSize: 14}}>times streak</Text>
            </View>
            <View>
                <Text style={{fontSize: 24, textAlign: "center"}}>12/21</Text>
                <Text style={{fontSize: 14, textAlign: "center"}}>done</Text>
            </View>
        </View>
        <ScrollView>
            <Text> 
                at {props.task.time || " some point "} I will {props.task.title}.

                I do this, {props.task.description}
            </Text>
            
        </ScrollView>
        {isPending? 
        <View style={{justifyContent: 'center', flexDirection: "row"}}>
        <TouchableOpacity
            onPress={()=> setPending(false)}
            style={[styles.button, {backgroundColor: "orange", width: 200}]}>
            <Text style={{color: "white"}}>mark pending</Text>
        </TouchableOpacity>
        </View>
        
        :<View style={{flexDirection: "row", justifyContent: "space-evenly"}}>
            <TouchableOpacity
            onPress={()=> setStatus(false)}
                style={[styles.button, {backgroundColor: "red", width: 120}]}>
                <Text style={{color: "white"}}>Missed</Text>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={()=> setStatus(true)}
                style={[styles.button, {backgroundColor: "green", width: 120}]}>
                <Text style={{color: "white"}}>Done</Text>
            </TouchableOpacity>
        </View>
}
    </View>);
}

const styles = StyleSheet.create({
    button: {
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        marginTop: 40
      },
});

export default TaskInfo;