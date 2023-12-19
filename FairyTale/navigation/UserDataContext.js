import {createContext} from 'react';

const UserDataContext = createContext({

    userId: '',
    setUserId: () => {},
    userPw: '',
    setUserPw: () => {},
    userName: '',
    setUserName: () => {},
    userNick: '',
    setUserNick: () => {},
    userBirth: '',
    setUserBirth: () => {},
    userProfile: '',
    setUserProfile: () => {},
    isLoggedIn: false,      // 로그인 상태 (로그아웃 구현하기 위함)
    setIsLoggedIn: () => {},
    userIp: '',
    setUserIp: () => {},
    userMembership: '',
    setUserMembership: () => {},
    endMembershipDate: '',
    setEndMembershipDate: () => {}

});

export default UserDataContext;

/*  UserDataContext 사용하기
 *
 *  UserData를 사용하려는 js 파일에서
 * 
 *  import UserDataContext from '../UserDataContext'; 
 *  import React, { useContext } from 'react'; 
 * 
 *  const context = useContext(UserDataContext);
 *  const setUserId = context.setUserId;    // 값 저장
 *  const userId = context.userId;          // 저장된 값 불러오기
 * 
 */