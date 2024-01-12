import {
  getNode,
  addClass,
  removeClass,
  insertAfter,
  insertBefore,
} from '/src/lib/';
import '/src/styles/tailwind.css';
import pb from '/src/api/pocketbase';

const reviewPlaceholder = getNode('.reviewPlaceholder');
const reviewText = getNode('#reviewText');
const inquiriesPlaceholder = getNode('.inquiriesPlaceholder');
const inquiriesText = getNode('#inquiriesText');
const openReviewButton = getNode('#openReviewButton');
const openInquiriesButton = getNode('#openInquiriesButton');
const cancelReviewModal = getNode('.cancelReviewModal');
const cancelInquiriesModal = getNode('.cancelInquiriesModal');
const postReviewButton = getNode('#postReviewButton');
const postInquiriesButton = getNode('#postInquiriesButton');
const reviewNotice = getNode('.reviewNotice');
const inquiriesNotice = getNode('.inquiriesNotice');
const inquiriesPagenation = getNode('.inquiries__pagenation');

const encryptName = (text) => {
  if (text.length === 0) return text;
  if (text.length < 3) return text.at(0) + '*'.repeat(text.length - 1);
  const first = text.at(0);
  const last = text.at(-1);
  return first + '*'.repeat(text.length - 2) + last;
};

//get 문의하기 - 로그인한 사용자면 비밀글도 볼 수 있어야하는데 .. ㅎㅇ
async function renderInquiries() {
  const response = await pb.collection('inquiries_users_data').getFullList({
    sort: '-created',
  });

  response.forEach((item) => {
    if (item.isFeedback) {
      item.isFeedback = '답변완료';
    } else {
      item.isFeedback = '답변대기';
    }

    item.name = encryptName(item.name);

    const unsecuredTemplate = /*html*/ `
<details class="flex flex-col">
<summary
  class="flex cursor-pointer items-center border-b border-b-gray-100"
>
  <h3 class="inquiries--h3">${item.title}</h3>
  <span class="inquiries--span">${item.name}</span>
  <span class="inquiries--span">${item.created.slice(0, 10)}</span>
  <span class="inquiries--span">${item.isFeedback}</span>
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
    ${item.content}
    </div>
  </div>
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
      안녕하세요. 칼리입니다. <br />믿고 찾아주신 상품에 불편을 드려
      정말 죄송합니다. <br /><br />
      더불어, 해당 게시판은 실시간으로 상담이 어려워 순차적으로
      답변드리고 있는 관계로 신속하게 답변 드리지 못하여 대단히
      죄송합니다.
      <br /><br />
      다행히도 고객님의 불편하셨던 사항은 고객행복센터를 통해 안내
      받으신 점 확인하였습니다. <br /><br />불편을 드려 정말 죄송할
      따름이며, 고객님께 늘 신선하고 최상의 상품을 불편 없이 전달드리기
      위해 최선을 다하는 칼리가 되겠습니다. <br /><br />칼리 드림.
      <div class="pt-3">2022.11.11</div>
    </div>
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
<span class="inquiries--span">${item.name}</span>
<span class="inquiries--span">${item.created.slice(0, 1)}</span>
<span class="inquiries--span">${item.isFeedback}</span>
</div>
`;

    if (item.isSecure) {
      insertBefore(inquiriesPagenation, securedTemplate);
    } else {
      insertBefore(inquiriesPagenation, unsecuredTemplate);
    }
  });
}
renderInquiries();

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

// Post 문의하기 - 추후에 상품hash랑 Userhash 넘겨야함
async function postInpuiries(e) {
  e.preventDefault();
  const inquiriesTitle = getNode('#inquiriesTitle');
  const inquiriesText = getNode('#inquiriesText');
  const secret = getNode('#secret');
  console.log(secret.checked);

  if (!inquiriesTitle.value || !inquiriesText.value) {
    alert('입력사항을 다시 한 번 확인해주세요.');
    return;
  }

  const data = {
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
      <h3 class="inquiries--h3 flex gap-5">
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
          <h3 class="inquiries--h3 flex gap-5">
            <span class="class--notice">공지</span>
            <span>${item.title}</span>
          </h3>
          <span class="inquiries--span">${item.author}</span>
          <span class="inquiries--span">${item.created.slice(0, 10)}</span>
          <span class="inquiries--span">-</span>
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

// 리뷰 및 문의 모달 활성화 구현
function openModal(e) {
  e.preventDefault();
  const { target } = e;
  const dialog = target.nextElementSibling;
  dialog.showModal();
}

function closeModal(e) {
  e.preventDefault();
  const { target } = e;
  const dialog = target.closest('dialog');
  dialog.close();
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
renderReviewNotice();
renderInquiriesNotice();
postReviewButton.addEventListener('click', postReview);
postInquiriesButton.addEventListener('click', postInpuiries);
