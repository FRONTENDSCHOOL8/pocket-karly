import '/src/styles/tailwind.css';
import pb from '/src/api/pocketbase';
import { getNode, getStorage, setStorage } from '/src/lib/';
import '/src/pages/components/js/include.js';

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
    window.location.href = '/index.html';
  } catch {
    alert('아이디,비밀번호를 확인해주세요.');
  }
}

loginButton.addEventListener('click', handleLogin);
