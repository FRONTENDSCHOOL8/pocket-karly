import {
  getNode,
  getNodes,
  insertBefore,
  getPbImageURL,
  comma,
  insertLast,
  attr,
} from '/src/lib';
import pb from '/src/api/pocketbase';
import '/src/styles/tailwind.css';
import '/src/pages/components/js/include.js';
import {
  drawCartPopup,
  changeAmount,
  cancelAddCart,
  addCart,
} from '/src/pages/components/js/addCart.js';

// 필터 메뉴의 카테고리, 브랜드 영역 구현
drawFilterMenu();
drawProductList(1, true);

async function drawFilterMenu() {
  const productData = await pb.collection('products').getFullList();

  // 카테고리 영역
  drawFilterMenuLi('.list__ul-filter-category', 'category', productData);
  // 브랜드 영역
  drawFilterMenuLi('.list__ul-filter-brand', 'brand', productData);
}

function drawFilterMenuLi(node, type, data) {
  let resultData = '';
  if (type === 'category') {
    // 모든 상품의 카테고리를 가져온 뒤 중복 제거
    const category = data.map((item) => item.category);
    resultData = [...new Set(category)];
  } else if (type === 'brand') {
    // 모든 상품의 브랜드를 가져온 뒤 중복 제거
    const brand = data.map((item) => item.brand);
    resultData = [...new Set(brand)];
  }

  for (const item of resultData) {
    const count = countFilterDynamicOption(item, type, data);
    const template = /*html*/ `
      <li class="list__li-filter">
      <button class="button__check--no mr-2"></button>
      <label for="${item}">${item}</label>
      <input
        type="checkbox"
        id="${item}"
        name="${item}"
        value="${item}"
        class="appearance-none"
        data-filter=${type}
        data-operator='or'
      />
      <span class="pl-2 text-p-sm text-gray-300 align-middle">${count}</span>
    </li>
    `;
    insertLast(node, template);
  }
}

function countFilterDynamicOption(item, standard, data) {
  const result = data.filter((product) => product[standard] === item);
  const count = result.length;
  return count;
}

// 필터 클릭할 경우 체크박스/라디오 체크/체크해제
function handleFilterClick(e) {
  const li = e.target.closest('li');
  if (!li) {
    return;
  }
  e.preventDefault();
  const input = li.querySelector('input');
  const inputType = attr(input, 'type');
  const button = li.querySelector('button');
  const { checked } = input;
  const inputCheckYes =
    inputType === 'checkbox' ? 'button__check--yes' : 'button__radio--yes';
  const inputCheckNo =
    inputType === 'checkbox' ? 'button__check--no' : 'button__radio--no';

  // input 체크/체크해제
  if (!checked) {
    // radio일 경우 name이 같은 radio는 모두 체크 해제부터 함
    if (inputType === 'radio') {
      const inputName = attr(input, 'name');
      const radio = getNodes(`[name=${inputName}]`);
      radio.forEach((element) => {
        // attr(element, 'checked', '');
        element.checked = false;
        const siblingButton = element.closest('li').querySelector('button');
        siblingButton.classList.replace(inputCheckYes, inputCheckNo);
      });
    }
    input.checked = true;
    button.classList.replace(inputCheckNo, inputCheckYes);
  } else {
    if (inputType == 'checkbox') {
      input.checked = false;
      button.classList.replace(inputCheckYes, inputCheckNo);
    }
  }

  drawProductList(1, true);
}

// 정렬 클릭할 경우 선택한 정렬 버튼 색상 바꿔주고 상품 목록 화면 출력
function handleSortClick(e) {
  const button = e.target.closest('button');
  if (!button) {
    return;
  }

  // 우선 모든 정렬 버튼의 색상 회색으로 바꿈
  const buttons = getNodes('.list__div-sort button');
  buttons.forEach((element) => {
    element.classList.remove('list__button-sort--isSelected');
  });

  button.classList.add('list__button-sort--isSelected');

  drawProductList(1, true);
}

