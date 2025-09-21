// 앱 전체에서 사용하는 상수 정의

// 경기도 중심 좌표 (수원시)
export const GYEONGGI_CENTER = {
  lat: 37.2636,
  lng: 127.0286,
};

// 기본 지도 설정
export const DEFAULT_MAP_CONFIG = {
  center: GYEONGGI_CENTER,
  zoom: 10,
};

// 경기도 대략적인 경계 좌표
export const GYEONGGI_BOUNDS = {
  sw: { lat: 36.8, lng: 126.3 }, // 남서쪽
  ne: { lat: 38.2, lng: 127.8 }, // 북동쪽
};

// 우선순위별 색상 설정
export const PRIORITY_COLORS = {
  1: '#FF4444', // 빨간색 - 1순위
  2: '#FF8800', // 주황색 - 2순위  
  3: '#FFDD00', // 노란색 - 3순위
  4: '#88DD00', // 연두색 - 4순위
  5: '#0088DD', // 파란색 - 5순위
  default: '#888888', // 회색 - 기본
};

// 지역 리스트
export const GYEONGGI_REGIONS = [
  '가평군', '고양시', '과천시', '광명시', '광주시', '구리시',
  '군포시', '김포시', '남양주시', '동두천시', '부천시', '성남시',
  '수원시', '시흥시', '안산시', '안성시', '안양시', '양주시',
  '양평군', '여주시', '연천군', '오산시', '용인시', '의왕시',
  '의정부시', '이천시', '파주시', '평택시', '포천시', '하남시',
  '화성시'
];

// API 설정
export const API_CONFIG = {
  KAKAO_MAP_API_KEY: import.meta.env.VITE_KAKAO_MAP_API_KEY,
  KAKAO_MAP_URL: 'https://dapi.kakao.com/v2/maps/sdk.js',
};

// 마커 아이콘 설정
export const MARKER_CONFIG = {
  size: {
    width: 32,
    height: 32,
  },
  offset: {
    x: 16,
    y: 32,
  },
};