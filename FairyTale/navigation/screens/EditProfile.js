import React, { useContext, useEffect, useState, useCallback } from 'react';
import {StyleSheet, Text, View, TextInput, SafeAreaView, KeyboardAvoidingView, Image, ScrollView, Alert, TouchableOpacity, Platform , Dimensions, Modal  } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { responsiveHeight, responsiveWidth,  responsiveFontSize } from "react-native-responsive-dimensions";
import UserDataContext from '../UserDataContext';
import axios from 'axios';
import CheckModify from './CheckModify';  // 유효성 검사 페이지
import { useFocusEffect } from '@react-navigation/native';  // 해당 페이지로 포커스 될 때마다 사용자 정보 불러옴
// import uploadImage from './ImagePickerFunction';
import * as ImagePicker from 'expo-image-picker'; // 갤러리 접근

import { FirebaseStorage } from '@firebase/storage';
import '@firebase/storage';
import { getStorage, ref, uploadBytes, getDownloadURL } from '@firebase/storage';


import { screenHeight, screenWidth } from '../screenSize';

export default function EditProfile ({navigation}) {
    const context = useContext(UserDataContext);  // context 선언
    const address = context.userIp;               // context에 저장된 데이터들 가져옴
    const isLoggedIn = context.isLoggedIn;
    const userId = context.userId;
    const userPw = context.userPw; 
    const userNick = context.userNick;
    const userName = context.userName;
    const userProfile = context.userProfile;
    const setUserPw = context.setUserPw;          // context에 새로운 값을 저장
    const setUserNick = context.setUserNick;
    const setUserProfile = context.setUserProfile;
    
    // Hook 선언 useState 사용 -> 사용자의 입력 받기 및 db에서 가져온 데이터 담기
    const [id, setId] = useState('');
    const [nick, setNick] = useState('');
    const [birth, setBirth] = useState('');
    const [name, setName] = useState('');
    let [profile, setProfile] = useState(userProfile);
    const [pw, setPw] = useState('');
    const [newPW, setNewPw] = useState('');
    const [pw2, setPw2] = useState('');

    // 회원 탈퇴 시 비밀번호 입력 받기 위해 선언
    const [visible, setVisible] = useState(false);
    const [inputPw, setInputPw] = useState('');

    // 생년월일, 나이 보여주기 위한 선언
    const year = birth.substring(0,4);
    const month = birth.substring(6,7);
    const day = birth.substring(9,10);
    const now = new Date();
    let nowYear = now.getFullYear(); 
    const age = (nowYear-year+1);

    // defaultProfile 걍 프로필 이미지 불러오는 곳마다 선언해줘야 됨
    const defaultProfile = require('../../assets/icon/basic-profile.png');
    const DefaultProfileUrl = '../../assets/icon/basic-profile.png';
   
    // nick변경 modal
    const [modalVisible, setModalVisible] = useState(false);
    
    // 이미지 변경 로컬 결과 받기
    const [resultLocal, setResultLocal] = useState('');

    // db에서 사용자 정보 가져오기
    const getUserProfile = () => {
      if(isLoggedIn === true){
          axios.post(`${address}/server/member/userProfile`,{
              id: userId
          })
          .then((res) => {
          if (res.data.result.id === userId) {
              setId (res.data.result.id);
              setName (res.data.result.name);
              setNick (res.data.result.nick);
              setBirth (res.data.result.birth);
              setProfile (res.data.result.profile);
               // pw는 일부러 안가져옴
          } else {
              Alert.alert('회원 정보 조회 오류.','페이지를 다시 로드해주세요.');
          }
          })
          .catch((err) => {
          console.error(err);
          });
      };
    };
  
    // Profile 화면에 초점이 맞춰질 때마다 db에서 사용자 정보 가져옴
    useFocusEffect(
        useCallback(() => {
            getUserProfile();
        }, [])
    );

    // <이미지 사용> 디렉토리 접근 권한을 위한 Hooks 선언
    const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
    // const [imageUrl, setImageUrl] = useState(''); -> profile, setProfile로 대체 <이 줄만 추후 삭제 예정/사용되지 않음>
    // 사용자의 디렉토리 접근 권한 여부 묻기
    const uploadImage = async () => {
      if (!status?.granted) {
          const permission = await requestPermission();
          if (!permission.granted) {
              return;
          }
      } 

      // 가져올 이미지의 상태 지정
      const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,    // 이미지만 업로드
          allowsEditing: true,                                // 이미지 수정가능 여부
          quality: 0.6,                                       // 이미지 화질
          aspect: [1,1]                                       // 이미지 크기
      });

      if (result.canceled) {
          return;
      }

      setProfile(result.assets[0].uri);  // 이미지 URL 설정
      setResultLocal(result);
      
  };

