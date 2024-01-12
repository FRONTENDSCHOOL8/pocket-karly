import PocketBase from 'pocketbase';
import {
  getNode,
  getNodes,
  getPbImageURL,
  insertFirst,
  clearContents,
  comma,
} from '/src/lib';
import '/src/styles/tailwind.css';
import '/src/pages/components/js/include.js';
import { execDaumPostcode } from '/src/pages/components/js/addressApi.js';

const pb = new PocketBase(import.meta.env.VITE_PB_URL);
let amount;

const productTemplate = getNode('.product--template');

// 유저 정보 테스트코드 2개
// 로그인한 유저의 id를 가져오도록 변경 필요
const userData = await pb.collection('users').getOne('q4l7a4urcjb33hz');
// const userData = await pb.collection('users').getOne('9vzsdelu39rzk6q');
const { id, address } = userData;

// 냉장식품 템플릿
const cartDataCold = await pb.collection('carts_products_data').getFullList({
  filter: `packageType = "냉장식품" && users_record = "${id}"`,
  sort: 'created',
});

// 선택된 상품 상태변수 관리
const productState = {};

// * 냉장식품 템플릿 반복문
cartDataCold.forEach((cart) => {
  const { products_record, name, price, discount, amount, thumbImgAlt } = cart;

  const discountPrice =
    Math.floor((price - price * (discount * 0.01)) / 10) * 10 * amount;
  const totalPrice = price * amount;

  const templateProduct = /* html */ `
    <li class="item flex items-center px-1 py-5">
      <label
        for=${removeNumbers(products_record)}
        class="relative flex items-center text-l-base text-content"
      >
        <input
          checked
          type="checkbox"
          name="select__product"
          id=${removeNumbers(products_record)}
          class="peer absolute h-6 w-6 appearance-none"
          data-record=${products_record}
        />
        <span
          aria-hidden="true"
          class="bg-input__button bg-check--no peer-checked:bg-check--yes inline-block h-6 w-6 cursor-pointer"
        ></span>
      </label>
      <div class="mx-2 w-[60px] overflow-hidden">
        <a href="#">
          <img
            src=${getPbImageURL(cart, 'thumbImg')}
            alt=${thumbImgAlt}
            class="w-full scale-150"
          />
        </a>
      </div>
      <p class="text-l-base text-black w-80">
        <a href="#">${name}</a>
      </p>
      <div
        class="button__amount h-7.5 ml-6 mr-2 flex w-[90px] border border-gray-200"
      >
        <button
          type="button"
          class="button__minus w-7.5 overflow-hidden"
        >
          <svg
            role="img"
            width="46"
            height="84"
            viewBox="8 46 46 84"
          >
            <use href="/icons/_sprite.svg#minus" />
          </svg>
        </button>
        <span class="product__amount w-7.5 inline-block text-center align-top leading-[30px]">${amount}</span>
        <button
          type="button"
          class="button__plus w-7.5 overflow-hidden"
        >
          <svg
            role="img"
            width="46"
            height="84"
            viewBox="8 8 46 84"
          >
            <use href="/icons/_sprite.svg#plus" />
          </svg>
        </button>
      </div>
      <div class="product__price w-32 text-right">
        <span class="text-l-base text-black">${comma(discountPrice)}원</span>
        ${
          discount === 0
            ? ``
            : `<del class="mt-1 block text-[14px] font-medium text-gray-400">${comma(
                totalPrice
              )}원</del>`
        }
      </div>
      <button class="ml-2">
        <svg
          role="img"
          width="30"
          height="30"
          viewBox="0 0 30 30"
        >
          <use href="/icons/_sprite.svg#cancel" />
        </svg>
      </button>
    </li>
  `;

  insertFirst('.product__cold--template', templateProduct);

  productState[products_record] = true;
});

function removeNumbers(value) {
  const result = value.replace(/\d+/g, '');
  return result;
}

// ^ checkState 함수
// * target은 input(dom), products_record는 상품id
function checkState(target, products_record) {
  console.log('target,', target);
  if (target.checked) {
    productState[products_record] = true;
  } else {
    productState[products_record] = false;
  }
}

// 냉동식품 템플릿
const cartDataFreeze = await pb.collection('carts_products_data').getFullList({
  filter: `packageType = "냉동식품" && users_record = "${id}"`,
  sort: 'created',
});

