import '/src/styles/tailwind.css';
import pb from '/src/api/pocketbase';
import { getNode, getStorage, setStorage } from '/src/lib/';
import '/src/pages/components/js/include.js';
import { deleteStorage } from '../../lib/utils/storage';
import { openModal } from '/src/pages/components/js/modals.js';

const loginButton = getNode('.loginButton');
const modalAlert = getNode('.modal__alert');
const modalAlertButton = getNode('.button__alert');

async function handleLogin(e) {
  e.preventDefault();

  try {
    const id = getNode('#userId').value;
    const pw = getNode('#userPw').value;

    await pb.collection('users').authWithPassword(id, pw);

    const { model, token } = await getStorage('pocketbase_auth');

    setStorage('auth', {
      isAuth: !!model,
      user: model,
      token,
    });

    // local storage에 저장된 장바구니 상품을 DB에 저장
    await addCart(model.id);
    await deleteLocalStorageCart();
    // window.location.href = '/index.html';
    history.back();
  } catch {
    openModal(modalAlert, '아이디, 비밀번호를 확인해주세요.', 'alert');
  }
}

// 로그인 안 한 상태에서 추가했던 장바구니를 회원의 장바구니에 저장 (local storage -> DB)
async function addCart(userId) {
  const localStorageCart = await getStorage('cart');
  if (!localStorageCart) {
    return;
  }

  // 로그인 사용자의 장바구니(DB)
  const carts = await pb.collection('carts').getFullList({
    filter: `users_record = "${userId}" `,
  });

  for (const product of localStorageCart) {
    const { products_record, amount } = product;

    // local storage에 저장했던 product가 이미 carts collection에 저장되어 있는지 확인
    const savedCart = searchCart(carts, products_record);

    // 이미 carts collection에 저장되어 있던 product일 경우엔 DB에 create가 아닌 update 해줌
    if (savedCart.length !== 0) {
      await pb.collection('carts').update(savedCart[0].id, {
        amount: savedCart[0].amount + amount,
      });
    } else {
      // carts collection에 저장되어 있지 않은 product일 경우엔 DB에 create해줌
      await pb.collection('carts').create({
        users_record: userId,
        products_record,
        amount,
      });
    }
  }
}

function searchCart(carts, products_record) {
  return carts.filter((cart) => cart['products_record'] === products_record);
}

async function deleteLocalStorageCart() {
  await deleteStorage('cart');
}

loginButton.addEventListener('click', handleLogin);
modalAlertButton.addEventListener('click', () => modalAlert.close());
