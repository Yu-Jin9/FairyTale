import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Dimensions , StyleSheet, Text, View, Button, SafeAreaView, Image, Alert, TouchableOpacity, Platform, Modal } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { screenHeight, screenWidth } from '../screenSize';

// js import
import UserDataContext from '../UserDataContext';
import MyFairyTale from './MyFairyTale';
import MyBoard from './MyBoard';
import RecentlyBook from './RecentlyBook';

import axios from 'axios';

import { useFocusEffect } from '@react-navigation/native';
import 'react-native-gesture-handler';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import { useDrawerStatus } from '@react-navigation/drawer';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

import ImageView from 'react-native-image-zoom-viewer';

// defaultProfile 걍 프로필 이미지 불러오는 곳마다 선언해줘야 됨
const defaultProfile = require('../../assets/icon/basic-profile.png');

const Drawer = createDrawerNavigator();

const windowWidth = Dimensions.get('screen').width;  
const windowHeight = Dimensions.get('screen').height;

// Profile 컴포넌트를 정의합니다.
function Profile({ navigation }) {
    const isDrawerOpen = useDrawerStatus() === 'open';
    
    const context = useContext(UserDataContext);
    const address = context.userIp;
    const isLoggedIn = context.isLoggedIn;
    const userId = context.userId;
    const userPw = context.userPw; 
    const userBirth = context.userBirth;
    const userNick = context.userNick;
    const userProfile = context.userProfile;
    
    const [id, setId] = useState('');
    const [nick, setNick] = useState('');
    const [birth, setBirth] = useState('');
    const [name, setName] = useState('');
    const [profile, setProfile] = useState(userProfile);

    const [profileModal, setProfileModal] = useState(false);
    const [isImageViewVisible, setImageViewVisible] = useState(false);

    const year = birth.substring(0,4);
    const month = birth.substring(6,7);
    const day = birth.substring(9,10);
    const now = new Date();
    let nowYear = now.getFullYear(); 
    const age = (nowYear-year+1);

    const Tab = createMaterialTopTabNavigator();

    const getUserProfile = () => {  // 사용자 정보 가져오기
      if(isLoggedIn === true){
          axios.post(`${address}/server/member/userProfile`,{
              id: userId
          })
          .then((res) => {
          if (res.data.result.id === userId) {
              setProfile (res.data.result.profile);
              setId (res.data.result.id);
              setName (res.data.result.name);
              setNick (res.data.result.nick);
              setBirth (res.data.result.birth);
              DrawerContainer();
          } else {
              Alert.alert('회원 정보 조회 오류.','페이지를 다시 로드해주세요.');
          }
          })
          .catch((err) => {
          console.error(err);
          });
      };
    };

    useFocusEffect(   // 이 페이지가 포커싱될 때마다 사용자 정보 불러옴
        useCallback(() => {
            getUserProfile();
            if(userId===null || userId === '') {
              Alert.alert('접근 오류','다시 로그인해주세요.');
              navigation.navigate('SignIn');
            }
        }, [])
    );

    let image;
    if (profile === '../../assets/icon/basic-profile.png') {
      const localImage = require('../../assets/icon/basic-profile.png');
      const resolvedImage = Image.resolveAssetSource(localImage);
      image = resolvedImage.uri;
    } if (profile !== '../../assets/icon/basic-profile.png') {
      image = profile;
    }
    
    const images = [{
      url: image,
    }];
    

  const openProfile = () => {
    setProfileModal(true);
    setImageViewVisible(true);
  }
  
  const closeImageView = () => {
    setProfileModal(false);
    setImageViewVisible(false);
  }
  
  // 닫기 버튼을 렌더링하는 함수
  const renderHeader = (currentIndex) => (
    <View >
      <TouchableOpacity onPress={closeImageView} style={styles.closeImageTouchView} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} >
        <Image source={require('../../assets/icon/close.png')} style={styles.closeImageIcon} />
      </TouchableOpacity>
    </View>
  );
  return(
    <SafeAreaView style={styles.container}>
        <View style={styles.ProfileView}>
          
        <View>
          <TouchableOpacity onPress={()=>openProfile()} >
            <Image style={styles.image} source={profile === '../../assets/icon/basic-profile.png' ? defaultProfile : {uri: profile} } resizeMode="cover" />
          </TouchableOpacity>

          <Modal
              animationType="slide"
              transparent={true}
              visible={profileModal}
            >
              <View style={styles.ProfileImageModalBackView}>
                {isImageViewVisible && (
                  <ImageView imageUrls={images} enableSwipeDown={true} />
                )}
                <TouchableOpacity onPress={closeImageView} style={styles.closeImageTouchView}>
                  <Image
                    source={require('../../assets/icon/close.png')}
                    style={styles.closeImageIcon} />
                </TouchableOpacity>
              </View>
            </Modal>
        </View>
        
          <Text style={styles.label} >{nick}</Text>
          <Text style={styles.label} >{name}</Text>
          <Text style={styles.label} >{year}년 {month}월 {day}일 {age}세</Text>
        </View>
        <View style={{ flex: 1 }}>
        <Tab.Navigator >
        <Tab.Screen name="내가 만든 동화" component={MyFairyTale} style={{backgroundColor:'#fff'}} options={{tabBarLabelStyle:{fontFamily:'soyoRegular'}}}/>
          <Tab.Screen name="내가 만든 게시판" component={MyBoard} style={{backgroundColor:'#fff'}} options={{tabBarLabelStyle:{fontFamily:'soyoRegular'}}}/>
          <Tab.Screen name="최근 읽은 책" component={RecentlyBook} style={{backgroundColor:'#fff'}} options={{tabBarLabelStyle:{fontFamily:'soyoRegular'}}}/>
        </Tab.Navigator>
        </View>
    </SafeAreaView>
    )
  }

