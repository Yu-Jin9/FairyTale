import {Dimensions} from 'react-native';

export const basicDimensions = { // 디자이너가 작업하고 있는 XD파일 스크린의 세로,가로
  width: 411.42857142857144,
  height: 882.2857142857143,
};

export const screenHeight = ( // 높이 변환 작업
  Dimensions.get('screen').height *
  (1 / basicDimensions.height)
);

export const screenWidth = ( // 가로 변환 작업
  Dimensions.get('screen').width *
  (1 / basicDimensions.width)
);