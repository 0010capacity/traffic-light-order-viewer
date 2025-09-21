# 경기도 보행자 신호등 우선순위 뷰어 🚦

대한민국 경기도 지역의 보행자 신호등 우선순위 정보를 시각적으로 제공하는 웹 애플리케이션입니다.

## 📋 프로젝트 개요

이 앱은 경기도 내 모든 보행자 신호등의 신호 변경 순서를 지도 위에 시각적으로 표시합니다. 교차로에 여러 개의 신호등이 있는 경우, 각 신호등이 초록불로 바뀌는 우선순위를 사용자에게 알려줍니다.

### 주요 특징
- 🗺️ **Kakao 지도 API**: 경기도 지역 지도 표시
- 🚦 **신호등 우선순위**: 교차로별 신호등 순서 정보 제공
- 📱 **반응형 디자인**: 모바일 및 데스크톱 지원
- ⚡ **빠른 성능**: Vite 기반 최적화된 빌드

### 주의사항
- 실시간 남은 시간 표시 기능은 제공하지 않습니다
- 신호등 우선순위 정보만 제공합니다

## 🛠️ 기술 스택

### Frontend
- **React 18** - 사용자 인터페이스 라이브러리
- **TypeScript** - 타입 안전성
- **Vite** - 빌드 도구 및 개발 서버
- **CSS Modules** - 스타일링

### 지도 & API
- **Kakao Maps API** - 지도 표시 및 위치 서비스

### 배포 & 호스팅
- **Firebase Hosting** - 정적 웹사이트 호스팅

### 개발 도구
- **ESLint** - 코드 품질 관리
- **Git** - 버전 관리
- **GitHub** - 코드 저장소

## 🚀 시작하기

### 전제 조건
- Node.js 18+ 
- npm 또는 yarn
- Kakao Developers API Key

### 설치 및 실행

1. **저장소 클론**
   ```bash
   git clone https://github.com/your-username/traffic-light-order-viewer.git
   cd traffic-light-order-viewer
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **환경 변수 설정**
   ```bash
   cp .env.example .env.local
   ```
   
   `.env.local` 파일에 다음 값들을 설정하세요:
   ```
   VITE_KAKAO_MAP_API_KEY=your_kakao_map_api_key
   ```

4. **개발 서버 실행**
   ```bash
   npm run dev
   ```

5. **브라우저에서 확인**
   
   http://localhost:5173 에서 앱을 확인할 수 있습니다.

### 빌드

프로덕션 빌드를 생성하려면:

```bash
npm run build
```

빌드 결과물은 `dist/` 폴더에 생성됩니다.

### 미리보기

빌드된 앱을 로컬에서 미리보기하려면:

```bash
npm run preview
```

## 📁 프로젝트 구조

```
traffic-light-order-viewer/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Map/
│   │   │   ├── KakaoMap.tsx
│   │   │   └── TrafficLightMarker.tsx
│   │   ├── UI/
│   │   │   ├── Header.tsx
│   │   │   └── Sidebar.tsx
│   │   └── index.ts
│   ├── types/
│   │   ├── traffic-light.ts
│   │   └── map.ts
│   ├── utils/
│   │   ├── api.ts
│   │   └── constants.ts
│   ├── hooks/
│   │   └── useKakaoMap.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🔧 API 설정

### Kakao Maps API 설정

1. [Kakao Developers](https://developers.kakao.com/) 에서 애플리케이션 등록
2. JavaScript 키 발급
3. 플랫폼 설정에서 웹 도메인 추가
4. `.env.local` 파일에 API 키 추가

## 🚀 배포

### Firebase 배포

1. **Firebase CLI 설치**
   ```bash
   npm install -g firebase-tools
   ```

2. **Firebase 로그인**
   ```bash
   firebase login
   ```

3. **프로젝트 초기화**
   ```bash
   firebase init hosting
   ```

4. **빌드 및 배포**
   ```bash
   npm run build
   firebase deploy
   ```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참고하세요.

## 📞 연락처

프로젝트 관련 문의: [GitHub Issues](https://github.com/your-username/traffic-light-order-viewer/issues)

---

**참고**: 이 프로젝트는 교육 및 연구 목적으로 개발되었습니다. 실제 교통 신호 정보와 다를 수 있으니 참고용으로만 사용하시기 바랍니다.