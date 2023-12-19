import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import UserDataContext from '../UserDataContext';
import axios from 'axios';
import ImageProgress from 'react-native-image-progress';
import ProgressCircle from 'react-native-progress';
import Swiper from 'react-native-swiper';
import { Dimensions } from 'react-native';
import { screenWidth, screenHeight } from '../screenSize';
import { ScrollView } from 'react-native-gesture-handler';


export default function BookList({ navigation }) {
    const [boardList, setBoardList] = useState([]);
    const [promotionList, setPromotionList] = useState([]);
    const [selectedOption, setSelectedOption] = useState('boardList');
    const [selectedLabel, setSelectedLabel] = useState('최신순');
    const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 10;
    const context = useContext(UserDataContext);
    const address = context.userIp;

    // 선택한 옵션에 따라 리스트를 가져오는 함수
    const fetchBoardList = async () => {
        console.log(selectedOption);
        if(selectedOption == 'boardList') {
            setSelectedLabel('최신 순');
        } else if(selectedOption == 'commentBoardList') {
            setSelectedLabel('댓글 순');
        } else if(selectedOption == 'viewBoardList') {
            setSelectedLabel('조회수 순');
        } else {
            setSelectedLabel('좋아요 순');
        }
        try {
            await axios.post(`${address}/server/board/${selectedOption}`,
            { 
                currentPage: currentPage,
                pageSize: pageSize
            })
            .then((response) => {
                setBoardList(response.data.boardList);
                setTotalPages(response.data.totalPages);
            })
            .catch((error) => {
                console.error(error);
            })
        } catch (error) {
            console.error(error);
            setBoardList([]);
        }
    };

    const fetchPromotionList = async () => {
        try {
            await axios.post(`${address}/server/board/promotionList`,
            { 
                currentPage: currentPage,
                pageSize: pageSize
            })
            .then((response) => {
                setPromotionList(response.data.promotionList);
                setTotalPages(response.data.totalPages);
            })
            .catch((error) => {
                console.error(error);
            })
        } catch (error) {
            console.error(error);
            setPromotionList([]);
        }
    }

    // 선택한 게시물의 product를 BookInfo 페이지에 보내는 함수
    const fetchBoardDetails = (product) => {
        navigation.navigate('BookInfo', { product: product });
    };
    
    // 검색 실행 함수
    const handleSearch = async () => {
        const response = await axios.post(`${address}/server/board/selectTitle`, { title: searchTerm });
        setBoardList(response.data.selectTitle);
    };

    // 아이템 렌더링에 사용될 컴포넌트
    const renderItem = ({ item }) => {
        const summary = item.summary.length > 25 ? item.summary.substring(0, 65) + '...' : item.summary;
        const formattedDate = item.date.split(' ')[0];

        return (
            <TouchableOpacity onPress={() => fetchBoardDetails(item)}>
                <View style={styles.bookItem}>
                    <View style={styles.bookCoverView}>
                <ImageProgress
                    indicator={ProgressCircle}
                    source={{ uri: item.titleImage }}
                    style={styles.bookCover}
                    resizeMode="cover" // 이미지 크기에 맞게 조정
                />
                </View>
                <View style={styles.bookInfo}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.summary}>{summary}</Text>
                    <Text style={styles.date}>{formattedDate}</Text>
                </View>
                </View>
            </TouchableOpacity>
        );
    };

    //유료회원 책 홍보 슬라이더 렌더링 컴포넌트
    const renderSwiperItem = (data) => {
        return data.map((item, index) => {
            const summary = item.summary.length > 25 ? item.summary.substring(0, 65) + '...' : item.summary;
            const formattedDate = item.date.split(' ')[0];
    
            return (
                <TouchableOpacity key={index} onPress={() => fetchBoardDetails(item)}>
                    <View key={item.id} style={styles.bookItem2}>
                        <View style={styles.bookCoverView}>
                            <ImageProgress
                                source={{ uri: item.titleImage }}
                                style={styles.bookCover}
                            />
                        </View>
                        <View style={styles.bookInfo}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.summary}>{summary}</Text>
                            <Text style={styles.date}>{formattedDate}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        });
    };

    const handleChangePage = (newPage) => {
        setCurrentPage(newPage);
    };

    useEffect(() => {
        handleSearch();
    }, [searchTerm])

    useEffect(() => {
        fetchBoardList();
    }, [selectedOption, currentPage]);
    useEffect(() => {
        fetchPromotionList();
    },[]);

    // UI 렌더링 부분
    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Image source={require('../../assets/icon/search_book.png')} style={{width: 17, height: 20, marginLeft: 10}} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="검색어 입력"
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                />
            </View>
            <View style={styles.optionView}>
                <Text style={styles.optionText}>{selectedLabel}</Text>
                <RNPickerSelect
                    onValueChange={(value) => setSelectedOption(value)}
                    items={[
                        { label: '댓글 순', value: 'commentBoardList' },
                        { label: '조회수 순', value: 'viewBoardList' },
                        { label: '좋아요 순', value: 'likeBoardList' },
                    ]}
                    placeholder={{ label: "최신 순", value: 'boardList' }}
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
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={{flexDirection: 'row',justifyContent:'center'}}>
                    <Image source={require('../../assets/icon/chick_bookQ.png')} style={{width:Dimensions.get('window').width * 0.1,height:Dimensions.get('window').height * 0.05}}/>
                    <Text style={{ fontSize: screenHeight * 18,margin:5,backgroundColor:'rgba(255,255,0,0.35)',alignSelf:'flex-start', fontFamily:'soyoBold' }}>이런 책은 어때요??</Text>
                </View>
                <View style={styles.swiperContainer}>
                    <Swiper height={screenHeight * 150} horizontal={true} autoplay={true} autoplayTimeout={2.5} loop spaceBetween={20}>
                        {renderSwiperItem(promotionList)}
                    </Swiper>
                </View>
                {boardList.map((product, index) => (
                        <TouchableOpacity key={index} onPress={() => fetchBoardDetails(product)}>
                            <View key={product.id} style={styles.bookItem}>
                                <View style={styles.bookCoverView}>
                                    <ImageProgress source={{ uri: product.titleImage }} style={styles.bookCover} />
                                </View>
                                <View style={styles.bookInfo}>
                                    <Text style={styles.title}>{product.title}</Text>
                                    <Text style={styles.name}>{product.name}</Text>
                                    <Text style={styles.summary} numberOfLines={3}>{product.summary}</Text>
                                    <Text style={styles.date}>{product.date.split(' ')[0]}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        ))}

                <View style={styles.paginationContainer}>
                        {currentPage > 1 && (
                            <TouchableOpacity style={styles.paginationButton} onPress={() => handleChangePage(currentPage - 1)}>
                                <Text style={styles.paginationText}>이전</Text>
                            </TouchableOpacity>
                        )}
                        {currentPage <= 1 && (
                            <TouchableOpacity style={styles.paginNoactionButton}>
                                <Text style={styles.paginationText}>이전</Text>
                            </TouchableOpacity>
                        )}
                        <Text style={styles.pageText}>{currentPage}</Text>
                        {totalPages != 1 && (
                            <TouchableOpacity style={styles.paginationButton} onPress={() => handleChangePage(currentPage + 1)}>
                                <Text style={styles.paginationText}>다음</Text>
                            </TouchableOpacity>
                        )}
                        {totalPages == 1 && (
                            <TouchableOpacity style={styles.paginNoactionButton}>
                                <Text style={styles.paginationText}>다음</Text>
                            </TouchableOpacity>
                        )}
                    </View>

            </ScrollView>

        </View>
    );
}

