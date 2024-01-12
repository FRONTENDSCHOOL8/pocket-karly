import { getPbImageURL, setStorage, getStorage } from '/src/lib';
import pb from '/src/api/pocketbase';
import '/src/styles/tailwind.css';
import '/src/pages/components/js/include.js';

async function onPageLoad() {
  // 해당 상품의 정보 가져옴
  const productId = window.location.hash.slice(1);
  const productData = await pb.collection('products').getOne(productId);
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
    return;
  }

  // 이미 저장되어 있는 product라면 삭제한 뒤 unshift 이용해서 배열의 가장 앞에 저장
  viewedProduct.forEach((item, i) => {
    if (item.id === productId) {
      viewedProduct.splice(i, 1);
      return i;
    }
  });
  viewedProduct.unshift(product);

  // 최대 15개의 product 저장될 수 있도록 함
  setStorage('viewedProduct', viewedProduct.slice(0, 15));
}
window.addEventListener('load', onPageLoad);
