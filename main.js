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
    prevEl: '.swiper-prev',
    nextEl: '.swiper-next',
  },
});

new Swiper('.swiper-product', {
  slidesPerView: 4,
  slidesPerGroup: 4,
  watchOverflow: true,
  navigation: {
    prevEl: '.swiper-button-prev-product',
    nextEl: '.swiper-button-next-product',
  },
  on: {
    slideChange() {
      const nextButton = document.querySelector('.swiper-button-next-product');
      if (this.isEnd) {
        nextButton.style.display = 'none';
      } else {
        nextButton.style.display = 'block';
      }
    },
  },
});

new Swiper('.swiper-discount', {
  slidesPerView: 4,
  slidesPerGroup: 4,
  watchOverflow: true,
  navigation: {
    prevEl: '.swiper-button-prev-discount',
    nextEl: '.swiper-button-next-discount',
  },
  on: {
    slideChange() {
      const nextButton = document.querySelector('.swiper-button-next-discount');
      if (this.isEnd) {
        nextButton.style.display = 'none';
      } else {
        nextButton.style.display = 'block';
      }
    },
  },
});
