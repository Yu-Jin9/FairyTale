import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Linking, TextInput, Platform } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import { screenWidth, screenHeight } from '../screenSize';

export default function RecommendList({ navigation }) {
    const [start, setStart] = useState(1);
    const [page, setPage] = useState(1);
    const [productList, setProductList] = useState([]);
    const [queryType, setQueryType] = useState('ItemEditorChoice');
    const [selectedLabel, setSelectedLabel] = useState('편집자 추천 리스트');
    // 검색창 텍스트
    const [searchTerm, setSearchTerm] = useState('');
    // 알라딘 apiKey
    const aladinApiKey = 'ttb532791057001';

    const fetchAladinProductList = async () => {
        if(queryType == 'ItemEditorChoice') {
            setSelectedLabel('편집자 추천 리스트');
        } else if(queryType == 'ItemNewAll') {
            setSelectedLabel('신간 전체 리스트');
        } else if(queryType == 'ItemNewSpecial') {
            setSelectedLabel('주목할 만한 신간 리스트');
        } else {
            setSelectedLabel('베스트셀러 리스트');
        }
        try {
            const url = `https://www.aladin.co.kr/ttb/api/ItemList.aspx`;
            const params = {
                TTBKey: aladinApiKey,
                QueryType: queryType,
                MaxResults: 10, // 가져올 상품의 최대 개수
                Start: start, // 시작 인덱스
                CategoryId: 13789,
                Cover: 'Big',
                Output: 'js', // JSON 형식으로 데이터를 요청
                Version: 20131101 // API 버전
            };
            // axios를 이용하여 API 요청
            const response = await axios.get(url, { params });

            // 응답 데이터에서 상품 리스트 추출
            setProductList(response.data.item);
            console.log(response.data.item[0]);
        } catch (error) {
            console.error('Error fetching Aladin product list:', error);
        }
    };

    const fetchAladinProductFind = async () => {
        try {
            const url = `http://www.aladin.co.kr/ttb/api/ItemSearch.aspx`;
            const params = {
                TTBKey: aladinApiKey,
                QueryType: searchTerm ? 'Title' : queryType,
                Query: searchTerm, // 검색어가 있을 경우에만 Query 설정
                MaxResults: 10, // 가져올 상품의 최대 개수
                Start: 1, // 시작 인덱스
                CategoryId: 1108,
                Cover: 'Big',
                Output: 'js', // JSON 형식으로 데이터를 요청
                Version: 20131101 // API 버전
            };
            // axios를 이용하여 API 요청
            const response = await axios.get(url, { params });

            // 응답 데이터에서 상품 리스트 추출
            setProductList(response.data.item || []);
        } catch (error) {
            console.error('Error fetching Aladin product list:', error);
        }
    };

    useEffect(() => {
        if (searchTerm === '') {
            fetchAladinProductList();
        } else {
            const delaySearch = setTimeout(() => {
                fetchAladinProductFind();
            }, 500);
            return () => clearTimeout(delaySearch);
        }
    }, [start, queryType, searchTerm]);

    const handleNext = () => {
        setStart(prevStart => prevStart + 10);
        setPage(prevPage => prevPage + 1);
    };

    const handlePrev = () => {
        setStart(prevStart => (prevStart > 1 ? prevStart - 10 : 1));
        setPage(prevPage => prevPage - 1);
    };

    const handleSearch = () => {
        if (searchTerm !== '') {
            fetchAladinProductFind();
        }
    };

    return (
        <View style={styles.mainContainer}>
            <View style={styles.searchContainer}>
                <Image source={require('../../assets/icon/search_book.png')} style={{width: 17, height: 20, marginLeft: 10}} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="검색어 입력"
                    value={searchTerm}
                    onChangeText={(inputText) => setSearchTerm(inputText)}
                />
            </View>
            <View style={styles.optionView}>
                <Text style={styles.optionText}>{selectedLabel}</Text>
                <RNPickerSelect
                    onValueChange={(value) => setQueryType(value)}
                    items={[
                        { label: '신간 전체 리스트', value: 'ItemNewAll' },
                        { label: '주목할 만한 신간 리스트', value: 'ItemNewSpecial' },
                        { label: '베스트셀러 리스트', value: 'Bestseller' },
                    ]}
                    placeholder={{ label: "편집자 추천 리스트", value: 'ItemEditorChoice' }}
                    style={{
                        inputIOS: {
                            fontFamily: 'soyoRegular',
                            fontSize: screenHeight * 20,
                        },
                        inputAndroid: {
                            fontFamily: 'soyoRegular',
                            fontSize: screenHeight * 20,
                        },
                        itemStyle: { fontFamily: 'soyoRegular', fontSize: screenHeight * 20},
                    }}
                >
                    <View style={styles.RNPView}>
                        <Text style={styles.RNPText}>{selectedLabel}</Text>
                        <Image source={require('../../assets/icon/listDown_book.png')} style={{width: 30, height: 30}}/>
                    </View>
                </RNPickerSelect>
            </View>
            <ScrollView contentContainerStyle={styles.container}>
                {productList.map((product, index) => (
                    <TouchableOpacity key={index} onPress={() => navigation.navigate('RecommendInfo', { product: product })}>
                        <View key={product.itemId} style={styles.bookItem}>
                            <View style={styles.bookCoverView}>
                            <Image source={{ uri: product.cover }} style={styles.bookCover} />
                            </View>
                            <View style={styles.bookInfo}>
                                <Text style={styles.title}>{product.title}</Text>
                                <Text style={styles.author}>{product.author}</Text>
                                <Text style={styles.description} numberOfLines={3}>{product.description}</Text>
                                <Text style={styles.pubDate}>{product.pubDate}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <View style={styles.paginationContainer}>
                {start > 1 && (
                    <TouchableOpacity style={styles.paginationButton} onPress={handlePrev}>
                        <Text style={styles.paginationText}>이전</Text>
                    </TouchableOpacity>
                )}
                {start <= 1 && (
                    <TouchableOpacity style={styles.paginNoactionButton}>
                        <Text style={styles.paginationText}>이전</Text>
                    </TouchableOpacity>
                )}
                <Text style={styles.pageText}>{page}</Text>
                <TouchableOpacity style={styles.paginationButton} onPress={handleNext}>
                    <Text style={styles.paginationText}>다음</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1, 
        backgroundColor: '#fff'
    },
    optionView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5,
    },
    RNPView: {
        flexDirection: 'row',
    },
    RNPText: {
        fontFamily: 'soyoBold',
        fontSize: screenHeight * 14,
        marginTop: 7,
    },
    optionText: {
        fontFamily: 'soyoRegular',
        fontSize: screenHeight * 20
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontFamily: 'soyoRegular',
        fontSize: screenHeight * 16,
    },
    searchContainer: {
        height: screenHeight * 45,
        flexDirection: 'row',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        width: screenWidth * 380,
        alignSelf: 'center',
        marginTop: '2%',
    },
    container: {
        width:'100%',
        alignItems: 'center',
        backgroundColor:'#fff'
    },
    bookItem: {
        flexDirection: 'row',
        width: '100%',
        padding: 10,
        marginTop: 3.5,
        marginBottom: 3.5,
        borderBottomWidth: 0.2,
        borderBottomColor: 'rgba(0,0,0,0.5)'
    },
    bookCoverView: {
        transform: [{ perspective: 570 }, { rotateY: '36deg' }],
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.35,
        shadowRadius: 3.84,
        borderColor: Platform.OS === 'ios' ? null : 'rgba(0,0,0,0.1)',
        borderWidth: Platform.OS === 'ios' ? 0 : 3.5,
        borderRadius: 5
    },
    bookCover: {
        width: screenWidth * 115,
        height: screenHeight * 150,
        resizeMode: 'cover',
        borderRadius: 2,
    },
    bookInfo: {
        height: screenHeight * 160,
        paddingLeft: '2.5%',
        paddingRight: '5%',
        flex: 1,
    },
    title: {
        flex:1.5,
        fontFamily: 'soyoBold',
        fontSize: screenHeight * 16,
        lineHeight: screenHeight * 24,
    },
    author: {
        flex:1,
        fontFamily: 'soyoRegular',
        fontSize: screenHeight * 13,
    },
    description: {
        flex:2.5,
        fontFamily: 'soyoRegular',
        fontSize: screenHeight *14,
    },
    pubDate: {
        flex:0.5,
        fontFamily: 'soyoRegular',
        fontSize: screenHeight * 13,
        alignSelf: 'flex-end',

    },
    paginationContainer: {
        width: '100%',
        height: Platform.OS === 'ios' ? screenHeight * 80 : screenHeight * 60 ,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: '3%',
        paddingLeft: '5%',
        paddingRight: '5%',
        borderTopColor: 'rgba(0,0,0,0.05)',
        borderWidth: 2,
        borderLeftColor: '#fff',
        borderRightColor: '#fff',
        borderBottomColor: '#fff'
        },
    paginNoactionButton: {
        width: screenWidth * 50,
        height: screenHeight * 35,
        backgroundColor: '#BFBFBF',
        borderRadius: 7,
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 1.5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 1.5,
        elevation: 1.5,
    },
    paginationButton: {
        width: screenWidth * 50,
        height: screenHeight * 35,
        backgroundColor: '#FF9900',
        borderRadius: 7,
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 1.5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 1.5,
        elevation: 1.5,
    },
    paginationText: {
        fontFamily: 'soyoRegular',
        color: 'white',
        fontSize: screenHeight * 18,
        textAlign: 'center',
        marginTop: Platform.OS === 'ios' ? '10%' : '15%'
    },
    pageText: {
        fontFamily : 'soyoRegular',
        fontSize: screenHeight * 16,
        marginTop: '3%'
    },

   
});
