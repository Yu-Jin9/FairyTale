import StackContainer from './navigation/screens/MainContainer';
import UserDataContext from './navigation/UserDataContext';
import React,{useState, useEffect} from 'react';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

export default function App() {

  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState(''); 
  const [userName, setUserName] = useState(''); 
  const [userNick, setUserNick] = useState(''); 
  const [userBirth, setUserBirth] = useState(''); 
  const [userProfile, setUserProfile] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState('');   
  const [userIp, setUserIp] = useState('http://10.20.100.87:8921');
  const [userMembership, setUserMembership] = useState('false');
  const [endMembershipDate, setEndMembershipDate] = useState('0');
  
  const firebaseConfig = {
    apiKey: "AIzaSyA7dso7xa9S7Ci4Oq1fRmbZg_W22mMelb8",
    authDomain: "fairytale-ed10f.firebaseapp.com",
    projectId: "fairytale-ed10f",
    storageBucket: "fairytale-ed10f.appspot.com",
    messagingSenderId: "1060182632972",
    appId: "1:1060182632972:web:1d8a2ca2348f9b12ba9c29",
    measurementId: "G-NVHKK9PJZK"
  };
  const app = initializeApp(firebaseConfig);
  // const analytics = getAnalytics(app);

  // 앱 시작 시 글꼴 로드
  SplashScreen.preventAutoHideAsync();

  useEffect(() => {
    const loadResources = async () => {
      try {
        await Font.loadAsync({
          'SejonghospitalBold': require('./assets/fonts/SejonghospitalBold.otf'),
          'SejonghospitalLight': require('./assets/fonts/SejonghospitalLight.otf'),
          'soyoBold': require('./assets/fonts/soyoBold.ttf'),
          'soyoRegular': require('./assets/fonts/soyoRegular.ttf'),
          'dalseoM': require('./assets/fonts/dalseoM.ttf'),
          'nanumBold': require('./assets/fonts/nanumBold.ttf'),
          'nanumRegular': require('./assets/fonts/nanumRegular.ttf'),
          'myeongRegular': require('./assets/fonts/myeongRegular.ttf'),
          'myeongBold': require('./assets/fonts/myeongBold.ttf')
        });
      } catch (e) {
        console.warn(e);
      } finally {
        SplashScreen.hideAsync();
      }
    };

    loadResources();
  }, []);
  
  return (
    
    <UserDataContext.Provider value={{
      userId: userId,
      setUserId: setUserId,
      userPw: userPw,
      setUserPw: setUserPw,
      userName: userName,
      setUserName: setUserName,
      userNick: userNick,
      setUserNick: setUserNick,
      userBirth: userBirth,
      setUserBirth: setUserBirth,
      userProfile: userProfile,
      setUserProfile: setUserProfile,
      isLoggedIn: isLoggedIn,
      setIsLoggedIn: setIsLoggedIn,
      userIp: userIp,
      setUserIp: setUserIp,
      userMembership: userMembership,
      setUserMembership: setUserMembership,
      endMembershipDate: endMembershipDate,
      setEndMembershipDate: setEndMembershipDate,

    }}>
      <StackContainer/>
    </UserDataContext.Provider>
  );
}