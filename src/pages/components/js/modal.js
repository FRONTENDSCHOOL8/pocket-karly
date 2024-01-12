// modal.js
export function createModal(modalTextContent) {
  // 모달을 생성합니다.
  const modal = document.createElement('div');
  modal.setAttribute('id', 'myModal');
  modal.setAttribute(
    'class',
    'fixed z-10 hidden inset-0 overflow-y-auto flex items-center justify-center'
  );

  // 모달 컨텐츠를 생성합니다.
  const modalContent = document.createElement('div');
  modalContent.setAttribute(
    'class',
    'relative h-[185px] w-[370px] rounded-[10px] bg-white shadow-Below/Medium flex flex-col'
  );

  // 모달 내부의 텍스트를 생성합니다.
  const modalText = document.createElement('span');
  modalText.setAttribute(
    'class',
    'flex-1 flex items-center justify-center text-center text-[18px] font-semibold leading-[150%] text-gray-700 px-[20px]'
  ); // 여기에서 padding을 추가했습니다.
  modalText.textContent = modalTextContent;

  // 확인 버튼을 생성합니다.
  const confirmButton = document.createElement('button');
  confirmButton.setAttribute(
    'class',
    'w-full rounded-b-[10px] border-t border-t-gray-100 bg-white py-[14px] text-l-base text-primary'
  );
  confirmButton.textContent = '확인';

  // 모든 요소를 조립합니다.
  modalContent.appendChild(modalText);
  modalContent.appendChild(confirmButton);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // 클릭 이벤트를 설정합니다.
  confirmButton.onclick = function () {
    modal.style.display = 'none';
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };

  return modal;
}

export function openModal(modal) {
  modal.style.display = 'flex';
}

// 모듈을 불러온 js에서
// import { createModal, openModal } from '/src/pages/components/js/1.js';

// const myModal = createModal('회원가입을 완료했습니다.');
// document
//   .getElementById('open-modal')
//   .addEventListener('click', () => openModal(myModal));
