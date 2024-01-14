import {
  getPbImageURL,
  setStorage,
  getStorage,
  insertFirst,
  getNode,
  comma,
} from '/src/lib';
import pb from '/src/api/pocketbase';
import '/src/styles/tailwind.css';
import '/src/pages/components/js/include.js';
import Swiper from 'swiper/bundle';

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

async function onPageLoad() {
  console.log('onPageLoad');
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
    console.log('123');
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
window.addEventListener('load', onPageLoad);

async function drawViewedProduct(swiper) {
  console.log('drawViewedProduct');
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
  } = productData;

  //////////

  const productTemplate = /* html */ `
      <div class="product-detail flex justify-between">
        <div>
          <img
            class="h-[552px] w-[430px] object-cover"
            src="${getPbImageURL(productData, 'thumbImg')}"
            alt="/"
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
                  : `<span class="ml-1 text-orange-500 text-l-xl">${comma(
                      discount
                    )}%</span>`
              }
                <span class="text-l-xl ml-1">${comma(
                  Math.floor((price - price * (discount * 0.01)) / 10) * 10
                )}</span>
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
              >로그인 후, 적립 혜택이 제공됩니다.</span
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
                  <p class="text-gray-500">${packageType} (종이포장)</p>
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
                <dd class="text-p-wsm text-gray-500">
                  <p>${alergy}</p>
                </dd>
              </li>
              <li class="mb-4 mt-4 flex">
                <dt class="w-32 text-l-sm text-gray-500">상품선택</dt>
                <dd
                  class="relative flex w-full justify-between border-x border-y border-gray-100"
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
                            <use href="/src/assets/svg/_sprite.svg#minus" />
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
                            <use href="/src/assets/svg/_sprite.svg#plus" />
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
    
                  <span class="">${comma(
                    Math.floor((price - price * (discount * 0.01)) / 10) * 10
                  )}원</span>
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
                      Math.floor((price - price * (discount * 0.01)) / 10) * 10
                    )}</span>
                  </div>
                  <span class="text-h-base">원</span>
                </div>
                <p>로그인 후, 적립 혜택 제공</p>
              </li>
              <li class="box-border flex h-14 gap-3 overflow-hidden">
                <button>
                  <svg
                    class=""
                    role="img"
                    width="56"
                    height="184"
                    viewBox="0 64 56 184"
                  >
                    <use href="/src/assets/svg/_sprite.svg#squre" />
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
                    <use href="/src/assets/svg/_sprite.svg#squre" />
                  </svg>
                </button>
                <button class="button--purple__big w-full">
                  장바구니 담기
                </button>
              </li>
            </ul>
          </div>
        </section>
      </div>
      <section class="sticky top-[72px]">
      <ul class="nav-bar flex box-border">
      <li class="w-full button--gray__big">
          <a href="#productExplain" class="inline-block w-full py-[15px] text-center text-l-base">상품설명</a>
        </li>
        <li class="w-full button--gray__big">
          <a href="#productInfo" class="inline-block w-full py-[15px] text-center text-l-base">상세정보</a>
        </li>
        <li class="w-full button--gray__big">
          <a href="#productReview" class="inline-block w-full py-[15px] text-center text-l-base">
              후기
            <span class="text-p-sm">(1,000)</p>
          </a>
        </li>
        <li class="w-full button--gray__big">
          <a href="#productQuestion" class="inline-block w-full py-[15px] text-center text-l-base">문의</a>
        </li>
      </ul>
    </section>
      
      <section>
        <div id="productExplain" class="pt-10"><img class="w-262.5 h-167.5" src="${getPbImageURL(
          productData,
          'detailImg-1'
        )}" alt="탱탱쫄면"></div>
        <h3 class="flex flex-col items-center">
          <span class="text-l-xl mt-[76px]">${detail}</span>
          <span class="text-h-3xl">${name}</span>
        </h3>
      </section>
      <section>
        <div class="mt-24 flex flex-col items-center">
          <h3 class="text-h-3xl">Karly's Check Point</h3>
          <img class="mt-24" src="/src/assets/images/ex/checkPoint.jpg" alt="칼리 포인트">
        </div>
      </section>
      <img id="productInfo" class="mt-24" src="/src/assets/images/ex/product.jpg" alt="상품 설명">
  `;
  insertFirst('.mainWrapper', productTemplate);

  const minusButton = getNode('.button__minus');
  const plusButton = getNode('.button__plus');
  const amountSpan = getNode('.product__amount');
  const totalSpan = getNode('.total');

  console.log(totalSpan);

  // 클릭 이벤트 리스너 추가
  minusButton.addEventListener('click', minusAmount);
  plusButton.addEventListener('click', pulsAmount);

  function minusAmount() {
    // .product__amount의 현재 값 가져오기
    const currentValue = parseInt(amountSpan.textContent);

    // 값이 1보다 클 때만 감소시킴
    if (currentValue > 1) {
      amountSpan.textContent = currentValue - 1;
      amountSpan.textContent = currentValue - 1;
    }
  }

  function pulsAmount() {
    // .product__amount의 현재 값 가져오기
    const currentValue = parseInt(amountSpan.textContent);

    // 값 증가시킴
    amountSpan.textContent = currentValue + 1;
  }
}

renderProductData();