function handlePageClick(e) {
  const clickedButton = e.target.closest('button');
  if (!clickedButton) {
    return;
  }

  if (clickedButton.dataset.type === 'page') {
    // 숫자 눌렀을 경우
    clickPageNumber(clickedButton);
  } else {
    clickPageArrow(clickedButton);
  }

  const page = Number(
    getNode('.list__button-pagination--isSelected').dataset.page
  );
  drawProductList(page, false);
}

// 숫자 눌렀을 경우
function clickPageNumber(clickedButton) {
  // 이전에 선택되어 있던 버튼의 --isSelected class 삭제
  removeButtonClass();
  clickedButton.classList.add('list__button-pagination--isSelected');
}

function clickPageArrow(clickedButton) {
  // 맨 앞으로
  if (clickedButton.dataset.type === 'first') {
    removeButtonClass();
    getNode("[data-page='1']").classList.add(
      'list__button-pagination--isSelected'
    );
  }

  // 맨 뒤로
  if (clickedButton.dataset.type === 'last') {
    removeButtonClass();
    // eslint-disable-next-line prefer-destructuring
    const length = getNodes("[data-type='page']").length;
    getNode(`[data-page='${length}']`).classList.add(
      'list__button-pagination--isSelected'
    );
  }

  // 이전 페이지
  if (clickedButton.dataset.type === 'prev') {
    const selectedButton = getNode('.list__button-pagination--isSelected');
    // 버튼 누르기 전에 선택되어 있던 페이지 숫자
    const beforePageNumber = Number(selectedButton.dataset.page);
    const afterPageNumber = beforePageNumber - 1;

    if (afterPageNumber === 0) {
      return;
    }
    removeButtonClass();
    getNode(`[data-page='${afterPageNumber}']`).classList.add(
      'list__button-pagination--isSelected'
    );
  }

  // 다음 페이지
  if (clickedButton.dataset.type === 'next') {
    const selectedButton = getNode('.list__button-pagination--isSelected');
    // 버튼 누르기 전에 선택되어 있던 페이지 숫자
    const beforePageNumber = Number(selectedButton.dataset.page);
    const afterPageNumber = beforePageNumber + 1;

    if (!getNode(`[data-page='${afterPageNumber}']`)) {
      return;
    }
    removeButtonClass();
    getNode(`[data-page='${afterPageNumber}']`).classList.add(
      'list__button-pagination--isSelected'
    );
  }
}

function removeButtonClass() {
  const beforeSelected = getNode('.list__button-pagination--isSelected');
  if (beforeSelected) {
    beforeSelected.classList.remove('list__button-pagination--isSelected');
  }
}

function handelResetButton() {
  const radio = getNodes('.list__div-filter input[type="radio"]');
  const checkbox = getNodes('.list__div-filter input[type="checkbox"]');

  radio.forEach((input) => {
    input.checked = false;
    const siblingButton = input.closest('li').querySelector('button');
    siblingButton.classList.replace('button__radio--yes', 'button__radio--no');
  });

  checkbox.forEach((input) => {
    input.checked = false;
    const siblingButton = input.closest('li').querySelector('button');
    siblingButton.classList.replace('button__check--yes', 'button__check--no');
  });
  drawProductList(1, true);
}

// 필터 클릭 이벤트리스너
const filter = getNode('.list__div-filter');
filter.addEventListener('click', handleFilterClick);

// 정렬 클릭 이벤트리스너
const sort = getNode('.list__div-sort');
sort.addEventListener('click', handleSortClick);

// 페이지 클릭 이벤트리스너
const paginationButton = getNode('.list__div-pagination');
paginationButton.addEventListener('click', handlePageClick);

const resetButton = getNode('.list__button-reset');
resetButton.addEventListener('click', handelResetButton);

