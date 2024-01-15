import { getNode } from '/src/lib';

// 사용할 js 파일에 원하는 변수를 선언해주세요

// --modalType
// const modalAlert = getNode('.modal__alert');
// const modalConfirm = getNode('.modal__confirm');

// --modalType1 button
// const modalAlertButton = getNode('.button__alert');

// --modalType2 button
// const modalCancelButton = getNode('.button__cancel');
// const modalConfirmButton = getNode('.button__confirm');

/* -------------------------------------------------------------------------- */
// modalType: modalAlert / modalConfirm 중 택1
// text: 넣고싶은 텍스트 (string으로 작성)
// type: alert / confirm 중 택1 (string으로 작성)
export function openModal(modalType, text, type) {
  const modalText = getNode(`.modal__text--${type}`);
  modalText.textContent = text;
  modalType.showModal();
}

// 닫을 때는 .close() 메서드 사용

// 사용할 js 파일에 import해서 사용해주세요
// import { openModal } from '/src/pages/components/js/modals.js';
