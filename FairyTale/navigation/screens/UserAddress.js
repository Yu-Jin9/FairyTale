import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet, Modal, Dimensions, Alert } from 'react-native';
import Postcode from '@actbase/react-daum-postcode';
import ImageProgress from 'react-native-image-progress';
import { screenWidth, screenHeight } from '../screenSize';
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function UserAddress({ route, navigation }) {
    const product = route.params.product;
    const [isModal, setModal] = useState(false);
    const [address, setAddress] = useState('');
    const [extraAddress, setExtraAddress] = useState('');

    const fetchBookAddress = (product) => {
        if(address=='' || extraAddress==''){
            Alert.alert('주소를 확인해주세요.','배송 받으실 주소를 입력해주세요.');
        } else {
        navigation.navigate('PayMent', { book: product.title, address: address + ' ' + extraAddress, amount: 15000, product: "내가 쓴 책 만들기" });
        }
    };

    const getAddressData = data => {
        if (!data) {
            console.log('Data is undefined!');
            return;
        }
        let defaultAddress = '';
        if (data.buildingName === 'N') {
            defaultAddress = data.apartment;
        } else {
            defaultAddress = data.buildingName;
        }

        setAddress(data.address + ' ' + defaultAddress);
        console.log(data.address);
        console.log(address);
        setModal(false);
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <KeyboardAwareScrollView>
                <View style={{alignItems:'center',justifyContent:'center'}}>
                    <Text style={{fontSize: screenHeight *26,fontFamily:'soyoBold',top:'5%'}}>{product.name} 작가님의</Text>
                    <Text style={{fontSize: screenHeight *26,fontFamily:'soyoBold',top:'6%'}}>작품을 실제 책으로 만나보세요</Text>
                    <View style={styles.ImageBackView}>
                        <ImageProgress
                            source={{uri:product.titleImage}}
                            style={{height:'100%', width: '100%'}}
                            resizeMode='cover'
                        />
                    </View>
                    <Text style={{fontSize: screenHeight * 24,fontFamily:'soyoBold',top:'10%', textAlign: 'center'}}>{product.title}</Text>
                    <View style={{width:'85%', top:'12%', alignSelf:'center'}}>
                        <Text style={{fontSize: screenHeight * 16, fontFamily:'soyoRegular', lineHeight:screenHeight*25}}>{product.summary}</Text>
                    </View>
                </View>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Modal visible={isModal}>
                        <Postcode
                            style={styles.postcode}
                            jsOptions={{ animation: true, hideMapBtn: true }}
                            onSelected={data => {
                                getAddressData(data);
                                
                            }}
                        />
                    </Modal>
                    <View style={styles.bottomView}>
                        <View style={styles.inputView1}>
                            <View style={styles.inputBack1}>
                                <TextInput
                                    style={styles.input1}
                                    onChangeText={setAddress}
                                    value={address}
                                    placeholder="주소찾기 버튼을 눌러 주소를 추가해주세요."
                                    editable={false}
                                />
                            </View>
                            <TouchableOpacity style={styles.button} onPress={() => setModal(true)}>
                                {/* <Image source={require('../../assets/icon/chick_bookQ.png')} style={{width: Dimensions.get('screen').width * 0.06,height: Dimensions.get('screen').height * 0.03}}/> */}
                                <Text style={{fontSize:15,fontFamily:'soyoBold',color:'#2478FF'}}>주소찾기</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputView2}>
                            <View style={styles.inputBack2}>
                                <TextInput
                                    style={styles.input2}
                                    onChangeText={setExtraAddress}
                                    value={extraAddress}
                                    placeholder="추가 주소를 입력하세요"
                                />
                            </View>
                        </View>

                        <View style={styles.inputView3}>
                            <TouchableOpacity style={styles.button2} onPress={() => fetchBookAddress(product)}>
                                <Text style={styles.buttonText2}>₩ 15000 결제하러 가기</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
                </KeyboardAwareScrollView>
            </ScrollView>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#fff'
    },
    postcode: {
        marginTop: "10%",
        height: "100%",
        width: "100%",
    },
    button: {
        width: screenWidth * 83,
        height: screenHeight * 40,
        backgroundColor: "#fff",
        borderColor:'#2478FF',
        borderWidth: 2 ,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: '1.5%',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {width:1, height:1},
        shadowOpacity: 0.25,
        shadowRadius: 1,
    },
    ImageBackView: {
        height: screenHeight * 400, 
        width: '76%' , 
        top:'10%',
        shadowColor:'#000',
        shadowOffset: {width:2, height:3},
        shadowOpacity: 0.25,
        shadowRadius: 1.5,
        elevation: 3,
        backgroundColor: '#fff',
        marginBottom : '5%'
    },
    bottomView: {
        width: '90%',
        height: screenHeight * 310,
        flexDirection: 'column',
        alignItems: 'center',
        alignContent:'center',
        justifyContent:'center',
        marginTop : '12%'
    },
    inputView1: {
        width: '90%',
        alignSelf: 'center',
        flexDirection:'row',
        marginBottom: '3%'
    },
    inputView2: {
        width: '90%',
        alignSelf: 'center',
        marginTop :'1%',
        marginBottom: '10%'
    },
    inputView3: {
        width: '100%',
        alignItems: 'center',
        justifyContent:'center',
        alignSelf :'center',
        paddingLeft: '10%'
    },
    button2: {
        width: '100%',
        height: screenHeight * 60,
        backgroundColor: "#fff",
        borderWidth: 3,
        borderColor:"#2478FF",
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {width:1, height:1},
        shadowOpacity: 0.25,
        shadowRadius: 1,
    },
    buttonText2: {
        fontSize: screenHeight * 24,
        fontFamily:'soyoBold',
        color:'#2478FF'
    },
    inputBack1: {
        backgroundColor : '#fff',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {width:1, height:1},
        shadowOpacity: 0.25,
        shadowRadius: 1,
        borderRadius: 5,
        borderColor: 'rgba(0,0,0,0.08)',
        borderWidth: 1,
        justifyContent: 'center'
    },
    input1: {
        fontFamily: 'soyoRegular',
        width: screenWidth * 300,
        height: screenHeight * 40,
        fontSize: screenHeight * 18,
        paddingLeft: '2%',
        justifyContent: 'center'
    },
    inputBack2: {
        backgroundColor : '#fff',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {width:1, height:1},
        shadowOpacity: 0.25,
        shadowRadius: 1,
        borderRadius: 5,
        borderColor: 'rgba(0,0,0,0.08)',
        borderWidth: 1,
        justifyContent: 'center'
    },
    input2: {
        fontFamily: 'soyoRegular',
        width: screenWidth * 380,
        height: screenHeight * 40,
        fontSize: screenHeight * 20,
        paddingLeft: '2%',
        justifyContent: 'center'
    },
});