import { setStorage, getStorage } from '/src/lib/utils/storage';
import { getNode } from '/src/lib/';

const popup = getNode('.popup');
const todayCloseButton = getNode('.button__today--closed');
const closeButton = getNode('.button--closed');
const currentDay = new Date().getDay();

// 팝업 닫기
export function closePopup() {
  popup.close();
}

// 로컬스토리지에 저장된 값을 가져와 비교
(async () => {
  const saveDay = await getStorage('saveDay');

  if (saveDay !== currentDay || saveDay === null) {
    localStorage.removeItem('saveDay');
    popup.showModal();
  }
})();

// 팝업을 닫았을 때의 요일을 로컬스토리지에 저장
export function closePopupToday() {
  popup.close();
  const clickedDay = new Date().getDay();
  setStorage('saveDay', clickedDay);
}

// 이벤트리스너
todayCloseButton.addEventListener('click', closePopupToday);
closeButton.addEventListener('click', closePopup);
