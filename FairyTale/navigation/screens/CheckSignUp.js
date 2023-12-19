import React from "react";
import { Alert } from "react-native";

function CheckSignUp({
  id: initialId,
  pw: initialPw,
  pw2: initialPw2,
  name: initialName,
  nick: initialNick,
  pNum1: initialPNum1,
  pNum2: initialPNum2,
  year: initialYear,
  month: initialMonth,
  day: initialDay,
  profile: initialProfile,
}) {

  // 정규 표현식 패턴들
  const checkId = /^[a-zA-Z0-9]{4,12}$/;
  const checkPw = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{6,12}$/;
  const checkName = /^[a-zA-Z가-힣]{2,12}$/;
  const checkNick = /^[a-zA-Z0-9가-힣\s]{1,10}$/;

  const validateInput = () => {
    if (initialId === '') {
      Alert.alert('아이디를 입력해주세요.');
      return false;
    }
    if (!checkId.test(initialId)){      
      Alert.alert('아이디는 대소문자 또는 숫자로 시작하고 끝나며 4~12자리로 입력해야합니다.');
      return false;
    }
    if (initialPw === '') {
      Alert.alert('비밀번호를 입력해주세요.');
      return false;   
    } 
    if (!checkPw.test(initialPw)) {
      Alert.alert('비밀번호가 조건에 맞지 않습니다.');
      return false;   
    } 
    if (initialId === initialPw) {
      Alert.alert('아이디와 비밀번호는 다르게해주세요.');
      return false;
    }
    if (initialPw2 === '') {
      Alert.alert('비밀번호 재확인이 비었습니다.');
      return false;   
    }
    if(initialPw != initialPw2) {
      Alert.alert('비밀번호와 비밀번호 재확인이 일치하지 않습니다.');
      return false;
    } 
    if (initialName === '') {
      Alert.alert('이름이 비었습니다.');
      return false;
    }
    if (!checkName.test(initialName)) {
      Alert.alert('이름이 형식에 맞지 않습니다.');
      return false;   
    }
    if (initialNick === '') {
      Alert.alert('닉네임이 비었습니다.');
      return false;
    }
    if (!checkNick.test(initialNick)) {
      Alert.alert('닉네임이 형식에 맞지 않습니다.');
      return false;   
    }
    if (initialPNum1 === '') {
      Alert.alert('주민등록번호를 입력해주세요.');
      return false;
    }
    if (initialPNum2 === '') {
      Alert.alert('주민등록번호를 입력해주세요.');
      return false;
    }
    if (initialYear === '' || initialMonth === '' || initialDay === '') {
      Alert.alert('생년월일이 입력되지 않았습니다.');
      return false;
    }
    return true;
  };
  return validateInput();
}

export default CheckSignUp;