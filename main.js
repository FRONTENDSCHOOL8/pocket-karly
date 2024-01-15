import pb from '/src/api/pocketbase';
import { getPbImageURL, comma, getNode } from '/src/lib';
import {
  drawCartPopup,
  changeAmount,
  cancelAddCart,
  addCart,
} from '/src/pages/components/js/addCart.js';
import '/src/pages/components/js/popup.js';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import '/src/pages/components/js/include.js';

// mainBanner Swiper
const swiperBanner = new Swiper('.swiper-container', {
  loop: true,
  autoplay: {
    delay: 3000,
  },
  navigation: {
    prevEl: '.swiper-prev',
    nextEl: '.swiper-next',
  },
});

const swiperProduct = new Swiper('.swiper-product', {
  slidesPerView: 4,
  slidesPerGroup: 4,
  watchOverflow: true,
  navigation: {
    prevEl: '.swiper-button-prev-product',
    nextEl: '.swiper-button-next-product',
  },
  on: {
    init() {
      const prevButton = document.querySelector('.swiper-button-prev-product');
      prevButton.style.display = 'none'; // 초기화시 왼쪽 버튼 숨기기
    },
    slideChange() {
      const nextButton = document.querySelector('.swiper-button-next-product');
      const prevButton = document.querySelector('.swiper-button-prev-product');

      if (this.isEnd) {
        nextButton.style.display = 'none';
      } else {
        nextButton.style.display = 'block';
      }

      if (this.isBeginning) {
        prevButton.style.display = 'none';
      } else {
        prevButton.style.display = 'block';
      }
    },
  },
});

const swiperDiscount = new Swiper('.swiper-discount', {
  slidesPerView: 4,
  slidesPerGroup: 4,
  watchOverflow: true,
  navigation: {
    prevEl: '.swiper-button-prev-discount',
    nextEl: '.swiper-button-next-discount',
  },
  on: {
    init() {
      const prevButton = document.querySelector('.swiper-button-prev-discount');
      prevButton.style.display = 'none'; // 초기화시 왼쪽 버튼 숨기기
    },
    slideChange() {
      const nextButton = document.querySelector('.swiper-button-next-discount');
      const prevButton = document.querySelector('.swiper-button-prev-discount');

      if (this.isEnd) {
        nextButton.style.display = 'none';
      } else {
        nextButton.style.display = 'block';
      }

      if (this.isBeginning) {
        prevButton.style.display = 'none';
      } else {
        prevButton.style.display = 'block';
      }
    },
  },
});

swiperProduct.init(); // Swiper 초기화

// 메인페이지 배너 swiper 그리기
drawBannerSwiper(swiperBanner);
// '이 상품 어때요?' swiper 그리기
drawProductSwiper(swiperProduct, 11);
// '놓치면 후회할 가격' swiper 그리기
drawDiscountSwiper(swiperDiscount, 11);

async function drawBannerSwiper(swiper) {
  const banners = await pb.collection('banners').getFullList();
  drawBannerTemplate(swiper, banners);
  swiper.update();
}

async function drawProductSwiper(swiper, slideCount) {
  // 전체 상품에서 slideCount 만큼 랜덤하게 뽑하여 화면 그려줌
  const products = await pb.collection('products').getFullList();

  const numbers = [];
  const randomProducts = [];

  let count = 0;
  while (count < slideCount) {
    const randomNumber = Math.floor(Math.random() * products.length);
    if (numbers.indexOf(randomNumber) === -1) {
      numbers.push(randomNumber);
      randomProducts.push(products[randomNumber]);
      count++;
    }
  }

  drawTemplate(swiper, randomProducts);
  swiper.update();
}

async function drawDiscountSwiper(swiper, slideCount) {
  // 상품 중 할인율 높은순으로 slideCount 만큼 화면 그려줌
  const data = await pb.collection('products').getList(1, slideCount, {
    sort: '-discount',
    requestKey: null,
  });
  const products = data.items;
  drawTemplate(swiper, products);
  swiper.update();
}

function drawBannerTemplate(swiper, data) {
  data.forEach((banner) => {
    const { bannerAlt } = banner;
    const template = /*html*/ `
    <li class="swiper-slide">
      <a href="/src/pages/productList/">
        <img
          src="${getPbImageURL(banner, 'bannerImg')}"
          alt="${bannerAlt}"
        />
      </a>
    </li>
      `;
    swiper.appendSlide(template);
  });
}

