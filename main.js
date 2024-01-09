// import pb from '/src/api/pocketbase';
// import { getNode } from '/src/lib';
// const pb = new PocketBase(import.meta.env.VITE_PB_URL);
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
// (async () => {
//   const test = await pb.collection('products').getList(1, 30);
//   console.log(test);
// })();

// const productData = await pb.collection('products').getOne('p23nio608325zim');
// const productDataList = await pb.collection('products').getFullList();
// const body = getNode('.productlist');

// mainBanner Swiper
new Swiper('.swiper-container', {
  loop: true,
  autoplay: {
    delay: 3000,
  },
  navigation: {
    prevEl: '.swiper-button-prev',
    nextEl: '.swiper-button-next',
  },
});

// const productSwiper = new Swiper('.swiper-product', {
//   spaceBetweenL: 10,
//   loop: true,
//   autoplay: {
//     delay: 3000,
//   },
// });
