# 점메추(Jummechu) - 맛집 검색 및 사용자 맞춤 추천 사이트

## 기술스택

###  Frontend
- **React 19**: 최신 React 기반 SPA
- **React Router DOM**: 클라이언트 사이드 라우팅
- **Redux Toolkit**, **Zustand**: 전역 상태 관리
- **React Hook Form**, **Zod**: 폼 처리 및 유효성 검증
- **Tailwind CSS**, **Tailwind Gradients**, **Headless UI**: 스타일링 및 유틸리티 기반 UI 구성
- **Recharts**, **Swiper**, **React Star Rating Component**: 시각화 및 UI 구성 요소

###  API 통신
- **Axios**: 서버와의 HTTP 요청 처리

###  UX 향상
- **React Toastify**: 사용자 피드백 알림
- **React Markdown**, **React Transition Group**: 마크다운 렌더링 및 애니메이션

###  Dev Tools
- **Vite**: 빠른 번들러 및 개발 서버
- **ESLint**, **Prettier**: 코드 스타일 및 정적 분석

## 폴더구조
```bash
jummechu-client/
│
├── node_modulese/
├── public/
├── src/
│   ├── app/              # 앱 진입점 설정, react-router 설정, 전역 설정 파일 등 관리 
│   │   ├── main.jsx      
│   │   ├── app.jsx       
│   ├── assets/           # 이미지, 스타일 등 정적 파일 관리
│   ├── features/         # 기능 단위로 분류된 컴포넌트 관리 
│   ├── layouts/          # header, footer 등 레이아웃 구성 요소를 담고 있는 폴더
│   ├── pages/            # 라우팅 되는 실제 페이지 컴포넌트
│   └── shared/           # 공통 컴포넌트, 유틸리티 함수 등을 관리
├── .env.development      # 개발용 환경변수 설정 파일
├── .gitignore
├── .prettierrc
├── eslint.config.js
├── index.html
├── package.json
├── README.md
├── vite.config.js
└── yarn.lock
```
## 실행방법

1. 프로젝트 클론
    ```bash
    git clone https://github.com/hanul-project-team/jummechu-client.git
    cd jummechu-client
    ```

2. 패키지 설치
    ```bash
    yarn
    ```

3. .env.development 파일 생성 및 환경변수 설정
    ```env
    VITE_API_BASE_URL=http://localhost:3000
    VITE_KAKAO_KEY=309f2ffc2063a30e72e2d932a424458b
    ```

4. 서버 실행
    ```bash
    yarn dev
    ```

## 주요기능
- **회원 유형에 따른 차별화된 서비스 제공**
    - 비회원, 일반 회원, 사업자 회원, 관리자

- **맛집 검색 및 정보 열람**
    - 비회원 및 일반 회원은 위치 기반 또는 키워드 검색을 통해 음식점 정보 조회 가능
    - 음식점 리뷰 및 평점 확인 가능 (비회원은 작성 불가능)

- **일반 회원 기능**
    - 최근에 본 음식점 리스트 확인
    - 음식점 찜하기
    - 리뷰 작성, 수정, 삭제
    - 사용자 알고리즘 기반 음식점 추천

- **사업자 회원 기능**
    - 누구나 가입 가능 (단, 음식점 관리 기능은 입점 승인 후 사용 가능)
    - 대시보드에서 사업자 정보 입력 후 입점 요청 가능
    - 입점 승인된 사업자는 음식점 소개글 작성, 리뷰 및 평점 관리 가능

- **관리자 기능**
    - 전체 회원 목록 조회 및 회원 관리
    - 사용자 리뷰 모니터링 및 삭제 등 관리 기능
    - 사업자 회원의 입점 신청 승인 및 거절
    - 입점 승인된 음식점 목록 및 정보 관리
    - 전체 서비스 운영을 위한 전반적인 사이트 관리 기능 제공