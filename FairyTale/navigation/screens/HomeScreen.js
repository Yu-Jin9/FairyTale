import React, { useState, useContext, useEffect, useCallback } from 'react';
import UserDataContext from '../UserDataContext';
import { ScrollView, View, StyleSheet, Text, Image, TouchableOpacity, BackHandler, Alert ,Dimensions } from 'react-native';
import { Button } from 'react-native-paper';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import ImageProgress from 'react-native-image-progress';
import ProgressCircle from 'react-native-progress';
import { LinearGradient } from 'expo-linear-gradient'

//아이콘 불러오기
import HomeIcon1 from '../image/HomeIcon1.png';
import ReadBookBtn from '../image/ReadBookBtn.png';
import MakeBook from '../image/MakeBookBtn.png';
import HomeBackground from '../../assets/icon/HomeBack.png';
import Banner1 from '../../assets/icon/Banner1.png';
import Banner2 from '../../assets/icon/Banner2.png';
import Banner3 from '../../assets/icon/Banner3.png';

import { screenWidth, screenHeight } from '../screenSize';
import Swiper from 'react-native-swiper';
import { Platform } from 'react-native';


export default function HomeScreen({ navigation }) {
    // 알라딘 apiKey
    const aladinApiKey =`ttbjuhak03081945001`;
    // Context에서 로그인한 사용자 정보 가져오기
    const context = useContext(UserDataContext);
    const address = context.userIp; 
    const userId = context.userId;
    const userPw = context.userPw;
    const userName = context.userName;
    const userNick = context.userNick;
    const userBirth = context.userBirth;
    const userProfile = context.userProfile;

    const setUserId = context.setUserId;
    const setUserPw = context.setUserPw;
    const setUserName = context.setUserName;
    const setUserNick = context.setUserNick;
    const setUserBirth = context.setUserBirth;
    const setUserProfile = context.setUserProfile;
    const setIsLoggedIn = context.setIsLoggedIn;
    const setUserMemberShip = context.setUserMembership;
    const setEndMembershipDate = context.setEndMembershipDate;

    const [productList, setProductList] = useState([]);
    const [bestBoardList, setBestBoardList] = useState([]);
    const bannerList = [Banner1,Banner2,Banner3];
    const navi = ['PaymentPage','MyBookList','WebViewScreen'];

    const fetchAladinProductList = async () => {
        try {
            const url = `https://www.aladin.co.kr/ttb/api/ItemList.aspx`;
            const params = {
                TTBKey: aladinApiKey,
                QueryType: 'ItemEditorChoice',
                MaxResults: 5, // 가져올 상품의 최대 개수
                Start: 1, // 시작 인덱스
                CategoryId: 13789,
                Cover: 'Big',
                Output: 'js', // JSON 형식으로 데이터를 요청
                Version: 20131101 // API 버전
            };
            // axios를 이용하여 API 요청
            const response = await axios.get(url, { params });
            // console.log(response.data.item);
            // 응답 데이터에서 상품 리스트 추출
            setProductList(response.data.item);

        } catch (error) {
            console.error('Error fetching Aladin product list:', error);
        }
    };

    const bannerImage = () => {
        return bannerList.map((image,index) => (
            <TouchableOpacity key={index} onPress={() =>navigation.navigate(navi[index])}>
                <View key={index}>
                    <Image source={image}
                        style={styles.banner}
                        resizeMode='stretch'
                    />
                </View>
            </TouchableOpacity>
          
        ))
      }
    const checkMembership = async() => {
        await axios.post(`${address}/server/member/checkMembership`, { id: userId })
        .then((res) => {
            setUserMemberShip(res.data.result.premium);
            setEndMembershipDate(res.data.result.endDate);
        })   
    }

    const fetchBestBoardList = async () => {
        try {
            const response = await axios.post(address + '/server/board/bestBoard', null);

            setBestBoardList(response.data.bestBoard);
        }catch (error) {
            console.error('Error posting best board list:', error);
        }
    }

    // 홈화면에서 뒤로가기 -> 로그아웃* -> 앱 종료
    const logout = async () => {

        return new Promise(resolve => {
            console.log('로그아웃 로직 실행');
            setIsLoggedIn(false);
            setUserId('');
            setUserPw('');
            setUserName('');
            setUserNick('');
            setUserBirth('');
            setUserProfile('');
            console.log('로그아웃 로직 종료');
          resolve();
        });
    };
    
    const noTitleBookDelete = async () => {
            await axios.post(`${address}/server/book/noTitleDelete`,{ id : context.userId})
            .then(()=> {
            }).catch((err)=>{
                console.log('노타이틀 책 삭제중 오류발생',err);
            });
    }

     // 이 페이지가 포커싱될 때마다 함수 실행
     //  => 사용자가 해당 화면으로 돌아올 때마다 데이터를 새로 불러와야 될 경우에 사용
    useFocusEffect(   
        useCallback(() => {
            fetchAladinProductList();
            fetchBestBoardList();
            checkMembership();
            noTitleBookDelete();

            if( userId===null || userId==='') {
                navigation.navigate('SignIn');
            }    

            const onBackPress = () => {
                Alert.alert("앱을 종료하며 로그아웃합니다.", "로그아웃하시겠습니까?", 
                [
                    {
                        text: "아니오",
                        onPress: () => null,
                        style: "cancel",
                    },
                    { 
                        text: "예", 
                        onPress: async () => {
                            await logout();
                            navigation.navigate('SignIn');
                            BackHandler.exitApp();
                            console.log('로그아웃 후 : '+userId+userBirth+userName+userNick+userProfile+userPw);
                          }
                    }
                ]);
                return true;
              };
        
              BackHandler.addEventListener('hardwareBackPress', onBackPress);
        
              return () => {
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
              };

        },[])
    );
    
    // 홈 화면에서 뒤로가기 누르면 로그아웃 되면서 앱 종료      
    useEffect(() => {
        if( userId===null || userId==='') {
            navigation.navigate('SignIn');
        }
      
    }, []);

    const sendCreateBookToServer = async () => {
        try {
            console.log(userId)
            const response = await axios.post(address + '/server/book/create', null, {
                params: {
                    userId: userId,
                    userName: userName,
                }
            });

            // 응답을 성공적으로 받았다면 페이지 이동
            if (response.status === 200) {
                const lastSeqNum = response.data.lastSeqNum.seqNum;
                navigation.navigate('MakeBook', { seqNum: lastSeqNum });
            }
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <View style={styles.container}>
            {/* <Image source={require('../../assets/icon/2.png')} style={{width:'100%', height:'100%'}}/>
            <LinearGradient colors={['rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0.5)','rgba(0,0,0,0.5)']} style={styles.overlay}/> */}
            <ScrollView>
                <View style={styles.firstView}>
                    <View style={{position: 'absolute'}}>
                        <Image source={HomeBackground} style={styles.backImage} resizeMode='stretch'/>
                        <LinearGradient colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.7)','rgba(0,0,0,0.9)']} style={styles.overlay}/>
                    </View>
                
                    <Image style={styles.logo} source={require('../../assets/icon/logo2.png')} resizeMode='cover'/>
                    <View style={styles.swiperController} >
                        {/* 로고 */}
                        <Swiper paginationStyle={{ bottom: '-17%' }} borderRadius={20} height={screenHeight * 150} horizontal={true} autoplay={true} autoplayTimeout={3} loop spaceBetween={20}>
                            {bannerImage()}
                        </Swiper>
                    </View>

                    <View>
                        <Text style={styles.mainText}>아이가 스스로 만드는</Text>
                        <Text style={styles.mainText}>나만의 AI 동화책!</Text>
                        <Text style={styles.subText}>아이들이 AI를 활용하여 동화책을</Text>
                        <Text style={styles.subText}>스스로 만들 수 있습니다.</Text>
                        <Text style={styles.subText}>언어적 능력과 창의력 향상을 위한</Text>
                        <Text style={styles.subText}>AI 동화책 만들기로 아이의 상상력과 창의력을</Text>
                        <Text style={styles.subText}>자유롭게 발휘해보세요.</Text>
                        
                        <TouchableOpacity style={styles.MakeBookBtn} activeOpacity={0.4} onPress={async () => await sendCreateBookToServer()}>
                            <View style={styles.MakeBookBtnView}>
                                <Image source={MakeBook} style={{ width: screenWidth * 20, height: screenHeight * 20, marginRight: '4%'}}/>
                                <Text style={styles.MakeBookTx}>동화책 만들기</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                

                    <View style={styles.headerContainer2}>
                        <Text style={styles.comment}>이번 달 작가왕</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('도서관')}>
                            <Text style={styles.more}>더 보러가기</Text>
                        </TouchableOpacity>
                    </View>
                    {bestBoardList.length > 0 ? (
                        <ScrollView  horizontal={true} style={styles.scrollContainer}>
                            {bestBoardList.map((product, index) => (
                                <TouchableOpacity style={styles.TouchItemView} key={index} onPress={() => navigation.navigate('BookInfo', { product: product })}>
                                    <View style={styles.scrollItemShadow}>
                                    <ImageProgress
                                        indicator={ProgressCircle}
                                        source={{ uri: product.titleImage }}
                                        style={styles.scrollItem2} />
                                        </View>
                                        {/* <LinearGradient colors={['rgba(246, 246, 246, 0)', 'rgba(246, 246, 246, 0.0)','rgba(240,240,240,1)']} style={styles.overlay}/> */}
                                        <Text style={styles.titleText}>{product.title.length > 8 ? product.title.substring(0, 7) + '...' : product.title}</Text>
                                        <Text style={styles.nameText}>{product.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    ) : (
                        <View style={styles.scrollContainer}>
                            <Text style={styles.emptyText}>이번 달 작가왕이 없습니다.</Text>
                        </View>
                    )}
                    <View style={styles.scrollViewContainer2}>
                        <View style={styles.headerContainer3}>
                            <Text style={styles.comment}>추천도서</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('RecommendList')}>
                                <Text style={styles.more}>더 보러가기</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView horizontal={true} style={styles.scrollContainer}>
                            {productList.map((product, index) => (
                                <TouchableOpacity style={styles.TouchItemView} key={index} onPress={() => navigation.navigate('RecommendInfo', { product: product })}>
                                    <View style={styles.scrollItemShadow}>
                                    <ImageProgress
                                        indicator={ProgressCircle}
                                        source={{ uri: product.cover }} 
                                        style={styles.scrollItem2} />
                                        </View>
                                        {/* <LinearGradient colors={['rgba(246, 246, 246, 0)', 'rgba(246, 246, 246, 0.0)','rgba(240,240,240,1)']} style={styles.overlay}/> */}
                                        <Text style={styles.titleText}>{product.title.length > 8 ? product.title.substring(0, 7) + '...' : product.title}</Text>
                                        <Text style={styles.nameText}>{product.author.length > 8 ? product.author.substring(0, 10) + '...' : product.author}</Text>            
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                {/* <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <Image source={HomeIcon1}  style={{ width: 35, height: 37, marginLeft: 8, marginBottom: 10}} />
                    <Text style={styles.textDesign}>오늘은 어떤 것을 할까요??</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button2} activeOpacity={0.4} onPress={async () => await sendCreateBookToServer()}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={MakeBook} style={{ width: 20, height: 20, marginRight: 8 }}/>
                            <Text style={styles.buttonText}>동화책 만들기</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} activeOpacity={0.4} onPress={() => navigation.navigate('게시판')}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image  source={ReadBookBtn} style={{ width: 20, height: 20, marginRight: 8 }} />
                            <Text style={styles.buttonText}>동화책 보기</Text>
                        </View>
                    </TouchableOpacity>
                </View> */}
            </ScrollView>
        </View>

    )

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Platform.OS === 'ios' ? screenHeight * 100 : screenHeight * 63,
    },
    overlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    scrollViewContainer: {
        width: '90%',
        height: Dimensions.get('screen').height * 0.55,
        // marginTop: screenHeight * 10,
        marginLeft: '1.5%',
        zIndex:1,
        backgroundColor: '#fff',
    },
    scrollViewContainer2: {
        backgroundColor: '#fff',
    },
    scrollContainer: {
        marginTop: '2.5%', // 상단 여백을 추가하면 두 개의 스크롤 뷰가 서로 겹치지 않습니다
        height: screenHeight * 240,
        width: Dimensions.get('screen').width * 0.94,
        alignSelf:'center',
        backgroundColor: '#fff'
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        flex: 1,
        alignItems: "flex-end",
        marginBottom: screenHeight * 10,
    },
    button: {
        width: Dimensions.get('screen').width * 0.45,
        height: Dimensions.get('screen').height * 0.08,
        marginRight: screenWidth * 8,
        backgroundColor: "#FF9900",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        elevation: 2,
        shadowColor:'#000',
        shadowOffset:{width:0, height:1.5},
        shadowOpacity:0.25,
        shadowRadius:1.5
    },
    button2: {
        width: Dimensions.get('screen').width * 0.45,
        height: Dimensions.get('screen').height * 0.08,
        marginLeft: screenWidth * 8,
        backgroundColor: "#FDC830",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        elevation: 2,
        shadowColor:'#000',
        shadowOffset:{width:0, height:1.5},
        shadowOpacity:0.25,
        shadowRadius:1.5
    },
    buttonText: {
        fontSize: screenWidth * 14,
        fontFamily: 'soyoBold',
        fontWeight: "400",
        color: "#fff",
    },
    comment: {
        fontFamily: 'soyoBold',
        fontSize: screenWidth * 19,
        // color:'#',
        marginBottom:'2%',
        marginLeft: '5%'
    },
    comment2: {
        fontFamily: 'soyoRegular',
        fontSize: screenWidth * 19,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // 필요하다면 다른 스타일 속성들을 추가하세요
    },
    headerContainer2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '9%',
        backgroundColor: '#fff'
        // 필요하다면 다른 스타일 속성들을 추가하세요
    },
    headerContainer3: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '3%',
        backgroundColor: '#fff'
        // 필요하다면 다른 스타일 속성들을 추가하세요
    },
    more: {
        fontFamily: 'soyoRegular',
        fontSize: screenWidth * 17,
        color: '#1E90FF', // 더보기 텍스트 색상
        bottom:'5%',
        right: '20%'
    },
    scrollItem: {
        // 이미지 아이템에 대한 스타일
        width: screenWidth * 98, // 이미지 너비 설정
        height: screenHeight * 130, // 이미지 높이 설정
        marginRight: screenWidth * 15, // 아이템 사이의 여백
        borderRadius: 5, // 이미지의 모서리를 둥글게
        backgroundColor :'#fff'
    },
    TouchItemView: {
        width: screenWidth * 117, // 이미지 너비 설정
        height: screenHeight * 230, // 이미지 높이 설정
        marginRight: screenWidth * 15
    },
    scrollItemShadow: {
        width: screenWidth * 120, // 이미지 너비 설정
        height: screenHeight * 165, // 이미지 높이 설정
        marginRight: screenWidth * 15, // 아이템 사이의 여백
        borderRadius: 5,
        elevation: 3, 
        shadowColor: '#000',
        shadowOffset: {width:0.1, height:1},
        shadowRadius: 1,
        shadowOpacity: 0.25,
    },
    scrollItem2: {
        // 이미지 아이템에 대한 스타일
        width: screenWidth * 120, // 이미지 너비 설정
        height: screenHeight * 165, // 이미지 높이 설정
        marginRight: screenWidth * 15, // 아이템 사이의 여백
        borderRadius: 5, // 이미지의 모서리를 둥글게
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    textDesign: {
        fontFamily: 'soyoRegular',
        fontSize: 18,
        marginTop: screenHeight * 10,
        marginLeft: screenWidth * 10,
        marginBottom: screenHeight * 15,
        paddingBottom: screenHeight * 5
    },
    emptyText: {
        fontFamily: 'soyoBold',
        fontSize: 20,
        textAlign: 'center',
        marginTop: 70
    },
    titleText: {
        fontFamily: 'soyoBold',
        fontSize: screenHeight * 14,
        marginTop:10,
        marginBottom: 3,
        lineHeight:screenHeight* 20
        // color:"white"
        
    },
    nameText: {
        fontFamily: 'soyoRegular',
        fontSize: 12,
        // color: '#fff'
    },
    image: {
        width: screenWidth * 300,
        height: screenHeight * 100,
        borderRadius: 20,
    },
    backImage: {
        width: Dimensions.get('window').width*1,
        height: Dimensions.get('window').height*0.64
    },
    firstView: {
        width: Dimensions.get('window').width*1,
        height: Dimensions.get('window').height*0.623,
    },
    overlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    logo:{
        top:'10%',
        width: screenWidth * 150,
        height: screenHeight * 42,
        alignSelf:'center',
        marginBottom: '2%',
        // marginTo:30
    },
    swiperController: {
        top:'22%',
        backgroundColor: '#FFF', // 배경색 추가
        alignSelf: 'center',
        width: Platform.OS === 'ios' ? screenWidth * 350 : screenWidth * 360,
        height: Platform.OS === 'ios' ? screenHeight * 95 : screenHeight * 100,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0.5},
        shadowOpacity: 0.25,
        borderRadius: Platform.OS === 'ios' ? 20 : 10,
        shadowRadius: 3.5,
        elevation: 4,
        zIndex:1,
        position: 'absolute',
        overflow:'hidden',
    },
    banner: {
        alignSelf: 'center',
        width:  Platform.OS === 'ios' ? screenWidth * 350 : screenWidth * 360,
        height: Platform.OS === 'ios' ? screenHeight * 95 : screenHeight * 100,
    },
    mainText: {
        fontFamily: 'soyoBold',
        fontSize: screenHeight * 24,
        color:'white',
        left:'5%',
        top: Platform.OS === 'ios' ? '76%' : '81%',
        marginBottom:'2.5%',
    },
    subText: {
        fontFamily: 'soyoRegular',
        color:'white',
        top: Platform.OS === 'ios' ? '80%' : '85%',
        left:'5%',
        marginBottom:'1.2%',
    },
    MakeBookBtn: {
        top: Platform.OS === 'ios'? '88%' : '92%',
        borderRadius: 100,
        backgroundColor: 'transparent', 
        borderWidth: 2,
        borderColor: 'white',
        alignItems:'center',
        width: Platform.OS === 'ios' ? screenWidth * 175 : screenWidth * 160,
        height: Platform.OS === 'ios' ? screenWidth * 65 : screenHeight * 55,
        justifyContent: 'center',
        alignSelf :'center'
    },
    MakeBookBtnView: {
        flexDirection:'row',
        justifyContent: 'center'
    },
    MakeBookTx: {
        fontFamily: 'soyoBold',
        fontSize: screenWidth * 18,
        color:'#fff'
    },
});