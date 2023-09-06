import React, {useState} from 'react';
import { Text, View, StyleSheet, Image, Button, TouchableOpacity, ScrollView} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Dimensions } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';

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
        <View>
            <Text style={{fontSize: 24, textAlign: "center", fontWeight: 600}}>About task</Text>
            <TouchableOpacity style={{position: "absolute", right: 0}} onPress={() => props.close(false)}>
                <LinearGradient
                colors={['rgba(225,225,225,1)','red']}
                style={{height: 26, width: 26, borderRadius: 5}}
                >
                    <Ionicons name="close-outline" size={26} color="white" />
                </LinearGradient>
            </TouchableOpacity>

        <ScrollView>
            <View style={{backgroundColor:"white", height:  100, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/*<View style={{flexDirection: "row", justifyContent: "space-evenly"}}>
            <View>
            <Text style={{fontSize: 24, textAlign: "center"}}>7</Text>
            <Text style={{fontSize: 14}}>times streak</Text>
            </View>
            <View>
                <Text style={{fontSize: 24, textAlign: "center"}}>12/21</Text>
                <Text style={{fontSize: 14, textAlign: "center"}}>done</Text>
            </View>
        </View> */}
                <Text> 

                    At <Text style={{fontWeight: 600}}>{props.task.time? new Date(props.task.time).getHours()+":"+new Date(props.task.time).getMinutes(): " some point "}</Text> I will <Text style={{fontWeight: 600}}>{props.task.title}</Text>{props.task.duration > 0 ? ` during ${props.task.duration} minutes`:' for a bunch of time'}.
                    {"\n"}
                    {props.task.description && `I do this, because ${props.task.description}. \n`}
                    {props.task.preparation && `To prepare myself, I will ${props.task.preparation}. \n`}
                    {props.task.distraction && `I should be aware of: ${props.task.distraction}. \n`}
                    {props.task.overcome && `I should be aware of: ${props.task.overcome}.`}
                </Text>
            
            </View>
        </ScrollView>
        </View>  
    );
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