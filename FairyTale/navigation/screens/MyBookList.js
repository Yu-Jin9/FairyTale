import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import UserDataContext from '../UserDataContext';
import axios from 'axios';
import ImageProgress from 'react-native-image-progress';
import { Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { screenWidth, screenHeight } from '../screenSize';

export default function MyBookList({ navigation }) {
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
    const userId = context.userId;
    const currentDate = new Date();

    // 선택한 옵션에 따라 리스트를 가져오는 함수
    const fetchBoardList = async () => {
        try {
            await axios.post(`${address}/server/board/myBookList`,
            { 
                id: userId,
                currentPage: currentPage,
                pageSize: pageSize
            })
            .then((response) => {
                setBoardList(response.data.myFairyTale);
                setTotalPages(response.data.totalPages);
                console.log(totalPages,'@@@@@@@@@@@@');
            })
            .catch((error) => {
                console.error(error);
            })
        } catch (error) {
            console.error(error);
            setBoardList([]);
        }
    };

    // 선택한 게시물의 product를 BookInfo 페이지에 보내는 함수
    const fetchBoardDetails = (product) => {{
        if(context.userMembership != 'true' || new Date(context.endMembershipDate) <= currentDate ){
          Alert.alert('멤버쉽 회원 전용 기능입니다.','해당 기능은 멤버쉽 회원만 이용 가능합니다.\n멤버쉽 결제 페이지로 이동하시겠습니까?',
          [
            {
              text: '예',
              onPress: () =>navigation.navigate('PaymentPage')
            },
            {
              text: '아니오',
              onPress: () => console.log('사용자가 아니오를 선택했습니다.'),
              style: 'cancel'
            }
          ],
          { cancelable: false }
          );
        } else {
        navigation.navigate('UserAddress', { product: product });
        }}
    };
    useEffect(()=> {
        fetchBoardList();

    },[]);
    

    // // 아이템 렌더링에 사용될 컴포넌트
    // const renderItem = ({ item }) => {
    //     const summary = item.summary.length > 25 ? item.summary.substring(0, 65) + '...' : item.summary;

    //     return (
    //         <TouchableOpacity style={styles.item} onPress={() => fetchBoardDetails(item)}>
    //             <ImageProgress
    //                 indicator={ProgressCircle}
    //                 source={{ uri: item.titleImage }}
    //                 style={styles.image}
    //                 resizeMode="cover" // 이미지 크기에 맞게 조정
    //             />
    //             <View style={styles.infoContainer}>
    //                 <Text style={styles.title}>{item.title}</Text>
    //                 <Text style={styles.name}>{item.name}</Text>
    //                 <Text style={styles.summary}>{summary}</Text>
    //                 <Text style={styles.date}>{item.date}</Text>
    //             </View>
    //         </TouchableOpacity>
    //     );
    // };

    const handleChangePage = (newPage) => {
        setCurrentPage(newPage);
    };

    useEffect(() => {
        fetchBoardList();
    }, [currentPage]);
    // UI 렌더링 부분
    return (
        <View style={styles.container}>
            <View style={{flexDirection: 'row',justifyContent:'center', width:'100%', height:'8%'}}>
                <Image source={require('../../assets/icon/chick_bookQ.png')} style={{width:screenWidth * 40,height:screenHeight * 42,marginRight:'3%', marginVertical: '2%'}}/>
                <Text style={{ alignSelf:'center',fontSize: screenHeight * 24, fontFamily:'soyoBold'}}>배송받으실 책을 선택해주세요</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
            {boardList.map((product, index) => (
                    <TouchableOpacity  key={index} onPress={() => fetchBoardDetails(product)}>
                        <View key={product.id} style={styles.bookItem}>
                            <View style={styles.bookCoverView}>
                            <ImageProgress
                             source={{ uri: product.titleImage }} style={styles.bookCover} />
                            </View>
                            <View style={styles.bookInfo}>
                                <Text style={styles.title}>{product.title}</Text>
                                <Text style={styles.name}>{product.name}</Text>
                                <Text style={styles.summary} numberOfLines={3}>{product.summary}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    ))}
            </ScrollView>
           
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
        </View>
    );
}

// 스타일 정의
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        flexDirection: 'row',
        marginBottom: 10,
        borderBottomWidth: 0.2,
        borderRadius: 5,
        padding: 10,
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
        height: 40,
        flexDirection: 'row',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
    },
    RNPView: {
        flexDirection: 'row',
    },
    RNPText: {
        marginTop: 7,
        fontWeight: 'bold',
    },
    searchInput: {
        flex: 1,
        marginLeft: 10
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
        paddingTop: '2.5%',
        paddingLeft: '6%',
        paddingRight: '6%',
        paddingBottom: '1%',
        borderTopColor: 'rgba(0,0,0,0.025)',
        borderWidth: 2,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth:0
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
        fontSize: 20
    },
    scrollContainer: {
        width:'94%',
        alignItems: 'center',
        backgroundColor:'transparent',
        alignSelf: 'center'
    },
    bookItem: {
        flexDirection: 'row',
        width: '100%',
        padding: 10,
        marginTop: 3.5,
        marginBottom: 3.5,
        backgroundColor: '#fff',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {width:1, height:1},
        shadowOpacity: 0.25,
        shadowRadius: 1
    },
    bookCoverView: {
        // transform: [{ perspective: 570 }, { rotateY: '36deg' }],
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.35,
        shadowRadius: 3.84,
        elevation: 4,
        // borderColor: Platform.OS === 'ios' ? null : 'rgba(0,0,0,0.1)',
        // borderWidth: Platform.OS === 'ios' ? 0 : 3.5,
        // borderRadius:5,
        backgroundColor:'#FFF'
    },
    bookCover: {
        width: screenWidth * 120,
        height: screenHeight * 160,
        resizeMode: 'cover',
        borderRadius: 4,
    },
    bookInfo: {
        height: screenHeight * 160,
        width: screenWidth * 110,
        flex: 1,
        marginHorizontal: '4%'
    },
});