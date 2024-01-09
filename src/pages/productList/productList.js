import { getNode, insertAfter, getPbImageURL, comma } from '/src/lib';
import pb from '/src/api/pocketbase';
import '/src/styles/tailwind.css';

const liSorting = getNode('.list__li-sorting');
const productData = await pb.collection('products').getOne('p23nio608325zim');
const { id, name, price, discount, detail, isKarlyOnly, isLimited } =
  productData;

const template = /*html*/ `
  <div class="w-productBox-width h-productBox-height">
    <a href="/src/pages/detail/index.html#${id}" class="a__product">
      <div class="relative">
        <div class="mb-4 h-80">
          <img
            src="${getPbImageURL(productData, 'thumbImg')}"
            class="h-full w-full object-cover"
            alt="상품 이미지"
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
          <span class="text-p-sm text-gray-400 line-through">${comma(
            price
          )} 원</span>
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
`;

for (let i = 0; i < 15; i++) {
  insertAfter(liSorting, template);
}
