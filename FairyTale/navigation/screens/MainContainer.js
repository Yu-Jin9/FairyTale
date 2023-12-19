// For using StackNavigation screen, BottomTabBar screen
// StackNavigation 사용 시 페이지 추가될 때마다 여기에 페이지 정의해주세요.

// import for BottomTabNavigator
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// import for StackNavigator
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 

// Screens For BottomTabNavigator 
import HomeScreen from './HomeScreen';  // 홈 화면
import BookList from './BookList';      // 게시판
import Profile from './Profile';        // 내 정보

// Screens For StackNavigator
import SignUp from './SignUp';          // 회원가입 
import SignIn from './SignIn';          // 로그인
import CheckSignUp from './CheckSignUp';// 유효성 검사
import MakeBook from './MakeBook';      // 책 만들기 페이지
import BookInfo from './BookInfo';      // 선택한 책 보기
import CommentList from './CommentList';    // 선택한 게시물의 댓글 보기
import ViewBook from './ViewBook';      // 선택한 게시물의 동화 보기
import RecommendInfo from './RecommendInfo';    // 선택한 추천 동화 보기
import RecommendList from './RecommendList';    // 추천 동화 리스트 페이지
import UserDataContext from '../UserDataContext';    // session 대신 UserData 저장할 js 파일
import CheckModify from './CheckModify';// 유효성 검사 (내 정보 수정)
import  PayMent  from './PayMent';    // 토스 결제 페이지
import PaymentPage from'./PaymentPage'; // 결제권 설명 페이지
import MyBookList from'./MyBookList'; // 내가 만든 동화
import UserAddress from'./UserAddress'; // 주소 받기
// Screen For TabNavigator
import MyFairyTale from './MyFairyTale';    // 내가 만든 동화 페이지
import MyBoard from './MyBoard';            // 내가 만든 게시판 페이지
import RecentlyBook from './RecentlyBook';  // 최근 읽은 책 페이지
import WebViewScreen from './WebVIewScreen';

// Screen For DrawerNavigator
import EditProfile from './EditProfile';    // 내 정보 수정 페이지
import 'react-native-gesture-handler';
import { createDrawerNavigator} from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';



// import For Use Action & icon
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, Alert, TouchableOpacity, Platform, Dimensions, Image } from 'react-native';
import React, {useContext, useEffect, useState, useFocusEffect} from 'react';

import { screenWidth, screenHeight } from '../screenSize';

// TabBar Screen names
const homeName = '홈 화면';
const bookListName = '도서관';
const profileName = '내 정보';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