cartDataFreeze.forEach((cart) => {
  const { products_record, name, price, discount, amount, thumbImgAlt } = cart;

  const discountPrice =
    Math.floor((price - price * (discount * 0.01)) / 10) * 10 * amount;
  const totalPrice = price * amount;

  const templateProduct = /* html */ `
    <li class="flex items-center px-1 py-5">
      <label
        for=${removeNumbers(products_record)}
        class="relative flex items-center text-l-base text-content"
      >
        <input
          checked
          type="checkbox"
          name="select__product"
          id=${removeNumbers(products_record)}
          class="peer absolute h-6 w-6 appearance-none"
          data-record=${products_record}
        />
        <span
          aria-hidden="true"
          class="bg-input__button bg-check--no peer-checked:bg-check--yes inline-block h-6 w-6 cursor-pointer"
        ></span>
      </label>
      <div class="mx-2 w-[60px] overflow-hidden">
        <a href="#">
          <img
            src=${getPbImageURL(cart, 'thumbImg')}
            alt=${thumbImgAlt}
            class="w-full scale-150"
          />
        </a>
      </div>
      <p class="text-l-base text-black w-80">
        <a href="#">${name}</a>
      </p>
      <div
        class="button__amount h-7.5 ml-6 mr-2 flex w-[90px] border border-gray-200"
      >
        <button
          type="button"
          class="button__minus w-7.5 overflow-hidden"
        >
          <svg
            role="img"
            width="46"
            height="84"
            viewBox="8 46 46 84"
          >
            <use href="/icons/_sprite.svg#minus" />
          </svg>
        </button>
        <span class="product__amount w-7.5 inline-block text-center align-top leading-[30px]">${amount}</span>
        <button
          type="button"
          class="button__plus w-7.5 overflow-hidden"
        >
          <svg
            role="img"
            width="46"
            height="84"
            viewBox="8 8 46 84"
          >
            <use href="/icons/_sprite.svg#plus" />
          </svg>
        </button>
      </div>
      <div class="product__price w-32 text-right">
        <span class="text-l-base text-black">${comma(discountPrice)}원</span>
        ${
          discount === 0
            ? ``
            : `<del class="mt-1 block text-[14px] font-medium text-gray-400">${comma(
                totalPrice
              )}원</del>`
        }
      </div>
      <button class="ml-2">
        <svg
          role="img"
          width="30"
          height="30"
          viewBox="0 0 30 30"
        >
          <use href="/icons/_sprite.svg#cancel" />
        </svg>
      </button>
    </li>
  `;

  insertFirst('.product__freeze--template', templateProduct);

  productState[products_record] = true;
});

// 상온식품 템플릿
const cartDataRoom = await pb.collection('carts_products_data').getFullList({
  filter: `packageType = "상온식품" && users_record = "${id}"`,
  sort: 'created',
});

cartDataRoom.forEach((cart) => {
  const { products_record, name, price, discount, amount, thumbImgAlt } = cart;

  const discountPrice =
    Math.floor((price - price * (discount * 0.01)) / 10) * 10 * amount;
  const totalPrice = price * amount;

  const templateProduct = /* html */ `
    <li class="flex items-center px-1 py-5">
      <label
        for=${removeNumbers(products_record)}
        class="relative flex items-center text-l-base text-content"
      >
        <input
          checked
          type="checkbox"
          name="select__product"
          id=${removeNumbers(products_record)}
          class="peer absolute h-6 w-6 appearance-none"
          data-record=${products_record}
        />
        <span
          aria-hidden="true"
          class="bg-input__button bg-check--no peer-checked:bg-check--yes inline-block h-6 w-6 cursor-pointer"
        ></span>
      </label>
      <div class="mx-2 w-[60px] overflow-hidden">
        <a href="#">
          <img
            src=${getPbImageURL(cart, 'thumbImg')}
            alt=${thumbImgAlt}
            class="w-full scale-150"
          />
        </a>
      </div>
      <p class="text-l-base text-black w-80">
        <a href="#">${name}</a>
      </p>
      <div
        class="button__amount h-7.5 ml-6 mr-2 flex w-[90px] border border-gray-200"
      >
        <button
          type="button"
          class="button__minus w-7.5 overflow-hidden"
        >
          <svg
            role="img"
            width="46"
            height="84"
            viewBox="8 46 46 84"
          >
            <use href="/icons/_sprite.svg#minus" />
          </svg>
        </button>
        <span class="product__amount w-7.5 inline-block text-center align-top leading-[30px]">${amount}</span>
        <button
          type="button"
          class="button__plus w-7.5 overflow-hidden"
        >
          <svg
            role="img"
            width="46"
            height="84"
            viewBox="8 8 46 84"
          >
            <use href="/icons/_sprite.svg#plus" />
          </svg>
        </button>
      </div>
      <div class="product__price w-32 text-right">
        <span class="text-l-base text-black">${comma(discountPrice)}원</span>
        ${
          discount === 0
            ? ``
            : `<del class="mt-1 block text-[14px] font-medium text-gray-400">${comma(
                totalPrice
              )}원</del>`
        }
      </div>
      <button class="ml-2">
        <svg
          role="img"
          width="30"
          height="30"
          viewBox="0 0 30 30"
        >
          <use href="/icons/_sprite.svg#cancel" />
        </svg>
      </button>
    </li>
  `;

  insertFirst('.product__room--template', templateProduct);

  productState[products_record] = true;
});

