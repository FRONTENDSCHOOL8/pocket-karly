import PocketBase from 'pocketbase';
import {
  getNode,
  getNodes,
  getPbImageURL,
  getStorage,
  setStorage,
  insertFirst,
  clearContents,
  comma,
} from '/src/lib';
import '/src/styles/tailwind.css';
import '/src/pages/components/js/include.js';
import { execDaumPostcode } from '/src/pages/components/js/addressApi.js';
import { openModal } from '/src/pages/components/js/modals.js';

const pb = new PocketBase(import.meta.env.VITE_PB_URL);
const isAuth = await getStorage('auth');
const packageTypeCold = getNode('.package__type--cold');
const packageTypeFreeze = getNode('.package__type--freeze');
const packageTypeRoom = getNode('.package__type--room');
const nothingProduct = getNode('.cart__product--nothing');
const addressSection = getNode('.user__address');
const productTemplate = getNode('.product--template');
const productStateArr = []; // 상태관리
const cartState = {}; // 상태관리
const cartCountElem = getNodes('.product__count'); // 상품 수량
const selectAlls = getNodes('input[name="select-all"]'); // 전체선택 버튼
const orderButton = getNode('.button__order'); // 주문하기 버튼
const modalConfirm = getNode('.modal__confirm');
const modalAlert = getNode('.modal__alert');
const modalCancelButton = getNode('.button__cancel');
const modalConfirmButton = getNode('.button__confirm');
const modalAlertButton = getNode('.button__alert');

let cartDataCold = [];
let cartDataFreeze = [];
let cartDataRoom = [];
let amount;

// 로컬스토리지에 auth가 있다면(회원이라면)
if (isAuth) {
  const { id, address, detailAddress } = isAuth['user'];
  cartDataCold = await pb.collection('carts_products_data').getFullList({
    filter: `packageType = "냉장식품" && users_record = "${id}"`,
    sort: 'created',
  });
  cartDataFreeze = await pb.collection('carts_products_data').getFullList({
    filter: `packageType = "냉동식품" && users_record = "${id}"`,
    sort: 'created',
  });
  cartDataRoom = await pb.collection('carts_products_data').getFullList({
    filter: `packageType = "상온식품" && users_record = "${id}"`,
    sort: 'created',
  });

  // 배송지 변경 함수
  const addressElem = getNode('address');
  addressElem.textContent = `${address} ${detailAddress}`;
  const changeAddressButton = getNode('.button__change-address');

  // &배송지 변경 버튼 클릭 시 DB 변경 기능 추가 필요
  changeAddressButton.addEventListener('click', () => {
    execDaumPostcode();
  });
} else {
  // *cart 유무에 따라서 데이터 불러올지 말지도 처리해주면 좋을 듯
  try {
    const getProductData = async (productRecordFilters, packageType) => {
      return await pb.collection('products').getFullList({
        filter: `(${productRecordFilters}) && packageType = "${packageType}"`,
      });
    };

    const getCartData = async () => {
      return await getStorage('cart');
    };

    const getFilteredCartData = (cartData, productData) => {
      return cartData.reduce((filteredData, cartItem) => {
        const matchProduct = productData.find(
          (product) => product.id === cartItem['products_record']
        );
        if (matchProduct) {
          filteredData.push({ ...cartItem, ...matchProduct });
        }
        return filteredData;
      }, []);
    };

    const cartData = await getCartData();
    const productRecordFilters = cartData
      .map((item) => `id="${item['products_record']}"`)
      .join('||');

    const coldData = await getProductData(productRecordFilters, '냉장식품');
    cartDataCold = getFilteredCartData(cartData, coldData);

    const freezeData = await getProductData(productRecordFilters, '냉동식품');
    cartDataFreeze = getFilteredCartData(cartData, freezeData);

    const roomData = await getProductData(productRecordFilters, '상온식품');
    cartDataRoom = getFilteredCartData(cartData, roomData);
  } catch {
    console.log('장바구니에 담긴 상품이 없습니다');
  }
  addressSection.classList.add('hidden');
  orderButton.textContent = '로그인';
  orderButton.addEventListener('click', () => {
    location.href = '/src/pages/login/';
  });
}
/* -------------------------------------------------------------------------- */
// 냉장식품 템플릿
cartDataCold.forEach((cart) => {
  const { id, products_record, name, price, discount, amount, thumbImgAlt } =
    cart;

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
      data-id=${id}
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
          data-record=${products_record}
          data-amount="minus"
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
            data-record=${products_record}
            data-amount="plus"
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
            <span class="text-l-base text-black">${comma(
              discountPrice
            )}원</span>
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

  cartState[id] = true;

  const dataObj = {
    state: true,
    id,
    products_record,
    price,
    discount,
    amount,
  };
  productStateArr.push(dataObj);
});

