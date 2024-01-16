import {
  getPbImageURL,
  getPbImagesURL,
  setStorage,
  getStorage,
  insertFirst,
  getNode,
  getNodes,
  comma,
  setDocumentTitle,
  updateCartBadge,
} from '/src/lib';
import pb from '/src/api/pocketbase';
import '/src/styles/tailwind.css';
import '/src/pages/components/js/include.js';
import Swiper from 'swiper/bundle';
import { openModal } from '/src/pages/components/js/modals.js';

const modalAlert = getNode('.modal__alert');
const modalAlertButton = getNode('.button__alert');

const swiper = new Swiper('.swiper__sidebar', {
  direction: 'vertical',
  slidesPerView: 2.7,
  spaceBetween: 20,
  slidesOffsetAfter: 20,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.button__next',
    prevEl: '.button__prev',
  },
  keyboard: {
    enabled: true,
  },
});

const productId = window.location.hash.slice(1);
const productData = await pb.collection('products').getOne(productId);
setDocumentTitle(productData.name);
onPageLoad();

async function onPageLoad() {
  // 해당 상품의 정보 가져옴

  const productImgURL = getPbImageURL(productData, 'thumbImg');
  const product = {
    id: productId,
    thumbImg: productImgURL,
    thumbImgAlt: productData.thumbImgAlt,
  };

  // local storage에 저장되어 있는 viewedProduct 값 가져옴
  // viewedProduct는 id, imgURL을 갖는 객체로 이루어진 배열임
  let viewedProduct = await getStorage('viewedProduct');

  // 만약 아무것도 저장되어 있지 않다면 배열 만들어 viewedProduct 저장
  if (!viewedProduct) {
    viewedProduct = [];
    viewedProduct.push(product);
    setStorage('viewedProduct', viewedProduct);
  } else {
    // 이미 저장되어 있는 product라면 삭제한 뒤 unshift 이용해서 배열의 가장 앞에 저장
    viewedProduct.forEach((item, i) => {
      if (item.id === productId) {
        viewedProduct.splice(i, 1);
        return i;
      }
    });
    viewedProduct.unshift(product);
  }

  // 최대 15개의 product 저장될 수 있도록 함
  setStorage('viewedProduct', viewedProduct.slice(0, 15));
  drawViewedProduct(swiper);
  swiper.update();
}

async function drawViewedProduct(swiper) {
  // local storage의 'viewedProduct'에 최근본상품 정보 저장되어 있음
  const viewedProduct = await getStorage('viewedProduct');

  if (viewedProduct) {
    viewedProduct.forEach((product) => {
      const template = `
    <div class="swiper-slide">
      <a href="/src/pages/detail/#${product.id}"><img src="${product.thumbImg}" alt="${product.thumbImgAlt}" /></a>
    </div>
    `;
      swiper.appendSlide(template);
    });
  }
}

//

