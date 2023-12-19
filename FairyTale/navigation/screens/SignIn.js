import { StatusBar } from 'expo-status-bar';
import React, {useState, useContext, useEffect} from 'react'; 
import UserDataContext from '../UserDataContext';
import { StyleSheet, Text, View, Button, TextInput, SafeAreaView, Alert, Animated, Image, Keyboard , TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { screenWidth, screenHeight } from '../screenSize';
import { Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'

import Swiper from 'react-native-swiper';
import image2 from '../../assets/icon/2.png';
import image3 from '../../assets/icon/3.png';
import image4 from '../../assets/icon/4.png';
import image5 from '../../assets/icon/5.png';
import image6 from '../../assets/icon/6.png';
import image7 from '../../assets/icon/7.png';
import image8 from '../../assets/icon/8.png';
import image9 from '../../assets/icon/9.png';
import image10 from '../../assets/icon/10.png';
import image11 from '../../assets/icon/11.png';
import image12 from '../../assets/icon/12.png';
import image13 from '../../assets/icon/13.png';
import image14 from '../../assets/icon/14.png';
import image15 from '../../assets/icon/15.png';
import image16 from '../../assets/icon/16.png';
import image17 from '../../assets/icon/17.png';
import image18 from '../../assets/icon/18.png';
import image19 from '../../assets/icon/19.png';
import image20 from '../../assets/icon/20.png';
import image21 from '../../assets/icon/21.png';
import { BlurView } from 'expo-blur';

export default function SignIn({ navigation }) {

  const context = useContext(UserDataContext);

  const address = context.userIp;
  const setUserId = context.setUserId;
  const setUserPw = context.setUserPw; 
  const setUserName = context.setUserName;
  const setUserNick = context.setUserNick;
  const setUserBirth = context.setUserBirth;
  const setUserProfile = context.setUserProfile;
  const setIsLoggedIn = context.setIsLoggedIn;

  const [id, setId] = useState('');
  const [pw, setPw] = useState('');

  // 아이디 입력칸에 대한 상태와 핸들러
  const [isIdFocused, setIsIdFocused] = useState(false);
  const idIconSize = useState(new Animated.Value(1))[0];

  const handleIdFocus = () => {
    setIsIdFocused(true);
    Animated.timing(idIconSize, {
      toValue: 0.8,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };
  const handleIdBlur = () => {
    setIsIdFocused(false);
    Animated.timing(idIconSize, {
      toValue: 1.2,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  // 비밀번호 입력칸에 대한 상태와 핸들러
  const [isPwFocused, setIsPwFocused] = useState(false);
  const pwIconSize = useState(new Animated.Value(1))[0];
  const handlePwFocus = () => {
    setIsPwFocused(true);
    Animated.timing(pwIconSize, {
      toValue: 0.8,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };
  const handlePwBlur = () => {
    setIsPwFocused(false);
    Animated.timing(pwIconSize, {
      toValue: 1.2,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleSignIn = async () => {
    try {
      let response = await axios.post(`${address}/server/member/login`, {
        id: id,
        pw: pw
      });
      console.log(response.data.result);
      if (response.data.result !== null ) { // 성공적으로 로그인 되었을 때
        setIsLoggedIn(true);  // 로그인 상태로 변경 
        
        // UserContext에 로그인한 User data 저장
        setUserId(response.data.result.id);
        setUserPw(response.data.result.pw);
        setUserName(response.data.result.name);
        setUserNick(response.data.result.nick);
        setUserBirth(response.data.result.birth);
        setUserProfile(response.data.result.profile);

        navigation.navigate('TabContainer'); // 메인 화면으로 이동

      } else {
        Alert.alert('로그인 실패', '아이디와 비밀번호를 확인해주세요.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const backGroundList = [image2, image3, image4, image5, image6, image7, image8, image9, image10, image11, image12, image13, image14, image15, image16, image17, image18, image19, image20, image21];
  const backImage = () => {
    return backGroundList.map((image,index) => (
      <View key={index} style={styles.slide}>
        <Image source={image} style={styles.image} resizeMode='cover'/>
        <LinearGradient colors={['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.3)','rgba(0,0,0,0.3)']} style={styles.overlay}/>
      </View>
    ))
  }

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // Or set state
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // Or set state
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
      <View style={styles.container}>
        <KeyboardAwareScrollView contentContainerStyle={styles.keyboardAvoidingView} enableAutomaticScroll={true} extraScrollHeight={0} behavior={'position'}  >
        <Swiper autoplayTimeout={5} autoplay showsPagination={false} disabled={false} loop loadMinimal loadMinimalSize={3}>
          {backImage(backGroundList)}
        </Swiper>
        
        <View style={styles.fixedComponent}>
            
              <View style={styles.logoView} >
                {/* <BlurView style={{width: screenWidth*250, height: screenHeight*180, zIndex: 1, position: 'absolute', }} 
                  tint="light" intensity={45} blurReductionFactor = {6} /> */}
                <Image source={require('../../assets/icon/logo3.png')} style={styles.logo} resizeMode='contain' />
              </View>

                <View style={styles.loginView}>
                  <View style={styles.inputView1}>
                    <Animated.Image
                      style={{ width: 24, height: 24, transform: [{ scale: idIconSize }] }}
                      source={require('../../assets/icon/id_Signup.png')}
                    />
                    <TextInput 
                      placeholder='아이디 입력'
                      onFocus={handleIdFocus}
                      onBlur={handleIdBlur}
                      onChangeText={setId} value={id}
                      style={styles.input}
                    />
                  </View>
                  <View style={styles.inputView2}>
                    <Animated.Image
                      style={{ width: 24, height: 24, transform: [{ scale: pwIconSize }] }}
                      source={require('../../assets/icon/pw_Signup.png')}
                    />
                    <TextInput 
                      placeholder='비밀번호 입력'
                      style={styles.input}
                      onFocus={handlePwFocus}
                      onBlur={handlePwBlur}
                      onChangeText={setPw} value={pw} secureTextEntry
                    />
                  </View>
                  
                  <TouchableOpacity onPress={() => handleSignIn(id, pw)} style={styles.logIn} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} >
                    <Text style={styles.logIntx} >로 그 인</Text>
                  </TouchableOpacity>

                </View>
            
        </View>
        </KeyboardAwareScrollView>
        {!keyboardVisible && (
            <View style={styles.signUptxView} >
              <BlurView style={StyleSheet.absoluteFill} tint="dark" intensity={45} blurReductionFactor = {6} />
                <Text style={styles.signUpText1} onPress={() => navigation.navigate('SignUp')}>계정이 없으신가요?</Text>
                <Text style={styles.signUpText2} onPress={() => navigation.navigate('SignUp')}>회원가입</Text>
            </View>
            )}
            
        </View>  
 );
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    },
    wrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    },
    slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    width: '100%',
    height: '100%',
    },
    overlay: {
      position: 'absolute',
      width: '100%',
      height: '100%',
    },
    fixedComponent: {
    width: '100%',
    position: 'absolute',
    top: '20%',
    zIndex: 1,
    paddingTop: '5%',
    paddingBottom: '5%',
    },
    keyboardAvoidingView: {
      justifyContent: 'center',
      backgroundColor: 'transparent',
      width: '100%',
      height: '100%',
    },
    logoView: {
      zIndex:2, 
      width: screenWidth*230, 
      height: screenHeight*180,
      position: 'relative',
      alignSelf: 'center',
      transform: [{translateX:-15}, {translateY: -50}],
      // backgroundColor:'#000'
    },
    logo: {
      zIndex:1, 
      width: screenWidth*240, 
      height: screenHeight*160,
      alignSelf: 'center',
      position: 'absolute',
    },
    loginView: {
      backgroundColor:'#fff',
      padding: '8.5%',
      alignSelf: 'center',
      borderRadius: 50,
      elevation: 10,
      shadowColor: '#000',
      shadowOffset: {width:1, height:1},
      shadowOpacity: 0.25,
      shadowRadius: 1.25,
      zIndex:2
    },
    bubbleView: {
      alignItems: 'center',
      justifyContent: 'center',
      transform: [
        { translateX: 75 },  // 버블 뷰를 X축으로 70만큼 이동
        { translateY: -60 }  // 버블 뷰를 Y축으로 -30만큼 이동
      ],
    },
    input: {
      width: '80%',
      padding: 10,
      borderColor: '#FFFFFF',
    },
    inputView1: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth:1.5,
      borderBottomColor: '#FF9900',
      borderLeftWidth:0,
      borderRightWidth: 0,
      borderTopWidth: 0,
      marginBottom: '5%',
      width: '72%',
      zIndex:3
    },
    inputView2: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth:1.5,
      borderBottomColor: '#FF9900',
      borderLeftWidth:0,
      borderRightWidth: 0,
      borderTopWidth: 0,
      marginBottom: '10%',
      width: '72%',
      zIndex:3
    },
    logIn: {
      backgroundColor: '#FF9900',
      width: screenWidth * 90,
      height: screenHeight * 40,
      borderRadius: 15,
      alignSelf: 'center',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: {width:0, height: 1.5},
      shadowOpacity: 0.25,
      shadowRadius: 1.5,
      justifyContent: 'center',
      zIndex:3
    },
    logIntx: {
      color: '#fff',
      textAlign: 'center',
      fontSize: Platform.OS === 'ios' ? screenWidth * 17 : screenHeight * 19,
      zIndex:3
    },
    signUptxView: {
      width: '100%',
      position: 'absolute',
      flexDirection: 'row', 
      justifyContent: 'space-between' ,
      paddingLeft: Platform.OS ==='ios' ? '20%' : '25%',
      paddingRight: Platform.OS ==='ios' ? '25%' : '25%',
      zIndex: 2,
      bottom: Platform.OS === 'ios' ? '3%' : 0
    },
    signUpText1: {
      color: '#fff',
      marginTop: screenHeight * 13,
      fontSize: screenWidth *18,
      marginBottom: screenWidth *13,
      zIndex:3
    },
    signUpText2: {
      color: '#fff',
      marginTop: screenHeight * 13,
      fontSize: screenWidth * 18,
      marginBottom: screenWidth *13,
      zIndex:3
    },
});