function removeNumbers(value) {
  const result = value.replace(/\d+/g, '');
  return result;
}

// 냉동식품 템플릿
cartDataFreeze.forEach((cart) => {
  const { id, products_record, name, price, discount, amount, thumbImgAlt } =
    cart;

  const discountPrice = Math.floor(price - price * (discount * 0.01)) * amount;
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
        data-id=${id}
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
          data-record=${products_record}
          data-amount="minus"
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
          data-record=${products_record}
          data-amount="plus"
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

  cartState[id] = true;

  const dataObj = {
    state: true,
    id,
    products_record,
    price,
    discount,
    amount,
  };
  productStateArr.push(dataObj);
});

// 상온식품 템플릿
cartDataRoom.forEach((cart) => {
  const { id, products_record, name, price, discount, amount, thumbImgAlt } =
    cart;

  const discountPrice = Math.floor(price - price * (discount * 0.01)) * amount;
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
          data-id=${id}
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
          data-record=${products_record}
          data-amount="minus"
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
        data-record=${products_record}
          data-amount="plus"
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

  cartState[id] = true;

  const dataObj = {
    state: true,
    id,
    products_record,
    price,
    discount,
    amount,
  };
  productStateArr.push(dataObj);
});

/* -------------------------------------------------------------------------- */
if (cartDataCold.length) {
  packageTypeCold.classList.remove('hidden');
}
if (cartDataFreeze.length) {
  packageTypeFreeze.classList.remove('hidden');
}
if (cartDataRoom.length) {
  packageTypeRoom.classList.remove('hidden');
}
if (cartDataCold.length || cartDataFreeze.length || cartDataRoom.length) {
  nothingProduct.classList.add('hidden');
}
/* -------------------------------------------------------------------------- */
// ^상태변수 관리 - 상품 선택 여부를 체크하는 함수
// target은 input(dom), products_record는 상품id
function checkState(target, productId, id) {
  cartState[id] = target.checked;

  productStateArr.forEach((obj) => {
    if (obj['products_record'] === productId) {
      obj['state'] = target.checked;
    }
  });
}

// value가 true인 key만 배열로 만드는 함수
function trueKeys(obj) {
  return Object.keys(obj).reduce((acc, key) => {
    if (obj[key] === true) {
      acc.push(key);
    }
    return acc;
  }, []);
}

/* -------------------------------------------------------------------------- */
// key가 value인 객체의 resultKey의 value를 담은 배열 생성
function selectedProductArrKey(key, value, resultKey) {
  return productStateArr
    .filter((obj) => obj[key] === value)
    .map((obj) => obj[resultKey]);
}

const cartTotalNum = productStateArr.length; // 전체 상품 수
let cartSelectedNum = trueKeys(cartState).length; // 선택 상품 수
// 선택된 상품 수 출력
function renderCartNum() {
  cartSelectedNum = trueKeys(cartState).length;
  [...cartCountElem].forEach((elem) => {
    elem.textContent = `(${cartSelectedNum}/${cartTotalNum})`;
  });
}
renderCartNum();

// 수량 변경 함수
function changeAmount(button, plusButton) {
  const amountElem = button.nextElementSibling || button.previousElementSibling;
  console.log('amountElem: ', amountElem);
  const productId = button.dataset.record;
  const beforeAmount = Number(
    selectedProductArrKey('products_record', productId, 'amount').join('')
  );

  if (plusButton) {
    amount = beforeAmount + 1;
  } else {
    if (beforeAmount === 1) {
      return;
    }
    amount = beforeAmount - 1;
  }

  productStateArr.forEach((product) => {
    if (product.products_record === productId) {
      product.amount = amount;
    }
  });
  amountElem.textContent = amount;
  changePrice(button, amount);
  return amount;
}

