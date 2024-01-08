import PocketBase from 'pocketbase';
import { insertFirst, getNode, comma, clearContents } from '/src/lib';
import '/src/styles/tailwind.css';

const pb = new PocketBase(import.meta.env.VITE_PB_URL);
// 클릭한 상품의 아이디를 불러오도록 변경 필요
// 할인 적용 상품 예시
const data = await pb.collection('products').getOne('p23nio608325zim');
// 할인 미적용 상품 예시
// const data = await pb.collection('products').getOne('u0aklckqzntpfb6');
const { name, price, discount } = data;

const addCartPopup = getNode('.add-cart__popup');
const minusButton = getNode('.button__minus');
const plusButton = getNode('.button__plus');
const productAmount = getNode('.product__amount');
const discountPrice = Math.floor((price - price * (discount * 0.01)) / 10) * 10;
const closeButton = getNode('.add-cart__button--closed');
const addCartButton = getNode('.add-cart__button');
let reward = Math.round(discountPrice * 0.0005);
productAmount.textContent = 1;

// 추후 장바구니 아이콘 클릭 시에만 열리도록 수정 필요
addCartPopup.showModal();

// 상품 수량 추가
function changeAmount(e) {
  e.preventDefault();
  const isMinusButton = this === minusButton;
  const currentCount = isMinusButton
    ? Number(productAmount.textContent) - 1
    : Number(productAmount.textContent) + 1;

  // console.log(currentCount);
  minusButton.disabled = currentCount === 1;
  productAmount.textContent = currentCount;

  updateAcc(discountPrice, currentCount);
  updateAcc(reward, currentCount);
  updateTemplate();
}

// 상품 수에 따라 합계를 누적
function updateAcc(target, currentCount) {
  return target * currentCount;
}

// 상품 정보 템플릿
const templateInfo = /* html */ `
  <p class="mb-3 text-l-base text-content">
  ${name}
  </p>
  <span class="mt-4 text-l-base leading-[30px]"
  >${comma(discountPrice)}원</span
  >
  ${
    discount === 0
      ? ``
      : `<del class="ml-1 text-p-sm text-gray-300">${comma(price)}원</del>`
  }
`;

// 상품 합계 템플릿
let templatePrice = /* html */ `
  <span class="mt-3.5 align-bottom text-l-base">합계</span>
  <span class="text-right text-h-xl"
    >${comma(discountPrice)}원</span
  >
  <div class="col-span-2 justify-self-end">
    <span
      class="rounded-sm bg-accent-yellow px-2 py-[3px] text-l-sm text-white"
      >적립</span
    >
    <span class="inline-block w-32 text-right align-middle text-l-base leading-none"
      >구매 시 ${comma(reward)}원 적립</span
    >
  </div>
`;

// 상품 합계 업데이트
function updateTemplate() {
  const totalPrice = updateAcc(
    Number(discountPrice),
    Number(productAmount.textContent)
  );
  reward = updateAcc(
    Number(Math.round(discountPrice * 0.0005)),
    Number(productAmount.textContent)
  );

  clearContents('.price__total--template');
  templatePrice = /* html */ `
    <span class="mt-3.5 align-bottom text-l-base">합계</span>
    <span class="text-right text-h-xl"
      >${comma(totalPrice)}원</span
    >
    <div class="col-span-2 justify-self-end">
      <span
        class="rounded-sm bg-accent-yellow px-2 py-[3px] text-l-sm text-white"
        >적립</span
      >
      <span class="inline-block w-32 text-right align-middle text-l-base leading-none"
        >구매 시 ${comma(reward)}원 적립</span
      >
    </div>
  `;
  insertFirst('.price__total--template', templatePrice);
}

// DB 연결 후 취소 버튼 클릭, 장바구니 담기 버튼 클릭에 따른 처리 필요
function cancelAddCart() {
  addCartPopup.close();
}

// 페이지와 연결 시 bubble 띄우도록 변경 필요 (임시로 alert 처리)
function addCart() {
  addCartPopup.close();
  alert(`장바구니에 ${name}을 담았습니다.`);
}

insertFirst('.product__info--template', templateInfo);
insertFirst('.price__total--template', templatePrice);

minusButton.addEventListener('click', changeAmount);
plusButton.addEventListener('click', changeAmount);
closeButton.addEventListener('click', cancelAddCart);
addCartButton.addEventListener('click', addCart);
