import { getNode, addClass, removeClass, insertAfter } from '/src/lib/';
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
// const postReviewButton = getNode('#postReviewButton');
const postInquiriesButton = getNode('#postInquiriesButton');
const reviewNotice = getNode('.reviewNotice');
const inquiriesNotice = getNode('.inquiriesNotice');

// Post 문의하기 - 추후에 상품hash랑 Userhash 넘겨야함
async function postInpuiries() {
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

postInquiriesButton.addEventListener('click', postInpuiries);
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
