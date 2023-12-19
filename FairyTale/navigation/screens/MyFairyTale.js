import React, { useState, useContext, useCallback } from "react";
import { View, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import UserDataContext from "../UserDataContext";
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import ImageProgress from "react-native-image-progress";
import ProgressCircle from "react-native-progress";

import { screenWidth, screenHeight } from "../screenSize";

export default function MyFairyTale({ navigation }) {
    const context = useContext(UserDataContext);
    const address = context.userIp;
    const userId = context.userId;
    const [bookList, setBookList] = useState([]);
    
    // 컬럼 수와 이미지 크기 계산
    const numColumns = 3;
    const widthsize = screenWidth * 411.42857142857144 / numColumns;

    // 동화 보기 버튼 클릭 시 실행될 함수
    const handleViewStory = (item) => {
        axios.post(`${address}/server/book/viewBook`, { 
            seqNum: item.seqNum,
            id: userId
        })
        .then(response => {
            // CommentList.js 페이지로 네비게이션하면서 데이터 전달
            const viewBook = response.data.viewBook;
            if(viewBook.userPageNum != 0){
                Alert.alert(
                    "처음이 아니네요",
                    "이어서 볼까요?",
                    [
                        {
                            text: "아니요",
                            onPress: () => console.log("이어서 보기 취소됨"), // 버튼을 눌렀을 때 수행할 동작
                            style: "cancel"
                        },
                        { 
                            text: "예",
                            onPress: () => {
                                navigation.navigate('ViewBook', { viewInfo: viewBook, userPageNum: viewBook.userPageNum });
                            }
                        },
                        {
                            text: "처음부터",
                            onPress: () => {
                                navigation.navigate('ViewBook', { viewInfo: viewBook, userPageNum: 0 });
                            }
                        }
                    ],
                    { cancelable: false } // 백그라운드 탭으로 닫을 수 없게 설정
                );
            } else {
                navigation.navigate('ViewBook', { viewInfo: viewBook, userPageNum: 0 });
            }
        })
        .catch(error => {
            console.error("동화 조회 중 오류 발생:", error);
        });
    };

    const onLongPressBook = async (item) => {
        await axios.post(address + '/server/board/selectBoard', { seqNum: item.seqNum })
        .then((response) => {
            if (response.data.selectBoard) {
                Alert.alert(
                    "게시물 확인",
                    "해당 동화책은 게시물에 등록되어 있는 상태입니다. 삭제하시겠습니까?",
                    [
                        {
                            text: "취소",
                            onPress: () => console.log("취소됨"),
                            style: "cancel"
                        },
                        {
                            text: "삭제",
                            onPress: () => {
                                axios.post(address + '/server/book/deleteBoard', { boardNum: response.data.selectBoard.boardNum})
                                .then((response) => {
                                    getMyFairyTale();
                                    showBookOptions(item);
                                })
                                .catch((error) => {
                                    console.log("error : " + error);
                                })
                            }
                        }
                    ],
                    { cancelable: true }
                );
            } else {
                showBookOptions(item);
            }
            
        })
        .catch((error) => {
            console.error("error : " + error);
        })
    };

    const showBookOptions = (item) => {
        Alert.alert(
            "동화 선택",
            "이 동화를 어떻게 하시겠습니까?",
            [
                {
                    text: "취소",
                    onPress: () => console.log("취소됨"),
                    style: "cancel"
                },
                {
                    text: "삭제",
                    onPress: () => {
                        axios.post(address + '/server/book/deleteBook', { seqNum: item.seqNum})
                        .then((response) => {
                            getMyFairyTale();
                        })
                        .catch((error) => {
                            console.log("error : " + error);
                        })
                    }
                },
                {
                    text: "보기",
                    onPress: () => handleViewStory(item)
                }
            ],
            { cancelable: true }
        );
    }

    const getMyFairyTale = async () => {
        try {
            await axios.post(address + '/server/book/myFairyTale', {
                id: userId
            })
            .then((response) => {
                setBookList(response.data.myFairyTale);
            })
            .catch((error) => {
                console.error(error);
            })
        } catch (error) {
            console.error(error);
        }
    }

    useFocusEffect(
        useCallback(() => {
            getMyFairyTale();
        },[])
    );
    
    // FlatList의 renderItem 함수
    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => {handleViewStory(item)}}
            onLongPress={() => onLongPressBook(item)}
        >
             <View style={{ 
                width: widthsize, 
                height: screenHeight * 210,
                padding: '4%',
                backgroundColor: '#fff', 
                elevation: 5,
                shadowColor: '#000', 
                shadowOffset: {width: 0, height: 0.5}, 
                shadowOpacity: 0.25, 
                shadowRadius: 1, 
            }}>
                <ImageProgress
                indicator={ProgressCircle}
                source={{ uri: item.titleImage }}
                resizeMode="cover"
                style={{ 
                    width: widthsize-10, 
                    height: screenHeight * 200,
                    borderRadius: 5, 
                    overflow: 'hidden'
                }}
                />
            </View>
        </TouchableOpacity>
    );

    return (
        <FlatList
            style={{backgroundColor:'#fff',flex:1, marginBottom: screenHeight * 65}}
            data={bookList}
            renderItem={renderItem}
            keyExtractor={(item, index) => String(index)}
            numColumns={numColumns} // 한 줄에 표시할 컬럼 수 지정
            horizontal={false} // 수평 스크롤 비활성화
        />
      );
}

// const styles = StyleSheet.create({
    
// });