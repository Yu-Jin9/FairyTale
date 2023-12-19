import React, { useState, useContext, useEffect } from 'react';
import { Button, Alert, } from 'react-native';
import {
  PaymentWidgetProvider,
  usePaymentWidget,
  AgreementWidget,
  PaymentMethodWidget
} from '@tosspayments/widget-sdk-react-native';
import UserDataContext from '../UserDataContext';
import axios from 'axios';


export default function App({ route, navigation }) {
  return (
    <>
      <PaymentWidgetProvider
        clientKey={`test_ck_Poxy1XQL8Rwo5kpWW7PZ37nO5Wml`}
        customerKey={`whIfuFTZdWjx4SKke9CJ5`}
      >
        <PayMent navigation={navigation} route={route} />
      </PaymentWidgetProvider>
    </>
  );
}

function PayMent({ route, navigation }) {
  const paymentWidgetControl = usePaymentWidget();
  const [paymentMethodWidgetControl, setPaymentMethodWidgetControl] =
    useState(null);
  const [agreementWidgetControl, setAgreementWidgetControl] =
    useState(null);
  const context = useContext(UserDataContext);
  const Id = context.userId;
  const address = context.userIp;
  const setUserMembership = context.setUserMembership;
  const setEndMembershipDate = context.setEndMembershipDate;
  const name = context.userName;
  const product = route?.params?.product || '정기 회원권 결제';
  const amount = route?.params?.amount || '29000';
  const book = route?.params?.book || '';
  const [address1, setAddress1] = useState('');
  useEffect(() => {
    if (route.params && route.params.address) {

      console.log("route.parmas.address: ", route.params.address);
      setAddress1(route.params.address);
      console.log("address1:", address1);
    }
  }, []);


  const setMembership = async () => {
    try {
      const response = await axios.post(`${address}/server/member/setMembership`, {
        id: Id,
      });
      console.log('유료회원 전환 성공');
    } catch (error) {
      console.error('유료회원 전환 실패', error);
    }
  }

  const addPayment = async () => {
    console.log(product, amount, book, address1);
    try {
      await axios.post(`${address}/server/payment/addPayment`, { userId: Id, name: name, product: product, amount: amount, address: address1, book: book })
        .then((res) => {
          console.log('저장 성공');
        })
        .catch((error) => {
          console.error(error);
        })
    } catch (error) {
      console.log('저장실패', error);
    }
  }

  // const getDESCPaymentId = async () => {
  //   await axios.post(`${address}/server/payment/getDESCPaymentId`, { useId: Id })
  //     .then((res) => {
  //       if (res.data) {
  //         console.log('결제 정보 리스트 가져오기 성공', res.data);
  //       } else {
  //         console.log('결제 정보 리스트 가져오기 실패');
  //       }
  //     }).catch((err) => {
  //       console.log('결제정보 리스트 가져오기 실패', err);
  //     })
  // };

  const checkMembership = async () => {
    await axios.post(`${address}/server/member/checkMembership`, { id: Id })
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

  return (
    <>
      <PaymentMethodWidget
        selector="payment-methods"
        onLoadEnd={() => {
          paymentWidgetControl
            .renderPaymentMethods(
              'payment-methods',
              { value: amount },
              {
                variantKey: 'DEFAULT',
              },
            )
            .then(control => {
              setPaymentMethodWidgetControl(control);
            });
        }}
      />
      <AgreementWidget
        selector="agreement"
        onLoadEnd={() => {
          paymentWidgetControl
            .renderAgreement('agreement', {
              variantKey: 'DEFAULT',
            })
            .then(control => {
              setAgreementWidgetControl(control);
            });
        }}
      />
      <Button
        title="결제요청"
        onPress={async () => {
          if (paymentWidgetControl == null || agreementWidgetControl == null) {
            Alert.alert('주문 정보가 초기화되지 않았습니다.');
            return;
          }
          const agreeement = await agreementWidgetControl.getAgreementStatus();
          if (agreeement.agreedRequiredTerms !== true) {
            Alert.alert('약관에 동의하지 않았습니다.');
            return;
          }
          paymentWidgetControl.requestPayment?.({
            orderId: 'whIfuFTZdWjx4SKke9CJ5',
            orderName: product,
          }).then((result) => {
            if (result.success) {
              console.log('결제 성공');
              setMembership();
              addPayment();
              navigation.navigate('홈 화면');
              alert('결제에 성공했습니다.');
            } else {
              console.log('결제 실패');
            }
          });
        }}
      />
    </>
  );
}
