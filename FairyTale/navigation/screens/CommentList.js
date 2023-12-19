// CommentList.js
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image, Modal, Alert, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import UserDataContext from '../UserDataContext';

import { screenWidth, screenHeight } from '../screenSize';
import ImageProgress from 'react-native-image-progress';

import defaultProfile from '../../assets/icon/basic-profile.png';
const localImage = require('../../assets/icon/basic-profile.png');
const resolvedImage = Image.resolveAssetSource(localImage);

const CommentList = ({ route, navigation }) => {
    const { comments, boardNum } = route.params;
    const [commentList, setCommentList] = useState(comments);
    const [newComment, setNewComment] = useState('');
    const context = useContext(UserDataContext);
    const address = context.userIp;
    const userProfile = context.userProfile;

    const [profileModal, setProfileModal] = useState(false);
    const [isImageViewVisible, setImageViewVisible] = useState(false);
    let [selectedImage, setSelectedImage] = useState(null);   // 댓글의 프로필 이미지 정보 저장


    // 상대 시간 표현 함수
    const timeAgo = (dateString) => {
        const now = new Date();
        const past = new Date(dateString);
        const diff = now - past;
        const seconds = diff / 1000;
        const minutes = seconds / 60;   
        const hours = minutes / 60;
        const days = hours / 24;
        const weeks = days / 7;
        const months = weeks / 4;
        const years = months / 12;
    
        if (seconds < 60) {
            return '방금 전';
        } else if (minutes < 60) {
            return `${Math.floor(minutes)}분 전`;
        } else if (hours < 24) {
            return `${Math.floor(hours)}시간 전`;
        } else if (days < 7) {
            return `${Math.floor(days)}일 전`;
        } else if (weeks < 4) {
            return `${Math.floor(weeks)}주 전`;
        } else if (months < 12) {
            return `${Math.floor(months)}달 전`;
        } else {
            return `${Math.floor(years)}년 전`;
        }
    };

    // 댓글 삭제 함수
    const handleDelete = (commentId) => {
        const commentData = {
            boardNum: boardNum,
            commentId: commentId,
        };
        axios.post(`${address}/server/comment/deleteComment`, commentData)
        .then(response => {
            // 성공적으로 댓글 추가 후, 댓글 목록 갱신
            console.log("삭제 후 : " + response.data.selectComment);
            setCommentList(response.data.selectComment);
            setNewComment(''); // 입력 필드 초기화
        })
        .catch(error => {
            console.error('댓글 추가 중 오류 발생:', error);
        });
    }
    
    // 댓글 전송 함수
    const sendComment = () => {
        const commentData = {
            boardNum: boardNum,
            commentText: newComment,
            name: context.userName,
            id: context.userId
        };

        axios.post(`${address}/server/comment/addComment`, commentData)
            .then(response => {
                // 성공적으로 댓글 추가 후, 댓글 목록 갱신
                setCommentList(response.data.selectComment);
                setNewComment(''); // 입력 필드 초기화
            })
            .catch(error => {
                console.error('댓글 추가 중 오류 발생:', error);
            });
    };

    let image;
    if (selectedImage === '../../assets/icon/basic-profile.png') {
      image = resolvedImage.uri;
    } if (selectedImage !== '../../assets/icon/basic-profile.png') {
      image = selectedImage;
    }
    
    const images = [{
      url: image,
    }];
    

  const openProfile = () => {
    setProfileModal(true);
    setImageViewVisible(true);
  }
  
  const closeImageView = () => {
    setProfileModal(false);
    setImageViewVisible(false);
  }

    // 닫기 버튼을 렌더링하는 함수
    const renderHeader = (currentIndex) => (
        <View>
          <TouchableOpacity onPress={closeImageView} style={styles.closeImageTouchView}>
            <Image source={require('../../assets/icon/close.png')} style={styles.closeImageIcon} />
          </TouchableOpacity>
        </View>
      );
  
 return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={{flex: 1}}  keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}>
            <View style={{flexDirection: 'column', flex:1, backgroundColor: '#fff'}}>
                <ScrollView>
                <KeyboardAvoidingView contentContainerStyle={styles.container} behavior={Platform.OS === "ios" ? null : null} >
                        <View style={styles.commentContainer}>
                            {commentList && commentList.length > 0 ? (
                                commentList.map((comment, index) => (
                                    <View key={index} style={styles.commentItem}>
                                        <View style={styles.infoView}>
                                            <TouchableOpacity 
                                                onPress={()=>
                                                    {setSelectedImage(comment.profile);
                                                     setProfileModal(true)}}>
                                                <Image source={comment.profile === '../../assets/icon/basic-profile.png' ? defaultProfile : {uri: comment.profile}} style={styles.image} resizeMode="cover" />
                                            </TouchableOpacity>

                                            <Modal
                                                animationType="slide"
                                                transparent={true}
                                                visible={profileModal}
                                                >
                                                <View style={styles.ProfileImageModalBackView}>
                                                <Image source={images === '../../assets/icon/basic-profile.png' ? defaultProfile : images} style={{ width: '100%', height: '50%', alignSelf:'center', backgroundColor:'#fff' }} />
                                                    <TouchableOpacity onPress={closeImageView} style={styles.closeImageTouchView}>
                                                    <Image
                                                        source={require('../../assets/icon/close.png')}
                                                        style={styles.closeImageIcon} />
                                                    </TouchableOpacity>
                                                </View>
                                            </Modal>

                                        {/* <Modal
                                            animationType="slide"
                                            transparent={false}
                                            visible={profileModal}>
                                            <View style={{ flex: 1, backgroundColor: '#000'}}>
                                                <View style={{alignItems: 'flex-end', paddingRight: '5%', paddingTop: Platform.OS === 'ios' ? '15%' : '10%'}}>
                                                    <TouchableOpacity onPress={closeImageView} style={styles.closeImageTouchView}>
                                                        <Image source={require('../../assets/icon/close.png')} style={styles.closeImageIcon} />
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={{flex: 1, justifyContent: 'center'}}>
                                                <Image source={Platform.OS === 'ios' ? images : images[0]} style={{ width: '100%', height: '50%', alignSelf:'center', backgroundColor:'#fff' }} />
                                                </View>
                                            </View>
                                        </Modal> */}

                                            {/* <Modal
                                                animationType="slide"
                                                transparent={true}
                                                visible={profileModal} >
                                                <View style={styles.ProfileImageModalBackView}>
                                                    {isImageViewVisible &&
                                                    <ImageView style={{zIndex:2}} imageUrls={images}  enableSwipeDown={true}  renderHeader={renderHeader} />}
                                                </View>
                                            </Modal> */}

                                            {/* <Modal
                                                animationType="slide"
                                                transparent={false}
                                                visible={profileModal}>
                                                <View style={{ flex: 1, backgroundColor: '#000', flexDirection: 'column', justifyContent:'center'}}>
                                                    
                                                    <TouchableOpacity onPress={closeImageView} style={styles.closeImageTouchView}>
                                                        <Image source={require('../../assets/icon/close.png')} style={styles.closeImageIcon} />
                                                    </TouchableOpacity>
                                                   
                                                    <Image source={Platform.OS === 'ios' ? images : (selectedImage === '../../assets/icon/basic-profile.png' ? defaultProfile : {url:selectedImage}) } style={{ width: '100%', height: '50%', alignSelf:'center', backgroundColor:'#fff' }} />
                                                </View>
                                            </Modal> */}

                                            <Text style={styles.name}>{comment.name}</Text>
                                            <Text style={styles.date}>{timeAgo(comment.date)}</Text>
                                            {comment.name === context.userName && (
                                                <TouchableOpacity onPress={() => handleDelete(comment.commentId)} style={styles.delBtn}  >
                                                    <Text style={styles.delTx}>삭제</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                        <View style={styles.commentView}>
                                            <Text style={styles.commentText}>{comment.commentText}</Text>
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <View style={{ justifyContent: 'center', width: '100%', height: '100%' }}>
                                    <Text style={{fontFamily:'soyoBold',alignSelf:'center',fontSize:screenHeight * 35}}>댓글이 없습니다.</Text>
                                </View>
                            )}
                        </View>
                </KeyboardAvoidingView>
                </ScrollView>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.input} onChangeText={setNewComment} value={newComment} placeholder="댓글을 입력하세요" />
                    <TouchableOpacity style={styles.addBtn} onPress={sendComment} >
                        <Text style={styles.addTx}>댓글 추가</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    commentContainer: {
        flex: 1, // 댓글 목록이 대부분의 공간을 차지
    },
    inputContainer: {
        height: Platform.OS === 'ios' ? screenHeight * 60 : screenHeight * 55,
        width: screenWidth * 411.42857142857144,
        flexDirection: 'row',
        borderTopWidth: 1,
        borderColor: '#e1e1e1', // 구분선 추가
        marginBottom : Platform.OS === 'ios' ? screenHeight * 25 : 0,
    },
    input: {
        fontFamily: 'nanumRegular',
        fontSize: screenWidth * 15,
        width: screenWidth * 310,
        height: screenHeight * 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        marginRight: '2%',
        marginLeft: '3%',
        marginTop: '2%',
        paddingLeft: '3%'
    },
    addBtn: {
        backgroundColor : '#FF9900',
        width: screenWidth * 72,
        height: screenHeight * 35,
        top : '2.5%',
        borderRadius: 10,
        justifyContent: 'center',
        //elevation: 1,
    },
    addTx: {
        fontFamily: 'soyoRegular',
        fontSize : Platform.OS === 'ios' ? screenWidth * 15 : screenWidth * 16,
        color: '#fff',
        textAlign: 'center',
    },
    commentItem: {
        width: '100%',
        flexDirection: 'column',
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#EEEEEE',
    },
    infoView: {
        width: '100%',
        flexDirection: 'row'
    },
    image: {
        width: screenWidth * 35,
        height: screenHeight * 35,
        borderRadius: 35,
        borderColor: '#FFD900',
        borderWidth: 1,
        overflow: 'hidden',
    },
    name: {
        fontFamily: 'nanumBold',
        marginTop: '2%',
        marginLeft: '3%'
    },
    date: {
        fontFamily: 'nanumRegular',
        flex: 1,
        marginTop: '2%',
        marginLeft: '3%'
    },
    commentView: {
        width: '98%',
        marginTop: '3%',
        alignSelf: 'center'
    },
    commentText: {
        fontFamily: 'nanumRegular',
    },
    delBtn: {
        backgroundColor: 'tomato',
        width: screenWidth * 40,
        height: screenHeight * 25,
        borderRadius: 10,
        // elevation: 2,
    },
    delTx: {
        fontFamily: 'soyoRegular',
        color: '#fff',
        textAlign: 'center',
        marginTop: Platform.OS === 'ios' ? screenHeight * 3 : screenHeight * 5,
        fontSize: screenWidth * 14
    },
    ProfileImageModalBackView: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#000',
      },
  ProfileImageModal:{
    backgroundColor: '#fff',
    alignItems: 'center',
    width: '100%',
    height: '50%'
  },
  closeImageTouchView: {
    alignSelf: 'flex-end',
    position:'absolute', 
    width: Platform.OS === 'ios' ? screenWidth *33 : screenWidth*30, 
    height: Platform.OS === 'ios' ? screenWidth *33 : screenHeight*30, 
    position: 'absolute',
    top: Platform.OS === 'ios' ? '7%' : '5%',
    right: '5%',
  },
  closeImageIcon: {
    alignSelf: 'flex-end', 
    width: Platform.OS === 'ios' ? screenWidth *33 : screenWidth*30, 
    height: Platform.OS === 'ios' ? screenWidth *33 : screenHeight*30, 
  }
});

export default CommentList;
