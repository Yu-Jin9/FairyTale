import React, { useState, useContext, useEffect, useCallback, useRef } from 'react';
import { Animated, View, Text, TextInput, ActivityIndicator, TouchableOpacity, Image, Modal, Button, StyleSheet, Dimensions, Alert, Platform, Keyboard } from 'react-native';
import { RadioButton } from 'react-native-paper';
import axios from 'axios';
import UserDataContext from '../UserDataContext';
import { FirebaseStorage } from '@firebase/storage';
import '@firebase/storage';
import { getStorage, ref, uploadBytes, getDownloadURL } from '@firebase/storage';
import modalImg1 from '../../assets/icon/ModalImg1.png';
import modalImg2 from '../../assets/icon/ModalImg2.png';
import { screenHeight, screenWidth } from '../screenSize';
import { useFocusEffect } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function MakeBook({ route, navigation }) {
  const GPT_API_KEY = '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'; // GPT API 키
  const IMAGES_API_KEY = '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'; // OpenAI 이미지 API 키
  const { seqNum } = route.params;
  const [text, setText] = useState("");
  const [GptText, setGptText] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [translatedText, setTranslatedText] = useState("");
  const [checked, setChecked] = React.useState('first');
  const [imageUrl, setImageUrl] = useState(null);
  const [showModal, setshowModal] = useState(false);
  const [modalselectmode, setModalSelectModeVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [pagenum, setPageNum] = useState(1);
  const [gender, setGender] = useState('');
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [age, setAge] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [postBoardModalVisible, setPostBoardModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [titleImage, setTitleImage] = useState(null);
  const [mainsummary, setMainsummary] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [summaryInput, setSummaryInput] = useState('');
  const [bookImage, setBookImage] = useState(null);
  const [modalImage, setModalImage] = useState(false);
  const [summary, setSummary] = useState("");
  const context = useContext(UserDataContext);
  const address = context.userIp;
  const UserId = context.userId;
  const UserName = context.userName;
  const storage = getStorage();
  const [downLoadUrl, setDownLoadUrl] = useState('');
  const [isLoading, setLoading] = useState(false); // 이미지 생성
  const [isLoading2, setLoading2] = useState(false); // 다음 페이지
  const [isLoading3, setLoading3] = useState(false); // 책 완성
  const [isLoading4, setLoading4] = useState(false); // 타이틀 이미지 생성
  const [isLoading5, setLoading5] = useState(false); //게시판에 올리는 중
  const [firstModal, setfirstModal] = useState(false);
  const [preImage, setPreImage] = useState("");
  const [NameModal, setNameModal] = useState(false);
  const [speciesModal, setSpeciesModal] = useState(false);
  const [ageModal, setAgeModal] = useState(false);
  const [timeModal, setTimeModal] = useState(false);
  const [locationModal, setLocationModal] = useState(false);
  const [heroSaveModal, setHeroSaveModal] = useState(false);
  const [TitleModal, setTitleModal] = useState(false);
  const [PostBoardModal, setPostBoardModal] = useState(false);
  const [GuideModal, setGuideModal] = useState(false);
  const [GuideText, setGuideText] = useState("");
  const currentDate = new Date();
  const setUserMembership = context.setUserMembership;
  const setEndMembershipDate = context.setEndMembershipDate;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim2 = useRef(new Animated.Value(1)).current;
  const [isPressed, setIsPressed] = useState(false); // 추가 버튼이 눌렸는지 상태를 저장하는 변수
  const [isPressed2, setIsPressed2] = useState(true); // 다음 페이지            //

  const [modifyModal, setModifyModal] = useState(false); // 주인공 정보 입력 확인 모달 (전체 바로 수정)
  // const fadeIn = () => {
  //   if (!isPressed) { // 버튼이 눌렸다면 애니메이션을 멈춤
  //     animation2 = Animated.timing(fadeAnim, {
  //       toValue: 1,
  //       duration: 1000,
  //       useNativeDriver: true
  //     });
  //     animation2.start(() => fadeOut());
  //   } else {
  //     console.log(animation2,'@@@@@@@@@@@@EEEE');
  //     animation2.stop();
  //     } 
  //   }

  // const fadeOut = () => {
  //   if (!isPressed) { // 버튼이 눌렸다면 애니메이션을 멈춤
  //     animation1 = Animated.timing(fadeAnim, {
  //       toValue: 0.5,
  //       duration: 1000,
  //       useNativeDriver: true
  //     });
  //     animation1.start(() => fadeIn());
  //   } else {
  //     console.log(animation1,'@@@@@@@@@@animation1');
  //     animation1.stop();
  //   }
  // }

  //추가 버튼 애니메이션 설정
  const runBlinkAnimation = () => {
    const blinkingAnimation = Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 500,
        useNativeDriver: true
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      })
    ]);
  
    return Animated.loop(blinkingAnimation, { iterations: 100 }); // 5회 반복, 원하는 횟수로 변경 가능
  };

  const startBlinking = () => {
    const blinking = runBlinkAnimation();
    blinking.start();
  };
  
  const stopBlinking = () => {
    fadeAnim.setValue(1); // 애니메이션을 멈추고 최초 상태로 돌려놓습니다.
  };

  // 다음 페이지 애니메이션 설정
  const runBlinkAnimation2 = () => {
    const blinkingAnimation2 = Animated.sequence([
      Animated.timing(fadeAnim2, {
        toValue: 0.5,
        duration: 500,
        useNativeDriver: true
      }),
      Animated.timing(fadeAnim2, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      })
    ]);
  
    return Animated.loop(blinkingAnimation2, { iterations: 100 }); // 5회 반복, 원하는 횟수로 변경 가능
  };

  const startBlinking2 = () => {
    const blinking2 = runBlinkAnimation2();
    blinking2.start();
  };
  
  const stopBlinking2 = () => {
    fadeAnim2.setValue(1); // 애니메이션을 멈추고 최초 상태로 돌려놓습니다.
  };

  // const fadeIn = () => {
  //   Animated.timing(fadeAnim, {
  //     toValue: 1,
  //     duration: 1000,
  //     useNativeDriver: true
  //   }).start();
  // };
  
  // const fadeOut = () => {
  //   Animated.timing(fadeAnim, {
  //     toValue: 0.5,
  //     duration: 1000,
  //     useNativeDriver: true
  //   }).start();
  // };

  const onPress = () => {
    setIsPressed(true); // 버튼이 눌리면 상태를 변경
    console.log(isPressed,'@@@@@@@');
    sendImage();
    sendDataToServer();
  }

  
  //추가 버튼 애니메이션 useEffect (isPressed 값이 변경될 떄 마다 호출)
  useEffect(() => {
    if (!isPressed) {
      startBlinking();
    } else {
      stopBlinking();
    }
  }, [isPressed]);

  // 다음 페이지 애니메이션 useEffect (isPressed2 값이 변경될 떄 마다 호출)
  useEffect(() => {
    if (!isPressed2) {
      startBlinking2();
    } else {
      stopBlinking2();
    }
  }, [isPressed2]);

  useEffect(() => {
    setfirstModal(true);
  }, []);
  useEffect(() => {
    const backAction = () => { // 뒤로가기
      Alert.alert("취소하시겠습니까?", "취소하시면 지금까지 작성한 동화책은 사라집니다.", [
        {
          text: "취소",
          style: "cancel",
          onPress: () => null,
        },
        {
          text: "확인",
          onPress: () => {
            axios.post(`${address}/server/book/deleteBook`, {
              seqNum: seqNum
            })
              .then(response => {
                // 리스너 해제
                unsubscribe();
                // 화면 이동
                navigation.goBack();
              })
              .catch(error => {
                console.error("동화책 삭제 중 오류 발생:", error);
              });
          },
        },
      ]);
      return true;
    };

    // 네비게이션 이벤트 리스너 등록
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      e.preventDefault(); // 기본 동작 방지
      backAction(); // 정의한 뒤로가기 핸들러 실행
    });


    // 컴포넌트 언마운트 시 리스너 해제
    return unsubscribe;
  }, [navigation]);
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  const openModal = () => { // 줄거리 생성시 모달
    // 모달을 엽니다.
    setshowModal(true);
  };

  const closeModal = () => { // 줄거리 생성시 모달
    // 모달을 닫습니다.
    setshowModal(false);
  };
  const opentoggleModalImage = () => { // 타이틀 이미지 생성 모달
    setModalImage(true);
  };
  const closetoggleModalImage = () => { // 타이틀 이미지 생성 모달
    setModalImage(false);
    navigation.navigate('홈 화면');
  };
  const handleAiInput = () => {
    setfirstModal(false);
    toggleModal();
  };
  const handleDirectInput = () => {
    setfirstModal(false);
  };
  const openFirstModal = () => {
    setModalVisible(false);
    setfirstModal(true);
  }
  const openGenderModal = () => {
    toggleModal(false);
    setModalVisible(true);
    setNameModal(false);
  }
  const openNameModal = () => {
    setModalVisible(false);
    setNameModal(true);
    setSpeciesModal(false);
  }
  const openSpeciesModal = () => {
    setNameModal(false);
    setSpeciesModal(true);
    setAgeModal(false);
  }
  const openAgeModal = () => {
    setSpeciesModal(false);
    setAgeModal(true);
    setTimeModal(false);
  }
  const openTimeModal = () => {
    setAgeModal(false);
    setTimeModal(true);
    setLocationModal(false);
  }
  const openlocationModal = () => {
    setTimeModal(false);
    setLocationModal(true);
    setHeroSaveModal(false);
  }
  const openHeroSaveModal = () => {
    setLocationModal(false);
    setHeroSaveModal(true);
    setModifyModal(false);
  }
  const openTitleModal = () => {
    setTitleModal(true);
  }
  const openPostBoardModal = () => {
    setPostBoardModal(true);
  }
  const openGuideModal = () => {
    setGuideModal(true);
  }
  const closeNameModal = () => {
    setNameModal(false);
  }
  const closeSpeciesModal = () => {
    setSpeciesModal(false);
  }
  const closeAgeModal = () => {
    setAgeModal(false);
  }
  const closeTimeModal = () => {
    setTimeModal(false);
  }
  const closeLocationModal = () => {
    setLocationModal(false);
  }
  const closeHeroSaveModal = () => {
    setHeroSaveModal(false);
  }
  const closeTitleModal = () => {
    setTitleModal(false);
  }
  const closemodalImage = () => {
    setModalImage(false);
  }
  const closePostBoardModal = () => {
    setPostBoardModal(false);
    navigation.navigate('홈 화면');
  }
  const closeGuideModal = () => {
    setGuideModal(false);
  }
  const GuideTextToInput = () => {
    setText(GuideText);
    closeGuideModal();
  }
  const openModifyModal = () => {
    setHeroSaveModal(false);
    setModifyModal(true);
  }
  const closeModifyModal = () => {
    setModifyModal(false);
  }

  const cancel = async () => {
    axios.post(`${address}/server/book/deleteBook`, {
      seqNum: seqNum
    })
      .then(response => {
        navigation.navigate('PaymentPage');
      })
      .catch(error => {
        console.error("동화책 삭제 중 오류 발생:", error);
      });
  }

  const checkMembership = async () => {
    await axios.post(`${address}/server/member/checkMembership`, { id: UserId })
      .then((res) => {
        if (res.data.result) {
          setUserMembership(res.data.result.premium);
          setEndMembershipDate(res.data.result.endDate);
          console.log('유저 결제 여부', context.userMembership);
        } else {
          console.log('회원 멤버쉽 판별 오류');
        }
      }).catch((error) => {
        console.error(error);
      });
  }
  useFocusEffect(
    useCallback(() => {
      checkMembership();

    }, [])
  )

  const closeAllModal = () => {
    setModalVisible(false);
    setNameModal(false);
    setSpeciesModal(false);
    setAgeModal(false);
    setTimeModal(false);
    setLocationModal(false);
    setHeroSaveModal(false);
    setModifyModal(false);
  }

  const sendfirstcomment = async () => { // 첫 주인공의 대한 정보를 입력할 시 GPT한테 전송
    setIsPressed(true);
    const HeroInfo = '인물 정보(' +
      ' 이름 :' +
      name +
      ' 성별 :' +
      gender +
      ' 종자 :' +
      species +
      ' 나이 :' +
      age +
      '시대적 배경 :' +
      time +
      '장소 :' +
      location +
      ')'
    try { 

      closeHeroSaveModal();
      closeModifyModal();
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4-0314',
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            {
              role: 'user',
              content:
                HeroInfo +
                '인물 정보를 이용해 동화 시작부분 한줄을 만들어줘',
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${GPT_API_KEY}`,
          },
        }
      );

      const responseText = response.data.choices[0]?.message.content;
      if (responseText) {
        setGptText(responseText);
        setIsPressed2(false);
      } else {
        console.log('Text not found in the response');
      }
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }

    try {
      setLoading(true);
      // OpenAI API URL
      const apiUrl = 'https://api.openai.com/v1/images/generations';

      // 요청 헤더 설정
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${IMAGES_API_KEY}`,
      };

      // 요청 바디 설정
      const requestBody = {
        model: "dall-e-3",
        prompt: HeroInfo + " 앞의 인물정보를 이용해서 다음과 같은 그림 스타일로 그려줘 beautiful render of a fairytale, anamorphic illustration, inspired by Rudolph F. Ingerle, promotional images, white warm illumination",
        n: 1,
        size: '1024x1024',
        quality: "hd"
      };

      // OpenAI API 호출
      const response = await axios.post(apiUrl, requestBody, { headers });

      // 이미지 URL 추출
      const image_url = response.data.data[0].url;
      // 상태 변수에 이미지 URL 설정

      setImageUrl(image_url);
      console.log(image_url);
      setPreImage(image_url);
      setLoading(false);
      console.log("성공");
    } catch (error) {
      console.log("실패");
      setLoading(false);
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };

  const sendDataToServer = async () => { // 텍스트 입력 후 GPT한테 전송
    Keyboard.dismiss();
    try {
      setText('');

      console.log(text);
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4-0314',
          messages: [
            { role: 'system', content: '어떤 동화문장을 만들어 드릴까요?' },
            { role: 'user', content: '"' + text + '"' + '의 다음에 이어질 동화 한 줄을 문법과 문맥에 맞게 만들어줘' },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${GPT_API_KEY}`,
          },
        }
      );
      const responseText = response.data.choices[0]?.message.content;
      if (responseText) {
        // responseText에서 text와 동일한 부분을 찾아 제거
        setText(''); let cleanedResponseText = responseText.replace(text, '');
        // 제거된 responseText를 text에 추가
        setGptText(text + " " + cleanedResponseText);
      } else {
        console.log('Text not found in the response');
      }
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };
  const sendContextToServer = async () => { // 다음 페이지로 넘어갈 시 DB에 텍스트와 이미지 페이지 넘버 전송
    setIsPressed2(true);
    setLoading2(true);
    console.log("전송시작");
    const downLoadUrl = await uploadImage();
    console.log(downLoadUrl);
    console.log("실행");
    await axios.post(address + '/server/book/context', null, {
      params: {
        seqNum: seqNum,
        context: GptText,
        image: downLoadUrl,
        pagenum: pagenum
      }
    })
    console.log("전송완료");
    try {
      console.log(text);
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4-0314',
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: '"' + GptText + '"' + '를 이용해서 동화에 이어질 내용 한줄 만들어줘' },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${GPT_API_KEY}`,
          },
        }
      );
      const responseText = response.data.choices[0]?.message.content;
      if (responseText) {
        setGuideText(responseText);
        // setText(responseText);
      } else {
        console.log('Text not found in the response');
      }
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
    setIsPressed(false);
    setLoading2(false);
    setPageNum(pagenum + 1);
    setText("");
    setGptText("이전페이지: " + GptText);
    setImageUrl("");
    setIsPressed(false);
  }

  const sendImage = async () => { // 문장 텍스트 입력 후 GPT에게 그림을 그려주도록 요청
    try {
      setLoading(true);
      // OpenAI API URL
      const apiUrl = 'https://api.openai.com/v1/images/generations';

      // 요청 헤더 설정
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${IMAGES_API_KEY}`,
      };

      // 요청 바디 설정
      const requestBody = {
        model: "dall-e-3",
        prompt: text + "라는 문장과" + preImage + "에 나오는 주인공을 이용해서 다음과 같은 그림 스타일로 그려줘 beautiful render of a fairytale, anamorphic illustration, inspired by Rudolph F. Ingerle, promotional images, white warm illumination",
        n: 1,
        size: '1024x1024',
        quality: "hd"
      };

      // OpenAI API 호출
      const response = await axios.post(apiUrl, requestBody, { headers });

      // 이미지 URL 추출
      const image_url = response.data.data[0].url;
      // 상태 변수에 이미지 URL 설정

      setImageUrl(image_url);
      console.log(image_url);
      setPreImage(image_url);
      setLoading(false);
      console.log("성공");
      setIsPressed2(false);
    } catch (error) {
      console.log("실패");
      setLoading(false);
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };
  const maketitleImage = async () => { // 줄거리를 이용해서 GPT에게 전송해 표지 이미지 그려달라 요청
    try {
      setLoading4(true);
      closeModal();
      opentoggleModalImage();
      // OpenAI API URL
      const apiUrl = 'https://api.openai.com/v1/images/generations';

      // 요청 헤더 설정
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${IMAGES_API_KEY}`,
      };

      // 요청 바디 설정
      const requestBody = {
        model: "dall-e-3",
        prompt: '"' + mainsummary + '"' + "를 이용해서 다음과 같은 그림 스타일로 그려줘 beautiful render of a fairytale, anamorphic illustration, inspired by Rudolph F. Ingerle, promotional images, white warm illumination",
        n: 1,
        size: '1024x1024',
      };

      // OpenAI API 호출
      const response = await axios.post(apiUrl, requestBody, { headers });

      // 이미지 URL 추출
      const titleimage_url = response.data.data[0].url;
      // 상태 변수에 이미지 URL 설정
      console.log(mainsummary);
      setImageUrl(titleimage_url);
      setLoading4(false);
      console.log(titleImage);
      console.log("성공");
    } catch (error) {
      console.log("실패");
      setLoading4(false);
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };
  // const response = await axios.post(apiUrl, requestBody, { headers });

  //     // 이미지 URL 추출
  //     const image_url = response.data.data[0].url;
  //     // 상태 변수에 이미지 URL 설정

  //     setImageUrl(image_url);
  //     console.log(image_url);
  //     setLoading(false);
  //     console.log("성공");
  //   } catch (error) {
  //     console.log("실패");
  //     setLoading(false);
  //     console.error('Error:', error.response ? error.response.data : error.message);
  //   }
  // };
  const SummaryfromServer = async () => { // 각 페이지 문장들을 통합해 GPT에게 줄거리 만들어달라고 요청
    try {                               // 각페이지 문장들을 서버에다 요청해 통합
      setLoading3(true);
      const downLoadUrl = await uploadImage();
      await axios.post(address + '/server/book/context', null, {
        params: {
          seqNum: seqNum,
          context: GptText,
          image: downLoadUrl,
          pagenum: pagenum
        }
      })
      console.log("줄거리 만들기 시도");
      const response = await axios.post(address + '/server/book/getContext', {
        seqNum: seqNum
      });

      const responseData = response.data;
      console.log(response);
      console.log('서버 응답:', responseData.getContext);
      console.log(responseData.getContext[0].text);

      let summary = '';

      for (let i = 0; i < responseData.getContext.length; i++) {
        summary += responseData.getContext[i].text;
      }

      // 최종 결과 확인
      console.log(summary);
      // 페이지별 동화들을 통합 한 후에 GPT에게 줄거리 만들어달라고 요청
      try {
        setLoading3(true);
        console.log("GPT 전송");
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4-0314',
            messages: [
              { role: 'system', content: 'You are a helpful assistant.' },
              { role: 'user', content: '"' + summary + '"' + '로 동화 줄거리를 한줄 만들어줘' },
            ],
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${GPT_API_KEY}`,
            },
          }
        );
        const responseText = response.data.choices[0]?.message.content;
        if (responseText) {
          setLoading3(false);
          setMainsummary(responseText);
          openModal();
        } else {
          console.log('Text not found in the response');
        }
      } catch (error) {
        setLoading3(false);
        console.error('Error:', error.response ? error.response.data : error.message);
      }

    } catch (error) {
      setLoading3(false);
      console.error('데이터 가져오기 오류:', error);
    }
  };

  const sendCompleteBook = async () => { // 책을 그만 만들고 싶을 때 DB에다가 제목,제목이미지,줄거리를 보내 DB에 저장
    setLoading3(true);
    closemodalImage();
    const downLoadUrl = await uploadImage();
    const response = await axios.post(address + '/server/book/complete', {
      seqNum: seqNum,
      title: titleInput,
      titleImage: downLoadUrl,
      summary: mainsummary,
    });
    console.log(response.data);
    // 응답으로부터 title, titleImage, summary 값을 가져옵니다.
    const bookInfo = response.data.saveBook;

    // 이 값을 상태 변수에 할당합니다.
    setTitle(bookInfo.title);
    setTitleImage(bookInfo.titleImage);
    setSummary(bookInfo.summary);

    console.log(bookInfo.title);
    console.log(bookInfo.titleImage);
    console.log(bookInfo.summary);

    // 책 저장이 완료되면 postBoardModal을 표시
    openPostBoardModal();
    setLoading3(false);
  }

  const posttoBoard = async () => { // 만든 책을 게시판에 올릴지말지 선택한 후 올리게 되면 서버에 전송
    setLoading5(true);
    closePostBoardModal();
    const downLoadUrl = await uploadImage();
    await axios.post(address + '/server/board/postBook', {
      seqNum: seqNum,
      id: UserId,
      name: UserName,
      title: titleInput,
      titleImage: downLoadUrl,
      summary: mainsummary
    })
      .then((response) => {
        console.log("성공");
        setLoading5(false);
        navigation.navigate('홈 화면')
      })
      .catch((error) => {
        console.log("error : " + error);
      });
  }

  //스토리지 이미지 업로드
  const uploadImage = async () => {
    try {
      let formData = new FormData();
      let fileName = `${Date.now()}_${pagenum}.jpg`;
      let uriParts = imageUrl.split('.');
      let fileType = uriParts[uriParts.length - 1];
      console.log("1");
      console.log("이름 넣기 성공");
      console.log(imageUrl);
      console.log(fileName);
      formData.append('file', {
        uri: imageUrl,
        name: fileName,
        type: 'image/jpeg',
      });
      console.log("이미지 넣기 성공");

      formData.append('userName', UserName);
      console.log(address);
      console.log('sadasdasdsadsad', UserName);
      const response = await axios.post(address + '/server/storage/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log("4");

      let url = await response.data;
      console.log('서버에서 받은 응답:', url.downloadUrl);
      console.log('@@@@@@@@@', url.downloadUrl);
      return url.downloadUrl;
    } catch (e) {
      console.error('서버로의 업로드 중 에러 발생:', e);
      // console.error('formdata', formData);
    }
  };
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.helpbtn}
          onPress={() => {
            if (context.userMembership === 'true' && currentDate <= new Date(context.endMembershipDate)) {
              openGuideModal();
            } else {
              Alert.alert(
                '유료회원 전용 기능입니다.',
                '유료회원이 아닙니다.\n 결제 페이지로 이동하시겠습니까?',
                [
                  {
                    text: '예',
                    onPress: () => cancel()
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
          }}>
          <Text style={styles.helptx}>도우미</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView style={{ width: '100%', flexDirection: 'column' }}>
        {isLoading2 && (
          <View style={{ height: '100%', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1 }}>
            <ActivityIndicator size="large" color="#628F5D" />
            <Text style={styles.loadingText}>페이지 저장중</Text>
          </View>
        )}
        {isLoading3 && (
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1 }}>
            <ActivityIndicator size="large" color="#628F5D" />
            <Text style={styles.loadingText}>책 만드는 중</Text>
          </View>
        )}
        {isLoading5 && (
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1 }}>
            <ActivityIndicator size="large" color="#628F5D" />
            <Text style={styles.loadingText}>게시판에 올리는 중</Text>
          </View>
        )}
        <View style={styles.saveNextView}>
          <TouchableOpacity style={styles.SaveBookbtn} onPress={() => {
            if (GptText != '') { SummaryfromServer(); } else {
              Alert.alert("페이지를 완성 시켜주세요");
            }
          }}>
            <Text style={styles.SavebuttonTx}>책 저장하기</Text>
          </TouchableOpacity>
          <Animated.View style={{ opacity: fadeAnim2 }} >
          <TouchableOpacity style={styles.NextBookbtn} onPress={() => {
            if (GptText != '') { sendContextToServer(); } else {
              Alert.alert("페이지를 완성 시켜주세요");
            }
          }}>
            <Text style={styles.NextButtonTx}>다음 페이지</Text>
          </TouchableOpacity>
          </Animated.View>
        </View>
        {/* <View style={styles.container}> */}
        <View style={styles.InputandaddTextView}>
          <TextInput
            style={styles.BookTextInput}
            placeholder="책 내용을 입력해주세요."
            placeholderTextColor="gray"
            value={text}
            onChangeText={(inputText) => setText(inputText)}
            onSubmitEditing={Keyboard.dismiss}
          />
          <Animated.View style={{ opacity: fadeAnim, useNativeDriver: true }}  >
            <TouchableOpacity
              onPress={onPress}
              style={styles.AddBookbtn}
            >
              <Text style={styles.AddbuttonTx}>추가</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
        <TextInput
          style={styles.InsertBookText}
          placeholder="책에 저장될 글이 입력될 공간입니다."
          placeholderTextColor="#000"
          multiline
          onChangeText={setGptText} // 텍스트가 바뀔 때마다 setGptText가 실행되어 GptText를 업데이트합니다.
        >{GptText}</TextInput>

        <View style={styles.ImageView}>
          {isLoading ? (
            <View style={styles.BookPageImageView}>
              <ActivityIndicator size="large" color="#628F5D" />
              <Text style={{ marginTop: 10 }}>이미지 로딩 중</Text>
            </View>
          ) : (
            imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.BookPageImage} />
            ) : (
              <Text style={styles.imagePlaceholder}>이미지가 들어갈 공간입니다.</Text>
            )
          )}
          {/* </View> */}
        </View>
        <Modal visible={firstModal}>
          <View style={styles.FirstModalContainer}>
            <View style={styles.FirstCenteredView}>
              <TouchableOpacity onPress={() => navigation.navigate('홈 화면')} >
                <Image source={require('../../assets/icon/logout_DrawerNav.png')}
                  style={{ width: screenWidth * 24, height: screenHeight * 24, alignSelf: 'flex-end', marginRight: '2%', marginTop: '2%' }} />
              </TouchableOpacity>
              <Image
                source={modalImg1} // 이미지 경로 설정
                style={styles.FirtstModalImage}
              />
              <TouchableOpacity style={styles.AiBtn} activeOpacity={0.4} onPress={handleAiInput}>
                <Text style={styles.FirstBtnText}>AI가 먼저</Text>
                <Text style={styles.FirstBtnText}>시작할까요??</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.SelfBtn} activeOpacity={0.4} onPress={handleDirectInput}>
                <Text style={styles.FirstBtnText}>내가 먼저</Text>
                <Text style={styles.FirstBtnText}>시작해볼까요??</Text>
              </TouchableOpacity>
              <Image
                source={modalImg2} // 이미지 경로 설정
                style={styles.FirtstModalImage2}
              />
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={GuideModal} >

          <View style={styles.ModalBackView}>
            <View style={styles.GuideModal}>
              <Text style={styles.modalText1}>이렇게 문장을 써보는건</Text>
              <Text style={styles.modalText2}>어떨까요?</Text>
              <Text style={styles.GuideText}>{GuideText}</Text>
              <Image
                source={require('../../assets/icon/idea_TeachingModal.png')} // 이미지 경로 설정
                style={styles.GuideModalImage}
              />
              <View style={styles.ModalBtnView}>
                <TouchableOpacity style={styles.ModalPreBtn} onPress={closeGuideModal}>
                  <Text style={styles.buttonText}>제가 써볼게요!</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.ModalNextBtn} onPress={GuideTextToInput}>
                  <Text style={styles.buttonText}>추가하기</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={toggleModal}
        >
          <View style={styles.ModalBackView}>
            <View style={styles.HeroModalView}>
              <Text style={styles.modalText1}>이야기의 주인공</Text>
              <Text style={styles.modalText2}>성별은 무엇으로 할까요?</Text>

              <View style={styles.modalContainer}>
                <Text style={styles.answerTx}>남자</Text>
                <View style={styles.radioButtonContainer}>
                  <RadioButton
                    value="남자"
                    status={gender === '남자' ? 'checked' : 'unchecked'}
                    onPress={() => setGender('남자')}
                    color='#0094FF'
                    uncheckedColor='#848484'
                  />
                </View>
                <Text style={styles.answerTx}>여자</Text>
                <View style={styles.radioButtonContainer}>
                  <RadioButton
                    value="여자"
                    status={gender === '여자' ? 'checked' : 'unchecked'}
                    onPress={() => setGender('여자')}
                    color='#0094FF'
                    uncheckedColor='#848484'
                  />
                </View>
              </View>
              <View style={styles.bottomView}>
                <TouchableOpacity style={styles.ModalPreBtn} onPress={openFirstModal}>
                  <Text style={styles.buttonText}>이전</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.ModalCancleBtn} onPress={closeAllModal}>
                  <Text style={styles.buttonText}>혼자 할래요!</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.ModalNextBtn} onPress={openNameModal}>
                  <Text style={styles.buttonText}>다음</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>


        <Modal
          animationType="slide"
          transparent={true}
          visible={NameModal} >

          <View style={styles.ModalBackView}>
            <View style={styles.HeroModalView}>
              <Text style={styles.modalText1}>주인공의 이름은</Text>
              <Text style={styles.modalText2}>무엇인가요?</Text>
              <View>
                <TextInput style={styles.ModalInput} value={name} onChangeText={setName} />
              </View>
              <View style={styles.bottomView}>
                <TouchableOpacity style={styles.ModalPreBtn} onPress={openGenderModal}>
                  <Text style={styles.buttonText}>이전</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.ModalCancleBtn} onPress={closeAllModal}>
                  <Text style={styles.buttonText}>혼자 할래요!</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.ModalNextBtn} onPress={openSpeciesModal}>
                  <Text style={styles.buttonText}>다음</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </Modal>


        <Modal
          animationType="slide"
          transparent={true}
          visible={speciesModal}
        >
          <View style={styles.ModalBackView}>
            <View style={styles.HeroModalView}>
              <Text style={styles.modalText1}>주인공의 역할은</Text>
              <Text style={styles.modalText2}>무엇인가요?</Text>
              <View style={styles.View}>
                <TextInput
                  style={styles.ModalInput}
                  value={species}
                  onChangeText={setSpecies}
                />
              </View>
              <View style={styles.ModalBtnView}>
                <TouchableOpacity style={styles.ModalPreBtn} onPress={openNameModal}>
                  <Text style={styles.buttonText}>이전</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.ModalCancleBtn} onPress={closeAllModal}>
                  <Text style={styles.buttonText}>혼자 할래요!</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.ModalNextBtn} onPress={openAgeModal}>
                  <Text style={styles.buttonText}>다음</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={ageModal}
        >
          <View style={styles.ModalBackView}>
            <View style={styles.HeroModalView}>
              <Text style={styles.modalText1}>주인공의 나이를</Text>
              <Text style={styles.modalText2}>입력해주세요</Text>
              <View style={styles.View}>
                <TextInput
                  style={styles.ModalInput}
                  value={age}
                  onChangeText={setAge}
                />
              </View>
              <View style={styles.ModalBtnView}>
                <TouchableOpacity style={styles.ModalPreBtn} onPress={openSpeciesModal}>
                  <Text style={styles.buttonText}>이전</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.ModalCancleBtn} onPress={closeAllModal}>
                  <Text style={styles.buttonText}>혼자 할래요!</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.ModalNextBtn} onPress={openTimeModal}>
                  <Text style={styles.buttonText}>다음</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={timeModal}
        >
          <View style={styles.ModalBackView}>
            <View style={styles.HeroModalView}>
              <Text style={styles.modalText1}>주인공은 어느 시대에</Text>
              <Text style={styles.modalText2}>살고 있나요?</Text>

              <View style={styles.modalContainer}>
                <Text style={styles.answerTx3}>과거</Text>
                <View style={styles.radioButtonContainer3}>
                  <RadioButton
                    value="과거시대"
                    status={time === '과거시대' ? 'checked' : 'unchecked'}
                    onPress={() => setTime('과거시대')}
                    color='#0094FF'
                    uncheckedColor='#848484'
                  />
                </View>
                <Text style={styles.answerTx3}>현대</Text>
                <View style={styles.radioButtonContainer3}>
                  <RadioButton
                    value="현대시대"
                    status={time === '현대시대' ? 'checked' : 'unchecked'}
                    onPress={() => setTime('현대시대')}
                    color='#0094FF'
                    uncheckedColor='#848484'
                  />
                </View>
                <Text style={styles.answerTx3}>미래</Text>
                <View style={styles.radioButtonContainer3}>
                  <RadioButton
                    value="미래시대"
                    status={time === '미래시대' ? 'checked' : 'unchecked'}
                    onPress={() => setTime('미래시대')}
                    color='#0094FF'
                    uncheckedColor='#848484'
                  />
                </View>
              </View>
              <View style={styles.ModalBtnView}>
                <TouchableOpacity style={styles.ModalPreBtn} onPress={openAgeModal}>
                  <Text style={styles.buttonText}>이전</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.ModalCancleBtn} onPress={closeAllModal}>
                  <Text style={styles.buttonText}>혼자 할래요!</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.ModalNextBtn} onPress={openlocationModal}>
                  <Text style={styles.buttonText}>다음</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={locationModal}
        >
          <View style={styles.ModalBackView}>
            <View style={styles.HeroModalView}>
              <Text style={styles.modalText1}>주인공의 나타날</Text>
              <Text style={styles.modalText2}>장소는 어디인가요?</Text>
              <View style={styles.View}>
                <TextInput
                  style={styles.ModalInput}
                  value={location}
                  onChangeText={setLocation}
                  placeholder=" 예) 성, 산속, 바다"
                  placeholderTextColor="gray"
                />
              </View>
              <View style={styles.ModalBtnView}>
                <TouchableOpacity style={styles.ModalPreBtn} onPress={openTimeModal}>
                  <Text style={styles.buttonText}>이전</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.ModalCancleBtn} onPress={closeAllModal}>
                  <Text style={styles.buttonText}>혼자 할래요!</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.ModalNextBtn} onPress={openHeroSaveModal}>
                  <Text style={styles.buttonText}>다음</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={heroSaveModal}
        >
          <View style={styles.ModalBackView}>
            <View style={styles.HeroModalView}>
              <Text style={styles.modalText1}>입력한 내용으로</Text>
              <Text style={styles.modalText2}>동화책을 시작해볼까요?</Text>
              <View >
                <Text style={{ fontSize: screenHeight * 17, marginTop: '5%', color: 'white' }}>저장 후 동화 만들기가 시작됩니다.</Text>
              </View>
              <View style={styles.ModalBtnView}>
                <TouchableOpacity style={styles.ModalPreBtn} onPress={openModifyModal}>
                  <Text style={styles.buttonText}>아니요!{"\n"}다시 정할래요</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.ModalNextBtn} onPress={sendfirstcomment}>
                  <Text style={styles.yesText}>네</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modifyModal}
        >
          <View style={styles.ModalBackView}>
            <View style={styles.HeroModalViewModify}>
              <Text style={styles.modalText1}>어느 것을 다시</Text>
              <Text style={styles.modalText2}>정해볼까요?</Text>

              <View style={styles.modalContainer}>
                <Text style={styles.answerTx}>성별 : </Text>
                <Text style={styles.answerTx}>남자</Text>
                <View style={styles.radioButtonContainer}>
                  <RadioButton
                    value="남자"
                    status={gender === '남자' ? 'checked' : 'unchecked'}
                    onPress={() => setGender('남자')}
                    color='#0094FF'
                    uncheckedColor='#848484'
                  />
                </View>
                
                <Text style={styles.answerTx}>여자</Text>
                <View style={styles.radioButtonContainer}>
                  <RadioButton
                    value="여자"
                    status={gender === '여자' ? 'checked' : 'unchecked'}
                    onPress={() => setGender('여자')}
                    color='#0094FF'
                    uncheckedColor='#848484'
                  />
                </View>
              </View>

              <View style={{flexDirection:'row', alignItems:'spaceBetween', justifyContent:'center'}}>
                  <Text style={styles.ModifyAnswerTx3}>이름 : </Text>
                  <TextInput style={styles.ModifyModalInput} value={name} onChangeText={setName} />
              </View>

              <View style={{flexDirection:'row', alignItems:'spaceBetween', justifyContent:'center'}}>
                <Text style={styles.ModifyAnswerTx3}>역할 : </Text>
                <TextInput
                  style={styles.ModifyModalInput}
                  value={species}
                  onChangeText={setSpecies}
                />
              </View>

              <View style={{flexDirection:'row', alignItems:'spaceBetween', justifyContent:'center', height:screenHeight * 40}}>
                <Text style={styles.ModifyAnswerTx3}>나이 : </Text>
                <TextInput
                  style={styles.ModifyModalInput}
                  value={age}
                  onChangeText={setAge}
                />
              </View>
              <Text style={styles.ModifyAnswerTx}>시대</Text>
              <View style={styles.modalContainer}>
                <Text style={styles.answerTx3}>과거</Text>
                <View style={styles.radioButtonContainer3}>
                  <RadioButton
                    value="과거시대"
                    status={time === '과거시대' ? 'checked' : 'unchecked'}
                    onPress={() => setTime('과거시대')}
                    color='#0094FF'
                    uncheckedColor='#848484'
                  />
                </View>
                <Text style={styles.answerTx3}>현대</Text>
                <View style={styles.radioButtonContainer3}>
                  <RadioButton
                    value="현대시대"
                    status={time === '현대시대' ? 'checked' : 'unchecked'}
                    onPress={() => setTime('현대시대')}
                    color='#0094FF'
                    uncheckedColor='#848484'
                  />
                </View>
                <Text style={styles.answerTx3}>미래</Text>
                <View style={styles.radioButtonContainer3}>
                  <RadioButton
                    value="미래시대"
                    status={time === '미래시대' ? 'checked' : 'unchecked'}
                    onPress={() => setTime('미래시대')}
                    color='#0094FF'
                    uncheckedColor='#848484'
                  />
                </View>
              </View>

              <View style={{flexDirection:'row', alignItems:'spaceBetween', justifyContent:'center'}}>
                <Text style={styles.ModifyAnswerTx3}>장소 : </Text>
                <TextInput
                  style={styles.ModifyModalInput}
                  value={location}
                  onChangeText={setLocation}
                  
                />
              </View>

              <View style={styles.ModalBtnView}>
                <TouchableOpacity style={styles.ModalPreBtn} onPress={openHeroSaveModal}>
                  <Text style={styles.buttonText}>이전</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.ModalCancleBtn} onPress={closeAllModal}>
                  <Text style={styles.buttonText}>혼자 할래요!</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.ModalNextBtn} onPress={sendfirstcomment}>
                  <Text style={styles.buttonText}>저장</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal animationType="slide" transparent={true} visible={showModal}>
          <View style={styles.ModalBackView}>
            <View style={styles.FinalModalView}>
              <TextInput
                placeholder="책 제목"
                value={titleInput}
                onChangeText={(text) => setTitleInput(text)}
                style={styles.TitleInput}
              />
              {/* 줄거리 입력 */}
              <Text
                placeholder="책 줄거리"
                value={mainsummary}
                multiline={4}
                style={styles.SummaryText}
              >{mainsummary}</Text>
              <View style={styles.ModalFinalBtnView}>
                <TouchableOpacity onPress={() => { closeModal() }} style={styles.ModalPreBtn}>
                  <Text style={styles.buttonText}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  if (titleInput != "") { maketitleImage() } else {
                    Alert.alert('제목이 없습니다.', '책 제목을 입력해주세요');
                  }
                }} style={styles.ModalNextBtn}>
                  <Text style={styles.buttonText}>다음</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal animationType="slide" transparent={true} visible={modalImage}>
          <View style={styles.ModalBackView}>
            <View style={styles.TitleImageModal}>
              {/* <View style={styles.modalView}> */}
              {/* 이미지 다시 생성 버튼 */}

              {/* 완성 버튼 */}

              {/* 제목 이미지 미리보기 */}
              <View style={styles.TitleImageView}>
                {isLoading4 ? (
                  <View style={{ alignItems: 'center', marginTop: '50%' }}>
                    <ActivityIndicator size="large" color="#628F5D" />
                    <Text style={{ marginTop: 10 }}>표지 이미지 생성 중</Text>
                  </View>
                ) : (
                  titleImage && (
                    <Image source={{ uri: imageUrl }} style={styles.TitleImage} />                  )
                )}

              </View>
              <View style={styles.ModalBtnView}>
                <TouchableOpacity onPress={maketitleImage} style={styles.TitleImageReMakeBtn}>
                  <Text style={styles.buttonText}>다시 생성</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={sendCompleteBook} style={styles.BookSaveBtn}>
                  <Text style={styles.buttonText}>저장</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* </View> */}
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={PostBoardModal}
        >
          <View style={styles.ModalBackView}>
            <View style={styles.ModalViewUploadBoard}>
              <Text style={styles.modalText1}>게시판에</Text>
              <Text style={styles.modalText2}>동화책을 올릴까요?</Text>
              <View style={styles.View}>
              </View>
              <View style={styles.ModalBtnView}>
                <TouchableOpacity style={styles.PostCancleBtn} onPress={closePostBoardModal}>
                  <Text style={styles.buttonText}>아니오</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.PostBoardBtn} onPress={posttoBoard}>
                  <Text style={styles.buttonText}>네</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { // 메인 컨테이너
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FDFDFB',
    alignItems: 'center',
    width: "100%",
  },
  saveNextView: { // 책 저장, 다음페이지 버튼 뷰
    width: "100%",
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: '5%',
    paddingRight: '5%',
    paddingBottom: '5%',
    marginTop: '5%'
  },
  SaveBookbtn: {
    backgroundColor: '#9C7B59',
    padding: '2%',
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0.1, height: 0.1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    justifyContent: 'center'
  },
  SavebuttonTx: {
    fontFamily: 'soyoRegular',
    color: '#fff',
    fontSize: screenWidth * 18,
    textAlign: 'center',
  },
  NextBookbtn: {
    width: Platform.OS === 'ios' ? screenWidth * 110 : screenWidth * 100,
    height: Platform.OS === 'ios' ? screenHeight * 45 : screenHeight * 40,
    backgroundColor: '#9C7B59',
    padding: '5%',
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0.1, height: 0.1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    justifyContent: 'center'
  },
  NextButtonTx: {
    fontFamily: 'soyoRegular',
    color: '#fff',
    fontSize: screenWidth * 18,
    textAlign: 'center',
  },
  InputandaddTextView: {  // 텍스트 인풋과 추가 버튼 뷰
    width: "100%",
    flexDirection: 'row',
    paddingLeft: '5%',
    paddingRight: '5%',
    paddingBottom: '5%',
    justifyContent: 'space-between',
  },
  TextInputContainer: {
    alignItems: 'center',
  },
  BookTextInput: { // 책 내용 입력 텍스트 인풋
    fontFamily: 'nanumRegular',
    fontSize: screenWidth * 17,
    borderColor: '#A9A9A9',
    borderRadius: 10,
    width: '80%',
    paddingHorizontal: '4%',
    paddingVertical: Platform.OS === 'ios' ? '4%' : '2%',
    textAlign: 'left',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 2,
    backgroundColor: 'white',
  },
  AddBookbtn: { // 추가 버튼
    height: screenHeight * 40,
    width: Platform.OS === 'ios' ? screenWidth * 60 : screenWidth * 60,
    backgroundColor: '#9C7B59',
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0.1, height: 0.1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    alignSelf : 'center',
    justifyContent: 'center'
  },
  AddbuttonTx: {
    width: Dimensions.get('window').width*0.15,
    fontFamily: 'soyoRegular',
    color: '#fff',
    fontSize: screenHeight * 18,
    textAlign: 'center',
  },
  InsertBookText: { // 책에 들어갈 텍스트 보이는 뷰 (Gpt가 입력하는 부분)
    alignItems: "center",
    alignSelf: 'center',
    justifyContent: 'center', // iOS에서 세로 중앙 정렬
    textAlignVertical: 'center', // Android에서 세로 중앙 정렬
    backgroundColor: "#fff",
    paddingLeft: '3%',
    paddingRight: '3%',
    paddingTop: '5%',
    paddingBottom: '5%',
    fontSize: screenHeight * 18,
    fontFamily: 'nanumRegular',
    borderRadius: 10,
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 2,
    lineHeight: screenHeight * 24
  },
  ImageView: { // 책 페이지별 이미지가 보일 뷰
    height: screenHeight * 300,
    width: '90%',
    marginLeft: '5%',
    marginRight: '5%',
    marginTop: '5%',
    marginBottom: '10%',
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 2,
  },
  imagePlaceholder: { // 이미지 들어갈 자리 안내 문구
    fontFamily: 'soyoRegular',
    fontSize: screenWidth * 18,
    textAlign: 'center',
    marginVertical: '30%'
  },
  BookPageImage: { // 책 페이지별 이미지
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10,
  },
  BookPageImageView: { // 책 내용 이미지 로딩화면 뷰
    alignSelf: 'center',
    marginBottom: '50%',
    top: '40%'
  },

  ///////////////// 모달 스타일 //////////////////////

  FirstModalContainer: { // 첫 시작 모달 View ? AI, self
    flex: 1,
    height: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  FirstCenteredView: {
    paddingTop: Platform.OS === 'ios' ? '10%' : 0,
    backgroundColor: '#fff',
    flexDirection: 'column',
    height: '100%'
  },
  FirtstModalImage: {
    width: screenWidth * 380,
    height: screenHeight * 310,
    resizeMode: 'stretch',
    alignSelf: 'center'
  },
  FirtstModalImage2: {
    width: screenWidth * 390,
    height: screenHeight * 180,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: '4%'
  },
  AiBtn: {
    width: screenWidth * 200,
    height: screenHeight * 85,
    backgroundColor: '#FF9900',
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2.5,
    marginTop: '12%',
    alignSelf: 'center'
  },
  SelfBtn: {
    width: screenWidth * 200,
    height: screenHeight * 85,
    backgroundColor: '#FDC830',
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2.5,
    marginTop: '14%',
    alignSelf: 'center'
  },
  FirstBtnText: {
    color: 'white',
    fontFamily: 'soyoRegular',
    fontSize: screenHeight * 24,
    marginTop: Platform.OS === 'ios' ? '3.5%' : '5.5%',
    textAlign: 'center',
  },
  ModalBackView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  HeroModalView: {
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
    height: Platform.OS === 'ios' ? screenHeight * 260 : screenHeight * 250,
    width: Platform.OS === 'ios' ? screenWidth * 340 : screenWidth * 330,
    borderColor: '#fff',
    borderWidth: 6.5
  },
  HeroModalViewModify:{
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
    borderWidth: 6.5
  },
  modalText1: {
    fontFamily: 'soyoRegular',
    textAlign: 'center',
    fontSize: screenHeight * 22,
    color: '#FFFFFF',
    marginBottom: '4%',
    marginTop: '2%'
  },
  modalText2: {
    fontFamily: 'soyoRegular',
    textAlign: 'center',
    fontSize: screenHeight * 22,
    color: '#FFFFFF',
    marginBottom: '5%',
  },
  modalContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '5%'
  },
  radioButtonContainer: {
    borderRadius: 50,
    backgroundColor: 'white',
    marginLeft: '5%',
    marginRight: '10%',
    width: screenWidth * 35,
    height: screenHeight * 35,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2.5,
  },
  radioButtonContainer3: {
    borderRadius: 50,
    backgroundColor: 'white',
    marginLeft: '3%',
    marginRight: '3%',
    width: screenWidth * 35,
    height: screenHeight * 35,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2.5,
  },
  answerTx: {
    fontFamily: 'soyoRegular',
    fontSize: screenHeight * 19,
    color: '#FFFFFF',
    marginLeft: '10%'
  },
  answerTx3: {
    fontFamily: 'soyoRegular',
    fontSize: screenHeight * 19,
    color: '#FFFFFF',
    marginLeft: '5%'
  },
  ModifyAnswerTx:{
    fontFamily: 'soyoRegular',
    fontSize: screenHeight * 19,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: '5%'
  },
  ModifyAnswerTx3: {
    fontFamily: 'soyoRegular',
    fontSize: screenHeight * 20,
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: '7%',
    marginRight: '3%',
    justifyContent:'center',
    marginTop: '12%'
  },
  ModalBtnView: {
    marginTop: '15%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ModalFinalBtnView: {
    marginTop: '6%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonText: { // 버튼들 텍스트
    fontFamily: 'soyoRegular',
    color: '#fff',
    fontSize: screenHeight * 18,
    textAlign: 'center'
  },
  ModalInput: {
    marginTop: "7%",
    alignSelf: 'center',
    width: screenWidth * 250,
    height: screenHeight * 35,
    backgroundColor: "white",
    borderRadius: 10,
    textAlign: 'center',
    fontFamily: 'nanumRegular',
    fontSize: screenHeight * 20
  },
  ModifyModalInput: {
    marginTop: "7%",
    alignSelf: 'center',
    width: screenWidth * 210,
    height: screenHeight * 35,
    backgroundColor: "white",
    borderRadius: 10,
    textAlign: 'center',
    fontFamily: 'nanumRegular',
    fontSize: screenHeight * 20
  },
  bottomView: {
    flexDirection: 'row',
    width: '100%',
    marginTop: '15%'
  },
  ModalPreBtn: {
    flex: 1
  },
  ModalCancleBtn: {
    flex: 5
  },
  ModalNextBtn: {
    flex: 1
  },
  yesText: {
    marginVertical: '5%',
    fontFamily: 'soyoRegular',
    color: '#fff',
    fontSize: screenHeight * 18,
    textAlign: 'center',
    marginLeft: '40%'
  },
  FinalModalView: {
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
    height: Platform.OS === 'ios' ? screenHeight * 370 : screenHeight * 360,
    width: Platform.OS === 'ios' ? screenWidth * 340 : screenWidth * 330,
    borderColor: '#fff',
    borderWidth: 6.5
  },
  TitleInput: {
    borderRadius: 10,
    fontFamily: 'soyoRegular',
    fontSize: screenHeight * 17,
    width: screenWidth * 250,
    height: screenHeight * 40,
    paddingHorizontal: 10,
    textAlign: 'left',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2.5,
    backgroundColor: 'white',
  },
  SummaryText: {
    fontFamily: 'soyoRegular',
    fontSize: screenHeight * 17,
    marginTop: "10%",
    width: screenWidth * 250,
    height: screenHeight * 200,
    padding: '4%',
    textAlign: 'center',
    textAlignVertical: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2.5,
    backgroundColor: 'white',
    lineHeight: screenHeight * 25
  },
  TitleImageModal: {
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
    height: Platform.OS === 'ios' ? screenHeight * 560 : screenHeight * 550,
    width: Platform.OS === 'ios' ? screenWidth * 340 : screenWidth * 330,
    borderColor: '#fff',
    borderWidth: 6.5
  },
  TitleImageView: {
    height: Platform.OS === 'ios' ? screenHeight * 430 : screenHeight * 420,
    width: Platform.OS === 'ios' ? screenWidth * 290 : screenWidth * 280,
    borderRadius: 13,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  TitleImage: {
    height: Platform.OS === 'ios' ? screenHeight * 430 : screenHeight * 420,
    width: Platform.OS === 'ios' ? screenWidth * 290 : screenWidth * 280,
    borderRadius: 13,
  },
  TitleImageReMakeBtn: {

  },
  BookSaveBtn: {

  },
  ModalViewUploadBoard: {
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
    height: Platform.OS === 'ios' ? screenHeight * 210 : screenHeight * 200,
    width: Platform.OS === 'ios' ? screenWidth * 340 : screenWidth * 330,
    borderColor: '#fff',
    borderWidth: 6.5
  },
  PostBoardBtn: {

  },
  PostCancleBtn: {

  },
  GuideModal: {
    height: screenHeight * 600,
    width: screenWidth * 350,
    paddingTop: '5%',
    backgroundColor: "#7F6742",
    borderRadius: 13,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
    borderColor: '#fff',
    borderWidth: 5
  },
  GuideText: {
    height: "30%",
    width: "80%",
    backgroundColor: "white",
    marginLeft: "10%",
    borderRadius: 13,
    overflow: 'hidden'
  },
  GuideModalImage: {
    width: screenWidth * 180,
    height: screenHeight * 200,
    resizeMode: 'contain',
    borderRadius: 13,
    alignSelf: 'center',
    marginTop: '5%'
  },


  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  titleImage: {

    flex: 1,
  },

  loadingText: { // 로딩 버퍼링 텍스트 크기
    fontSize: screenWidth * 20,
    marginTop: screenHeight * 15,
  },

  imageContainer: {
    width: '90%',
    height: '40%',
    resizeMode: 'cover',
    marginTop: '5%',
    borderRadius: 10,
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },

  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 100,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },


  ///////////////////모달 관련된 스타일


  SaveAndPostBtn: {
    marginTop: "5%",
    width: "20%",
    height: "30%",
    borderRadius: 13,
    marginRight: "10%",
  },



  //////여기서부터 시작 부분 모달 스타일

  modalImage: {
    width: Dimensions.get('window').width * 1,
    height: Dimensions.get('window').height * 0.3,
    resizeMode: 'contain', // 이미지 크기 조절 방식 설정 (contain, cover, stretch 등)
    marginTop: 15,
    marginBottom: 10,
  },
  modalImage2: {
    width: Dimensions.get('window').width * 1,
    height: Dimensions.get('window').height * 0.3,
    resizeMode: 'contain', // 이미지 크기 조절 방식 설정 (contain, cover, stretch 등)

  },

  helpbtn: {
    width: screenWidth * 70,
    height: screenHeight * 35,
    backgroundColor: 'tomato',
    alignItems: 'center',
    marginEnd: screenWidth * 15,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },  // 그림자 위치
    shadowOpacity: 0.2,  // 그림자 투명도
    shadowRadius: 1.2,     // 그림자 블러 반경
  },
  helptx: {
    fontFamily: 'soyoRegular',
    color: '#fff',
    fontSize: Platform.OS === 'ios' ? 14.5 : 17.5,
    marginTop: Platform.OS === 'ios' ? 5.5 : 8
  },
});
