import {
  getNode,
  addClass,
  removeClass,
  insertAfter,
  insertBefore,
  setStorage,
  attr,
  getStorage,
  getPbImageURL,
} from '/src/lib/';
import '/src/styles/tailwind.css';
import pb from '/src/api/pocketbase';
import defaultAuthData from '/src/api/defaultAuthData';

const reviewPlaceholder = getNode('.reviewPlaceholder');
const inquiriesPlaceholder = getNode('.inquiriesPlaceholder');

const reviewText = getNode('#reviewText');
const reviewTitle = getNode('#reviewTitle');

const inquiriesText = getNode('#inquiriesText');
const inquiriesTitle = getNode('#inquiriesTitle');

const openReviewButton = getNode('#openReviewButton');
const openInquiriesButton = getNode('#openInquiriesButton');

const cancelReviewModal = getNode('.cancelReviewModal');
const cancelInquiriesModal = getNode('.cancelInquiriesModal');

const postReviewButton = getNode('#postReviewButton');
const postInquiriesButton = getNode('#postInquiriesButton');

const reviewNotice = getNode('.reviewNotice');
const inquiriesNotice = getNode('.inquiriesNotice');

const inquiriesPagenation = getNode('.inquiries__pagenation');
const reviewPagenation = getNode('.review__pagenation');

const reviewForm = getNode('.reviewForm');
const inquiriesForm = getNode('.inquiriesForm');

const encryptName = (text) => {
  if (text.length === 0) return text;
  if (text.length < 3) return text.at(0) + '*'.repeat(text.length - 1);
  const first = text.at(0);
  const last = text.at(-1);
  return first + '*'.repeat(text.length - 2) + last;
};

// get 현재 페이지 상품 data
const hash = window.location.hash.slice(1);
const thisProductData = await pb
  .collection('products')
  .getOne(hash, { requestKey: null });

// 현재페이지에서 로그인 여부 상태 확인 후 localStorage로 auth 전달
if (!localStorage.getItem('auth')) {
  setStorage('auth', defaultAuthData);
}
// const auth = localStorage.getItem('auth');
const { user, isAuth } = await getStorage('auth');

// 리뷰 렌더링
async function renderReviews() {
  const response = await pb.collection('reviews_users_data').getFullList({
    filter: `products_record = "${hash}"`,
    sort: '-created',
  });
  const reviewNumber = getNode('.reviewNumber');
  const number = response.length;
  reviewNumber.textContent = `총 ${number}개`;
  const emptyReview = /*html*/ `
    <div
        id="emptyReview"
        class="flex h-[140px] flex-col items-center justify-center gap-5 border-b border-b-gray-100 bg-gray-50 p-5 text-l-lg text-gray-400"
      >
        <svg
          aria-hidden="true"
          width="48"
          height="48"
          viewBox="0 0 48 48"
          role="img"
        >
          <use href="/public/icons/_sprite.svg#notice" />
        </svg>
        <span>따끈한 첫 후기를 기다리고 있어요.</span>
      </div>
      <div>
    `;

  response.forEach((item) => {
    const {
      user_name,
      user_class,
      products_name,
      isBestReview,
      created,
      content,
    } = item;

    // 사용자 이름 보안처리
    const secureName = encryptName(user_name);

    const bestTemplate = '<span class="class--best">베스트</span>';
    const reviewTemplate = /*html*/ `
    <article class="review__article relative">
          <div class="review__article--badge w-[230px]">
          ${isBestReview ? bestTemplate : ''}
            
            <span class="class--unfilled">${user_class}</span>
            <span>${secureName}</span>
          </div>
          <div class="review__article__text">
            <h3 class="text-gray-400">${products_name}</h3>
            <p class="text-p-sm">
              ${content}
            </p>
            <p class="text-gray-400"></p>${created.slice(0, 4)}.${created.slice(
              5,
              7
            )}.${created.slice(8, 10)}</p>
          </div>
          <button
            class="absolute bottom-5 right-5 flex h-8 items-center justify-center gap-1  rounded-4xl border border-gray-200 px-4 text-p-sm text-gray-200 hover:fill-primary hover:text-primary"
            id="recommandButton"
            type="button"
          >
            <svg
              aria-hidden="true"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              role="img"
            >
              <use href="/public/icons/_sprite.svg#thumb" />
            </svg>
            도움돼요
            <span>24</span>
          </button>
        </article>
    `;

    insertBefore(reviewPagenation, reviewTemplate);
  });
  if (!number) {
    insertBefore(reviewPagenation, emptyReview);
  }
}