// 화면 출력
async function drawProductList(page, isDrawButton) {
  // 필터링 옵션 구하기
  const filterOptionString = getFilterOption();
  // 정렬 옵션 구하기
  const sortOptionString = getSortOption();

  const option = { filter: filterOptionString, sort: sortOptionString };

  if (isDrawButton) {
    drawPaginationButton('products', 9, option);
  }
  const data = await drawProductBox('products', page, 9, option);
  const { totalItems } = data;
  drawTotalItems(totalItems);
}

function getFilterOption() {
  // 체크된 항목
  const checked = getNodes('.list__div-filter input:checked');
  const orOptionString = getOrOption(checked);
  const andOptionString = getAndOption(checked);

  if (!orOptionString) {
    return andOptionString;
  }

  if (!andOptionString) {
    return orOptionString;
  }

  return orOptionString.concat('&&', andOptionString);
}

function getOrOption(node) {
  const orOptionArr = [];

  node.forEach((input) => {
    const dataset = input.dataset.filter;

    if (dataset == 'category') {
      orOptionArr.push(`category="${input.value}"`);
    }
    if (dataset == 'brand') {
      orOptionArr.push(`brand="${input.value}"`);
    }
  });

  const orOptionString = orOptionArr.join('||');
  return orOptionString;
}

function getAndOption(node) {
  const andOptionArr = [];

  node.forEach((input) => {
    const dataset = input.dataset.filter;

    if (dataset === 'price') {
      switch (input.id) {
        case 'price1':
          andOptionArr.push(`price < 5000`);
          break;
        case 'price2':
          andOptionArr.push(`(price >= 5000 && price <=10000)`);
          break;
        case 'price3':
          andOptionArr.push(`(price >= 10001 && price <=15000)`);
          break;
        case 'price4':
          andOptionArr.push(`price >= 15000`);
          break;
        default:
          break;
      }
    }

    if (dataset === 'discount') {
      andOptionArr.push(`discount > 0`);
    }

    if (dataset === 'karlyOnly') {
      andOptionArr.push(`isKarlyOnly = true`);
    }

    if (dataset === 'limited') {
      andOptionArr.push(`isLimited = true`);
    }

    if (dataset === 'except') {
      andOptionArr.push(`category != "${input.value}"`);
    }
  });
  const andOptionString = andOptionArr.join('&&');
  return andOptionString;
}

function getSortOption() {
  // eslint-disable-next-line prefer-destructuring
  const sort = getNode('.list__button-sort--isSelected').dataset.sort;
  return sort;
}

async function drawPaginationButton(collection, perPage, option) {
  const nextArrow = getNode('#next-arrow');
  const { filter, sort } = option;

  // 구현되어 있는 페이지네이션 버튼 먼저 삭제해줌
  deleteNode('.list__button-pageNumber');

  const dataAll = await pb.collection(collection).getFullList({
    filter,
    sort,
    requestKey: null,
  });
  // 검색 결과 상품의 전체 개수
  const totalProductNumber = dataAll.length;

  // 총 페이지넘버
  const totalPageNumber =
    totalProductNumber % perPage === 0
      ? totalProductNumber / perPage
      : Math.floor(totalProductNumber / perPage) + 1;

  // 새로운 페이지네이션 버튼 그려줌
  for (let i = 1; i <= totalPageNumber; i++) {
    const template = /*html */ `
      <button class="list__button-pagination list__button-pageNumber text-p-base text-content" data-page="${i}" data-type="page"
        >${i}
      </button>
    `;
    insertBefore(nextArrow, template);
    getNode("[data-page='1']").classList.add(
      'list__button-pagination--isSelected'
    );
  }
}

