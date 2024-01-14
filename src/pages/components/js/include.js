import {
  getNode,
  getStorage,
  insertFirst,
  insertLast,
  deleteStorage,
} from '/src/lib/';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import pb from '/src/api/pocketbase';
import '/src/styles/tailwind.css';

function includeHTML(element, onSuccess) {
  const { includePath } = element.dataset;
  if (includePath) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        element.outerHTML = this.responseText;
        onSuccess();
      }
    };
    xhr.open('GET', includePath, true);
    xhr.send();
  }
}

function loadIncludedHTML() {
  const allElements = document.getElementsByTagName('*');
  Array.prototype.forEach.call(allElements, (item) => {
    includeHTML(item, () => {
      if (item.tagName === 'HEADER') header();
      if (item.tagName === 'DIV') div();
    });
  });
}

const header = async () => {
  // 스크롤 높이에 따라 헤더 다르게 출력
  const headerSimple = getNode('.header__div-simple');
  window.onscroll = function () {
    if (
      document.body.scrollTop > 195 ||
      document.documentElement.scrollTop > 195
    ) {
      // 스크롤이 origin 헤더의 높이만큼 내려갔을 때 simple 헤더 나타남
      headerSimple.style.display = 'block';
    } else {
      // 다른 경우엔 origin 헤더 나타남
      headerSimple.style.display = 'none';
    }
  };

  // 로그인 시 localStorage에 저장된 정보의 key 값을 'auth'라 가정하고 만듦
  // 추후 로그인 기능 작업시 작업자와 협의해야함.

  // localStorage에 auth 정보가 있을 경우(로그인 되어 있는 경우) 회원등급/이름/고객센터 출력
  if (localStorage.getItem('auth')) {
    const { isAuth, user } = await getStorage('auth');

    if (isAuth) {
      const memberTemplate = /*html*/ `
      <div
        class="group relative flex h-full cursor-pointer items-center gap-1 px-3 text-p-sm text-content"
      >
        <span
          class="text-p-xsm rounded-3xl border border-primary px-4 text-primary"
          >${user.class}</span
        >
          <span class="pl-1 text-p-sm text-content">${user.name} 님</span>
        <div
          class="invisible absolute right-3 top-10 w-32 border border-gray-divider bg-white p-2 group-hover:visible"
        >
          <ul class="flex list-none flex-col gap-1 items-start w-full">
            <li class="w-full">
              <a href="/src/pages/cart/" class="block">장바구니</a>
            </li>
            <li class="w-full">
              <button type="button" class="header__button-delete w-full text-left">탈퇴하기</button>
            </li>
            <li class="w-full">
              <button type="button" class="header__button-logout w-full text-left">로그아웃</button>
            </li>
          </ul>
        </div>
      </div>
      <div class="h-3.25 w-px border-r text-gray-divider"></div>
        <div
          class="group relative flex h-full cursor-pointer items-center gap-1 px-3 text-p-sm text-content"
        >
          <span>고객센터</span>
          <svg role="img" width="8" height="5.6" viewBox="0 0 11 7">
            <use href="/icons/_sprite.svg#down" />
          </svg>
          <div
            class="invisible absolute right-3 top-10 w-32 border border-gray-divider bg-white p-2 group-hover:visible z-10"
          >
          <ul class="flex list-none flex-col gap-1">
            <li>
              <a href="#">공지사항</a>
            </li>
            <li>
              <a href="#">자주하는 질문</a>
            </li>
            <li>
              <a href="#">1:1 문의</a>
            </li>
            <li>
              <a href="#">대량주문 문의</a>
            </li>
          </ul>
        </div>
      </div>
    `;
      insertFirst('.header__div-top', memberTemplate);
    }
    // localStorage에 auth 정보가 없을 경우(로그인 안 된 경우) 회원가입/로그인/고객센터 출력
  } else {
    const nonMemberTemplate = /*html*/ `
  <a href="/src/pages/register/" class="px-3 text-p-sm text-primary"
    >회원가입</a
  >
  <div class="h-3.25 w-px border-r text-gray-divider"></div>
  <a href="/src/pages/login/" class="px-3 text-p-sm text-content"
    >로그인</a
  >
  <div class="h-3.25 w-px border-r text-gray-divider"></div>
  <div
    class="group relative flex h-full cursor-pointer items-center gap-1 px-3 text-p-sm text-content"
  >
    <span>고객센터</span>
    <svg role="img" width="8" height="5.6" viewBox="0 0 11 7">
      <use href="/icons/_sprite.svg#down" />
    </svg>
    <div
      class="group invisible absolute right-3 top-10 w-32 border border-gray-divider bg-white p-2 group-hover:visible z-10"
    >
      <ul class="flex list-none flex-col gap-1">
        <li>
          <a href="#">공지사항</a>
        </li>
        <li>
          <a href="#">자주하는 질문</a>
        </li>
        <li>
          <a href="#">1:1 문의</a>
        </li>
        <li>
          <a href="#">대량주문 문의</a>
        </li>
      </ul>
    </div>
  </div>
  `;
    insertFirst('.header__div-top', nonMemberTemplate);
  }

  // 장바구니 수량 뱃지 출력
  const amount = await getCartAmount();
  const cartBadge =
    /*html*/
    `
    <div
      class="header__cart-badge absolute -right-1 top-0.5 rounded-full bg-primary px-[5px] text-center text-[9px] text-white"
    >${amount}
    </div>
  `;
  insertLast('.header__a-cart-simple', cartBadge);
  insertLast('.header__a-cart-origin', cartBadge);

  // 로그아웃 버튼 눌렀을 경우 localStorage에서 'auth'삭제한 뒤 page reroad
  const logoutButton = getNode('.header__button-logout');
  // 탈퇴하기 버튼 눌렀을 경우 pocketbase 연결해서 계정 삭제
  const deleteButton = getNode('.header__button-delete');

  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      pb.authStore.clear();
      deleteStorage('auth');
      window.location.reload();
    });
  }

  if (deleteButton) {
    deleteButton.addEventListener('click', async () => {
      if (confirm('탈퇴 하시겠습니까?')) {
        try {
          const { user } = await getStorage('auth');
          pb.authStore.clear();
          deleteStorage('auth');
          await pb.collection('users').delete(user.id);
          location.href = '/';
        } catch (error) {
          alert('회원 탈퇴에 실패했습니다.');
        }
      }
    });
  }
};