// 가격 변경 함수
function changePrice(button, amount) {
  const resultPriceElem =
    button.parentElement.nextElementSibling.firstElementChild;
  const netPriceElem = button.parentElement.nextElementSibling.lastElementChild;
  const productId = button.dataset.record;

  const resultPrice = productStateArr
    .filter((product) => product.products_record === productId)
    .map(
      (product) =>
        Math.floor(
          (product.price - product.price * (product.discount * 0.01)) / 10
        ) * 10
    );
  const netPrice = productStateArr
    .filter((product) => product.products_record === productId)
    .map((product) => product.price);

  resultPriceElem.innerText = `${comma(resultPrice * amount)}원`;
  netPriceElem.innerText = `${comma(netPrice * amount)}원`;
}

// 선택한 상품 합산 금액 계산
function calcTotalPrice() {
  // state가 true인 객체를 필터링하여 새로운 배열을 생성
  const filteredProducts = productStateArr.filter(
    (product) => product.state === true
  );
  const netPrice = filteredProducts
    .map((product) => product.price * product.amount)
    .reduce((acc, cur) => acc + cur, 0);

  const resultPrice = filteredProducts
    .map(
      (product) =>
        Math.floor(
          (product.price - product.price * (product.discount * 0.01)) / 10
        ) *
        10 *
        product.amount
    )
    .reduce((acc, cur) => acc + cur, 0);

  const discountPrice = netPrice - resultPrice;

  return { netPrice, discountPrice, resultPrice };
}

// 총 금액 템플릿 업데이트
function updateTemplate() {
  clearContents('.result--template');
  const { netPrice, discountPrice, resultPrice } = calcTotalPrice();
  const deliveryFee = resultPrice >= 40000 || resultPrice === 0 ? 0 : 3000;
  const reward = Math.round(resultPrice * 0.0005);

  const templateResult = /* html */ `
    <ul class="text-p-base text-content">
      <li class="mb-4 flex justify-between">
        <span>상품금액</span>
        <span>${comma(netPrice)}<span class="ml-1 text-l-base">원</span></span>
      </li>
      <li class="mb-4 flex justify-between">
        <span>상품할인금액</span>
        <span>${discountPrice === 0 ? '' : '-'}${comma(
          discountPrice
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
        resultPrice + deliveryFee
      )}</strong>원</span>
    </div>
    <p class="points relative text-right text-l-sm text-content">
      <span class="rounded-sm bg-accent-yellow px-2 py-1 mr-1 text-white">적립</span>
      ${
        isAuth
          ? `최대 ${reward}원 적립 일반 0.1%`
          : `로그인 후 회원 등급에 따라 적립`
      }
    </p>
  `;
  insertFirst('.result--template', templateResult);
}
updateTemplate();
/* -------------------------------------------------------------------------- */
// 상품 삭제 함수 (x버튼 클릭 - 개별 삭제)
async function deleteProduct(e) {
  const productId =
    e.target.closest('li').firstElementChild.firstElementChild.dataset.record;
  console.log(productId);

  if (isAuth) {
    // 회원 DB 데이터 삭제
    const { id } = isAuth['user'];

    const cartDataCold = await pb.collection('carts').getFullList({
      filter: `users_record = "${id}" && products_record = "${productId}"`,
    });
    await pb.collection('carts').delete(cartDataCold[0].id);
  } else {
    // 비회원 로컬스토리지 데이터 삭제
    const cartData = await getStorage('cart');

    const saveCartData = cartData.filter((data) => {
      return data['products_record'] !== productId;
    });
    setStorage('cart', saveCartData);
  }
  location.reload();
}

