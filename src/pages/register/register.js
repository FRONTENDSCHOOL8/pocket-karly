import { getNode, getNodes, attr, removeClass, addClass } from '/src/lib/';
import '/src/styles/tailwind.css';
import pb from '/src/api/pocketbase';

/*--------------------------------------*/
/*             "전체동의 기능"             */
/*--------------------------------------*/
const agreeAll = getNode('#agreeAll');

function checkAll() {
  const agree = getNodes('input[name="agree"]');
  if (agreeAll.checked) {
    agree.forEach((li) => {
      console.log(li.checked);
      attr(li, 'checked', true);
    });
  } else {
    agree.forEach((li) => {
      console.log(li.checked);
      attr(li, 'checked', '');
    });
  }
}
agreeAll.addEventListener('click', checkAll);

/*----------------------------------*/
/*            "밸리데이션"             */
/*----------------------------------*/

let id = 0;
let password = 0;
let email = 0;
const idInput = getNode('#username');
const passwordInput = getNode('#password');
const passwordConfirmInput = getNode('input[name="password-repeat"]');
const passwordConfirm = passwordConfirmInput.value;
const emailInput = getNode('#email');
const yearInput = getNode('#year');
const monthInput = getNode('#month');
const dayInput = getNode('#days');
const idButton = getNode('.register__valid__id');
const emailButton = getNode('.register__valid__email');
const submit = getNode('#registerSubmit');

const allUser = await pb.collection('users').getFullList();
const allUserName = allUser.map((item) => {
  return item.username;
});
const allUserEmail = allUser.map((item) => {
  return item.email;
});

// 아이디 정규식 밸리데이션
function regId() {
  id = idInput.value; // 검사하려는 문자열

  if (id.length >= 10) {
    let count = 0;
    if (/[A-Za-z]/.test(id)) count++; // 영문 포함 여부
    if (/[0-9]/.test(id)) count++; // 숫자 포함 여부
    if (/[\W_]/.test(id)) count++; // 특수문자 포함 여부 (공백 제외)

    if (count >= 2) {
      console.log('조건을 만족합니다.');
    } else {
      console.log('영문, 숫자, 특수문자 중 최소 2개 이상을 조합해야 합니다.');
    }
  } else {
    console.log('문자열이 10자 이상이어야 합니다.');
  }
}
idInput.addEventListener('input', regId);

// 패스워드 정규식 밸리데이션
function regPw() {
  password = passwordInput.value;

  if (password.length >= 10) {
    let count = 0;
    if (/[A-Za-z]/.test(password)) count++; // 영문 포함 여부
    if (/[0-9]/.test(password)) count++; // 숫자 포함 여부
    if (/[\W_]/.test(password)) count++; // 특수문자 포함 여부 (공백 제외)

    if (count >= 2) {
      console.log('조건을 만족합니다.');
    } else {
      console.log('영문, 숫자, 특수문자 중 최소 2개 이상을 조합해야 합니다.');
    }
  } else {
    console.log('문자열이 10자 이상이어야 합니다.');
  }
}
passwordInput.addEventListener('input', regPw);

// 패스워드 확인 밸리데이션
passwordConfirmInput.addEventListener('input', (e) => {
  const password = passwordInput.value;
  const err = passwordConfirmInput.nextElementSibling;
  const now = e.target;
  const nowValue = now.value;

  if (password !== nowValue) {
    removeClass(err, 'hidden');
  } else {
    addClass(err, 'hidden');
  }
});

//이메일 정규식 밸리데이션
function regEmail() {
  email = emailInput.value;
  const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (emailRegEx.test(email)) {
    console.log('이메일 형식이 올바릅니다.');
  } else {
    console.log('이메일 형식이 올바르지 않습니다.');
  }
}
emailInput.addEventListener('input', regEmail);

//생년월일 정규식 밸리데이션

const birthInput = getNode('.birth');

function checkBirthDate() {
  const year = yearInput.value;
  const month = monthInput.value;
  const days = dayInput.value;
  const inputDate = `${year}-${month}-${days}`;

  const currentDate = new Date();
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 100);
  const minAgeDate = new Date();
  minAgeDate.setFullYear(minAgeDate.getFullYear() - 14);

  // 정규식 패턴
  const regex = /^(\d{4})-(\d{2})-(\d{2})$/;

  // 정규식 검증
  const match = inputDate.match(regex);
  if (!match) {
    console.log('생년월일을 다시 확인해주세요.');
    return;
  }

  // 날짜 변환
  const birthDate = new Date(match[1], match[2] - 1, match[3]);

  // 조건 검증
  if (birthDate > currentDate) {
    console.log('생년월일이 미래로 입력되었습니다.');
  } else if (birthDate < minDate) {
    console.log('생년월일을 다시 확인해주세요.');
  } else if (birthDate > minAgeDate) {
    console.log('만 14세 미만은 가입이 불가합니다.');
  } else {
    console.log('정상적인 생년월일입니다.');
  }
}

birthInput.addEventListener('input', checkBirthDate);
/*----------------------------------*/
/*             "DateBase"            */
/*----------------------------------*/

// 아이디 중복확인 버튼 기능구현
idButton.addEventListener('click', (e) => {
  id = idInput.value;
  e.preventDefault();
  if (allUserName.includes(id)) {
    console.log('이미 사용중인 아이디입니다. 다른 아이디를 입력해주세요.');
  } else {
    console.log('사용가능한 아이디입니다.');
  }
});

//이메일 중복확인 버튼 기능 구현
emailButton.addEventListener('click', (e) => {
  email = emailInput.value;
  e.preventDefault();
  if (allUserEmail.includes(email)) {
    console.log('이미 사용중인 이메일입니다. 다른 이메일을 입력해주세요.');
  } else {
    console.log('사용가능한 이메일입니다.');
  }
});

// 회원가입 버튼 (DB에 POST)
async function clickRegister(e) {
  e.preventDefault();

  id = idInput.value;
  password = passwordInput.value;
  email = emailInput.value;
  const name = getNode('#name').value;
  const phone = getNode('#phone').value * 1;
  const year = yearInput.value;
  const month = monthInput.value;
  const days = dayInput.value;
  const birth = `${year}-${month}-${days}`;
  // const address = getNode('#address') 여기서 주소를 리턴하는 주소 API를 미리 구현해야함

  const userData = {
    username: id,
    password,
    passwordConfirm,
    name,
    email,
    phone,
    birth,
  };
  console.log(userData);

  const record = await pb.collection('users').create(userData);
  console.log(record);
}

submit.addEventListener('click', clickRegister);
// const user = await pb.collection('users').getFullList();
// console.log(user);