function CustomDrawerContent(props) {   // Drawer Navigator Items
  
  const { navigation } = props; 
  const context = useContext(UserDataContext);
  const setUserId = context.setUserId;
  const setUserPw = context.setUserPw;
  const setUserName = context.setUserName;
  const setUserNick = context.setUserNick;
  const setUserProfile = context.setUserProfile;
  const setUserBirth = context.setUserBirth;
  const setIsLoggedIn = context.setIsLoggedIn;
  const [membershipDate, setMembershipDate] = useState('');
  const setUserMembership = context.setUserMembership;
  const setEndMembershipDate = context.setEndMembershipDate;
  const Id = context.userId;
  const address = context.userIp;
  const currentDate = new Date();

  const checkMembership = async() => {
    await axios.post(`${address}/server/member/checkMembership`, { id : Id })
     .then((res) => {
      if(res.data.result){
        setUserMembership(res.data.result.premium);
        setEndMembershipDate(res.data.result.endDate);
      } else {
        console.log('회원 멤버쉽 판별 오류');
      }
     }).catch((error) => {
      console.error(error);
     });
    }

  useFocusEffect(   // 이 페이지가 포커싱될 때마다 사용자 정보 불러옴
        useCallback(() => {
            checkMembership();
        }, [])
  );

  return (
    <View style={{flex:1}}> 
      <DrawerContentScrollView {...props} defaultStatus="closed" contentContainerStyle={{ paddingTop: '13%'}}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="내 정보 수정"
          onPress={() => navigation.navigate('EditProfile')} 
          labelStyle={{
            fontFamily: 'soyoRegular',
            fontSize: screenHeight * 16,
            headerBackTitle:" "
          }}
        />
        <DrawerItem
          label="결제하기"
          onPress={() => {
            // if (context.userMembership==='true' && currentDate<=new Date(context.endMembershipDate)) {
            //   // navigation.navigate('PayMent');
            //   alert('이미 결제 하셨습니다.');
            // } else {
              navigation.navigate('PaymentPage');
            // }
          }}
          labelStyle={{
            fontFamily: 'soyoRegular',
            fontSize: screenHeight * 16,
            headerBackTitle:" "
          }}
        />
        <DrawerItem
          label="내 책 배송 신청하기"
          onPress={() => 
              navigation.navigate('MyBookList')
          }
          labelStyle={{
            fontFamily: 'soyoRegular',
            fontSize: screenHeight * 16,
            headerBackTitle:" "
          }}
        />
        </DrawerContentScrollView>
        <View style={{paddingBottom: 12}}>
          <DrawerItem label="로그아웃" 
                      onPress={() => {
                          Alert.alert(
                              "로그아웃", 
                              "로그아웃 하시겠습니까?",
                              [
                              {
                                  text: "아니요",
                                  onPress: () => navigation.goBack(),
                                  style: "cancel"
                              },
                              { 
                                  text: "예", 
                                  onPress: () => {
                                  setIsLoggedIn(false);
                                  setUserId('');
                                  setUserPw('');
                                  setUserName('');
                                  setUserNick('');
                                  setUserBirth('');
                                  setUserProfile('');
                                  navigation.navigate('SignIn');
                                  }
                              }
                              ]
                          );
                      }} 
                      labelStyle={{
                        fontFamily: 'soyoRegular',
                        fontSize: screenHeight * 16,
                        color: '#000000'
                      }}
                      icon={() => ( <Image source={require('../../assets/icon/logout_DrawerNav.png')} style={{width: 20, height: 20}}/> )}  
              />
        </View>
    </View>  
  );
}

