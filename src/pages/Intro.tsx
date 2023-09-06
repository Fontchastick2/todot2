import React from 'react';
import { Text, View, StyleSheet, Image, Button, TouchableOpacity} from 'react-native';
import { Dimensions } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';

const screenWidth= Dimensions.get('window').width;

function Intro({ navigation }) {
  return (    
  <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor:"white", height:  Dimensions.get('screen').height }}>
      <LinearGradient
        colors={['rgba(225,225,225,1)', 'rgba(225,225,225,1)','rgba(103,173,225,1)']}
        style={{height: screenWidth * 1.4, width: screenWidth * 1.4, borderRadius: screenWidth * 0.7, position: "absolute", left: -screenWidth*0.2, zIndex: 3, top: -screenWidth * 1.05}}
      >
      </LinearGradient>
      <View style={{position: "absolute", top: 80}}>
        <Text style={{zIndex: 4, fontSize: 32, fontWeight: 600, color: "white"}}>T
        <Image source={require('../../assets/icon.png')} style={{width: 20, height: 20}}></Image>
        doT</Text>

      </View>

    <Image source={require('../../assets/intro.png')}  style={styles.picture} alt=""/>
    <View >
        <Text style={styles.title}>Welcome to Todot</Text>
        <Text style={styles.text}>
            Are you struggling with <Text style={{fontWeight: 600}}>procrastination</Text>?{"\n"}
            Do you wish you were <Text style={{fontWeight: 600}}>more productive</Text>?{"\n"}
            You sometimes lack <Text style={{fontWeight: 600}}>motivation</Text>? {"\n"}
            Then please let me help you!
        </Text>
    </View>

    <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
        style={styles.roundButton1}>
        <Text style={{color: "white"}}>get started</Text>
      </TouchableOpacity>
    </View>);
}

const styles = StyleSheet.create({
    container: {
      textAlign: "center"
    },
    title: {
        color: "#5D80FF",
        fontSize: 20,
        marginBottom: 10,
        fontWeight: "600",
        textAlign: "center"
    },
    picture: {
        width: 378, 
        height: 252,
        marginTop: screenWidth * 0.2
    },
    text: {
        width: 250, 
        margin: "auto",
        textAlign: "center"

    },
    header: {
        fontSize: 30,
        zIndex: 9,
        textAlign: "center",
        marginTop: 50,  
        color: "white"
    },
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

export default Intro;