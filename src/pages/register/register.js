import { getNode, getNodes, removeClass, addClass } from '/src/lib/';
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
      li.checked = true;
    });
  } else {
    agree.forEach((li) => {
      li.checked = false;
    });
  }
}
agreeAll.addEventListener('click', checkAll);

/*----------------------------------*/
/*            "밸리데이션"             */
/*----------------------------------*/

let id = 0;
let password = 0;
let passwordConfirm = 0;
let email = 0;
const idInput = getNode('#username');
const passwordInput = getNode('#password');
const passwordConfirmInput = getNode('input[name="password-repeat"]');
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
  const errText = idInput.nextElementSibling;

  // 한글 또는 특수문자가 포함되어 있는지 검사하는 정규식
  const invalidChars = /[ㄱ-ㅎㅏ-ㅣ가-힣\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]/;

  if (id.length >= 6 || id.lengh <= 16) {
    // 한글 또는 특수문자가 포함되어 있으면 안 됨
    if (invalidChars.test(id)) {
      removeClass(errText, 'hidden');
      return; // 조건을 만족하지 않으므로 여기서 함수 종료
    }

    let count = 0;
    if (/[A-Za-z]/.test(id)) count++; // 영문 포함 여부
    // if (/[0-9]/.test(id)) count++; // 숫자 포함 여부
    // 특수문자 포함 여부 (공백 제외) - 기존의 조건이므로 이 부분은 삭제하거나 주석 처리합니다.
    //if (/[\W_]/.test(id)) count++;

    if (count >= 1) {
      addClass(errText, 'hidden');
    } else {
      removeClass(errText, 'hidden');
    }
  } else {
    removeClass(errText, 'hidden');
  }
}

// 'input' 이벤트 리스너를 추가하는 부분은 그대로 유지합니다.
idInput.addEventListener('input', regId);

// 패스워드 정규식 밸리데이션
function regPw() {
  const errText = passwordInput.nextElementSibling;
  const errText2 = errText.nextElementSibling;
  password = passwordInput.value;

  if (password.length >= 10) {
    let count = 0;
    if (/[A-Za-z]/.test(password)) count++; // 영문 포함 여부
    if (/[0-9]/.test(password)) count++; // 숫자 포함 여부
    if (/[\W_]/.test(password)) count++; // 특수문자 포함 여부 (공백 제외)

    if (count >= 2) {
      addClass(errText, 'hidden');
      addClass(errText2, 'hidden');
      console.log('조건을 만족합니다.');
    } else {
      addClass(errText, 'hidden');
      removeClass(errText2, 'hidden');
    }
  } else {
    addClass(errText2, 'hidden');
    removeClass(errText, 'hidden');
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
  const errText = emailInput.nextElementSibling;
  email = emailInput.value;
  const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (emailRegEx.test(email)) {
    addClass(errText, 'hidden');
  } else {
    removeClass(errText, 'hidden');
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
  passwordConfirm = passwordConfirmInput.value;
  email = emailInput.value;
  const name = getNode('#name').value;
  const phone = getNode('#phone').value * 1;
  const year = yearInput.value;
  const month = monthInput.value;
  const days = dayInput.value;
  const address = getNode('#address').value;
  const detailAddress = getNode('#detailAddress').value;

  const checkgender = getNode('input[name="gender"]:checked');
  const gender = checkgender.value;

  const birth = {
    year: `${year}`,
    month: `${month}`,
    days: `${days}`,
  };
  const checkMarketing = getNode('#agreeEvent');
  const isMarketing = checkMarketing.checked;
  // const address = getNode('#address') 여기서 주소를 리턴하는 주소 API를 미리 구현해야함

  try {
    await pb.collection('users').create({
      username: id,
      password,
      passwordConfirm,
      name,
      email,
      phone,
      birth,
      gender,
      isMarketing,
      address,
      detailAddress,
    });

    alert('회원가입이 완료되었습니다. 메인페이지로 이동합니다!');
    location.href = '/';
  } catch (error) {
    alert('입력사항을 다시 한 번 확인해주세요.');
  }
}

submit.addEventListener('click', clickRegister);