// 문의하기 렌더링
async function renderInquiries() {
  const response = await pb.collection('inquiries_users_data').getFullList({
    filter: `products_record = "${hash}"`,
    sort: '-created',
  });

  response.forEach((item) => {
    const {
      user_name,
      title,
      isSecure,
      feedbacks_created,
      feedbacks_content,
      created,
      content,
      users_record,
    } = item;

    //답변여부 체크
    let feedbackStatus;
    if (feedbacks_content) {
      feedbackStatus =
        '<span class="inquiries__span--feedback">답변완료</span>';
    } else {
      feedbackStatus = '<span class="inquiries__span">답변대기</span>';
    }
    // 사용자 이름 보안처리
    const secureName = encryptName(user_name);

    const feedbackTemplate = /*html */ `
 <div class="flex gap-3">
    <svg
      aria-hidden="true"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      role="img"
    >
      <use href="/public/icons/_sprite.svg#answer" />
    </svg>
    <div>
    ${feedbacks_content}
      <div class="pt-3">${feedbacks_created.slice(
        0,
        4
      )}.${feedbacks_created.slice(5, 7)}.${feedbacks_created.slice(
        8,
        10
      )}</div>
    </div>`;
    const unsecuredTemplate = /*html*/ `
<details class="flex flex-col">
<summary
  class="flex cursor-pointer items-center border-b border-b-gray-100"
>
  <h3 class="inquiries__h3">${title} ${
    users_record === user.id
      ? `<svg
      class = "ml-5"
  aria-hidden="true"
  width="12"
  height="14"
  viewBox="0 0 12 14"
  role="img"
>
  <use href="/src/assets/svg/_sprite.svg#lock" />
</svg>`
      : ''
  }</h3>
  <span class="inquiries__span">${secureName}</span>
  <span class="inquiries__span">${created.slice(0, 10)}</span>
  ${feedbackStatus}
</summary>
<div
  class="flex flex-col gap-10 border-b border-b-gray-100 bg-gray-50 p-5 text-l-sm text-content"
>
  <div class="flex gap-3">
    <svg
      aria-hidden="true"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      role="img"
    >
      <use href="/public/icons/_sprite.svg#question" />
    </svg>
    <div>
    ${content}
    </div>
  </div>
${feedbacks_content ? feedbackTemplate : ''}
  </div>
</div>
</details>
`;
    const securedTemplate = /*html*/ `
<div class="flex h-[58px] items-center border-b border-b-gray-100">
<div class="flex w-[750px] items-center gap-5 px-5">
  <p class="text-l-base text-gray-400">비밀글입니다.</p>
  <svg
    aria-hidden="true"
    width="12"
    height="14"
    viewBox="0 0 12 14"
    role="img"
  >
    <use href="/src/assets/svg/_sprite.svg#lock" />
  </svg>
</div>
<span class="inquiries__span">${secureName}</span>
<span class="inquiries__span">${created.slice(0, 10)}</span>
<span class="inquiries__span">${feedbackStatus}</span>
</div>
`;

    //비밀글 여부
    if (isSecure) {
      if (users_record === user.id) {
        insertBefore(inquiriesPagenation, unsecuredTemplate);
      } else {
        insertBefore(inquiriesPagenation, securedTemplate);
      }
    } else {
      insertBefore(inquiriesPagenation, unsecuredTemplate);
    }
  });
}

// Post 리뷰 - 추후에 상품hash랑 Userhash 넘겨야함
async function postReview(e) {
  e.preventDefault();
  const reviewTitle = getNode('#reviewTitle');
  const reviewText = getNode('#reviewText');

  if (!reviewTitle.value || !reviewText.value) {
    alert('입력사항을 다시 한 번 확인해주세요.');
    return;
  }

  const data = {
    products_record: hash,
    users_record: user.id,
    title: reviewTitle.value,
    content: reviewText.value,
  };

  try {
    await pb.collection('reviews').create(data);
    alert('등록되었습니다.');
    location.reload(true);
  } catch {
    alert('입력사항을 다시 한 번 확인해주세요.');
  }
}

// Post 문의하기 - 추후에 상품hash 넘겨야함
async function postInpuiries(e) {
  e.preventDefault();

  const inquiriesTitle = getNode('#inquiriesTitle');
  const inquiriesText = getNode('#inquiriesText');
  const secret = getNode('#secret');

  if (!inquiriesTitle.value || !inquiriesText.value) {
    alert('입력사항을 다시 한 번 확인해주세요.');
    return;
  }

  const data = {
    products_record: hash,
    users_record: user.id,
    title: inquiriesTitle.value,
    content: inquiriesText.value,
    isSecure: secret.checked,
  };

  try {
    await pb.collection('inquiries').create(data);
    alert('등록되었습니다.');
    location.reload(true);
  } catch {
    alert('입력사항을 다시 한 번 확인해주세요.');
  }
}

// 리뷰 공지 렌더링
async function renderReviewNotice() {
  const response = await pb.collection('notices').getFullList({
    sort: '-created',
    filter: 'field = "review"',
  });

  response.forEach((item) => {
    const template = /* html*/ `
    <details class="notice--details">
    <summary class="flex cursor-pointer border-b border-b-gray-100">
      <h3 class="inquiries__h3 flex gap-5">
        <span class="class--notice">공지</span>
        <span>${item.title}</span>
      </h3>
    </summary>
    <div
      class="flex flex-col gap-10 border-b border-b-gray-100 bg-gray-50 p-5 text-l-sm text-content"
    >
      <span>${item.content}</span>
    </div>
  </details>
    `;
    insertAfter(reviewNotice, template);
  });
}