/* -------------------------------------------------------------------------- */
// 상품 개수
const productCountElem = getNodes('.product__count');

// 전체 상품 개수
const productTotalNum =
  cartDataCold.length + cartDataFreeze.length + cartDataRoom.length;
console.log('productTotalNum: ', productTotalNum);

// 선택 상품 개수 - 임시로 설정
let productSelectedNum = productTotalNum;
renderProductNum();

function renderProductNum() {
  productSelectedNum = trueKeys(productState).length;
  [...productCountElem].forEach((elem) => {
    elem.textContent = `(${productSelectedNum}/${productTotalNum})`;
  });
}

const addressElem = getNode('address');
addressElem.textContent = address;

/* -------------------------------------------------------------------------- */
// 수량 변경 함수
function changeAmount(elemTarget, eventTarget) {
  const beforeAmount = Number(elemTarget.innerText);
  if (eventTarget) {
    amount = beforeAmount + 1;
  } else {
    if (beforeAmount === 1) {
      return;
    }
    amount = beforeAmount - 1;
  }
  elemTarget.textContent = amount;

  changePrice(elemTarget, beforeAmount);
}

// 가격 변경 함수
function changePrice(elemTarget, beforeAmount) {
  const discountElem =
    elemTarget.parentElement.nextElementSibling.firstElementChild;
  const totalPriceElem =
    elemTarget.parentElement.nextElementSibling.lastElementChild;

  const discount =
    discountElem.textContent.replace(/[,원]/g, '') / beforeAmount;
  const totalPrice =
    totalPriceElem.textContent.replace(/[,원]/g, '') / beforeAmount;

  discountElem.textContent = `${comma(discount * amount)}원`;
  totalPriceElem.textContent = `${comma(totalPrice * amount)}원`;
}

// 상품 삭제 함수
async function deleteProduct(e) {
  const productId = e.target
    .closest('li')
    .firstElementChild.getAttribute('for');
  console.log(productId);

  const cartDataCold = await pb.collection('carts').getFullList({
    filter: `users_record = "${id}" && products_record = "${productId}"`,
  });
  await pb.collection('carts').delete(cartDataCold[0].id);
  location.reload();
}

// 배열에 담긴 숫자 합산
function arrayToSum(array) {
  return array.reduce((acc, cur) => acc + cur, 0);
}

// 문자 빼고 숫자(가격)만 추출
function parsePrice(priceString) {
  return Number(priceString.replace(/[,원]/g, ''));
}

// 모든 상품 합산 금액 계산
function calcTotalPrice() {
  const priceElems = getNodes('.product__price');
  const realPriceArray = [];
  const discountPriceArray = [];

  priceElems.forEach((parentDiv) => {
    const firstChild = parentDiv.firstElementChild;
    const childElements = parentDiv.children;

    if (firstChild && firstChild.tagName === 'SPAN') {
      discountPriceArray.push(parsePrice(firstChild.textContent));
    }

    const priceElem =
      childElements.length === 1 ? childElements[0] : childElements[1];
    realPriceArray.push(parsePrice(priceElem.textContent));
  });

  const realPriceAcc = arrayToSum(realPriceArray);
  const discountPriceAcc = arrayToSum(discountPriceArray);

  return { realPriceAcc, discountPriceAcc };
}

// value가 true인 key만 배열로 만듦
function trueKeys(obj) {
  return Object.keys(obj).reduce((acc, key) => {
    if (obj[key] === true) {
      acc.push(key);
    }
    return acc;
  }, []);
}
console.log(trueKeys(productState));

