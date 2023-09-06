import React, {useState} from 'react';
import { Text, View, StyleSheet, Image, Button, TouchableOpacity, ScrollView} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Dimensions } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';

const screenWidth= Dimensions.get('window').width;

function DayDescription(props: any) {

    const [isPending, setPending] = useState(false);
    const [isDone, setDone] = useState(false);

    return (  
        <View>
          
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