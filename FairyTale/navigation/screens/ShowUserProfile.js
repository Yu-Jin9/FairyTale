
import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, View, Button, TextInput, SafeAreaView, KeyboardAvoidingView, Image, ScrollView, Alert} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import UserDataContext from '../UserDataContext';
import axios from 'axios';

export default function ShowUserProfile({navigation}) {
    const context = useContext(UserDataContext);
    const address = context.userIp;
    const isLoggedIn = context.isLoggedIn;
    const userId = context.userId;
    const userPw = context.userPw; 
    const userBirth = context.userBirth;
    const userNick = context.userNick;
    const userProfile = context.userProfile;
    const setUserPw = context.setUserPw;
    const setUserNick = context.setUserNick;
    const setUserProfile = context.setUserProfile;
    
    const [id, setId] = useState('');
    const [nick, setNick] = useState('');
    const [birth, setBirth] = useState('');
    const [name, setName] = useState('');
    const [profile, setProfile] = useState('');

    useEffect(() => {
       
        // 수정
        if(isLoggedIn === true){
            axios.post(`${address}/server/member/userProfile`,{
                id: userId
            })
            .then((res) => {
            console.log(res.data !== null);
            if (res.data!== null) {
                setId (res.data.id);
                setName (res.data.name);
                setNick (res.data.nick);
                setBirth (res.data.birth);
                setProfile (res.data.profile);
            } else {
                Alert.alert('회원 정보 조회 오류.','페이지를 다시 로드해주세요.');
            }
            })
            .catch((err) => {
            console.error(err);
            });
        };

    },[]);

    return(
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <KeyboardAvoidingView behavior='padding' style={styles.keyboardAvoidingView}>
          <Ionicons name="logo-flickr" size={100} color="black" style={styles.icon}/>
          <Text>ShowUserProfile</Text>
          <Text style={styles.label} >{id}</Text>
          <Text style={styles.label} >{nick}</Text>
          <Text style={styles.label} >{name}</Text>
          <Text style={styles.label} >{birth}</Text>
          
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
    )


}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    scrollView: {
      paddingHorizontal: 0,
    },
    keyboardAvoidingView: {
      width: '100%',
      alignItems: 'center',
    },
    label: {
      fontSize: 18,
      fontWeight: 'bold',
      marginVertical: 10,
    },
    input: {
      width: '80%',
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    },
    inputContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    image: {
      width: 100,
      height: 100,
      borderWidth: 1,
      borderColor: 'gray',
      marginBottom: 15,
    },
    icon: {
      marginBottom: 50,
    },
  });