function DrawerContainer() {    // Drawer navigator 
  
  return ( 
    <Drawer.Navigator 
      defaultStatus="closed"
      initialRouteName="Profile" 
      drawerContent={props => <CustomDrawerContent {...props} />} 
      screenOptions={{headerTitle:"내 정보", headerShown:false, drawerPosition:"right", 
        drawerStyle: {
        backgroundColor: '#fff',
        width: Platform.OS === 'ios' ? '52%' : '48%',
        height: screenHeight * 700,
        paddingBottom: '2%'
        },
        drawerType: 'front',
        drawerActiveTintColor: '#fff', // 활성화된 아이콘 및 라벨의 색상
        drawerActiveBackgroundColor: '#FF9900',  // 활성화된 아이템의 배경색 설정
        drawerLabelStyle: {
          fontFamily: 'soyoRegular',
          fontSize: screenHeight * 16,
        },
      }} 
      >
    <Drawer.Screen name="내 정보 보기" component={Profile} />
  </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 0,
  },
  icon: {
    flex: 2,
    marginVertical: '5%'
  },
  ProfileView: {
    flex: Platform.OS === 'ios' ? 0.63 : 0.59,
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  label: {
    fontFamily: 'nanumRegular',
    fontSize: 18,
    marginVertical: '0.8%',
  },
  image: {
    width: 150,
    height: 150,
    borderWidth: 3,
    borderColor: '#FFD600',
    marginTop: '7%',
    marginBottom: '1%',
    borderRadius: 75
  },
  ProfileImageModalBackView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  ProfileImageModal:{
    backgroundColor: '#fff',
    alignItems: 'center',
    width: '100%',
    height: '50%'
  },
  closeImageTouchView: {
    alignSelf: 'flex-end',
    position:'absolute', 
    width: Platform.OS === 'ios' ? screenWidth *33 : screenWidth*30, 
    height: Platform.OS === 'ios' ? screenWidth *33 : screenHeight*30, 
    position: 'absolute',
    top: Platform.OS === 'ios' ? '7%' : '5%',
    right: '5%',
  },
  closeImageIcon: {
    alignSelf: 'flex-end', 
    width: Platform.OS === 'ios' ? screenWidth *33 : screenWidth*30, 
    height: Platform.OS === 'ios' ? screenWidth *33 : screenHeight*30, 
  }
  
});

export default DrawerContainer;
