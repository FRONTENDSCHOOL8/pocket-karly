import { getNode, getNodes, attr } from '/src/lib/';
import '/src/styles/tailwind.css';

const radioSvgs = getNodes('.radio__icon');
const radioSvgsArray = [...radioSvgs];
const radios = getNodes('input[type="radio"]');
const radiosArray = [...radios];
const gender = getNode('.gender__wrapper');
const extra = getNode('.extra__wrapper');

function handleRadioClick() {
  radiosArray.forEach((item, i) => {
    attr(item, 'checked', '');
    const isChecked = item.checked;
    if (isChecked) {
      item.setAttribute('checked', '');
      attr(radioSvgsArray[i], 'viewBox', '8 41 40 73');
    } else {
      attr(radioSvgsArray[i], 'viewBox', '8 8 40 73');
    }
  });
}

gender.addEventListener('click', handleRadioClick);
extra.addEventListener('click', handleRadioClick);

const checkSvgs = getNodes('.check__icon');
const checkSvgsArray = [...checkSvgs];
// const checks = getNodes('input[type="checkbox"]');
const checks = getNodes('input[name="agree"]');
const checksArray = [...checks];
const agreement = getNode('.register__agreement');
const agreeAll = getNode('#agreeAll');

function handleCheckClick() {
  const isCheckedAgreeAll = agreeAll.checked;

  if (isCheckedAgreeAll) {
    checksArray.forEach((item) => {
      item.setAttribute('checked', '');
    });
  } else {
    checksArray.forEach((item) => {
      attr(item, 'checked', '');
    });
  }
  checksArray.forEach((item, i) => {
    const isChecked = item.checked;
    if (isChecked) {
      item.setAttribute('checked', '');
      attr(checkSvgsArray[i + 1], 'viewBox', '8 41 40 72');
    } else {
      attr(item, 'checked', '');
      attr(checkSvgsArray[i + 1], 'viewBox', '8 8 40 72');
    }
  });
}

agreement.addEventListener('click', handleCheckClick);