// 선택삭제 버튼 클릭시 선택된 상품 삭제
async function deleteSelectedProduct() {
  const selectedProductIds = selectedProductArrKey('state', true, 'id');

  if (isAuth) {
    // 회원 DB 데이터 삭제
    for (const id of selectedProductIds) {
      await pb.collection('carts').delete(id);
    }
  } else {
    // 비회원 로컬스토리지 데이터 삭제
    const cartData = await getStorage('cart');

    // 조건에 해당하지 않는 요소만 필터링 (saveData 얻기)
    const filterArrayByCondition = (arr, conditionFunc) => {
      return arr.filter(conditionFunc);
    };

    const filtering = (data) => {
      for (const id of selectedProductIds) {
        if (data['products_record'] === id) {
          return false;
        }
      }
      return true;
    };

    const saveCartData = filterArrayByCondition(cartData, filtering);
    setStorage('cart', saveCartData);
  }
  location.reload();
}
/* -------------------------------------------------------------------------- */
export const checkAll = (elem) => {
  return (e) => {
    const { target } = e;
    const select = getNodes(elem);
    if (target.checked) {
      select.forEach((item) => {
        item.checked = true;
        cartState[item.dataset.id] = true;
        productStateArr.forEach((item) => {
          item.state = true;
        });
      });
    } else {
      select.forEach((item) => {
        item.checked = false;
        cartState[item.dataset.id] = false;
        productStateArr.forEach((item) => {
          item.state = false;
        });
      });
    }
    // console.log(selectedProductArrKey('state', true, 'id'));
    renderCartNum();
    updateTemplate();
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
  if (!nothingProduct.classList.contains('hidden')) {
    selectAll.checked = false;
    selectAll.disabled = true;
  } else {
    selectAll.checked = true;
    selectAll.disabled = false;
  }
  connectSelect(selectAlls);
  selectAll.addEventListener(
    'click',
    checkAll('input[name="select__product"]')
  );
});
/* -------------------------------------------------------------------------- */
// 버튼 클릭 이벤트 함수
function handleButton(e) {
  const { target } = e;
  const button = target.closest('button');
  const input = target.closest('input');

  if (!button && !input) {
    return;
  }
  if (button) {
    const minusButton = button.classList.contains('button__minus');
    const plusButton = button.classList.contains('button__plus');
    if (minusButton || plusButton) {
      changeAmount(button, plusButton);
      console.log('수량 버튼 클릭');
      calcTotalPrice();
      updateTemplate();
      // & 수량 1일때 minus 버튼 diabled 처리
      // const minus = button.closest('button[data-amount="minus"]');
      // const amount = (
      //   button.nextElementSibling || button.previousElementSibling
      // ).textContent;
      // minus.disabled = amount === '1';
      return;
    } else {
      deleteProductModal(e);
      calcTotalPrice();
      updateTemplate();
    }
  }
  if (input) {
    if (!input.checked) {
      selectAlls.forEach((selectAll) => {
        selectAll.checked = false;
      });
    }
    const productId = input.dataset.record;
    const cartId = input.dataset.id;
    checkState(input, productId, cartId);
    renderCartNum();
    updateTemplate();
    console.log(selectedProductArrKey('state', true, 'id'));
  }
}
/* -------------------------------------------------------------------------- */
// 모달창
function deleteSelectedProductModal() {
  openModal(modalConfirm, '선택한 상품을 삭제하시겠습니까?', 'confirm');
  modalCancelButton.addEventListener('click', () => modalConfirm.close());
  modalConfirmButton.addEventListener('click', () => deleteSelectedProduct());
}
function deleteProductModal(e) {
  openModal(modalConfirm, '삭제하시겠습니까?', 'confirm');
  modalCancelButton.addEventListener('click', () => modalConfirm.close());
  modalConfirmButton.addEventListener('click', () => deleteProduct(e));
}
function handleOrderButton(e) {
  if (!isAuth) {
    e.preventDefault();
  } else {
    if (!selectedProductArrKey('state', true, 'id').length) {
      openModal(modalAlert, '장바구니에 상품을 담아주세요.', 'alert');
      modalAlertButton.addEventListener('click', () => modalAlert.close());
    } else {
      openModal(modalConfirm, '주문하시겠습니까?', 'confirm');
      modalCancelButton.addEventListener('click', () => modalConfirm.close());
      modalConfirmButton.addEventListener('click', () => orderCart(e));
    }
  }
}
/* -------------------------------------------------------------------------- */
async function orderCart(e) {
  e.preventDefault();
  // 장바구니에서 체크박스 선택한 상품
  const deleteData = productStateArr.filter(
    (product) => product.state === true
  );

  // carts collection 에서 데이터 삭제
  for (const element of deleteData) {
    await pb.collection('carts').delete(element.id);
  }
  openModal(modalAlert, '주문을 완료했습니다.', 'alert');
  location.reload();
}

// 선택삭제 버튼 이벤트리스너
const selectDeleteButton = getNodes('.button--delete__select');
[...selectDeleteButton].forEach((button) => {
  button.addEventListener('click', deleteSelectedProductModal);
});

// 이벤트리스너
productTemplate.addEventListener('click', handleButton);
orderButton.addEventListener('click', handleOrderButton);
