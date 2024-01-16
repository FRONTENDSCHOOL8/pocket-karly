# <img width='30px' alt = '마켓컬리' src="https://res.kurly.com/favicon.ico"> 7조 Poket Karly

멋쟁이 사자처럼 프론트엔드 스쿨 8기 - 바닐라프로젝트 7조 <br>

<br>

## 📚 프로젝트 소개

<h4> Vanilla JavaScript & TailwindCSS를 사용한 마켓컬리 Clone 프로젝트 </h4>

<br>

## 📅 프로젝트 진행기간

<h4>24년 1월 4일 ~ 24년 1월 16일</h4>

<br>

## 📚 기술 스택

<div>
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white"/>
  <img src="https://img.shields.io/badge/Tailwind CSS-06B6D4?style=flat-square&logo=Tailwind CSS&logoColor=white"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black"/> 
  <img src="https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white"/>
  <img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=GitHub&logoColor=white"/>
  <img src="https://img.shields.io/badge/pocketbase-B8DBE4?style=flat-square&logo=pocketbase&logoColor=black">
</div>

<br><br>

## 👨‍👩‍👧‍👧 프로젝트 구성원

- [박지우](https://github.com/ParkjiDev)(조장) : 헤더, 상품리스트, 장바구니 담기, 최근 본 상품 기능
- [반현지](https://github.com/lanuioe) : 장바구니, 팝업, 푸터
- [박수양](https://github.com/clapsheep)(스크럼마스터) : 회원가입, 상세페이지 리뷰, 문의하기
- [허건](https://github.com/HHeoGeon) : 메인페이지, 로그인, 상세페이지 상단

<br><br>

## 🌐 포켓컬리 구현
[프로젝트 데모 바로가기](https://pocket-karly.netlify.app)

<br><br>


## ✨ 요구 사항

- 슬라이드가 필요한 ui에서는 [**swiper.js**](https://swiperjs.com/)를 사용해주세요.
  - 각 슬라이드를 데이터로 받아 동적으로 렌더링 되도록 만들어주세요.
  - 슬라이드의 `prev`, `next` 버튼도 구현해주세요.
  - 키보드 키로도 작동되도록 구현해주세요.
- [localStorage](https://developer.mozilla.org/ko/docs/Web/API/Window/localStorage)를 사용하여 “최근 본 항목”의 UI를 구성해주세요.
- “마이크로 애니메이션”이 필요하다면 추가해주세요.
- “회원가입 기능”을 구현해주세요.
  - 최소한 이메일, 비밀번호 입력 필드(`input`), 제출 버튼(`button`)을 가지도록 구성해주세요.
- 이메일과 비밀번호의 유효성을 확인합니다.
  - 이메일 조건 : 최소 `@`, `.` 포함
  - 비밀번호 조건 : 특수문자 포함 최소 6자 - 최대 16자
  - 이메일과 비밀번호가 모두 입력되어 있고, 조건을 만족해야 제출 버튼이 활성화 되도록 구현해주세요.
- 회원가입을 통해 사용자(user)를 생성하고 관리합니다.
  - 데이터 통신을 통해 유저를 생성하고 관리해주세요
  - 유저의 회원을 탈퇴할 수 있는 기능을 구현해주세요
  - 로그인된 유저를 인식하여 UI를 다르게 랜더링해주세요
  - 로그인되지 않은 사용자면 회원가입 페이지로 리디렉션 시켜주세요
  - 회원가입시 중복된 유저가 있는지 체크해주세요
- 장바구니 기능을 구현해 주세요
  - 사용자가 장바구니에 항목을 담으면 장바구니 페이지에 랜더링이 되도록 구현해 주세요.

<br>

## 📜 주요 페이지 (구현 기능)

#### 주요 페이지 : 로그인, 회원가입, 상품리스트, 장바구니, 메인 페이지

 ### 🛠 메인 페이지
 - 헤더
   - 네비게이션: 카테고리
   - 회원정보 : 로그아웃, 탈퇴 기능
   - 로그인 여부에 따라 헤더 최상단 다르게 보여짐
    
- 바디
  - 스와이퍼
    - 배너 - DB에 올라간 배너
    - 이 상품 어때요 - 랜덤한 데이터
    - 놓치면 후회할 가격 - 할인순
    
  - 장바구니 모달
  - 장바구니 버블

- 푸터
   - 메일 앱 연결
   - 문의 팝업
  
- 팝업
  - 오늘 하루 보지않기 구현

- 최근 본 상품

 ### 🛠 회원 가입 페이지
 - 아이디, 이메일 중복확인
- 각 입력항목 유효성 검사 - 아이디, 비밀번호, 비밀번호 확인, 이메일
- Daum 주소 API 사용
- 필수입력항목 상태관리
- 전체동의 구현
- 입력한 회원정보 post

 ### 🛠 로그인 페이지
- 아이디, 비밀번호 DB 확인
- 아이디, 비밀번호가 다를 시 알림창

 ### 🛠 상품 리스트 페이지 
 - 페이지네이션
- 상품 정렬 기능
- 상품 필터링 기능
- 검색 결과 총 상품 수 출력
- 장바구니 버튼 이용시 비회원은 local storage에 저장, 회원은 DB에 저장
- 비회원 장바구니의 상품 목록은 로그인 시 로그인 사용자의 장바구니로 옮겨짐
- 장바구니 담기 완료시 화면 상단에 말풍선으로 알림창 출력
- 최근본상품 local storage 이용하여 저장(최대 15개, 최근 클릭한 순서대로 swiper로 출력)

 ### 🛠 상세 페이지 
- 할인율 적용
- 회원, 비회원 나누어 적립금 구현
- 좋아요 클릭
- 탭 메뉴 스크롤 이동
- 상세정보는 특정 템플릿을 가지고 DB데이터를 조합하여 렌더링 (alt 포함)
- 리뷰 - 정렬
- 리뷰 및 문의하기 작성 모달창 - 시연페이지 : 손질오징어
    - 로그인 여부에 따른 로그인 요청
    - fake-placeholder(함수 재사용을 고려한 클로저 사용), 글자수 제한
    - 입력 상태에 따른 post 버튼 상태관리
- DB에서 동적 렌더링 - 시연페이지 : 손질오징어
    - 공지사항 렌더링(아코디언)
    - 현재 페이지 상품에 대한 DB와 로그인 한 사용자의 DB를 리뷰나 문의사항에 대조하여 출력
    - 비밀글 비밀처리 및 자신이 등록한 비밀글 조회 가능하게 구현
- 작성자 이름 보안
 
 ### 🛠 장바구니 페이지 
- 회원의 장바구니는 DB에서, 비회원의 장바구니는 로컬스토리지에서 불러옴
- 장바구니에 담긴 상품 수량, 종류에 따라 UI 변경
    - 장바구니에 담긴 상품이 없을 경우 빈 화면 출력
    - 상품에 해당하는 카테고리만 출력
    - 상품 종류 수에 맞추어 상품 개수 (선택 개수/전체 개수) 출력
    - 전체선택, 개별 선택
- 선택한 상품의 금액만 합산
- 주문하기 버튼 클릭시 선택한 상품은 장바구니에서 삭제


## 🏹 트러블 슈팅
- 깃허브 이슈
- tailwind 사용하면서 중복으로 사용되는 다수의 class 존재 → tailwind config 파일에 만들어 놓거나
  Vite  postcss-import 사용하여 vite 환경에서 하나의 CSS 파일로 합쳐서 빌드 될 수 있도록 함
<br>

## 💜 프로젝트 느낀 점
1.  Vanilla JavaScript 동적으로 렌더링 하는 항목들에 대한 업데이트나, 상태관리 측면에서 꽤나 많은 과정의 처리를 요구하기 때문에 react가 필요하다는 사실을 많이 깨달았다.
2. 마크업과 디자인을 할 때 TailwindCSS를 사용하다보니 html과 css 파일을 왔다갔다 하지 않아도 되서 Tailwind의 편리함을 알 수 있었다.
3. 실습할 시간이 없어서 익숙하지 않았던 javascript의 DOM 조작, async, 객체, 배열의 반복 등을 직접 경험하며 익힐 수 있었다.
4. 협업할때는 소통이 매우 중요하다는걸 알게됐다. 여러명이 한 페이지를 만들기도 하면서 각자가 개발한 내용을 잘 공유해야 됐었다.

## 💻 실행 방법

### 클론 후, 패키지 설치

```
npm install
```
