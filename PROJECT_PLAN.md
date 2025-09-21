# 프로젝트 계획서: 경기도 보행자 신호등 우선순위 뷰어

## 1. 프로젝트 개요

### 1.1 목적
- 경기도 지역 보행자 신호등의 우선순위 정보를 시각적으로 제공
- 교차로별 신호등 순서를 지도 위에 직관적으로 표시
- 보행자들이 효율적으로 횡단보도를 이용할 수 있도록 정보 제공

### 1.2 범위
- **지역**: 대한민국 경기도 전체
- **대상**: 보행자 신호등만 (차량 신호등 제외)
- **기능**: 우선순위 정보만 제공 (실시간 카운트다운 기능 제외)

## 2. 기술 아키텍처

### 2.1 전체 시스템 구조
```
Frontend (React + TypeScript)
    ↓
Kakao Maps API
    ↓
Traffic Light Data (Static/Mock Data)
    ↓
Firebase Hosting (배포)
```

### 2.2 기술 스택 상세

#### Frontend
- **React 18**: 컴포넌트 기반 UI 개발
- **TypeScript**: 타입 안전성 보장
- **Vite**: 빠른 개발 서버 및 빌드 도구
- **CSS Modules**: 스타일 캡슐화

#### 지도 서비스
- **Kakao Maps JavaScript API**: 지도 표시 및 마커 관리

#### 배포 및 호스팅
- **Firebase Hosting**: 정적 웹사이트 호스팅
- **GitHub**: 소스코드 버전 관리

## 3. 주요 기능 명세

### 3.1 핵심 기능

#### 3.1.1 지도 표시 기능
- 경기도 지역을 중심으로 한 지도 표시
- 줌 인/아웃 기능
- 지도 이동 (드래그) 기능

#### 3.1.2 신호등 마커 표시
- 보행자 신호등 위치에 마커 표시
- 우선순위에 따른 마커 스타일 차별화
- 마커 클릭 시 상세 정보 팝업

#### 3.1.3 우선순위 정보 표시
- 교차로별 신호등 순서 표시 (1, 2, 3, ...)
- 색상 코딩을 통한 시각적 구분
- 툴팁을 통한 추가 정보 제공

### 3.2 부가 기능

#### 3.2.1 검색 기능
- 지역명으로 검색하여 해당 위치로 이동
- 주요 교차로명 검색 지원

#### 3.2.2 필터 기능
- 우선순위별 필터링
- 지역별 필터링

#### 3.2.3 정보 패널
- 선택된 교차로의 상세 정보 표시
- 신호등 개수 및 순서 정보

## 4. 데이터 모델

### 4.1 신호등 데이터 구조

```typescript
interface TrafficLight {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  intersection: string;
  priority: number;
  address: string;
  region: string;
  crosswalkDirection: string;
  notes?: string;
}

interface Intersection {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  trafficLights: TrafficLight[];
  totalCount: number;
}
```

### 4.2 지도 설정 데이터

```typescript
interface MapConfig {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  bounds: {
    sw: { lat: number; lng: number };
    ne: { lat: number; lng: number };
  };
}
```

## 5. 컴포넌트 구조

### 5.1 컴포넌트 계층 구조

```
App
├── Header
│   ├── Logo
│   └── SearchBar
├── MapContainer
│   ├── KakaoMap
│   ├── TrafficLightMarker[]
│   └── InfoWindow
├── Sidebar
│   ├── FilterPanel
│   └── IntersectionList
└── Footer
```

### 5.2 주요 컴포넌트 명세

#### 5.2.1 KakaoMap 컴포넌트
```typescript
interface KakaoMapProps {
  center: { lat: number; lng: number };
  zoom: number;
  onMapLoad: (map: kakao.maps.Map) => void;
  children: React.ReactNode;
}
```

#### 5.2.2 TrafficLightMarker 컴포넌트
```typescript
interface TrafficLightMarkerProps {
  trafficLight: TrafficLight;
  map: kakao.maps.Map;
  onClick: (trafficLight: TrafficLight) => void;
}
```

## 6. 개발 일정

### 6.1 Phase 1: 기본 구조 설정 (1주)
- [x] 프로젝트 초기 설정
- [x] README.md 작성
- [x] 기본 컴포넌트 구조 설계
- [ ] TypeScript 타입 정의

### 6.2 Phase 2: 지도 기능 구현 (1주)
- [ ] Kakao Maps API 연동
- [ ] 기본 지도 표시 기능
- [ ] 경기도 지역 중심 설정
- [ ] 줌 및 이동 기능 테스트

### 6.3 Phase 3: 신호등 데이터 및 마커 (1주)
- [ ] 신호등 데이터 모델링
- [ ] 모의 데이터 생성
- [ ] 마커 표시 기능 구현
- [ ] 우선순위별 스타일링

### 6.4 Phase 4: 상호작용 기능 (1주)
- [ ] 마커 클릭 이벤트 처리
- [ ] 정보 창(InfoWindow) 구현
- [ ] 사이드바 정보 패널
- [ ] 검색 기능 구현

### 6.5 Phase 5: 완성 및 배포 (1주)
- [ ] UI/UX 개선
- [ ] 반응형 디자인 적용
- [ ] Firebase 배포 설정
- [ ] 최종 테스트 및 문서 완성

## 7. 필요한 외부 리소스

### 7.1 API 키 및 인증
- **Kakao Maps API**: JavaScript 키 필요
  - 발급 위치: https://developers.kakao.com/
  - 웹 플랫폼 등록 필요

### 7.2 데이터 소스
현재 프로젝트에서는 실제 신호등 데이터가 없으므로, 다음과 같은 방식으로 진행:
- **Phase 1**: 모의 데이터 사용
- **Phase 2**: 공공 데이터 포털 또는 관련 기관에서 데이터 확보 (향후)
- **Phase 3**: 크라우드소싱을 통한 데이터 수집 (향후)

### 7.3 추가 필요 정보
사용자에게 요청할 정보:
1. **Kakao Maps API Key** - 프로젝트 실행을 위해 필수
2. **Firebase 프로젝트 설정** - 배포를 위해 필요
3. **실제 신호등 데이터** - 있다면 제공 부탁 (현재는 모의 데이터로 진행)

## 8. 위험 요소 및 대안

### 8.1 주요 위험 요소
1. **데이터 부족**: 실제 신호등 우선순위 데이터 부재
2. **API 제한**: Kakao Maps API 호출 제한
3. **성능 이슈**: 많은 수의 마커 표시 시 성능 저하

### 8.2 대안 및 해결책
1. **데이터 부족 해결**:
   - 모의 데이터로 프로토타입 완성
   - 주요 교차로 중심으로 샘플 데이터 생성
   
2. **API 제한 해결**:
   - 지역별 데이터 지연 로딩
   - 캐싱 메커니즘 도입

3. **성능 개선**:
   - 마커 클러스터링 적용
   - 가시 영역 내 마커만 렌더링

## 9. 성공 기준

### 9.1 기술적 성공 기준
- [ ] 경기도 전체 지역 지도 표시
- [ ] 최소 50개 이상의 교차로 데이터 표시
- [ ] 모바일 반응형 지원
- [ ] 3초 이내 초기 로딩 완료

### 9.2 사용자 경험 성공 기준
- [ ] 직관적인 우선순위 표시
- [ ] 쉬운 검색 및 네비게이션
- [ ] 명확한 정보 전달

이 계획서를 바탕으로 단계적으로 개발을 진행하며, 각 단계별로 진행 상황을 점검하고 필요시 조정하겠습니다.