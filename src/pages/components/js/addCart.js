import pb from '/src/api/pocketbase';
import {
  insertFirst,
  getNode,
  comma,
  clearContents,
  getStorage,
  setStorage,
} from '/src/lib';
import '/src/styles/tailwind.css';

// 장바구니 팝업 그리기
export async function drawCartPopup(productId) {
  try {
    const data = await pb.collection('products').getOne(productId);
    getNode('.product__info--template').replaceChildren();
    getNode('.price__total--template').replaceChildren();

    insertFirst('.product__info--template', drawTemplateInfo(data));
    insertFirst('.price__total--template', drawTemplatePrice(data));

    getNode('.product__amount').textContent = 1;
  } catch (error) {
    alert('데이터 조회에 실패했습니다.');
  }
}

// 상품 수량 추가
export function changeAmount(e) {
  const minusButton = getNode('.button__minus');
  const productAmount = getNode('.product__amount');
  const button = e.target.closest('button');
  e.preventDefault();
  const isMinusButton = button === minusButton;
  const discountPrice = Number(getNode('#discountPrice').dataset.discountprice);
  const currentCount = isMinusButton
    ? Number(productAmount.textContent) - 1
    : Number(productAmount.textContent) + 1;

  minusButton.disabled = currentCount === 1;
  productAmount.textContent = currentCount;

  updateTemplate(discountPrice, currentCount);
}

function drawTemplateInfo(data) {
  const { id, name, price, discount } = data;
  const discountPrice =
    Math.floor((price - price * (discount * 0.01)) / 10) * 10;

  // 상품 정보 템플릿
  const templateInfo = /* html */ `
  <p class="mb-3 text-l-base text-content" data-id=${id}>
  ${name}
  </p>
  <span class="mt-4 text-l-base leading-[30px]" data-discountPrice="${discountPrice}" id="discountPrice"
  >${comma(discountPrice)}원</span
  >
  ${
    discount === 0
      ? ``
      : `<del class="ml-1 text-p-sm text-gray-300">${comma(price)}원</del>`
  }
`;
  return templateInfo;
}

function drawTemplatePrice(data) {
  const { price, discount } = data;
  const discountPrice =
    Math.floor((price - price * (discount * 0.01)) / 10) * 10;
  const reward = Math.round(discountPrice * 0.0005);
  // 상품 합계 템플릿
  const templatePrice = /* html */ `
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
  return templatePrice;
}

// 상품 수에 따라 합계를 누적
function updateAcc(target, currentCount) {
  return target * currentCount;
}

// 상품 합계 업데이트
function updateTemplate(discountPrice) {
  const productAmount = getNode('.product__amount');
  const totalPrice = updateAcc(
    Number(discountPrice),
    Number(productAmount.textContent)
  );

  const reward = updateAcc(
    Number(Math.round(discountPrice * 0.0005)),
    Number(productAmount.textContent)
  );

  clearContents('.price__total--template');
  const templatePrice = /* html */ `
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

// 취소 버튼 클릭
export function cancelAddCart(addCartPopup) {
  addCartPopup.close();
}

// 장바구니 담기 버튼 클릭
export async function addCart(addCartPopup) {
  const productId = getNode('.product__info--template p').dataset.id;
  let amount = Number(getNode('.product__amount').innerText);
  const name = getNode('.product__info--template p').innerText;
  let isExist = false;

  // local storage에 저장되어 있는 cart 값 가져옴
  // cart id, amout를 갖는 객체로 이루어진 배열임
  let cart = await getStorage('cart');
  const product = { products_record: productId, amount };

  // 만약 아무것도 저장되어 있지 않다면 배열 만들어 cart에 저장
  if (!cart) {
    cart = [];
    cart.push(product);
    setStorage('cart', cart);
    addCartPopup.close();
    alert(`장바구니에 ${name}을 담았습니다.`);
    return;
  }

  // 이미 저장되어 있는 product라면 amount를 더해줌
  cart.forEach((item, i) => {
    if (item.products_record === productId) {
      amount += item.amount;
      cart[i] = { products_record: productId, amount };
      isExist = true;
      return;
    }
  });

  // 이미 local storage에 저장되어 있던 product가 아니라면 cart에 push 해줌
  if (!isExist) {
    cart.push(product);
  }

  // loacl storage에 cart 배열 저장
  setStorage('cart', cart);
  addCartPopup.close();
  alert(`장바구니에 ${name}을 담았습니다.`);
}
