import '/src/styles/tailwind.css';
import pb from '/src/api/pocketbase';
import { getNode, getStorage, setStorage } from '/src/lib/';
import '/src/pages/components/js/include.js';
import { deleteStorage } from '../../lib/utils/storage';

const loginButton = getNode('.loginButton');

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
    alert('아이디,비밀번호를 확인해주세요.');
  }
}

// 로그인 안 한 상태에서 추가했던 장바구니를 회원의 장바구니에 저장 (local storage -> DB)
async function addCart(userId) {
  const cart = await getStorage('cart');
  if (!cart) {
    return;
  }
  try {
    for (const product of cart) {
      const { products_record, amount } = product;
      const data = {
        products_record,
        amount,
        users_record: userId,
      };
      await pb.collection('carts').create(data);
    }
  } catch (error) {
    alert('데이터 통신에 실패했습니다.');
  }
}

async function deleteLocalStorageCart() {
  await deleteStorage('cart');
}

loginButton.addEventListener('click', handleLogin);
