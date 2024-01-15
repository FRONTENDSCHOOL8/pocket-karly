import { getNode, getNodes, removeClass, addClass, attr } from '/src/lib/';
import '/src/styles/tailwind.css';
import pb from '/src/api/pocketbase';
import '/src/pages/components/js/include.js';
import { execDaumPostcode } from '/src/pages/components/js/addressApi.js';

// 필수입력항목 상태관리
const state = {
  id: false,
  pw: false,
  username: false,
  email: false,
  phone: false,
  address: false,
  agree: false,
};

/*--------------------------------------*/
/*             "전체동의 기능"             */
/*--------------------------------------*/
const agreeAll = getNode('#agreeAll');

function checkAll(e) {
  const { target } = e;
  const agree = getNodes('input[name="agree"]');
  if (target.checked) {
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
const idButton = getNode('#id__button');
const passwordInput = getNode('#password');
const passwordConfirmInput = getNode('input[name="password-repeat"]');
const nameInput = getNode('#name');
const emailInput = getNode('#email');
const emailButton = getNode('#email__button');
const yearInput = getNode('#year');
const monthInput = getNode('#month');
const dayInput = getNode('#days');
const phoneInput = getNode('#phone');
const phoneButton = getNode('#phone__button');
const addressInput = getNode('#address');
const addressButton = getNode('.address__button');
const reAddressButton = getNode('.reAddress__button');

const submit = getNode('#registerSubmit');
const allUser = await pb.collection('users').getFullList();
const allUserName = allUser.map((item) => {
  return item.username;
});
const allUserEmail = allUser.map((item) => {
  return item.email;
});

// 아이디 정규식 밸리데이션 (통과 시 중복확인 버튼 활성화)
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
      removeClass(idButton, 'text-gray-300');
      addClass(idButton, 'border-primary');
      addClass(idButton, 'text-primary');
      attr(idButton, 'disabled', '');
      addClass(errText, 'hidden');
    } else {
      removeClass(idButton, 'text-primary');
      removeClass(idButton, 'border-primary');
      addClass(idButton, 'text-gray-300');
      attr(idButton, 'disabled', true);
      removeClass(errText, 'hidden');
    }
  } else {
    removeClass(idButton, 'text-primary');
    removeClass(idButton, 'border-primary');
    addClass(idButton, 'text-gray-300');
    attr(idButton, 'disabled', true);
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
    state.pw = false;
    removeClass(err, 'hidden');
  } else {
    state.pw = true;
    addClass(err, 'hidden');
  }
});

//이메일 정규식 밸리데이션
function regEmail() {
  const errText = emailInput.nextElementSibling;
  email = emailInput.value;
  const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (emailRegEx.test(email)) {
    removeClass(emailButton, 'text-gray-300');
    addClass(emailButton, 'border-primary');
    addClass(emailButton, 'text-primary');
    attr(emailButton, 'disabled', '');

    addClass(errText, 'hidden');
  } else {
    removeClass(emailButton, 'text-primary');
    removeClass(emailButton, 'border-primary');
    addClass(emailButton, 'text-gray-300');
    attr(emailButton, 'disabled', true);

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

// 이름 입력 상태 확인
function checkInputName() {
  if (nameInput.value) {
    state.username = true;
  } else {
    state.username = false;
  }
}
nameInput.addEventListener('input', checkInputName);

// 휴대폰 입력 상태 확인
function activeButton(e) {
  const { target } = e;
  const button = target.nextElementSibling;

  if (target.value) {
    removeClass(button, 'text-gray-300');
    addClass(button, 'border-primary');
    addClass(button, 'text-primary');
    attr(button, 'disabled', '');
  } else {
    removeClass(button, 'text-primary');
    removeClass(button, 'border-primary');
    addClass(button, 'text-gray-300');
    attr(button, 'disabled', true);
  }
}

phoneInput.addEventListener('input', activeButton);

//휴대폰 인증을 구현해야하지만, 그냥 버튼 누르면 인증되게 구현 but, 인증 후 다시 번호를 바꾸면? 또 상태를 바꿔야하는데?
phoneButton.addEventListener('click', () => {
  alert('휴대폰 인증이 완료되었습니다.');
  return (state.phone = true);
});

// 주소 api 실행 이벤트

addressButton.addEventListener('click', execDaumPostcode);
reAddressButton.addEventListener('click', execDaumPostcode);

//주소 입력 상태 확인
function checkInputaddress() {
  if (addressInput.value) {
    state.address = true;
  } else {
    state.address = false;
  }
}
// 다른건 다 해당 Input에 입력했을 때 이벤트가 발생하게 했는데, 주소는 Input을 받지 못해서 submit을 클릭했을 때 상태를 체크함
// 근데 생각해보니까 클릭할 때 상태를 한번에 체크하는게 훨씬 더 효율이 좋은 것 같음
submit.addEventListener('click', checkInputaddress);

//약관 동의 상태 확인
function checkStateAgree() {
  const agreeTerms = getNode('#agreeTerms');
  const agreePersonal = getNode('#agreePersonal');
  const over14 = getNode('#over14');
  if (agreeTerms.checked && agreePersonal.checked && over14.checked) {
    state.agree = true;
  } else {
    state.agree = false;
  }
}
submit.addEventListener('click', checkStateAgree);
/*----------------------------------*/
/*             "DateBase"            */
/*----------------------------------*/

// 아이디 중복확인 버튼 기능구현
idButton.addEventListener('click', (e) => {
  id = idInput.value;
  e.preventDefault();
  if (allUserName.includes(id)) {
    state.id = false;
    alert('이미 사용중인 아이디입니다. 다른 아이디를 입력해주세요.');
  } else {
    state.id = true;
    alert('사용가능한 아이디입니다.');
  }
});

//이메일 중복확인 버튼 기능 구현
emailButton.addEventListener('click', (e) => {
  email = emailInput.value;
  e.preventDefault();
  if (allUserEmail.includes(email)) {
    state.email = false;
    alert('이미 사용중인 이메일입니다. 다른 이메일을 입력해주세요.');
  } else {
    state.email = true;
    alert('사용가능한 이메일입니다.');
  }
});

// 회원가입 버튼 (DB에 POST)
async function clickRegister(e) {
  if (Object.values(state).every((value) => value === true)) {
    console.log('필수입력값 확인 완료');
  } else {
    alert('필수입력 값을 확인해주세요.');
    return;
  }

  e.preventDefault();

  id = idInput.value;
  password = passwordInput.value;
  passwordConfirm = passwordConfirmInput.value;
  email = emailInput.value;
  const name = nameInput.value;
  const phone = phoneInput.value * 1;
  const year = yearInput.value;
  const month = monthInput.value;
  const days = dayInput.value;
  const address = addressInput.value;
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
      class: '일반',
    });

    alert('회원가입이 완료되었습니다. 메인페이지로 이동합니다!');
    location.href = '/';
  } catch (error) {
    alert('입력사항을 다시 한 번 확인해주세요.');
  }
}

function checkRequire() {}
submit.addEventListener('click', checkRequire);
submit.addEventListener('click', clickRegister);
