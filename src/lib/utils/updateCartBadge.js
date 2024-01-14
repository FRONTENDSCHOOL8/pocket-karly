import { getStorage, insertLast, getNodes } from '/src/lib/';
import pb from '/src/api/pocketbase';

export async function updateCartBadge() {
  const amount = await getCartAmount();
  const template =
    /*html*/
    `
      <div
        class="header__cart-badge absolute -right-1 top-0.5 rounded-full bg-primary px-[5px] text-center text-[9px] text-white"
      >${amount}
      </div>
    `;
  const badge = getNodes('.header__cart-badge');
  if (badge) {
    badge.forEach((element) => {
      element.remove();
    });
  }
  insertLast('.header__a-cart-simple', template);
  insertLast('.header__a-cart-origin', template);
}

// 장바구니 수량 확인
async function getCartAmount() {
  let total = 0;

  // 로그인 되어 있는 경우
  if (await getStorage('auth')) {
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
