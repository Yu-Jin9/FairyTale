import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, ActivityIndicator, TouchableOpacity, Image, Modal, Button, StyleSheet, Dimensions, Alert } from 'react-native';
import UserDataContext from '../UserDataContext';
import { screenWidth, screenHeight } from '../screenSize';

function PaymentPage({ navigation }) {
    const context = useContext(UserDataContext);
    const userId = context.userId;
    const userName = context.userName;
    const userMembership = context.userMembership;
    const endMembershipDate = context.endMembershipDate;
    const currentDate = new Date();
    

    const renderButton = () => {
        if (!userMembership || new Date(endMembershipDate) <= currentDate) {
            return (
                <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('PayMent', {
                    product: '정기 회원권 결제',
                    amount: '29000',
                    address: '',
                    book: '',
                })}>
                    <Text style={styles.buttonText}>￦ 29000 결제하러 가기</Text>
                </TouchableOpacity>
            );
        } else {
            return (
                <View style={styles.disabledButton}>
                    <Text style={styles.disabledText}>이미 회원입니다.</Text>
                    <Text style={styles.disabledText2}>( ~{endMembershipDate.split(' ')[0]} 까지)</Text>
                </View>
            );
        }
    };

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.text}>북작북작을 이용해주시는</Text>
                <Text style={styles.text2}>특별한 {userName} 작가님을 환영합니다 !</Text>
                <Text style={styles.miniText}>북작북작이 준비한</Text>
                <Text style={styles.miniText2}>특별한 기능을 경험하세요</Text>
            </View>
            <View style={{justifyContent: 'center',}}>
                <Image 
                style={{ marginTop: '5%', width:screenWidth * 300, height:screenHeight * 300, alignSelf: 'center'}}
                source={require('../../assets/icon/paymentIcon.png')}/>
                <View style={styles.container2}>
                    <View style={styles.ImageItems}>
                    <Image
                        style={styles.image}
                        source={require('../../assets/icon/paymenttts.png')}
                    />
                    <Text style={[styles.exImageTx,{marginTop:'12%'}]}>원하는 목소리로</Text>
                    <Text style={styles.exImageTx}>책을 들을 수 있어요</Text>
                    </View>

                    <View  style={styles.ImageItems}>
                    <Image
                        style={styles.image}
                        source={require('../../assets/icon/paymentedit.png')}
                    />
                    <Text style={[styles.exImageTx,{marginTop:'12%'}]}>인공지능의 도움으로</Text>
                    <Text style={styles.exImageTx}>더더욱 쉽게 동화를</Text>
                    <Text style={styles.exImageTx}>만들어봐요</Text>
                    </View>

                    <View  style={styles.ImageItems}>
                    <Image
                        style={styles.image}
                        source={require('../../assets/icon/paymentdelivery.png')}
                    />
                    <Text style={[styles.exImageTx,{marginTop:'12%'}]}>실제 책으로 만들고</Text>
                    <Text style={styles.exImageTx}>배송 해드려요</Text>
                    <Text style={styles.exImageTx}>(추가 결제 필요)</Text>
                    </View>
                </View>
            </View>
            {/* <TouchableOpacity style={styles.button2} onPress={()=>navigation.navigate('PayMent',{
               product: '정기 회원권 결제',
               amount: '29000',
               address: '',
               book:'',
               })}>
                    <Text style={styles.buttonText}>￦ 29000 결제하러 가기</Text>
            </TouchableOpacity> */}
            {renderButton()}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    text:{
        marginTop: '7%',
        marginBottom: '1%',
        fontSize: screenHeight * 25,
        fontFamily:'soyoBold',
        textAlign: 'center'
    },
    text2:{
        fontSize: screenHeight * 25,
        fontFamily:'soyoBold'
    },
    miniText:{
        marginTop: '5%',
        fontSize: screenHeight * 18,
        textAlign: 'center',
        marginBottom : '0.5%',
        fontFamily:'myeongBold'
    },
    miniText2:{
        fontSize: screenHeight * 18,
        textAlign: 'center',
        fontFamily:'myeongBold'
    },
    btn: {
        alignItems:'flex-end',
    },
    container2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    ImageItems: {
        marginHorizontal: '2%',
        flexDirection: 'column',
        alignContent:'center',
        alignItems:'center'
    },
    image: {
        marginTop: '10%',
        width: screenWidth * 80,
        height: screenHeight * 80,
    },
    exImageTx: {
        marginTop: '3%',
        fontSize:screenHeight*12,
        fontFamily:'myeongBold',
    },
    button2: {
        width:screenWidth * 285,
        height: screenHeight * 63,
        marginTop: '10%',
        alignSelf: 'center',
        backgroundColor: "transparent",
        borderWidth:4,
        borderColor:"#2478FF",
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        fontSize: screenHeight * 24,
        color: 'black',
        fontFamily:'soyoBold',
        color:'#2478FF'
    },
    disabledButton: {
        width:screenWidth * 285,
        height: screenHeight * 63,
        marginTop: '10%',
        alignSelf: 'center',
        backgroundColor: "transparent",
        borderWidth:4,
        borderColor:"#8C8C8C",
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledText: {
        fontSize: screenHeight * 24,
        color: '#7A7A7A',
        fontFamily:'soyoBold'
    },
    disabledText2: {
        fontSize: screenHeight * 12,
        color: '#7A7A7A',
        fontFamily:'myeongRegular',
        marginTop: '0.5%'
    },
});
export default PaymentPage;