function drawTemplate(swiper, data) {
  data.forEach((product) => {
    const {
      id,
      name,
      price,
      discount,
      detail,
      isKarlyOnly,
      isLimited,
      thumbImgAlt,
    } = product;
    const template = /*html*/ `
    <li class="swiper-slide">
      <div class="w-productBox-width h-productBox-height">
        <a href="/src/pages/detail/index.html#${id}" class="a__product">
          <div class="relative">
            <div class="mb-4 h-80">
              <img
                src="${getPbImageURL(product, 'thumbImg')}"
                class="h-full w-full object-cover"
                alt="${thumbImgAlt}"
              />
            </div>
            <div class="info flex flex-col gap-2">
              <span class="text-l-sm text-gray-400">샛별배송</span>
              <p class="text-p-base text-content">${name}</p>
              <div class="flex gap-2">
                ${
                  discount === 0
                    ? ``
                    : `<p class="text-l-lg text-accent-yellow">${discount}<span>%</span></p>`
                }
                <p class="text-l-lg text-content">${comma(
                  Math.floor((price - price * (discount * 0.01)) / 10) * 10
                )} <span>원</span></p>
              </div>
              ${
                discount === 0
                  ? ``
                  : `<span class="text-p-sm text-gray-400 line-through">${comma(
                      price
                    )} 원</span>`
              }
              <p class="text-p-sm text-gray-400">${detail}</p>
              <div class="flex gap-2">
                ${
                  isKarlyOnly
                    ? `<span class="rounded bg-gray-100 p-1 text-l-sm text-primary"
                  >Karly Only</span
                  >`
                    : ``
                }
                ${
                  isLimited
                    ? `<span class="rounded bg-gray-100 p-1 text-l-sm text-content"
                    >한정수량</span
                  >`
                    : ``
                }
              </div>
            </div>
            <button
              type="button"
              aria-label="장바구니 버튼"
              class="productBox__cart-button left-productBox-cart-left top-productBox-cart-top absolute"
            >
              <svg role="img" width="45" height="45" viewBox="0 0 45 45 ">
                <use href="/icons/_sprite.svg#cart" />
              </svg>
            </button>
          </div>
        </a>
    </div>
    </li>
    `;

    swiper.appendSlide(template);
  });

  // 전체보기 슬라이드
  const shwoAllTemplate = /*html*/ `
  <li class="swiper-slide w-productBox-width">
    <div class="flex h-80 items-center justify-center">
      <a href="/src/pages/productList/">
        <img src="/src/assets/svg/goToTop.svg" alt="" />
        <span> 전체보기 </span>
      </a>
    </div>
  </li>
  `;
  swiper.appendSlide(shwoAllTemplate);
}

const addCartPopup = getNode('.add-cart__popup');
function handleCartButtonClick(e) {
  const button = e.target.closest('.productBox__cart-button');
  if (!button) {
    return;
  } else {
    e.preventDefault();

    // 해당 product의 id 가져오기
    const productIdIndex = e.target.closest('a').href.indexOf('#') + 1;
    const productId = e.target.closest('a').href.slice(productIdIndex);

    // 장바구니 팝업 그리기
    drawCartPopup(productId);
    addCartPopup.showModal();
    return;
  }
}

function handleCartAmount(e) {
  changeAmount(e);
}

function handleCartClose() {
  cancelAddCart(addCartPopup);
}

function handleCartAdd() {
  addCart(addCartPopup);
}

const minusButton = getNode('.button__minus');
const plusButton = getNode('.button__plus');
const closeButton = getNode('.add-cart__button--closed');
const addButton = getNode('.add-cart__button');
const swiperProductDiv = getNode('.swiper-product');
const swiperDiscountDiv = getNode('.swiper-discount');

minusButton.addEventListener('click', handleCartAmount);
plusButton.addEventListener('click', handleCartAmount);
closeButton.addEventListener('click', handleCartClose);
addButton.addEventListener('click', handleCartAdd);
swiperProductDiv.addEventListener('click', handleCartButtonClick);
swiperDiscountDiv.addEventListener('click', handleCartButtonClick);
