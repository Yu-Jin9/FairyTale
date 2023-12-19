import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Button, Alert, Dimensions, Modal, TouchableOpacity  } from 'react-native';
import UserDataContext from '../UserDataContext';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import querystring from 'querystring';
import { Audio } from 'expo-av';
import FlipPage from 'react-native-flip-page';
import { FlipPagePage } from 'react-native-flip-page';
import ImageProgress from 'react-native-image-progress';
import { encode as btoa } from 'base-64';
import { RadioButton } from 'react-native-paper';
import { screenWidth, screenHeight } from '../screenSize';


export default function ViewBook({ route, navigation }) {
    const { viewInfo, userPageNum } = route.params;
    let [currentPageData, setCurrentPageData] = useState({});
    const [currentPageNum, setCurrentPageNum] = useState(userPageNum); // 현재 페이지 번호
    const [soundModal, setSoundModal] = useState(false);
    const [voicename, setVoiceName] = useState("ngaram");
    const [tempVoiceName, setTempVoiceName] = useState(voicename || '');
    const [Summary, setSummary] = useState(viewInfo.summary);
    const [Title, setTitle] = useState(viewInfo.title);
    const [Name, setName] = useState(viewInfo.name);
    let [PageText, setPageText] = useState([]);
    const [isKorean, setIsKorean] = useState(true);
    let [soundplay, setSoundPlay] = useState(false);
    const [textToSpeak, setTextToSpeak] = useState('');
    const currentDate = new Date();

    const context = useContext(UserDataContext);
    const address = context.userIp;
    const OpenSoundModal = () => {
        setSoundModal(true);
    }
    const CloseSoundModal = () => {
        setSoundModal(false);
    }
    const handleLanguageChange = (value) => {
        setIsKorean(value === 'true');
    };

    const updatePageNumInServer = (pageNum) => {
        axios.post(`${address}/server/book/updateRecently`, {
            id: context.userId,
            seqNum: viewInfo.seqNum,
            pageNum: pageNum
        })
            .then(response => {
                console.log("페이지 번호가 업데이트되었습니다:", pageNum);
            })
            .catch(error => {
                console.error("페이지 번호 업데이트 오류:", error);
            });
    };

    const handleNextPage = (index) => {
        if (index <= viewInfo.pageNum + 1) {
            setCurrentPageNum(index);
            updatePageNumInServer(index);
        }
    };

    const lastPage = () => {
        if(currentPageNum > 0){
            Alert.alert(
                "마지막 페이지",
                "종료하시겠습니까?",
                [
                    {
                        text: "아니오",
                        onPress: () => console.log("취소됨"),
                        style: "cancel"
                    },
                    {
                        text: "예",
                        onPress: () => {
                            updatePageNumInServer(currentPageNum);
                            navigation.goBack();
                        }
                    }
                ],
                { cancelable: false }
            );
        }
    }

    useEffect(() => {
        // 첫 페이지가 아니라면 페이지 데이터를 가져옴
        if (currentPageNum > 0) {
            axios.post(`${address}/server/book/pageData`, { seqNum: viewInfo.seqNum, pageNum: currentPageNum })
                .then(response => {
                    setCurrentPageData(response.data.pageData);

                    // setPageText(response.data.pageData.text);


                })
                .catch(error => {
                    console.error("페이지 데이터 조회 오류:", error);
                });
        }

    }, [currentPageNum, viewInfo.seqNum]);

    useEffect(() => {
        updatePageNumInServer();
    }, [])
    useEffect(() => {
        if (isKorean != true && PageText[currentPageNum - 1] == null) {
            PapagoApi();
        }

    }, [currentPageData])


    const handlePreViewText = () => {
        PreviewVoice();
    }


    useEffect(() => {
        const speakText = async () => {
            if (!soundplay) {
                setSoundPlay(true);
                if (!isKorean) {
                    setTextToSpeak(PageText[currentPageNum - 1]);
                } else {
                    setTextToSpeak(currentPageData.text);
                }
                const naverClientId = 'tvjsdpi7e1';
                const naverClientSecret = 'O2lBRlWLuCTy95jVUF8PAFBdal6OxJlSvDiSTEwa';
                if (Platform.OS === "ios") {
                    await Audio.setAudioModeAsync({
                        playsInSilentModeIOS: true,
                    });
                }
                try {
                    const response = await axios.post(
                        'https://naveropenapi.apigw.ntruss.com/tts-premium/v1/tts',
                        querystring.stringify({
                            speaker: voicename,
                            volume: '1',
                            speed: '0',
                            text: textToSpeak,
                        }),
                        {
                            responseType: 'arraybuffer',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'X-NCP-APIGW-API-KEY-ID': naverClientId,
                                'X-NCP-APIGW-API-KEY': naverClientSecret,
                            },
                        },
                    );

                    // ArrayBuffer를 Base64 문자열로 변환
                    const base64data = btoa(
                        new Uint8Array(response.data).reduce(
                            (data, byte) => data + String.fromCharCode(byte),
                            '',
                        ),
                    );

                    // Base64 문자열을 파일로 저장
                    const uri = FileSystem.documentDirectory + 'tempAudio.mp3';
                    await FileSystem.writeAsStringAsync(uri, base64data, {
                        encoding: FileSystem.EncodingType.Base64,
                    });

                    // 오디오 재생
                    // 오디오 재생
                    const { sound } = await Audio.Sound.createAsync(
                        { uri },
                        { shouldPlay: true },
                    );

                    sound.setOnPlaybackStatusUpdate(playbackStatus => {
                        if (playbackStatus.didJustFinish) {
                            // 재생이 완료되면 soundplay 상태를 false로 설정
                            setSoundPlay(false);
                        }
                    });
                    sound.playAsync(); // 오디오 재생 시작

                } catch (error) {
                    console.log("dpfjdpfjdpfj");
                    console.error('Error:', error.response ? error.response.data : error.message);
                    setSoundPlay(false);
                }
            }
        };
        const handleReadText = () => {
            if (!soundplay) {
                speakText(); // speaktext 함수 호출
                console.log(currentPageNum);
                console.log(voicename);
            }
        }

        navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        onPress={handleReadText}
                        style={styles.readBtn}
                    >
                        <Text style={styles.readTx} >동화 재생</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={OpenSoundModal}
                        style={styles.readBtn2}
                    >
                        <Text style={styles.readTx} >목소리 선택</Text>
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [voicename, currentPageNum, soundplay, currentPageData, PageText]);
    const PreviewVoice = async () => {
        if (!soundplay) {
            setSoundPlay(true);
            // if (isKorean != true) {
            //     textToSpeak = PageText[currentPageNum - 1]
            // } else {
            //     textToSpeak = currentPageData.text;
            // }
            let previewText = "제 목소리 미리 들어보세요";
            if (isKorean != true) {
                previewText = "Listen to my voice in advance";

            }
            const naverClientId = 'tvjsdpi7e1';
            const naverClientSecret = 'O2lBRlWLuCTy95jVUF8PAFBdal6OxJlSvDiSTEwa';
            if (Platform.OS === "ios") {
                await Audio.setAudioModeAsync({
                    playsInSilentModeIOS: true,
                });
            }
            try {
                const response = await axios.post(
                    'https://naveropenapi.apigw.ntruss.com/tts-premium/v1/tts',
                    querystring.stringify({
                        speaker: tempVoiceName,
                        volume: '1',
                        speed: '0',
                        text: previewText,
                    }),
                    {
                        responseType: 'arraybuffer',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'X-NCP-APIGW-API-KEY-ID': naverClientId,
                            'X-NCP-APIGW-API-KEY': naverClientSecret,
                        },
                    },
                );

                // ArrayBuffer를 Base64 문자열로 변환
                const base64data = btoa(
                    new Uint8Array(response.data).reduce(
                        (data, byte) => data + String.fromCharCode(byte),
                        '',
                    ),
                );

                // Base64 문자열을 파일로 저장
                const uri = FileSystem.documentDirectory + 'tempAudio.mp3';
                await FileSystem.writeAsStringAsync(uri, base64data, {
                    encoding: FileSystem.EncodingType.Base64,
                });

                // 오디오 재생
                // 오디오 재생
                const { sound } = await Audio.Sound.createAsync(
                    { uri },
                    { shouldPlay: true },
                );

                sound.setOnPlaybackStatusUpdate(playbackStatus => {
                    if (playbackStatus.didJustFinish) {
                        // 재생이 완료되면 soundplay 상태를 false로 설정
                        setSoundPlay(false);
                    }
                });
                sound.playAsync(); // 오디오 재생 시작

            } catch (error) {
                console.log("dpfjdpfjdpfj");
                console.error('Error:', error.response ? error.response.data : error.message);
                setSoundPlay(false);
            }
        }
    };
    const PapagoApi = () => {
        const client_id = '2ERDDKtfYmHt1E0o6T_D';
        const client_secret = 'dFxmqjuJwX';
        const api_url = 'https://openapi.naver.com/v1/papago/n2mt';
        axios
            .post(
                api_url,
                {
                    source: 'ko', target: 'en', text: Title
                },
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-Naver-Client-Id': client_id,
                        'X-Naver-Client-Secret': client_secret,
                    },
                }
            )
            .then((response) => {
                // 번역된 결과 처리
                console.log('번역 결과:', response.data.message.result.translatedText);
                setTitle(response.data.message.result.translatedText);
            })
            .catch((error) => {
                console.error('번역 오류:', error);
            });
        if (currentPageNum >= 1) {
            console.log(currentPageData.text);
            axios.post(
                api_url,
                { source: 'ko', target: 'en', text: currentPageData.text },
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-Naver-Client-Id': client_id,
                        'X-Naver-Client-Secret': client_secret,
                    },
                }
            )
                .then((response) => {
                    // 번역된 결과 처리
                    //console.log('번역 결과:', response.data.message.result.translatedText);
                    setPageText(prevPageText => [...prevPageText, response.data.message.result.translatedText]);
                    //console.log(PageText[currentPageNum]);
                })
                .catch((error) => {
                    console.error('번역 오류:', error);
                    // PapagoApi();
                });
        }
    };







    return (
        <View style={styles.container}>
            <FlipPage
                onPageChange={(index, direction) => {
                    console.log(index);
                    handleNextPage(index);

                }}
                // loopForever ={false}
                onFinish={lastPage}
            >
                {Array.from({ length: viewInfo.pageNum + 1 }, (_, index) => (
                    <FlipPagePage key={index}>
                        {index === 0 && (
                            <View>
                                <ImageProgress
                                    source={{ uri: viewInfo.titleImage }}
                                    style={styles.image} />
                                {isKorean ? (
                                    <View>
                                        <Text style={styles.title}>{viewInfo.title}</Text>
                                        <Text style={styles.name}>{viewInfo.name}</Text>
                                    </View>
                                ) : (
                                    <View>
                                        <Text style={styles.title}>{Title}</Text>
                                        <Text style={styles.name}>{Name}</Text>
                                    </View>
                                )}
                            </View>

                        )}
                        {index > 0 && currentPageData.text && (
                            <View>
                                <ImageProgress
                                    source={{ uri: currentPageData.image }}
                                    style={styles.pageImage} />
                                {isKorean ? (
                                    <View style={{width: '96%', marginHorizontal:'3%'}}>
                                        <Text style={styles.story} >{currentPageData.text}</Text>
                                    </View>
                                ) : (
                                    <View style={{width: '96%', marginHorizontal:'3%'}}>
                                        <Text style={styles.story} >{PageText[currentPageNum - 1]}</Text>
                                    </View>
                                )}
                            </View>
                        )}
                    </FlipPagePage>
                ))}
            </FlipPage>


            {/* 여기에 모달 추가 */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={soundModal}
            >
                <View style={styles.centeredView}>
                    <View style={styles.soundModal}>
                        <RadioButton.Group onValueChange={handleLanguageChange} value={isKorean.toString()}>
                            <View style={styles.radioButtonRow}>
                                <View style={styles.radioButton}>
                                    <Text style={styles.menuTx}>한국어</Text>
                                    <View style={styles.radioButtonContainer3}>
                                        <RadioButton value="true"/>
                                    </View>
                                </View>
                                <View style={styles.radioButton}>
                                    <Text style={styles.menuTx}>영어</Text>
                                    <View  style={styles.radioButtonContainer3}>
                                        <RadioButton value="false"/>
                                    </View>
                                </View>
                            </View>
                        </RadioButton.Group>
                        <RadioButton.Group onValueChange={newValue => setTempVoiceName(newValue)} value={tempVoiceName}>
                            {isKorean ? (
                                <View>
                                    <View style={styles.radioButtonRow}>

                                        <View style={styles.radioButton}>
                                            <Text style={styles.menuTx}>가람</Text>
                                            <View  style={styles.radioButtonContainer3}>
                                                <RadioButton  value="ngaram" />
                                            </View>
                                        </View>
                                        <View style={styles.radioButton}>
                                            <Text style={styles.menuTx}>샤샤</Text>
                                            <View  style={styles.radioButtonContainer3}>
                                                <RadioButton value="nshasha" />
                                            </View>
                                        </View>
                                        <View style={styles.radioButton}>
                                            <Text style={styles.menuTx}>마녀 사비나</Text>
                                            <View style={styles.radioButtonContainer3}>
                                                <RadioButton value="nsabina" />
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.radioButtonRow}>
                                        <View style={styles.radioButton}>
                                            <Text style={styles.menuTx}>멍멍이</Text>
                                            <View style={styles.radioButtonContainer3}>
                                                <RadioButton value="nwoof" />
                                            </View>
                                        </View>
                                        <View style={styles.radioButton}>
                                            <Text style={styles.menuTx}>하준</Text>
                                            <View style={styles.radioButtonContainer3}>
                                                <RadioButton value="nhajun" />
                                            </View>
                                        </View>
                                        <View style={styles.radioButton}>
                                            <Text style={styles.menuTx}>악마 마몬</Text>
                                            <View style={styles.radioButtonContainer3}>
                                                <RadioButton value="nmammon" />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            ) : (
                                <View>
                                    <View style={styles.radioButtonRow}>

                                        <View style={styles.radioButton}>
                                            <Text style={styles.menuTx}>클라라</Text>
                                            <View style={styles.radioButtonContainer3}>
                                                <RadioButton  value="clara" />
                                            </View>
                                        </View>
                                        <View style={styles.radioButton}>
                                            <Text style={styles.menuTx}>매트</Text>
                                            <View style={styles.radioButtonContainer3}>
                                                <RadioButton value="matt" />
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.radioButtonRow}>
                                        <View style={styles.radioButton}>
                                            <Text style={styles.menuTx}>안나</Text>
                                            <View style={styles.radioButtonContainer3}>
                                                <RadioButton value="danna" />
                                            </View>
                                        </View>
                                        <View style={styles.radioButton}>
                                            <Text style={styles.menuTx}>조이</Text>
                                            <View style={styles.radioButtonContainer3}>
                                                <RadioButton value="djoey" />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )}
                        </RadioButton.Group>
                        <View  style={{alignItems:'center', marginBottom: '2%', marginTop: '2%', width:screenWidth * 230, height: screenHeight*50}}>
                                <TouchableOpacity style={{width:'100%', height: '100%', alignItems:'center'}} onPress={handlePreViewText}>
                                    <Text style={styles.menuTx}>목소리 미리 들어보기</Text>
                                </TouchableOpacity>
                            </View>
                            
                            <View style={{flexDirection:'row-reverse', justifyContent:'space-between', width:screenWidth * 230, height: screenHeight*50}}>
                                <View style={{width:screenWidth *115, height: screenHeight*50}}>
                                <TouchableOpacity
                                    style={{ width:screenWidth *115, height: screenHeight*50, alignItems:'center'}}
                                        onPress={() => {
                                            if (context.userMembership === 'true' && currentDate <= new Date(context.endMembershipDate)) {
                                                setVoiceName(tempVoiceName);
                                                if (isKorean != true) {
                                                    PapagoApi();
                                                }
                                                CloseSoundModal();
                                            } else {
                                                Alert.alert(
                                                    '유료회원 전용 기능입니다.',
                                                    '유료회원이 아닙니다.\n 결제 페이지로 이동하시겠습니까?',
                                                    [
                                                        {
                                                            text: '예',
                                                            onPress: () => navigation.navigate('PayMent')
                                                        },
                                                        {
                                                            text: '아니오',
                                                            onPress: () => console.log('사용자가 아니오를 선택했습니다.'),
                                                            style: 'cancel'
                                                        }
                                                    ],
                                                    { cancelable: false }
                                                );
                                            }
                                        }}
                                    >
                                    <Text style={styles.menuTx}>저장</Text>
                                </TouchableOpacity>
                                </View>
                                <View style={{width:screenWidth *115, height: screenHeight*50, }}>
                                <TouchableOpacity style={{width:screenWidth *115, height: screenHeight*50, alignItems:'center'}} onPress={CloseSoundModal}>
                                    <Text style={styles.menuTx}>취소</Text>
                                </TouchableOpacity>
                                </View>
                            </View>
                    </View>
                </View>
            </Modal>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff'
    },
    title: {
        fontSize: screenWidth * 27,
        fontWeight: 'bold',
        marginBottom: screenHeight * 10,
        marginTop: screenHeight * 10,
        textAlign: 'center',
        fontFamily:'myeongBold'
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.35)',
    },
    soundModal: {
        backgroundColor: '#9C7B59',
        borderRadius: 20,
        padding: '8%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 3,
        // height: Platform.OS === 'ios' ? screenHeight * 260 : screenHeight * 250,
        width: Platform.OS === 'ios' ? screenWidth * 340 : screenWidth * 330,
        borderColor: '#fff',
        borderWidth: 6.5,
        flexDirection:'column'
    },
    radioButtonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    radioButton:{
        flexDirection:'column',
        justifyContent:'center',
        marginHorizontal: '3%',
        alignContent:'center',
        alignItems: 'center',
        marginVertical: '3%'
    },
    image: {
        width: '100%',
        height: screenHeight * 600,
        resizeMode: 'contain',
        marginBottom: screenHeight * 10,
    },
    name: {
        fontSize: screenWidth * 20,
        marginRight: '7%',
        marginBottom: screenHeight * 10,
        marginTop: screenHeight * 15,
        textAlign: 'right',
        fontFamily:'myeongBold'
    },
    context: {
        fontSize: screenWidth * 16,
        marginBottom: screenHeight * 10,
    },
    pageImage: {
        width: Dimensions.get('window').width * 0.94,
        height: Dimensions.get('window').height * 0.55,
        marginTop: '3%',
        marginBottom: '3%',
        alignSelf: 'center'
    },
    story: {
        fontFamily: 'myeongRegular',
        fontSize: screenWidth * 23,
        marginBottom: screenHeight * 10,
        marginTop: '3%',
        lineHeight : screenHeight * 31,
    },
    readBtn: {
        backgroundColor: '#7F6742',
        width: screenWidth * 72,
        height: screenHeight * 33,
        marginRight: '7%',
        borderRadius: 5,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 3,
        shadowOffset: { width: 1, height: 1 },
        justifyContent:'center'
    },
    readTx: {
        fontFamily: 'soyoRegular',
        color: '#fff',
        fontSize: screenWidth * 15,
        textAlign: 'center',
    },
    readBtn2: {
        backgroundColor: '#7F6742',
        width: screenWidth * 85,
        height: screenHeight * 33,
        marginRight: '7%',
        borderRadius: 5,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 3,
        shadowOffset: { width: 1, height: 1 },
        justifyContent:'center'
    },
    menuTx: {
        fontFamily: 'soyoRegular',
        fontSize: screenHeight * 19,
        color: '#FFFFFF',
        marginBottom: '5%'
    },
    radioButtonContainer3: {
        borderRadius: 50,
        backgroundColor: 'white',
        width: screenWidth * 35,
        height: screenHeight * 35,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 2.5,
        alignSelf: 'center',
        marginTop: '5%'
      },
});