// 스타일 정의
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginBottom: Platform.OS === 'ios' ? screenHeight * 100 : screenHeight * 63,
    },
    item: {
        flexDirection: 'row',
        marginBottom: 10,
        borderBottomWidth: 0.2,
        borderRadius: 5,
        padding: 10,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 5,
    },
    infoContainer: {
        flex: 1,
        marginLeft: 10
    },
    title: {
        flex:1.5,
        fontFamily: 'soyoBold',
        fontSize: screenHeight * 16,
        lineHeight: screenHeight * 24,
    },
    name: {
        flex:1,
        fontFamily: 'soyoRegular',
        fontSize: screenHeight * 13,
    },
    summary: {
        flex:2.5,
        fontFamily: 'soyoRegular',
        fontSize: screenHeight *14,
        lineHeight:screenHeight * 20
    },
    date: {
        flex:0.5,
        fontFamily: 'soyoRegular',
        fontSize: screenHeight * 13,
        alignSelf: 'flex-end',
    },
    picker: {
        height: 30,
        width: '100%',
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
        marginTop: '2%'
    },
    RNPView: {
        flexDirection: 'row',
    },
    RNPText: {
        fontFamily: 'soyoBold',
        fontSize: screenHeight * 14,
        marginTop: 7,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontFamily: 'soyoRegular',
        fontSize: screenHeight * 16,
    },
    searchButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ddd',
        padding: 5,
        borderRadius: 5,
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

    optionView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5,
    },
    optionText: {
        fontFamily: 'soyoRegular',
        fontSize: screenHeight * 20,
        marginLeft: '2%'
    },
    swiperContainer: {
        backgroundColor: '#FFF', // 배경색 추가
        height: screenHeight * 197,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0.15},
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 4,
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
        borderRadius:5,
        backgroundColor: '#FFF' ,
        marginBottom: '2%'
    },
    bookCover: {
        width: screenWidth * 120,
        height: screenHeight * 160,
        resizeMode: 'cover',
        borderRadius: 2,
    },
    bookItem: {
        flexDirection: 'row',
        width: '100%',
        padding: 10,
        marginTop: 4,
        marginBottom: 4,
        borderBottomWidth: 0.2,
        borderBottomColor: 'rgba(0,0,0,0.5)'
    },
    bookItem2: {
        flexDirection: 'row',
        width: '100%',
        padding: 10,
        marginTop: 4,
        marginBottom: 2,
    },
    bookItemPreM: {
        flexDirection: 'row',
        width: '100%',
        padding: 10,
        marginTop: 6,
        marginBottom: 4,
        borderBottomWidth: 0.2,
        borderBottomColor: 'rgba(0,0,0,0.5)',

    },
    bookInfo: {
        height: screenHeight * 160,
        paddingLeft: '2%',
        paddingRight: '3%',
        flex: 1,
    },
    scrollContainer: {
        width:'100%',
        alignItems: 'center',
        backgroundColor:'#fff'
    },
});