// screenOptions={{headerShown:false}} -> 상단 페이지 타이틀 숨기기
function StackContainer(props) {

    return (
        <NavigationContainer >
            <Stack.Navigator initialRouteName='SignIn' > 
              <Stack.Screen name="SignIn" component={SignIn} options={{headerTitle:"로그인 화면", headerTitleAlign:'center',headerShown:false }}/>
              <Stack.Screen name="SignUp" component={SignUp} options={{headerTitle:"회원가입 화면", headerTitleAlign:'center', headerBackTitle:" "}}/>
              <Stack.Screen name="CheckSignUp" component={CheckSignUp} options={{headerTitle:"유효성검사 화면", headerTitleAlign:'center'}}/>
              <Stack.Screen name="MakeBook" component={MakeBook} options={{headerTitle:"책 만들기 화면", headerTitleAlign:'center', headerTitleStyle: {fontFamily: 'soyoBold'}, headerBackTitle:" "}}/>
              <Stack.Screen name="BookInfo" component={BookInfo} options={{headerTitle:"동화책 보기", headerTitleAlign:'center', headerBackTitle:" ", headerTitleStyle: {fontFamily: 'soyoBold'}}}/>
              <Stack.Screen name="CommentList" component={CommentList} options={{headerTitle:"댓글 보기", headerTitleAlign:'center', headerBackTitle:"동화 보기", headerTitleStyle: {fontFamily: 'soyoBold'}}}/>
              <Stack.Screen name="ViewBook" component={ViewBook} options={{headerTitle:'', headerTitleAlign:'center', headerTitleStyle: {fontFamily: 'soyoBold'}, headerBackTitle:" "}} />
              <Stack.Screen name="EditProfile" component={EditProfile} options={{headerTitle:"내 정보 수정 화면", headerTitleAlign:'center', headerTitleStyle: {fontFamily: 'soyoBold'}, headerBackTitle:" "}}/>
              <Stack.Screen name="RecommendInfo" component={RecommendInfo} options={{headerTitle:"추천 동화 정보", headerTitleAlign:'center', headerTitleStyle: {fontFamily: 'soyoBold'}, headerBackTitle:" "}}/>
              <Stack.Screen name="RecommendList" component={RecommendList} options={{headerTitle:"추천 동화 리스트", headerTitleAlign:'center', headerTitleStyle: {fontFamily: 'soyoBold'}, headerBackTitle:" "}}/>
              <Stack.Screen name="CheckModify" component={CheckModify} options={{headerTitle:"유효성 검사 (내 정보 수정)", headerTitleAlign:'center', headerTitleStyle: {fontFamily: 'soyoBold'}}}/>
              <Stack.Screen name="PayMent" component={PayMent} options={{headerTitle:"결제", headerTitleAlign:'center', headerTitleStyle: {fontFamily: 'soyoBold'}, headerBackTitle:" "}}/>
              <Stack.Screen name="PaymentPage" component={PaymentPage} options={{headerTitle:"멤버십 회원 혜택", headerTitleAlign:'center', headerTitleStyle: {fontFamily: 'soyoBold'}, headerBackTitle:" "}}/>
              <Stack.Screen name="MyFairyTale" component={MyFairyTale} />
              <Stack.Screen name="MyBoard" component={MyBoard} />
              <Stack.Screen name="RecentlyBook" component={RecentlyBook} />
              <Stack.Screen name="MyBookList" component={MyBookList} options={{headerTitle:"내 책 배송", headerTitleAlign:'center', headerTitleStyle: {fontFamily: 'soyoBold'}, headerBackTitle:" "}} />
              <Stack.Screen name="UserAddress" component={UserAddress} options={{headerBackTitle:" ", headerTitle:"배송지 입력", headerTitleAlign:'center', headerTitleStyle: {fontFamily: 'soyoBold'}}} />
              <Stack.Screen name="WebViewScreen" component={WebViewScreen} options={{headerTitle:"회원가입 화면", headerTitleAlign:'center', headerBackTitle:" "}}/>
              <Stack.Screen name="UserDataContext" component={UserDataContext}/>

              <Stack.Screen name="TabContainer" component={TabContainer} options={{headerShown:false, title:"" }}/>
              <Stack.Screen name="DrawerContainerParent" component={DrawerContainerParent} options={{headerShown:false, headerBackTitle:" "}}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

function DrawerContainerParent() {
    const Drawer = createDrawerNavigator();
    return ( 
        <Drawer.Navigator>
        <Drawer.Screen name="TabContainer" component={TabContainer} options={{headerShown:false}}/>
      </Drawer.Navigator>
    );
}

function TabContainer() {
    const context = useContext(UserDataContext);
    const isLoggedIn = context.isLoggedIn;
    const setIsLoggedIn = context.setIsLoggedIn;

    const { height: height } = Dimensions.get('window');    // ㅅ용자의 화면 크기를 가져옴

    return(
            <Tab.Navigator 
            initialRouteName={homeName}
            screenOptions={({route}) => ({
                tabBarIcon: ({foucused, color, size}) => {
                    let iconName;
                    let rn = route.name;

                    if (rn === homeName) {
                        iconName = foucused ? 'home' : 'home-outline'
                    } else if (rn === bookListName) {
                        iconName = foucused ? 'list' : 'book-outline'
                    } else if (rn === profileName) {
                        iconName = foucused ? 'settings' : 'person-outline'
                    }

                    return <Ionicons name={iconName} size={size} color={color}/>
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'grey',
                tabBarLabelStyle: {
                    marginBottom: 10,
                    fontSize:10,
                    fontFamily: 'soyoRegular'
                },
                tabBarStyle:{
                    position: 'absolute',
                    padding: 7,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: Platform.OS === 'ios' ? screenHeight * 100 : screenHeight * 63,
                    borderRadius: 0,
                    elevation: 10,
                    shadowColor: '#000',
                    shadowOffset: {width:0, height:1},
                    shadowOpacity: 0.25,
                    shadowRadius: 1
                }
            })}
            >
            
            <Tab.Screen name={homeName} component={HomeScreen} options={{headerTitleAlign:'center', headerTitleStyle: {fontFamily: 'soyoBold'},headerShown:false}} />
            <Tab.Screen name={bookListName} component={BookList} options={{headerTitleAlign:'center', headerTitleStyle: {fontFamily: 'soyoBold'},}}/>
            <Tab.Screen 
                name={profileName} 
                component={Profile}
                options={({navigation }) => ({
                    headerRight: () => (
                        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
                            <Image source={require('../../assets/icon/list_Drawer.png')} resizeMode="cover" 
                                style={{
                                    width: screenWidth * 25, 
                                    height: screenHeight * 25,
                                    marginEnd: screenWidth * 20 }} />
                        </TouchableOpacity>
                    ),
                    headerTitleStyle: {fontFamily: 'soyoBold'},
                    headerTitleAlign:"center",
                    // 초기화면이 무조건 Profile화면으로 나오게 설정
                    tabBarButton: (props) => (
                        <TouchableOpacity {...props} onPress={() => {
                            // prevent default action
                            props.onPress();
                            // navigate to the first screen of the drawer
                            navigation.navigate(profileName, { screen: 'Profile' });
                        }} />
                    ),
                })}
            />
        
        </Tab.Navigator>
    )
}

export default StackContainer;