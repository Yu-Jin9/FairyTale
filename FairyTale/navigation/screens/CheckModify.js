import { findFocusedRoute } from "@react-navigation/native";
import React, { useContext } from 'react';
import UserDataContext from '../UserDataContext';
import { Alert } from "react-native";

function CheckModify({
  id: initialId,
  pw: initialPw,
  newPW: initialNewPw,
  pw2: initialPw2,
  nick: initialNick,
  profile: initialProfile,
  
}) {

  // 정규 표현식 패턴들
  const checkPw = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{6,12}$/;
  const checkNick = /^[a-zA-Z0-9가-힣\s]{1,10}$/;

  const validateNewInput = () => {

    // 새 비밀 번호만 뭔가 적혀있는 경우
    if (initialNewPw !== '') {
        if(initialPw === '') {
            Alert.alert('현재 비밀번호가 비었습니다.\n비밀번호 변경을 원하시면 입력해주세요.');
            return false;
        }
        if (initialPw2 === '') {
            Alert.alert('비밀번호 재확인이 비었습니다.');
            return false;   
        }
        if (!checkPw.test(initialNewPw)) {
            Alert.alert('새 비밀번호가 조건에 맞지 않습니다.');
            return false;   
        } 
    }

    // 현재 비밀번호, 새 비밀전호 둘 다 뭐가 적혀있는 경우
    if (initialPw !== '' && initialNewPw !== '') {
        if (initialPw2 === '') {
            Alert.alert('비밀번호 재확인이 비었습니다.');
            return false;   
        }
        if (!checkPw.test(initialNewPw)) {
            Alert.alert('새 비밀번호가 조건에 맞지 않습니다.');
            return false;   
        } 
    }
    
    if (initialId === initialNewPw) {
        Alert.alert('아이디와 새 비밀번호는 다르게해주세요.');
        return false;
    }

    if ((initialNewPw !== '' && initialPw !== '') && (initialNewPw === initialPw)) {
        Alert.alert('새 비밀번호가 기존 비밀번호와 일치합니다.');
        return false;   
    } 
    
    if(initialNewPw != initialPw2) {
        Alert.alert('새 비밀번호와 비밀번호 재확인이 일치하지 않습니다.');
        return false;
    } 

    if (initialNick === '') {
        Alert.alert('닉네임이 비었습니다. 닉네임은 필수 항목입니다.');
        return false;
    }
    if (!checkNick.test(initialNick)) {
        Alert.alert('닉네임이 형식에 맞지 않습니다.');
        return false;   
    }
        return true;
  };
  return validateNewInput();
}

export default CheckModify;