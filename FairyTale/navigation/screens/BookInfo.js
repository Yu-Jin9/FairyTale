import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, StyleSheet, Image, Button, Alert, TouchableOpacity, Dimensions, Platform } from 'react-native';
import axios from 'axios';
import UserDataContext from '../UserDataContext';
import ImageProgress from 'react-native-image-progress';
import ProgressCircle from 'react-native-progress';
import { useFocusEffect } from '@react-navigation/native';

//불러올 아이콘
import DeleteIcon from '../image/DeleteIcon.png'
import LikeIcon from '../image/LikeIcon.png';
import CommentIcon from '../image/CommentIcon.png';
import ViewBook from '../image/ViewFairyTale.png';

import { screenWidth, screenHeight } from '../screenSize';
import { ScrollView } from 'react-native-gesture-handler';

const BookInfo = ({ route, navigation }) => {
    const { product } = route.params;
    const context = useContext(UserDataContext);
    const address = context.userIp;
    const userId = context.userId;
    const boardNum = product.boardNum;
    const seqNum = product.seqNum;

    const [likes, setLikes] = useState(0);
    const [nick, setNick] = useState("");
    const [date, setDate] = useState("");
    const [title, setTitle] = useState("");
    const [titleImage, setTitleImage] = useState("");
    const [viewCnt, setViewCnt] = useState(0);
    const [commentCnt, setCommentCnt] = useState(0);
    const [summary, setSummary] = useState("");
    const [id, setId] = useState('');

    const [likeImage, setLikeImage] = useState(require('../../assets/icon/nonlike_book.png'));
    const [userLikeState, setUserLikeState] = useState(0);
    
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            refreshBoardDetails();
        });
    
        return unsubscribe; // 컴포넌트 언마운트 시 리스너 제거
    }, [navigation]);

    useFocusEffect(   // 이 페이지가 포커싱될 때마다 사용자의 좋아요 상태 불러옴
        useCallback(() => {
            checkUserLikeState();
        }, [])
    );

    const refreshBoardDetails = () => {
        axios.post(`${address}/server/board/selectBoard`, { seqNum: seqNum }, )
        .then(response => {
            const bookInfo = response.data.selectBoard;
            setLikes(bookInfo.like);
            setNick(bookInfo.name);
            setDate(bookInfo.date.split(' ')[0]);
            setTitle(bookInfo.title);
            setTitleImage(bookInfo.titleImage);
            setViewCnt(bookInfo.viewCnt);
            setCommentCnt(bookInfo.commentCnt);
            setSummary(bookInfo.summary);
            setId(bookInfo.id);
            
        })
        .catch(error => {
            console.error("error", error);
        })
    };

    // 게시물 페이지가 로드될 때마다 조회수 증가 요청 보내기
    useEffect(() => {
        axios.post(`${address}/server/board/boardView`, null, {
            params: {
                boardNum: boardNum
            }
        })
        .then(response => {
            console.log("조회수가 업데이트 되었습니다.");
        })
        .catch(error => {
            console.error("조회수 업데이트 중 오류 발생:", error);
        });
    }, []);

    // 좋아요 버튼 클릭 시 실행될 함수
    const handleLike = () => {
        axios.post(`${address}/server/board/boardLike`, null, {
            params: {
                userId: userId,
                boardNum: boardNum
            }
        })
        .then(response => {
            console.log("좋아요 상태가 업데이트 되었습니다.");
            setLikes(response.data.like);
            checkUserLikeState();
        })
        .catch(error => {
            console.error("네트워크 오류:", error);
        });
    };

    // 댓글 버튼 클릭 시 실행될 함수
    const handleComment = () => {
        axios.post(`${address}/server/comment/selectComment`, { boardNum: boardNum })
        .then(response => {
            // CommentList.js 페이지로 네비게이션하면서 데이터 전달
            navigation.navigate('CommentList', {
                comments: response.data.selectComment,
                boardNum: boardNum
            });
        })
        .catch(error => {
            console.error("댓글 조회 중 오류 발생:", error);
        });
    };

    // 동화 보기 버튼 클릭 시 실행될 함수
    const handleViewStory = () => {
        axios.post(`${address}/server/book/viewBook`, { 
            seqNum: seqNum,
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

    const handleBoardDelete = () => {
        Alert.alert(
            "게시물 삭제",
            "해당 게시물을 삭제하시겠습니까?",
            [
                {
                    text: "아니요",
                    onPress: () => console.log("이어서 보기 취소됨"), // 버튼을 눌렀을 때 수행할 동작
                    style: "cancel"
                },
                { 
                    text: "예",
                    onPress: () => {
                        axios.post(address + '/server/board/deleteBoard', { boardNum : boardNum })
                        .then((response) => {
                            navigation.goBack();  
                        })
                        .catch((error) => {
                            console.error("error : " + error);
                        })
                    }
                },
            ],
            { cancelable: false } // 백그라운드 탭으로 닫을 수 없게 설정
        );
    }

    // 헤당 게시물에 대한 사용자의 좋아요 상태 확인하는 함수
    const checkUserLikeState = () => {
        axios.post(`${address}/server/board/checkUserLikeState`, null, {
            params: {
                userId: userId,
                boardNum: boardNum
            }
        })
        .then(response => {
            console.log("사용자의 좋아요 상태입니다. : " + response.data.like);
            setUserLikeState(response.data.like);

            if(response.data.like === 0) {
                setLikeImage(require('../../assets/icon/nonlike_book.png'));
            } else {
                setLikeImage(require('../../assets/icon/like_book.png'));
            }

        })
        .catch(error => {
            console.error("네트워크 오류:", error);
        });
    };

    // id 일치하면 게시물 삭제 버튼 생성
    React.useLayoutEffect(() => {
        // id와 userId가 일치할 때만 버튼을 보이게 함
        if (id === userId) {
            navigation.setOptions({
                headerRight: () => ( 
                    <TouchableOpacity onPress={handleBoardDelete}>
                    <Image
                        source={DeleteIcon} // 이미지 경로 설정
                        style={{ width: screenWidth * 30, height: screenHeight * 30, marginRight: screenWidth * 15}} // 이미지의 가로, 세로 크기 설정
                    />
                    </TouchableOpacity>
                ),
            });
        } else {
            navigation.setOptions({
                headerRight: () => null, // id와 userId가 일치하지 않을 경우, 버튼을 보이지 않게 함
            });
        }
    }, [navigation, id, userId]); // 의존성 배열에 id와 userId 추가
  
    return (
        <View style={styles.container}> 
        <ScrollView>
            {/* {titleImage ? (
                <Image
                    source={{ uri: titleImage }}
                    style={styles.image}
                />
            ) : (
                // titleImage가 비어 있을 경우 대체 텍스트 또는 이미지 표시
                <Text>No image available</Text>
            )} */}
            <View>
                <ImageProgress
                    source={titleImage ? { uri: titleImage } : null}
                    indicator={ProgressCircle} // 로딩 인디케이터 스타일 지정
                    indicatorProps={{
                        size: 40,
                        borderWidth: 0,
                        color: '#999', // 로딩 인디케이터 색상 지정
                        unfilledColor: '#FFFFFF', // 로딩 인디케이터 내부 배경 색상 지정
                    }}
                    resizeMode="cover"
                    style={styles.image}
                    >
                    {/* titleImage가 비어 있을 경우 대체 텍스트 또는 이미지 표시 */}
                    {titleImage ? (
                        <Image source={{ uri: titleImage }} style={styles.image} />
                    ) : (
                        <Text>No image available</Text>
                    )}
                </ImageProgress>
            </View>

            <View >
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.nick}>{nick}</Text>
                <Text style={styles.date}>{date}</Text>
            </View>
            
            <View style={styles.viewContainer}>
                <Text style={styles.infoTx}>조회수 {viewCnt}</Text>
                <Text style={styles.infoTx}>/ 좋아요 {likes}</Text>
                <Text style={styles.infoTx}>/ 댓글 {commentCnt}</Text>
            </View>

            <View style={styles.summaryView}>
                <Text style={styles.summary}>{summary}</Text>
            </View>

            </ScrollView>
            
            <View style={styles.ratingContainer}>
                <View style={styles.buttonView}> 
                    <TouchableOpacity onPress={handleLike}>
                        <Image source={likeImage} style={styles.imageButton} />
                        <Text style={styles.textItem}>좋아요</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonView}>
                    <TouchableOpacity onPress={handleComment}>
                        <Image source={require('../../assets/icon/commend_book.png')}  style={styles.imageButtonmid} />
                        <Text style={styles.textItem}>댓글 보기</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonView}>
                    <TouchableOpacity onPress={handleViewStory}>
                        <Image source={require('../../assets/icon/play_book.png')} style={styles.imageButtonlast} />
                        <Text style={styles.textItem}>동화책 보기</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

// 스타일 정의
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff', 
        flexDirection: 'column',
        width: '100%',
        height: '100%'
    },
    image: {
        width: '100%', // 이미지 너비를 컨테이너에 맞춤
        height: screenHeight * 400, // 이미지 높이를 고정값으로 설정
        resizeMode: 'cover', // 이미지가 비율을 유지하면서 컨테이너에 맞게 조정됩니다.
    },
    buttonView: {
        backgroundColor: '#fff',
        borderRightColor: '#EDECE4',
        borderBottomColor: '#EDECE4',
        borderLeftColor: 'rgba(255,255,255,1)',
        borderTopColor: 'rgba(255,255,255,1)',
        borderWidth: 1,
        borderRadius: 15,
        elevation: 0.5,
        width: screenWidth * 80,
        height: screenHeight * 65,
        alignItems: 'center',
        flexDirection: 'column',
        paddingVertical: '2%',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 0.5},
        shadowOpacity: 0.25,
        shadowRadius: 1
   },
    imageButton: {
        width: screenWidth * 30,
        height: screenHeight * 30,
        marginHorizontal: 15,
        alignItems: 'center',
    },
    imageButtonmid: {
        width: screenWidth * 27,
        height: screenHeight * 27,
        marginHorizontal: 15,
        alignItems: 'center',
        marginVertical: '2%'
    },
    imageButtonlast: {
        width: screenWidth * 30,
        height: screenHeight * 30,
        alignSelf: 'center'
    },
    textItem: {
        fontFamily : 'soyoRegular',
        color: '#FF9900',
        textAlign: 'center',
        marginTop : screenHeight * 4,
        fontSize : Platform.OS === 'ios' ? screenWidth * 14 :  screenWidth * 15
    },  
    title: {
        fontFamily : 'nanumBold',
        fontSize: screenWidth * 29,
        marginTop: screenHeight * 30,
        marginBottom: screenHeight * 20,
        textAlign: 'center',
    },
    nick: {
        fontFamily : 'nanumRegular',
        fontSize: screenWidth * 16,
        color: '#666',
        marginBottom: screenHeight * 10,
        marginRight: '5%',
        alignItems: 'center',
        textAlign: 'right'
    },
    date: {
        fontFamily : 'nanumRegular',
        fontSize: screenWidth * 16,
        color: '#666',
        marginBottom: screenHeight * 15,
        marginRight: '5%',
        alignItems: 'center',
        textAlign: 'right'
    },
    viewContainer: {
        // 조회수 등을 표시하는 컨테이너의 스타일
        dispaly: 'flex',
        flexDirection: 'row',
        marginTop: screenHeight * 3,
        marginBottom: screenHeight * 15,
        marginLeft: '5%'
    },
    infoTx: {
        fontFamily : 'soyoRegular',
        fontSize: screenWidth * 17,
        marginRight: '2%'
    },
    ratingContainer: {
        // 하단 버튼 컨테이너
        width: '100%',
        height: Platform.OS === 'ios' ? screenHeight * 48 : screenHeight * 33,
        flexDirection: 'row',
        marginBottom: Platform.OS === 'ios' ? '7%' : '2.5%',
        marginTop : 22,
        paddingLeft: '7%',
        paddingRight: '7%',
        alignItems:'flex-end',
        justifyContent: 'space-between'
    },
    summaryView: {
        width: screenWidth * 370,
        alignSelf: 'center',
        marginBottom: '2.5%',
        marginTop: '2.5%'
    },
    summary: {
        fontFamily : 'soyoRegular',
        fontSize: screenWidth * 18,
        color: '#333',
        lineHeight: screenHeight * 24, // 줄 간격
        textAlign: 'justify'
    },
    
});

export default BookInfo;