async function renderProductData() {
  const {
    name,
    detail,
    price,
    seller,
    origin,
    alergy,
    weight,
    discount,
    unit,
    packageType,
    detailImgAlt,
    thumbImgAlt,
  } = productData;
  const isAuth = await getStorage('auth');
  const discountPrice =
    Math.floor((price - price * (discount * 0.01)) / 10) * 10;
  const reward = Math.round(discountPrice * 0.0005);
  const rewardMessage = isAuth
    ? `구매 시 ${reward}원 적립`
    : '로그인 후, 적립 혜택 제공';
  // 상세정보 이미지 배열
  const detailImgArr = getPbImagesURL(productData, 'detailImg');
  // 상세정보 이미지 파일명 배열
  const fileNameArr = productData.detailImg.map((file) => {
    const extenisonIndex = file.indexOf('.');
    const fileNameEndIndex = extenisonIndex - 11;
    return file.slice(0, fileNameEndIndex);
  });
  //////////

  const productTemplate = /* html */ `
      <div class="product-detail flex justify-between">
        <div>
          <img
            class="h-[552px] w-[430px] object-cover"
            src="${getPbImageURL(productData, 'thumbImg')}"
            alt="${thumbImgAlt}"
          />
        </div>
        <section class="w-140">
          <div class="flex flex-col gap-4 pb-5">
            <div class="text-h-lg text-gray-500">샛별 배송</div>
            <div>
              <h2 class="pb-1 text-l-xl">${name}</h2>
              <span class="text-gray-400 text-p-base">${detail}</span>
            </div>
            <div>
              <div>
              ${
                discount === 0
                  ? ``
                  : `<span class="text-orange-500 text-l-xl">${comma(
                      discount
                    )}%</span>`
              }
                <span class="text-l-xl ml-1">${comma(discountPrice)}</span>
                <span class="text-h-base">원</span>
              </div>
              ${
                discount === 0
                  ? ``
                  : `<del class="text-gray-300 text-p-base">${comma(
                      price
                    )}원</del>`
              }

            </div>
            <span class="text-l-base text-primary"
              >${
                isAuth
                  ? '최대 36원 적립 일반 0.1%'
                  : '로그인 후 회원 등급에 따라 적립'
              }</span
            >
            <ul class="box-border pb-12 ">
              <li class="flex border-y border-gray-100 py-4">
                <dt class="w-32 text-l-sm text-gray-500">배송</dt>
                <dd class="flex flex-col gap-1 text-l-sm text-gray-400">
                  <p>샛별배송</p>
                  <p>
                    23시 전 주문 시 내일 아침 7시 전 도착 (대구 부산 울산
                    샛별배송 운영시간 별도 확인)
                  </p>
                </dd>
              </li>
              <li class="flex border-b border-gray-100 py-4">
                <dt class="w-32 text-l-sm text-gray-500">판매자</dt>
                <dd class="text-l-sm text-gray-400">
                  <p>${seller}</p>
                </dd>
              </li>
              <li class="flex border-b border-gray-100 py-4">
                <dt class="w-32 text-l-sm text-gray-500">포장타입</dt>
                <dd class="text-l-sm text-gray-400">
                  <p class="text-gray-500 mb-1">${packageType} (종이포장)</p>
                  <p>택배배송은 에코 포장이 스티로폼으로 대체됩니다.</p>
                </dd>
              </li>
              <li class="flex border-b border-gray-100 py-4">
                <dt class="w-32 text-l-sm text-gray-500">판매단위</dt>
                <dd class="text-l-sm text-gray-500">
                  <p>${unit}</p>
                </dd>
              </li>
              <li class="flex border-b border-gray-100 py-4">
                <dt class="w-32 text-l-sm text-gray-500">중량/용량</dt>
                <dd class="text-l-sm text-gray-500">
                  <p>${weight}</p>
                </dd>
              </li>
              <li class="flex border-b border-gray-100 py-4">
                <dt class="w-32 text-l-sm text-gray-500">원산지</dt>
                <dd class="text-l-sm text-gray-500">
                  <p>${origin}</p>
                </dd>
              </li>
              <li class="flex border-b border-gray-100 py-4">
                <dt class="w-32 text-l-sm text-gray-500">알레르기정보</dt>
                <dd class="w-[432px] text-wrap text-p-wsm text-gray-500">
                  <p class="">${alergy}</p>
                </dd>
              </li>
              <li class="mb-4 mt-4 flex">
                <dt class="w-32 text-l-sm text-gray-500">상품선택</dt>
                <dd
                  class="w-[432px] relative flex  justify-between border-x border-y border-gray-100"
                >
                  <div class="px-4 py-3">
                    <div class="flex flex-col items-start gap-3">
                      <p class="text-l-sm text-gray-500">
                        ${name}
                      </p>
                      <div
                        class="button__amount mr-2 flex h-7.5 w-[90px] border border-gray-200">
                        <button
                          type="button"
                          class="button__minus w-7.5 overflow-hidden">
                          <svg
                            role="img"
                            width="46"
                            height="84"
                            viewBox="8 46 46 84">
                            <use href="/icons/_sprite.svg#minus" />
                          </svg>
                        </button>
                        <span
                          class="product__amount inline-block w-7.5 text-center align-top leading-[30px]">1</span>
                        <button
                          type="button"
                          class="button__plus w-7.5 overflow-hidden">
                          <svg
                            role="img"
                            width="46"
                            height="84"
                            viewBox="8 8 46 84">
                            <use href="/icons/_sprite.svg#plus" />
                          </svg>
                          <!-- svg경로 assets에서 public으로 바꾸기! -->
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="absolute bottom-2 right-2">
                  ${
                    discount === 0
                      ? ``
                      : `<del class="text-gray-300 text-p-base
                      ">${comma(price)}원</del>`
                  }
    
                  <span class="">${comma(discountPrice)}원</span>
                  </div>
                </dd>
              </li>
              <li
                class="flex w-full flex-col items-end gap-2 border-t border-gray-100 py-7"
              >
                <div class="flex items-center">
                  <p class="text-l-base mr-[17px]">총 상품금액:</p>
                  <div>
                    <span class="total text-l-xl mr-[4px]">${comma(
                      discountPrice
                    )}</span>
                  </div>
                  <span class="text-h-base">원</span>
                </div>
                <div class="flex items-center">
                  <span class="rounded-sm bg-accent-yellow px-2 py-1 mr-1 text-white">적립</span>
                  <span class="reward">${rewardMessage}</span>
                </div>
              </li>
              <li class="box-border flex h-14 gap-3 overflow-hidden">

                  <button class="squre">
                    <svg
                      class="squre__icon"
                      role="img"
                      width="56"
                      height="184"
                      viewBox="0 64 56 184"
                    >
                      <use href="/icons/_sprite.svg#squre" />
                    </svg>
                  </button>
                  <button>
                    <svg
                      class=""
                      role="img"
                      width="56"
                      height="184"
                      viewBox="0 128 56 184"
                    >
                      <use href="/icons/_sprite.svg#squre" />
                    </svg>
                  </button>
                  <button type="button" class="button--purple__big w-full detail__button-cart">
                    장바구니 담기
                  </button>

              </li>
            </ul>
          </div>
        </section>
      </div>
      <section class="sticky top-[72px] z-20">
        <ul class="nav-bar flex box-border">
        <li class="w-full button--gray__big">
            <a href="#productExplain" data-target="productExplain" class="scroll-link inline-block w-full py-[15px] text-center text-l-base">상품설명</a>
          </li>
          <li class="w-full button--gray__big">
            <a href="#productInfo" data-target="productInfo" class="scroll-link inline-block w-full py-[15px] text-center text-l-base">상세정보</a>
          </li>
          <li class="w-full button--gray__big">
            <a href="#productReview" data-target="productReview" class="scroll-link inline-block w-full py-[15px] text-center text-l-base">
                후기
            </a>
          </li>
          <li class="w-full button--gray__big">
            <a href="#productQuestion" data-target="productQuestion" class="scroll-link inline-block w-full py-[15px] text-center text-l-base">문의</a>
          </li>
        </ul>
      </section>
      
      <section>
        <div id="productExplain" class="pt-10"><img class="w-262.5 h-167.5" src="${
          detailImgArr[0]
        }" alt="${detailImgAlt[fileNameArr[0]]}"></div>
        <h3 class="flex flex-col items-center">
          <span class="text-l-xl mt-[76px]">${detail}</span>
          <span class="text-h-3xl">${name}</span>
        </h3>
      </section>
      <section>
        <div class="mt-[96px] relative h-10 flex items-center text-center">
          <div class="absolute inset-x-0 h-px bg-gray-100 "></div>
          <span class="relative z-10 bg-white px-2 text-h-3xl left-1/2 -translate-x-1/2 ">Karly's Check Point</span>
        </div>
        <div class=" flex flex-col items-center">
          <img class="mt-[68px]" src="${detailImgArr[1]}" alt="${
            detailImgAlt[fileNameArr[1]]
          }">
        </div>
      </section>
      <img id="productInfo" class="mt-24 border-b border-gray-100" src="${
        detailImgArr[2]
      }" alt="${detailImgAlt[fileNameArr[2]]}">
  `;
  insertFirst('.mainWrapper', productTemplate);

  const minusButton = getNode('.button__minus');
  const plusButton = getNode('.button__plus');
  const amountSpan = getNode('.product__amount');

  function minusAmount() {
    // .product__amount의 현재 값 가져오기
    const currentValue = parseInt(amountSpan.textContent);

    // 값이 1보다 클 때만 감소시킴
    if (currentValue > 1) {
      amountSpan.textContent = currentValue - 1;
    }
    updateTotalPrice(discountPrice);
  }

  function plusAmount() {
    // .product__amount의 현재 값 가져오기
    const currentValue = parseInt(amountSpan.textContent);

    // 값 증가시킴
    amountSpan.textContent = currentValue + 1;
    updateTotalPrice(discountPrice);
  }

  // 클릭시 좋아요
  const squreButton = getNode('.squre');
  const viewBox1 = '0 64 56 184';
  const viewBox2 = '0 0 56 184';

  squreButton.addEventListener('click', function () {
    if (isAuth) {
      const svg = this.querySelector('.squre__icon');
      const currentViewBox = svg.getAttribute('viewBox');
      const newViewBox = currentViewBox === viewBox1 ? viewBox2 : viewBox1;

      svg.setAttribute('viewBox', newViewBox);
    } else {
      openModal(
        modalAlert,
        '로그인하셔야 본 서비스를 이용하실 수 있습니다.',
        'alert'
      );
      window.location.href = '/src/pages/login/';
    }
  });

  // 클릭 이벤트 리스너 추가
  minusButton.addEventListener('click', minusAmount);
  plusButton.addEventListener('click', plusAmount);
}

await renderProductData();

const cartButton = getNode('.detail__button-cart');

async function handleCartButton() {
  const auth = await getStorage('auth');
  const data = {
    productId,
    imgSrc: getPbImageURL(productData, 'thumbImg'),
    amount: Number(getNode('.product__amount').innerText),
    name: productData.name,
    auth,
  };

  // local storage에 auth가 있다면 로그인 된 상태기 때문에 DB에 장바구니 상품 추가해줌
  if (auth) {
    await addCartDB(data);
  } else {
    // local storage에 auth가 있다면 로그인 안 된 상태기 때문 local storage에 상품 추가해줌
    await addCartLocalStorage(data);
  }
  updateCartBadge();
  showBubble(data);
}

async function addCartDB(data) {
  const { productId, amount, auth } = data;
  const userId = auth.user.id;

  const carts = await pb.collection('carts').getFullList({
    filter: `users_record= "${userId}" && products_record= "${productId}"`,
    requestKey: null,
  });

  if (!carts.length) {
    // 기존에 장바구니에 없던 상품. 따라서 DB에 새로 데이터 넣어줌
    const data = {
      users_record: userId,
      products_record: productId,
      amount,
    };
    await pb.collection('carts').create(data);
  } else {
    // 기존에 장바구니에 있던 상품. 따라서 기존 데이터의 amount 값을 바꿔줌
    const beforeAmount = carts[0].amount;
    const data = {
      amount: beforeAmount + amount,
    };

    await pb.collection('carts').update(carts[0].id, data);
  }
}
async function addCartLocalStorage(data) {
  const { productId } = data;
  let { amount } = data;
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
  await setStorage('cart', cart);
}

async function showBubble(data) {
  const { name, imgSrc } = data;
  // 헤더 두 가지 버전이기 때문에 bubble도 두 가지 헤더에 모두 달려있음. 따라서 getNodes로 가져옴
  const bubble = getNodes('.header__bubble');
  bubble.forEach((element) => {
    const bubbleImg = element.querySelector('.header__bubble-img');
    const bubbleFigcaption = element.querySelector(
      '.header__bubble-figcaption'
    );
    // 말풍선에 이미지 넣기
    bubbleImg.src = imgSrc;
    // 말풍선에 물품명 넣기
    bubbleFigcaption.innerText = name;
    // 말풍선 띄우기
    element.style.display = 'block';
    setTimeout(() => {
      element.style.display = 'none';
    }, 3000);
  });
}

// 상품 합계 업데이트
async function updateTotalPrice(discountPrice) {
  const productAmount = getNode('.product__amount');
  const totalPrice = updateAcc(
    Number(discountPrice),
    Number(productAmount.textContent)
  );

  const reward = updateAcc(
    Number(Math.round(discountPrice * 0.0005)),
    Number(productAmount.textContent)
  );
  const totalPriceNode = getNode('.total');
  totalPriceNode.innerText = comma(totalPrice);
  const auth = await getStorage('auth');

  if (auth) {
    const rewardNode = getNode('.reward');
    rewardNode.innerText = `구매 시 ${reward}원 적립`;
  }
}

// 상품 수에 따라 합계를 누적
function updateAcc(target, currentCount) {
  return target * currentCount;
}

const links = document.getElementsByClassName('scroll-link');
for (let i = 0; i < links.length; i++) {
  links[i].addEventListener('click', scrollToSection);
}

// 섹션 스크롤 이동
function scrollToSection(e) {
  e.preventDefault(); // 링크 클릭 시 기본 동작 방지

  const target = this.getAttribute('data-target');
  const section = document.getElementById(target);

  // 섹션의 위치로 스크롤 이동
  section.scrollIntoView({ behavior: 'smooth' });
}

cartButton.addEventListener('click', handleCartButton);
modalAlertButton.addEventListener('click', () => modalAlert.close());
