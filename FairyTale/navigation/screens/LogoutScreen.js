import React, {useContext} from 'react';
import { Alert } from 'react-native';
import  UserDataContext from '../UserDataContext';

function LogoutScreen({ navigation }) {
  const context = useContext(UserDataContext);
  const isLoggedIn = context.isLoggedIn;
  const setIsLoggedIn = context.setIsLoggedIn;
  const setUserId = context.setUserId;
  const setUserPw = context.setUserPw;
  const setUserName = context.setUserName;
  const setUserNick = context.setUserNick;
  const setUserBirth = context.setUserBirth;
  const setUserProfile = context.setUserProfile;

  React.useEffect(() => {
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
            const setUserId = '';
            const setUserPw = '';
            const setUserName = '';
            const setUserNick = '';
            const setUserBirth = '';
            const setUserProfile = '';
           navigation.navigate('SignIn');
          }
        }
      ]
    );
  });

  return null;
}

// function DrawerContainer() {
//     return ( 
//       <Drawer.Navigator initialRouteName='Profile' screenOptions={{drawerPosition:"left", headerTitle:"내 정보"}}>
//         <Drawer.Screen name="EditProfile" component={EditProfile} options={{title:"개인 정보 수정"}}/>
//         <Drawer.Screen name="Logout" component={LogoutScreen} options={{title:"로그아웃"}}/>
//       </Drawer.Navigator>
//     );
//   }

export default LogoutScreen;