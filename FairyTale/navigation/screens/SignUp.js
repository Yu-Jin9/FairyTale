
import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, Button, TextInput, SafeAreaView, KeyboardAvoidingView, Image, ScrollView, Alert, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import UserDataContext from '../UserDataContext';
import CheckSignUp from './CheckSignUp';
import axios from 'axios';

import { screenWidth, screenHeight } from '../screenSize';

function SignUp({ navigation }) {
  const context = useContext(UserDataContext);
  const address = context.userIp;

  const basicProfileUrl = '../image/basic-profile.png';

  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [name, setName] = useState('');
  const [nick, setNick] = useState('');
  const [pNum1, setPNum1] = useState('');
  const [pNum2, setPNum2] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [profile, setProfile] = useState(basicProfileUrl);
  const [exId, setExId] = useState('영어, 숫자 4글자 이상 12글자 이하.');
  const [exPw1, setExPw1] = useState('x');
  const [exPw2, setExPw2] = useState('x');
  const [exPw3, setExPw3] = useState('x');
  const [exName, setExName] = useState('영어 또는 한글 2글자 이상 12글자 이하.');
  const [exNickName, setExNickName] = useState('영어 또는 한글 1글자 이상 12글자 이하.');
  

  // ************ 주민등록번호 유효성 검사를 위한 함수 *************
 const CheckpNum = (pNum1, pNum2, setYear, setMonth, setDay) => {
    // 주민등록번호 유효성 검사 true -> 생일 자동 입력하기
    let checkpNum1 = /[0-9]{6,6}$/; // 주민번호 정규식 앞에 숫자 6개
    let checkpNum2 = /[0-9]{7,7}$/; // 주민번호 정규식 뒤에 숫자 7개

    // 주민 번호 앞/뒷자리
    let arrIdNum1 = new Array();
    let arrIdNum2 = new Array();

    if (!pNum1 || !pNum2) { // 주민등록 번호가 입력되지 않은 경우
      Alert.alert('주민등록번호를 입력해주세요.');
      return false;
    }
    if (!(checkpNum1.test(pNum1) && checkpNum2.test(pNum2))) { // 주민 등록번호의 형식에 안맞게 작성된 경우
      Alert.alert('주민등록번호가 제대로 입력되지 않았습니다.');
      return false;
    }

    // *** 주민등록 번호 검증식 ***
    for (let i = 0; i < pNum1.length; i++) {
      arrIdNum1[i] = pNum1.charAt(i);
    }

    for (let i = 0; i < pNum2.length; i++) {
      arrIdNum2[i] = pNum2.charAt(i);
    }

    let tempSum = 0;

    for (let i = 0; i < pNum1.length; i++) {
      tempSum += arrIdNum1[i] * (2 + i);
    }

    for (let i = 0; i < pNum2.length - 1; i++) {
      if (i >= 2) {
        tempSum += arrIdNum2[i] * i;
      } else {
        tempSum += arrIdNum2[i] * (8 + i);
      }
    }

    if ((11 - (tempSum % 11)) % 10 != arrIdNum2[6]) {
      Alert.alert("올바른 주민번호가 아닙니다.");
      return false;
    }

    // **************** 입력된 주민 번호로 생일 입력하기 *****************
    if (arrIdNum2[0] == 1 || arrIdNum2[0] == 2) { // 2000년 이전
      let y = (pNum1.substring(0, 2)); // 2자리씩
      let m = (pNum1.substring(2, 4));
      let d = (pNum1.substring(4, 6));
      setYear(`${1900 + parseInt(y)}`); // 년
      setMonth(`${m.padStart(2, '0')}`); // 월
      setDay(`${d.padStart(2, '0')}`); // 일
    } else if (arrIdNum2[0] == 3 || arrIdNum2[0] == 4) { // 2000년 이후
      let y = (pNum1.substring(0, 2));
      let m = (pNum1.substring(2, 4));
      let d = (pNum1.substring(4, 6));
      setYear(`${2000 + parseInt(y)}`);
      setMonth(`${m.padStart(2, '0')}`);
      setDay(`${d.padStart(2, '0')}`);
    }

      return true;
  };

  // ID 중복 확인  
  const checkButton = () => {
    console.log(address);
    axios.post(`${address}/server/member/idCheck?id=${id}`)
    .then((res) => {
      console.log(res.data.result && res.data.result.id !== null);
      if (res.data.result && res.data.result.id !== null) {
        Alert.alert('사용 불가능한 아이디 입니다.\n다시 입력해주세요.');
      } else {
        Alert.alert('사용가능한 아이디 입니다');
        setExId("성공")
      }
    })
    .catch((err) => {
      console.error(err);
    });
  }

  // 회원 가입 버튼 -> 유효성 검사 -> true 로그인 페이지로 이동
  const handleSignUp = () => {
    const isValid = CheckSignUp({ // CheckSignUp 함수에 사용자 입력 정보 전달
      id: id,
      pw: pw,
      pw2: pw2,
      name: name,
      nick: nick,
      pNum1: pNum1,
      pNum2: pNum2,
      year: year,
      month: month,
      day: day
    });
  
    if (isValid) { // 유효성 검사가 통과했을 경우
      Alert.alert('회원가입 완료', '회원가입이 성공적으로 완료되었습니다.');
      signUp();
    } else { // 유효성 검사가 통과하지 못했을 경우
    }
  };
  
  
  const signUp = async () => {
    try {
      let response = await axios.post(`${address}/server/member/regist`, {
        id: id,
        pw: pw,
        name: name,
        nick: nick,
        birth: year + "-" + month + "-" + day,
        profile: profile
      });
      console.log(response.status);
      if (response.status === 200) { // 성공적으로 회원가입이 되었을 때
        Alert.alert('회원가입 완료', '회원가입이 성공적으로 완료되었습니다.');
        navigation.navigate('SignIn'); // 로그인 페이지로 이동
      } else {
        Alert.alert('회원가입 실패', '회원가입에 실패하였습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <KeyboardAvoidingView behavior='padding' style={styles.keyboardAvoidingView}>
          <View style={styles.iconView}>
            <Image style={{width: screenWidth * 150, height: screenHeight * 150}} source={require('../../assets/icon/add-friend.png')}/>
            <Text style={styles.iconText}>회원가입</Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput style={styles.idInput} placeholder='아이디' onChangeText={setId} value={id} />
            <TouchableOpacity style={styles.checkButton} onPress={checkButton}>
              <Text style={styles.checkText}>중복확인</Text>
            </TouchableOpacity>
          </View>
          <Text style={exId === "성공" ? styles.successText : styles.failText}>{exId}</Text>

          <TextInput style={styles.input} placeholder='비밀번호' onChangeText={setPw} value={pw} secureTextEntry />
          <Text style={exId === "O" ? styles.successText : styles.failText2}>알파벳, 특수문자 (!@#$%^*+=-), 숫자를 모두 하나 이상 포함</Text>
          <Text style={exId === "O" ? styles.successText : styles.failText2}>아이디와 일치하면 안됩니다.</Text>
          <Text style={exId === "O" ? styles.successText : styles.failText2}>비밀번호는 최소 6글자, 최대 12글자 입니다.</Text>

          <TextInput style={styles.input} placeholder='비밀번호 재확인' onChangeText={setPw2} value={pw2} secureTextEntry />

          <TextInput style={styles.input} placeholder='이름' onChangeText={setName} value={name} />
          <Text style={styles.info}>{exName}</Text>

          <TextInput style={styles.input} placeholder='닉네임' onChangeText={setNick} value={nick} />
          <Text style={styles.info}>{exNickName}</Text>

          <View style={styles.rowView}>
            <TextInput style={styles.idNumberInput} placeholder='주민등록번호 앞 6자리' onChangeText={setPNum1} value={pNum1}/>
            <Text style={styles.pText}>  -  </Text>
            <TextInput style={styles.idNumberInput} placeholder='주민등록번호 뒤 7자리' onChangeText={setPNum2} value={pNum2} secureTextEntry />
          </View>
          <TouchableOpacity style={styles.accreditationButton} onPress={() => CheckpNum(pNum1, pNum2, setYear, setMonth, setDay)} color="#FF5D7D">
            <Text style={styles.accreditationText}>인 증</Text>
          </TouchableOpacity>

          <View style={styles.rowView}>
            <TextInput style={styles.birthdayInput} placeholder='연도' onChangeText={setYear} value={year} editable={false}/>
            <Text style={styles.pText}>     </Text>
            <TextInput style={styles.birthdayInput} placeholder='월' onChangeText={setMonth} value={month} editable={false}/>
            <Text style={styles.pText}>     </Text>
            <TextInput style={styles.birthdayInput} placeholder='일' onChangeText={setDay} value={day} editable={false}/>
          </View>

          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp} color="#FF5D7D">
            <Text style={styles.signUpText}>회원가입</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',    
    backgroundColor: '#fff',
  },
  iconView: {
    width: 150, // 아이콘의 크기 설정
    height: 150, // 아이콘의 크기 설정
    justifyContent: 'center', // 세로축을 기준으로 중앙 정렬
    alignItems: 'center', // 가로축을 기준으로 중앙 정렬
    marginBottom: 20, // 아래쪽 여백 설정
    flexDirection: 'row'
  },
  iconText: {
    fontSize: screenHeight *30,
    marginTop: 100,
    fontFamily: 'SejonghospitalLight',
  },
  scrollView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyboardAvoidingView: {
    width: '100%',
    alignItems: 'center',
    paddingLeft: '2%',
    paddingRight: '2%'
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  idInput: {
    width: '65%',
    borderWidth: 1.8,
    borderColor: '#FF9900',
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    fontSize: 13.8,
    fontFamily: 'SejonghospitalLight',
    padding: 10,
  },
  input: {
    width: '75%',
    borderWidth: 1.8,
    borderColor: '#FF9900',
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    fontSize: 13.8,
    fontFamily: 'SejonghospitalLight',
    padding: 10,
    marginBottom: 10,
    alignSelf: 'center'
  },
  idNumberInput: {
    width: '37%',
    borderWidth: 1.8,
    borderColor: '#FF9900',
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    fontSize: 13.8,
    fontFamily: 'SejonghospitalLight',
    padding: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
  pText: {
    marginTop: 10,
    fontFamily: 'SejonghospitalLight',
  },
  rowView: {
    display: 'flex',
    flexDirection: 'row',
    fontFamily: 'SejonghospitalLight',
    marginTop: '3%'
  },
  birthdayInput: {
    width: '20%',
    borderWidth: 1.8,
    borderColor: '#FF9900',
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    justifyContent: 'center',
    fontSize: 13.8,
    fontFamily: 'SejonghospitalLight',
    padding: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkButton: {
    width: 80,
    height: 35,
    borderRadius: 15,
    backgroundColor: '#FF9900',
    marginBottom: 5,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2
  },
  accreditationButton: {
    width: 60,
    height: 35,
    borderRadius: 15,
    backgroundColor: '#FF9900',
    marginTop: 5,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2
  },
  signUpButton: {
    width: screenWidth * 110,
    height: screenHeight * 45,
    borderRadius: 15,
    backgroundColor: '#FF9900',
    marginTop: '10%',
    marginBottom: '15%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2
  },
  checkText: {
    textAlign: 'center',
    color: 'white',
    fontFamily: 'SejonghospitalLight',
    marginTop: 10,
    fontSize: screenHeight * 17
  },
  accreditationText: {
    textAlign: 'center',
    color: 'white',
    fontFamily: 'SejonghospitalLight',
    fontSize: 16,
    marginTop: 9,
  },
  signUpText: {
    textAlign: 'center',
    color: 'white',
    fontFamily: 'SejonghospitalLight',
    fontSize: screenHeight * 20,
    marginTop: 12,
  },
  icon: {
    marginBottom: 50,
  },
  info: {
    fontSize: screenHeight * 12,
    color: 'gray',
    marginBottom: 10,
    marginBottom: 5,
    lineHeight: screenHeight * 14,
  },
  failText: {
    fontSize: screenHeight *12,
    color: 'red',
    marginBottom: 10,
    alignSelf: 'flex-start',
    marginBottom: 5,
    lineHeight: 12,
    marginLeft : '6%'
  },
  failText2: {
    fontSize: screenHeight *12,
    color: 'red',
    marginBottom: 10,
    alignSelf: 'flex-start',
    marginBottom: 5,
    lineHeight: 12,
    marginLeft : '12%'
  },
  successText: {
    fontSize: screenHeight *12,
    color: 'green', // 성공 메시지의 색상을 초록색으로 설정
    marginBottom: 10,
    alignSelf: 'flex-start',
    marginBottom: 5,
    lineHeight: 12,
    marginLeft : '6%'
  },
});

export default SignUp;