let localUri = '';
let filename = '';
let match = '';
let type = '';

if (resultLocal && resultLocal.assets && resultLocal.assets.length > 0) {
  localUri = resultLocal.assets[0].uri;
  filename = localUri.split('/').pop();
  match = /\.(\w+)$/.exec(filename ?? '');
  type = match ? `image/${match[1]}` : `image`;
}

const saveImage = async () => {
  try {
    let formData = new FormData();
    let fileName = `${Date.now()}_${filename}`;

    formData.append('file', {
      uri: localUri,
      name: fileName,
      type: type,
    });

    formData.append('userName', userName);

    let response = await fetch(`${address}/server/storage/profile`, {
      method: 'POST',
      body: formData,
    });

    let url = await response.json();
    console.log('서버에서 받은 응답:', url.downloadUrl);
    return url.downloadUrl;
  } catch (e) {
    console.error('서버로의 업로드 중 에러 발생:', e);
  }
}

    // onPress 기본 프로필로 변경 함수
    function setDefaultProfile () {
      setProfile(DefaultProfileUrl);
    }

    // onPress 회원탈퇴 함수
    const handleUserDelete = async () => {
      Alert.alert(
        '회원 탈퇴',
        '정말 탈퇴하시겠습니까? 탈퇴 후 삭제된 정보는 되돌릴 수 없습니다.',
        [
          {
            text: '아니오',
            onPress: () => console.log('회원 탈퇴 취소'),
            style: 'cancel',
          },
          {
            text: '예',
            onPress: async () => {
              try {
                let response = await axios.post(`${address}/server/member/delete`, {
                  id: userId,
                  pw: userPw,
                });
                if (response.data.result > 0) {
                  Alert.alert('회원 탈퇴 완료. 다음에 만나요.');
                  navigation.navigate('SignIn');
                } else {
                  console.log(response.data.result);
                  Alert.alert('회원 탈퇴 실패. 잠시 후 다시 시도해주세요.');
                }
              } catch (error) {
                console.error(error);
              }
            },
          },
        ],
        {cancelable: false},
      );
    };
  
    // 회원탈퇴 버튼 선언
    React.useLayoutEffect(() => {
      navigation.setOptions({
        headerRight: () => ( 
          <TouchableOpacity
            onPress={handleUserDelete}
            style={styles.removebtn}
          ><Text style={styles.removetx}>회원 탈퇴</Text></TouchableOpacity>
        ),
      });
    }, [navigation]);  

    // 서버에 비밀번호 확인 요청
    const checkPassword = async () => {
      try {
        let response = await axios.post(`${address}/server/member/checkPassword`, {
          id: id,
          pw: pw,
        });
        return response.data.result;  // "result"로 true / false 반환해줌
      } catch (error) {
        console.error(error);
      }
    };

    // 수정하기 -> 유효성 검사 -> true Profile 페이지로 이동
    const handleCheckUp = async () => {
      
      if (pw !== '') {  // pw가 입력되었을 경우에만 비밀번호 확인 요청
        const isPasswordCorrect = await checkPassword(); // 서버에 비밀번호 확인 요청 후 결과 저장 (true/false)
        
        if (!isPasswordCorrect) {   // 비밀번호 불일치 경우
          Alert.alert('현재 비밀번호가 일치하지 않습니다. 다시 입력해주세요.');
          return;
        } 
      }
      
      const isValid = CheckModify({ 
        id: id,
        pw: pw,
        newPW: newPW,
        pw2: pw2,
        name: name,
        nick: nick,
        profile: profile
      });

      if (isValid) { // 유효성 검사가 통과했을 경우
        Alert.alert('유효성 검사 통과 완료'); 
        await handleModify();
      } else { // 유효성 검사가 통과하지 못했을 경우
        console.log(pw + newPW);
        Alert.alert('변경한 내용이 형식에 맞지 않습니다. 다시 작성해주세요.');
        return;
      }
    }; 

    const handleModify = async () => {

      try {
        let modifiedFields = {
          id: userId,
          pw: pw,
          newPW: newPW,
          nick: nick,
          profile: profile
        };
        
        // 수정되거나 수정되지 않은
        if (newPW !=='' && newPW !== null) {  // 수정 O
          modifiedFields.pw = newPW;
        } else {
          modifiedFields.pw = null;
        }

        if (nick === userNick && nick !== '' && nick !== null ) {   // 수정 O
          modifiedFields.nick = nick;
        } else {
          modifiedFields.nick = null;
        }

        if (profile !== userProfile && profile !== '' && profile !== null) {  // 수정 O
          modifiedFields.profile = profile;
        } else if (profile === userProfile) {  // 기존과 동일한 이미지일 경우
          modifiedFields.profile = null;
        } else  if (profile === '' || profile === null ) {  // 기본 이미지인 경우
          modifiedFields.profile = "basicUrl";
        }

        if (profile !== '../../assets/icon/basic-profile.png' && profile !== null) {
          const imageUrl = await saveImage(); // profile에는 로컬 경로가 저장된 상태  => firebase로 보내고 url받기 위함 
          console.log("imageUrl : " + imageUrl);
          profile = imageUrl;
          modifiedFields.profile = profile;
        }
        console.log('profile : '+profile);
        
        modifiedFields.id = id; // 쿼리에서 사용자를 찾기modify
    
        // 수정된 필드가 없으면 함수를 종료
        if (Object.keys(modifiedFields).length === 0) {
          Alert.alert('수정된 내용이 없습니다.');
          return;
        }

        // 수정된 필드만 body에 담아서 보내기
        const modify = async () => { 
          console.log('modifiedFields.profile : '+modifiedFields.profile);
          await axios.post(`${address}/server/member/modify`, {
            id: modifiedFields.id,
            pw: modifiedFields.pw,
            nick: modifiedFields.nick,
            profile: modifiedFields.profile
          })
          .then(() => {
            console.log('DB 저장 성공');
            updateContext();
            Alert.alert('내 정보 수정 완료');
            navigation.navigate('TabContainer'); // 내 정보 화면으로 이동
          })
          .catch((error) => {
            console.log("error : " + error);
            Alert.alert('내 정보 수정 실패', '비밀번호 또는 닉네임을 조건을 확인해주세요.');
          });
        } 

        await modify();

      } catch (error) {
        console.error(error);
      }  
      
    };

    const updateContext = () => {
      try {
        let res = axios.post(`${address}/server/member/getNewInfo`, {id:id});
        if(res.data.result != null) {
          context.setUserPw(res.data.result.pw);
          context.setUserNick(res.data.result.nick);
          context.setUserProfile(res.data.result.profile);
        } else {
          Alert.alert('상태 업데이트 실패', '잠시 후 다시 시도해주세요.');
        }
      } catch (error) {
        console.error(error);
      }
    };

    const settingNick = () => {
      if (nick != null && nick != '') {
        setUserNick(nick);
        Alert.alert('아래 수정하기 버튼을 눌러서 저장해주세요.');
      } else {
        Alert.alert('닉네임을 입력해주세요.');
      }
      setModalVisible(!modalVisible);
    }

    return(
    <SafeAreaView style={styles.container} >
        <KeyboardAwareScrollView contentContainerStyle={styles.keyboardAvoidingView}>

        <View style={styles.proImaView}>
          <TouchableOpacity onPress={uploadImage}>
            <Image  style={styles.image} source={profile === '../../assets/icon/basic-profile.png' ? defaultProfile : {uri: profile} } resizeMode="cover" />
            <Image  source={require('../../assets/icon/camera_EditProfile(2).png')} 
              style={{
                width: screenWidth * 28,
                height: screenHeight * 28,
                transform: [
                  { translateX: Platform.OS === 'ios' ? 118 : 124 },  
                  { translateY: -32 } 
                ],
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},  // 그림자 위치
                shadowOpacity: 0.25,  // 그림자 투명도
                shadowRadius: 2.5,     // 그림자 블러 반경
              }} />
          </TouchableOpacity>  
        </View>
        <TouchableOpacity onPress={setDefaultProfile} style={styles.basicProbtn}>
          <Text style={styles.basicProtx}>기본 이미지로 변경</Text>
        </TouchableOpacity>

          <Text style={styles.label} >{name}</Text>
          <Text style={styles.label} >{year}년 {month}월 {day}일 {age}세</Text>
          <View style={{flexDirection:'row'}}>
            <Text style={styles.label} >{nick}</Text>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Image source={require('../../assets/icon/edit_EditProfile(2).png')} 
                  style={{
                    width:20, 
                    height:20,
                    transform : [
                      { translateX: 13 },
                      { translateY: Platform.OS ==='ios' ? 5 : 7 } 
                    ],
                    opacity: 3,
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 2},  // 그림자 위치
                    shadowOpacity: 0.25,  // 그림자 투명도
                    shadowRadius: 2.5,     // 그림자 블러 반경
                    }} />
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => {
                    Alert.alert('닉네임 변경 창닫기','변경 내용이 저장되지 않습니다.\n저장을 원하시면 \'확인\'을 눌러주세요.');
                    setModalVisible(!modalVisible);
                  }}>
                    <View style={styles.modalParentView}>
                      <View style={styles.modalView} >
                        <Text style={{ fontSize: screenHeight * 20, marginBottom: '2%', fontFamily: 'soyoRegular' }}>원하는 닉네임을 입력해주세요.</Text>
                        <Text style={{ fontSize: screenHeight *13, marginBottom: '10%', fontFamily: 'soyoRegular' }}>영어 또는 한글 1~10글자 (특수문자 사용가능).</Text>
                        <TextInput 
                          style={{ 
                            fontFamily: 'nanumRegular',
                            fontSize: screenHeight * 18,  
                            width: screenWidth*220, 
                            height: 40, 
                            borderColor: '#FFD641', 
                            borderWidth: 1, 
                            borderRadius: 15, 
                            textAlignVertical: 'center', 
                            textAlign: 'center'
                            }} 
                            placeholder='닉네임을 입력해주세요.' onChangeText={setNick} value={nick}/>
                        <View style={{ flexDirection: 'row', alignContent:'space-between'}}>  
                          <TouchableOpacity style={styles.canclebtn}>
                            <Text style={styles.cancleTx} onPress={()=>setModalVisible(false)} >취소</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.savebtn} onPress={()=>settingNick()}>
                            <Text style={styles.saveTx}>확인</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                </Modal>
              </TouchableOpacity>
          </View>

          <View style={styles.pwView}>
            <Text style={{fontSize: screenHeight * 18, fontFamily: 'soyoBold', marginLeft:'2%'}}>* 비밀번호 변경 *</Text>
            <View style={{flexDirection: 'column', paddingTop: '4%'}}>
              <Text style={{fontSize: screenHeight * 17, fontFamily:'soyoRegular', marginBottom: '2%', marginLeft: 10}}>현재 비밀번호</Text>
              <TextInput style={styles.pwInput} placeholder='현재 비밀번호를 입력해주세요.' onChangeText={setPw} />
            </View>

            <View style={{flexDirection: 'column', paddingTop: '4%'}}>
              <Text style={{fontSize: screenHeight * 17, fontFamily:'soyoRegular', marginBottom: '2%' , marginLeft: 10}}>새 비밀번호</Text>
              <Text style={{fontSize: screenHeight * 13, fontFamily:'soyoRegular', marginBottom: '3%', marginLeft: 10}}>알파벳, 특수문자 (!@#$%^*+=-), 숫자를 모두 하나 이상 포함</Text>
              <TextInput style={styles.pwInput} placeholder='비밀번호를 조건에 맞게 입력해주세요.' onChangeText={setNewPw} secureTextEntry/>
            </View>
            
            <View style={{flexDirection: 'column', paddingTop: '4%'}}>
              <Text style={{fontSize: screenHeight * 17, fontFamily:'soyoRegular', marginBottom: '2%', marginLeft: 10}}>비밀번호 재확인</Text>
              <TextInput style={styles.pwInput} placeholder='비밀번호 재확인입니다.' onChangeText={setPw2} secureTextEntry />
            </View>
           </View>  

          <TouchableOpacity style={styles.Editbutton} activeOpacity={0.4} onPress={() => handleCheckUp()}>
            <Text style={styles.EditbuttonText}>수정하기</Text>
          </TouchableOpacity>

        </KeyboardAwareScrollView >
    </SafeAreaView>
    )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 3,
  },
  keyboardAvoidingView: {
    width: '100%',
    alignItems: 'center',
    marginBottom: '10%'
  },
  proImaView: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: '4%'
  },
  label: {
    fontFamily: 'nanumRegular',
    fontSize: screenHeight * 18,
    marginVertical: '1.2%',
  },
  nickView: {
    width: '95%',
    marginTop: '5%',
    flexDirection: 'column',
    borderTopColor: '#D6D6D6', 
    borderLeftColor: '#fff', 
    borderRightColor: '#fff', 
    borderBottomColor: '#fff', 
    borderWidth: 1, 
    paddingTop: '4%',
  },
  pwView: {
    width: '93%',
    marginTop: '5%',
    flexDirection: 'column',
    borderTopColor: '#D6D6D6', 
    borderLeftColor: '#fff', 
    borderRightColor: '#fff', 
    borderBottomColor: '#fff', 
    borderWidth: 1, 
    paddingTop: '4%',
    paddingLeft: '1%',
    paddingEnd: '1%'
  },
  pwInput: {
    width: '95%',
    borderWidth: 1,
    borderColor: '#FFD641',
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
    marginLeft: 10,
    fontSize: screenHeight * 17,
  },
  image: {
    width: screenWidth * 150,
    height: screenHeight * 150,
    borderWidth: 3,
    borderColor: '#FFD600',
    marginTop: '7%',
    marginBottom: '4%',
    borderRadius: 75
  },
  icon: {
    marginBottom: 50,
  },
  Editbutton: {
    width: Platform.OS === 'ios' ? screenWidth * 92 : screenWidth * 87,
    height: Platform.OS === 'ios' ? screenHeight * 47 : screenHeight * 42,
    backgroundColor: "#FF9900",
    borderRadius: 15,
    marginTop: 30,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: '#000',
    shadowOffset:{width:0.5, height:1},
    shadowOpacity: 0.25,
    shadowRadius:1,
    elevation: 2
  },
  EditbuttonText: {
    fontFamily: 'soyoRegular',
    fontSize: screenHeight * 18,
    fontWeight: "600",
    color: "#fff",
    marginRight: 10,
    marginLeft: 10,
},
  removebtn: {
    width: screenWidth * 80, 
    height: screenHeight * 35,
    backgroundColor: 'tomato', 
    alignItems:'center', 
    marginEnd: '10%', 
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 2},  // 그림자 위치
    shadowOpacity: 0.2,  // 그림자 투명도
    shadowRadius: 1.2,     // 그림자 블러 반경
    justifyContent: 'center'
  },
  removetx: {
    fontFamily: 'soyoRegular',
    color: '#fff', 
    fontSize: Platform.OS === 'ios' ? screenHeight * 14.5 : screenHeight * 16.5,
    textAlign: 'center'
  },
  basicProbtn: {
    width: Platform.OS === 'ios' ? screenWidth*165 : screenWidth*158, 
    height: Platform.OS === 'ios' ? screenHeight*42 : screenHeight*40,
    backgroundColor: '#FF9900',
    borderRadius: 10,
    marginBottom: '3%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 2},  // 그림자 위치
    shadowOpacity: 0.2,  // 그림자 투명도
    shadowRadius: 1.2,     // 그림자 블러 반경
  },
  basicProtx: {
    fontSize: Platform.OS === 'ios' ? 15.5 : 17.5,
    fontFamily:'soyoRegular',
    color: '#fff',
    paddingTop: Platform.OS === 'ios' ? 9.5 : 12, 
    paddingLeft: Platform.OS === 'ios' ? 11.5 : 15
  },
  modalParentView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  canclebtn: {
    marginTop: 30,
    marginRight: 60,
    backgroundColor: '#FFB900',
    width: Platform.OS === 'ios' ? screenWidth*55 : screenWidth*52,
    height: Platform.OS === 'ios' ?screenHeight*35 : screenHeight*32,
    borderRadius: 10,
    elevation: 1.5,
    shadowColor: '#000',
    shadowOffset: {width:0, height:1},
    shadowOpacity: 0.25,
    shadowRadius: 1.5
  },
  cancleTx: {
    fontFamily: 'soyoRegular',
    textAlign: 'center',
    color: '#fff',
    fontSize: screenHeight * 17,
    marginTop: Platform.OS === 'ios' ? '10%' : '12%'
  },
  savebtn: {
    marginTop: 30,
    marginLeft: 60,
    backgroundColor: 'tomato',
    width: Platform.OS === 'ios' ? screenWidth*55 : screenWidth*52,
    height: Platform.OS === 'ios' ?screenHeight*35 : screenHeight*32,
    borderRadius: 10,
    elevation: 1.5,
    shadowColor: '#000',
    shadowOffset: {width:0, height:1},
    shadowOpacity: 0.25,
    shadowRadius: 1.5
  },
  saveTx: {
    fontFamily: 'soyoRegular',
    textAlign: 'center',
    color: '#fff',
    fontSize: screenHeight * 17,
    marginTop: Platform.OS === 'ios' ? '10%' : '12%'
  }
});
