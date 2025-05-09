# 점메추(Jummechu) - 점심 뿐 아니라 아침, 저녁, 야식까지 추천해주는 맛집 검색 사이트

## 기술스택

## 폴더구조
```bash
jummechu-client/
│
├── node_modulese/
├── public/
├── src/
│   ├── app/              # 앱 진입점 설정, react-router 설정, 전역 설정 등 파일 관리 
│   │   ├── main.jsx      
│   │   ├── app.jsx       
│   ├── assets/           # 이미지, 스타일 등 정적 파일 관리
│   ├── features/         # 기능 단위(예: Login, Logout, Details)로 분류된 컴포넌트 관리 
│   ├── layouts/          # header, footer 등 레이아웃 구성 요소를 담고 있는 폴더
│   ├── pages/            # 라우팅 되는 실제 페이지 컴포넌트(예: HomePage, LoginPage)
│   └── shared/           # feature, page에서 사용할 공통 컴포넌트, 함수 등을 관리
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