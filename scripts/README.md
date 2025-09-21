# 데이터 전처리 스크립트

## 개요
경기도 신호등 데이터에 좌표 정보를 추가하는 전처리 스크립트입니다.

## 사용법

### 1. 카카오 REST API 키 발급
1. [카카오 디벨로퍼](https://developers.kakao.com/) 접속
2. 애플리케이션 생성 또는 기존 앱 선택
3. "플랫폼" → "Web" 추가 (도메인: localhost)
4. "API 키" → "REST API 키" 복사

### 2. 스크립트 설정
`scripts/geocode-data.js` 파일에서 API 키 설정:
```javascript
const KAKAO_REST_API_KEY = 'YOUR_KAKAO_REST_API_KEY'; // 여기에 발급받은 키 입력
```

### 3. 데이터 전처리 실행
```bash
# 프로젝트 루트에서 실행
node scripts/geocode-data.js
```

### 4. 결과 확인
- 입력: `public/traffic-lights.json` (원본 데이터)
- 출력: `public/traffic-lights-processed.json` (좌표 추가된 데이터)

## 처리 과정
1. 원본 JSON 데이터 로드
2. 주소별로 그룹화 (중복 제거)
3. 카카오 지오코딩 API로 주소 → 좌표 변환
4. 좌표 정보가 추가된 데이터 저장

## 주의사항
- 카카오 REST API는 초당 10건 제한이 있어 딜레이가 있습니다
- 하루 300,000건까지 무료 사용 가능
- 주소를 찾지 못한 데이터도 보존됩니다 (coordinates: null)

## 출력 데이터 구조
```json
{
  // 기존 필드들...
  "coordinates": {
    "lat": 37.2663,
    "lng": 127.0011
  },
  "geocoding_info": {
    "original_address": "원본 주소",
    "kakao_address_name": "카카오에서 정규화한 주소",
    "kakao_road_address": "도로명 주소",
    "geocoded_at": "2024-01-01T00:00:00.000Z"
  }
}
```