window.addEventListener('load', loadIncludedHTML);

// 장바구니 수량 확인
async function getCartAmount() {
  let total = 0;

  // 로그인 되어 있는 경우
  if (localStorage.getItem('auth')) {
    const { user } = await getStorage('auth');
    total = await getCartAmountDB(user);

    // 로그인 안 된 경우
  } else {
    total = await getCartAmountStorage();
  }

  return total;
}

// 로그인 사용자의 장바구니 수량 확인(DB)
async function getCartAmountDB(user) {
  // carts collection에서 users_record 값이 로그인 된 사용자의 id와 같은 데이터만 가져옴
  const carts = await pb.collection('carts').getFullList({
    filter: `users_record = "${user.id}"`,
  });

  // 가져온 데이터 배열에서 amount(수량) 값을 모두 더함
  const total = carts.reduce((acc, cur) => acc + cur.amount, 0);
  return total;
}

// 비회원의 장바구니 수량 확인(Local Storage)
async function getCartAmountStorage() {
  let total = 0;
  const storageCart = await getStorage('cart');

  // 비회원이 장바구니에 상품을 담은 이력이 없는 경우
  if (!storageCart) {
    return total;
  }

  for (const products of storageCart) {
    total += products.amount;
  }
  return total;
}

/* -------------------------------------------------------------------------- */
// 최근본상품 사이드바
const div = () => {
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

  drawViewedProduct(swiper);

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
  swiper.update();
};