// 문의사항 공지 렌더링
async function renderInquiriesNotice() {
  const response = await pb.collection('notices').getFullList({
    sort: '-created',
    filter: 'field = "inquiries"',
    requestKey: null,
  });

  response.forEach((item) => {
    const template = /* html*/ `
    <details class="notice--details">
        <summary
          class="flex cursor-pointer items-center border-b border-b-gray-100"
        >
          <h3 class="inquiries__h3 flex gap-5">
            <span class="class--notice">공지</span>
            <span>${item.title}</span>
          </h3>
          <span class="inquiries__span">${item.author}</span>
          <span class="inquiries__span">${item.created.slice(0, 10)}</span>
          <span class="inquiries__span">-</span>
        </summary>
        <div
          class="flex flex-col gap-10 border-b border-b-gray-100 bg-gray-50 p-5 text-l-sm text-content"
        >
          <span>${item.content}</span>
        </div>
      </details>
    `;
    insertAfter(inquiriesNotice, template);
  });
}

// fake-placeholder 구현
function removePlaceholder(node) {
  return () => {
    addClass(node, 'hidden');
  };
}
function addPlaceholder(node) {
  return (e) => {
    const { target } = e;
    if (!target.value) {
      removeClass(node, 'hidden');
    }
  };
}

//textarea 글자수 제한
function countTextLength(e) {
  const text = e.target.value;
  e.target.nextElementSibling.textContent = `${text.length} / 5,000`;
}
reviewText.addEventListener('input', countTextLength);
inquiriesText.addEventListener('input', countTextLength);

// 리뷰 및 문의 모달 활성화 구현
function openModal(e) {
  e.preventDefault();
  const { target } = e;

  const reviewFigcap = getNode('#reviewFigcap');
  const inquiriesFigcap = getNode('#inquiriesFigcap');
  const reviewImg = getNode('#reviewImg');
  const inquiriesImg = getNode('#inquiriesImg');

  attr(reviewImg, 'src', `${getPbImageURL(thisProductData, 'thumbImg')}`);
  attr(inquiriesImg, 'src', `${getPbImageURL(thisProductData, 'thumbImg')}`);

  inquiriesFigcap.textContent = `${thisProductData.name}`;
  reviewFigcap.textContent = `${thisProductData.name}`;

  if (!isAuth) {
    alert('로그인이 필요합니다.');
    window.location.href = '/src/pages/login/';
  } else {
    const dialog = target.nextElementSibling;
    dialog.showModal();
  }
}
function closeModal(e) {
  e.preventDefault();
  const { target } = e;
  const dialog = target.closest('dialog');
  dialog.close();
}

//active Post Button 기능
function activeReviewButton() {
  if (reviewTitle.value && reviewText.value) {
    removeClass(postReviewButton, 'bg-gray-100');
    addClass(postReviewButton, 'bg-primary');
    attr(postReviewButton, 'disabled', '');
  } else {
    removeClass(postReviewButton, 'bg-primary');
    addClass(postReviewButton, 'bg-gray-100');
    attr(postReviewButton, 'disabled', true);
  }
}
function activeInquiriesButton() {
  if (inquiriesTitle.value && inquiriesText.value) {
    removeClass(postInquiriesButton, 'bg-gray-100');
    addClass(postInquiriesButton, 'bg-primary');
    attr(postInquiriesButton, 'disabled', '');
  } else {
    removeClass(postInquiriesButton, 'bg-primary');
    addClass(postInquiriesButton, 'bg-gray-100');
    attr(postInquiriesButton, 'disabled', true);
  }
}

reviewText.addEventListener('blur', addPlaceholder(reviewPlaceholder));
inquiriesText.addEventListener('blur', addPlaceholder(inquiriesPlaceholder));
reviewText.addEventListener('input', removePlaceholder(reviewPlaceholder));
inquiriesText.addEventListener(
  'input',
  removePlaceholder(inquiriesPlaceholder)
);
openReviewButton.addEventListener('click', openModal);
openInquiriesButton.addEventListener('click', openModal);
cancelReviewModal.addEventListener('click', closeModal);
cancelInquiriesModal.addEventListener('click', closeModal);
reviewText.addEventListener('input', countTextLength);
inquiriesText.addEventListener('input', countTextLength);
renderReviewNotice();
renderInquiriesNotice();
postReviewButton.addEventListener('click', postReview);
postInquiriesButton.addEventListener('click', postInpuiries);
renderReviews();
renderInquiries();
reviewForm.addEventListener('input', activeReviewButton);
inquiriesForm.addEventListener('input', activeInquiriesButton);
