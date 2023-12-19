import React from 'react';
import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';

export function PaymentResult() {
  const route = useRoute();
  const { orderId, amount, message } = route.params;

  const isPaymentSuccessful = message === undefined;

  return (
    <View>
      <Text style={{fontSize: 24}}>{isPaymentSuccessful ? '결제 성공' : '결제 실패'}</Text>
      {isPaymentSuccessful ? (
        <>
          <Text>{`주문 아이디: ${orderId}`}</Text>
          <Text>{`결제 금액: ${Number(amount).toLocaleString()}원`}</Text>
        </>
      ) : (
        <Text>{`사유: ${message}`}</Text>
      )}
    </View>
  );
}
