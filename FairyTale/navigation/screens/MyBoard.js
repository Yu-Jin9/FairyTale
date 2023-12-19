import React, { useState, useContext, useCallback } from "react";
import { View, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import UserDataContext from "../UserDataContext";
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

import { screenWidth, screenHeight } from "../screenSize";

export default function MyBoard({ navigation }) {
    const context = useContext(UserDataContext);
    const address = context.userIp;
    const userId = context.userId;
    const [boardList, setBoardList] = useState([]);
    
    // 컬럼 수와 이미지 크기 계산
    const numColumns = 3;
    const widthsize = screenWidth * 411.42857142857144 / numColumns;

    const getMyFairyTale = async () => {
        try {
            await axios.post(address + '/server/board/myBoard', {
                id: userId
            })
            .then((response) => {
                setBoardList(response.data.myBoard);
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
        <TouchableOpacity onPress={() => navigation.navigate('BookInfo', { product: item, pNum: 0 })}>
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
            <Image
                source={{ uri: item.titleImage }}
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
        <View style={{flex:1}}>
            <FlatList
                style={{backgroundColor:'#fff', flex:1, marginBottom: screenHeight * 65}}
          data={boardList}
          renderItem={renderItem}
          keyExtractor={(item, index) => String(index)}
          numColumns={numColumns} // 한 줄에 표시할 컬럼 수 지정
          horizontal={false} // 수평 스크롤 비활성화
        />
        </View>
    );
}