// 총 금액 템플릿 업데이트
function updateTemplate() {
  clearContents('.result--template');
  const { realPriceAcc, discountPriceAcc } = calcTotalPrice();
  const deliveryFee = discountPriceAcc >= 40000 ? 0 : 3000;

  const templateResult = /* html */ `
    <ul class="text-p-base text-content">
      <li class="mb-4 flex justify-between">
        <span>상품금액</span>
        <span>${comma(
          realPriceAcc
        )}<span class="ml-1 text-l-base">원</span></span>
      </li>
      <li class="mb-4 flex justify-between">
        <span>상품할인금액</span>
        <span>-${comma(
          realPriceAcc - discountPriceAcc
        )}<span class="ml-1 text-l-base">원</span></span>
      </li>
      <li class="mb-4 flex justify-between">
        <span>배송비</span>
        <span>${deliveryFee === 0 ? '' : '+'}${comma(
          deliveryFee
        )}<span class="ml-1 text-l-base">원</span></span>
      </li>
    </ul>
    <div class="mb-3 flex items-center justify-between border-t border-dashed border-t-gray-100 pt-6">
      <span class="text-p-base">결제예정금액</span>
      <span class="text-l-base text-black"><strong class="mr-1 text-h-xl">${comma(
        discountPriceAcc + deliveryFee
      )}</strong>원</span>
    </div>
    <p class="relative text-right text-l-sm text-content">
      <span class="left-18 absolute top-[-4px] rounded-sm bg-accent-yellow px-2 py-1 text-white">적립</span>
      최대 36원 적립 일반 0.1%
    </p>
  `;
  insertFirst('.result--template', templateResult);
}
updateTemplate();
/* -------------------------------------------------------------------------- */
// * 회원가입,장바구니 둘 다 쓸 수 있는 함수로 리팩토링 하면 좋을 듯
const selectAlls = getNodes('input[name="select-all"]');

export const checkAll = (elem) => {
  return (e) => {
    const { target } = e;
    const select = getNodes(elem);
    // console.log('select: ', select);
    if (target.checked) {
      select.forEach((item) => {
        item.checked = true;
        productState[item.dataset.record] = true;
      });
    } else {
      select.forEach((item) => {
        item.checked = false;
        productState[item.dataset.record] = false;
      });
    }
    console.log(trueKeys(productState));
    renderProductNum();
  };
};

// 전체선택 연결
function connectSelect(elem) {
  const [checkAll1, checkAll2] = elem;
  checkAll2.addEventListener('change', function () {
    checkAll1.checked = this.checked;
  });

  checkAll1.addEventListener('change', function () {
    checkAll2.checked = this.checked;
  });
}

// 전체선택 시 모든 checkbox 선택
selectAlls.forEach((selectAll) => {
  connectSelect(selectAlls);
  selectAll.addEventListener(
    'click',
    checkAll('input[name="select__product"]')
  );
});
/* -------------------------------------------------------------------------- */
// 버튼 클릭 이벤트 함수
function handleButton(e) {
  const button = e.target.closest('button');
  const input = e.target.closest('input');

  if (!button && !input) {
    return;
  }
  if (button) {
    const minusButton = button.classList.contains('button__minus');
    const plusButton = button.classList.contains('button__plus');
    if (minusButton || plusButton) {
      const amountElem =
        button.previousElementSibling || button.nextElementSibling;
      changeAmount(amountElem, plusButton);
      console.log('수량 버튼 클릭');
      calcTotalPrice();
      updateTemplate();
      return;
    } else {
      console.log('삭제 버튼 클릭');
      deleteProduct(e);
      calcTotalPrice();
      updateTemplate();
    }
  }
  if (input) {
    const productId = input.dataset.record;
    console.log('productId: ', productId);
    checkState(input, productId);
    console.log('productState: ', productState);
    console.log(trueKeys(productState));
    renderProductNum();
  }
}

const selectDeleteButton = getNodes('.button--delete__select');
[...selectDeleteButton].forEach((button) => {
  button.addEventListener('click', () => {
    console.log('선택 삭제 버튼 클릭');
  });
});

/* -------------------------------------------------------------------------- */
// 배송지 변경 함수
const changeAddressButton = getNode('.button__change-address');

changeAddressButton.addEventListener('click', () => {
  console.log('배송지 변경 버튼 클릭');
});
changeAddressButton.addEventListener('click', () => {
  execDaumPostcode();
});

productTemplate.addEventListener('click', handleButton);