async function drawProductBox(collection, page, perPage, option) {
  const { filter, sort } = option;

  const data = await pb.collection(collection).getList(page, perPage, {
    filter,
    sort,
    requestKey: null,
  });

  // 낮은 가격순 정렬일 경우 정렬 기준을 '원가'가 아닌 원가에 discount 반영된 가격을 기준으로 정렬해줘야함
  if (sort === 'price') {
    data.items.sort((a, b) => {
      if (
        Math.floor((a.price - a.price * (a.discount * 0.01)) / 10) * 10 >
        Math.floor((b.price - b.price * (b.discount * 0.01)) / 10) * 10
      )
        return 1;
      if (
        Math.floor((a.price - a.price * (a.discount * 0.01)) / 10) * 10 <
        Math.floor((b.price - b.price * (b.discount * 0.01)) / 10) * 10
      )
        return -1;
      return 0;
    });
  }

  // 높은 가격순 정렬일 경우 정렬 기준을 '원가'가 아닌 원가에 discount 반영된 가격을 기준으로 정렬해줘야함
  if (sort === '-price') {
    data.items.sort((a, b) => {
      if (
        Math.floor((a.price - a.price * (a.discount * 0.01)) / 10) * 10 <
        Math.floor((b.price - b.price * (b.discount * 0.01)) / 10) * 10
      )
        return 1;
      if (
        Math.floor((a.price - a.price * (a.discount * 0.01)) / 10) * 10 >
        Math.floor((b.price - b.price * (b.discount * 0.01)) / 10) * 10
      )
        return -1;
      return 0;
    });
  }

  deleteNode('.list_div-productBox');
  if (data.totalItems === 0) {
    getNode('#no-item').style.display = 'flex';
    getNode('.list__div-pagination').style.display = 'none';
    return;
  }
  const productArr = data.items;
  productArr.forEach((product) => {
    const {
      id,
      name,
      price,
      discount,
      detail,
      isKarlyOnly,
      isLimited,
      thumbImgAlt,
    } = product;

    const productTemplate = /*html*/ `
    <div class="w-productBox-width h-productBox-height list_div-productBox">
      <a href="/src/pages/detail/index.html#${id}" class="a__product">
        <div class="relative">
          <div class="mb-4 h-80">
            <img
              src="${getPbImageURL(product, 'thumbImg')}"
              class="h-full w-full object-cover"
              alt="${thumbImgAlt}"
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
            ${
              discount === 0
                ? ``
                : `<span class="text-p-sm text-gray-400 line-through">${comma(
                    price
                  )} 원</span>`
            }
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
    insertLast(getNode('.list__grid'), productTemplate);
  });
  getNode('#no-item').style.display = 'none';
  getNode('.list__div-pagination').style.display = 'flex';

  return data;
}

function deleteNode(node) {
  const nodes = getNodes(node);
  if (nodes.length > 0) {
    nodes.forEach((element) => {
      element.remove();
    });
  }
}

function drawTotalItems(totalItems) {
  const totalItemsNode = getNode('.list__span-total');
  totalItemsNode.innerText = totalItems;
}

/* -------------------------------------------------------------------------- */

const addCartPopup = getNode('.add-cart__popup');
function handleCartButtonClick(e) {
  const button = e.target.closest('.productBox__cart-button');
  if (!button) {
    return;
  } else {
    e.preventDefault();

    // 해당 product의 id 가져오기
    const productIdIndex = e.target.closest('a').href.indexOf('#') + 1;
    const productId = e.target.closest('a').href.slice(productIdIndex);

    // 장바구니 팝업 그리기
    drawCartPopup(productId);
    addCartPopup.showModal();
    return;
  }
}

function handleCartAmount(e) {
  changeAmount(e);
}

function handleCartClose() {
  cancelAddCart(addCartPopup);
}

function handleCartAdd() {
  addCart(addCartPopup);
}

const minusButton = getNode('.button__minus');
const plusButton = getNode('.button__plus');
const closeButton = getNode('.add-cart__button--closed');
const addButton = getNode('.add-cart__button');
const list = getNode('.list__grid');

minusButton.addEventListener('click', handleCartAmount);
plusButton.addEventListener('click', handleCartAmount);
closeButton.addEventListener('click', handleCartClose);
addButton.addEventListener('click', handleCartAdd);
list.addEventListener('click', handleCartButtonClick);
