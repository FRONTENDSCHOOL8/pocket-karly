// import pb from '/src/api/pocketbase';
// // const pb = new PocketBase(import.meta.env.VITE_PB_URL);

import { closePopup, closePopupToday } from './src/js/popup';

// (async () => {
//   const test = await pb.collection('products').getList(1, 30);
//   console.log(test);
// })();

closePopup();
closePopupToday();
