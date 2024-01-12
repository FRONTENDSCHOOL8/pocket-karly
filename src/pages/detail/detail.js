import '/src/styles/tailwind.css';
import { insertFirst, getNode } from '/src/lib/';
import pb from '/src/api/pocketbase';

//

async function renderProductData() {
  const productData = await pb.collection('products').getOne('p23nio608325zim');
  const {
    name,
    detail,
    price,
    seller,
    origin,
    alergy,
    weight,
    unit,
    packageType,
  } = productData;

  //////////

  const productTemplate = /* html */ `
  
      <div class="product-detail flex justify-between">
        <div>
          <img
            class="h-[552px] w-[430px] object-cover"
            src="/src/assets/images/ex/thumb-1.jpg"
            alt="/"
          />
        </div>
        <section class="w-140">
          <div class="flex flex-col gap-4 pb-5">
            <div class="text-h-lg text-gray-500">샛별 배송</div>
            <div>
              <h2 class="pb-1 text-l-xl">${name}</h2>
              <span class="text-p-base">${detail}</span>
            </div>
            <div>
              <span class="text-l-xl">${price}</span>
              <span class="text-h-base">원</span>
            </div>
            <span class="text-l-base text-primary"
              >로그인 후, 적립 혜택이 제공됩니다.</span
            >
            <ul class="box-border pb-12 ">
              <li class="flex border-y border-gray-100 py-4">
                <dt class="w-32 text-l-sm text-gray-500">배송</dt>
                <dd class="flex flex-col gap-1 text-l-sm text-gray-400">
                  <p>샛별배송</p>
                  <p>
                    23시 전 주문 시 내일 아침 7시 전 도착 (대구 부산 울산
                    샛별배송 운영시;간 별도 확인)
                  </p>
                </dd>
              </li>
              <li class="flex border-b border-gray-100 py-4">
                <dt class="w-32 text-l-sm text-gray-500">판매자</dt>
                <dd class="text-l-sm text-gray-400">
                  <p>${seller}</p>
                </dd>
              </li>
              <li class="flex border-b border-gray-100 py-4">
                <dt class="w-32 text-l-sm text-gray-500">포장타입</dt>
                <dd class="text-l-sm text-gray-400">
                  <p class="text-gray-500">${packageType} (종이포장)</p>
                  <p>택배배송은 에코 포장이 스티로폼으로 대체됩니다.</p>
                </dd>
              </li>
              <li class="flex border-b border-gray-100 py-4">
                <dt class="w-32 text-l-sm text-gray-500">판매단위</dt>
                <dd class="text-l-sm text-gray-500">
                  <p>${unit}</p>
                </dd>
              </li>
              <li class="flex border-b border-gray-100 py-4">
                <dt class="w-32 text-l-sm text-gray-500">중량/용량</dt>
                <dd class="text-l-sm text-gray-500">
                  <p>${weight}</p>
                </dd>
              </li>
              <li class="flex border-b border-gray-100 py-4">
                <dt class="w-32 text-l-sm text-gray-500">원산지</dt>
                <dd class="text-l-sm text-gray-500">
                  <p>${origin}</p>
                </dd>
              </li>
              <li class="flex border-b border-gray-100 py-4">
                <dt class="w-32 text-l-sm text-gray-500">알레르기정보</dt>
                <dd class="text-p-wsm text-gray-500">
                  <p>${alergy}</p>
                </dd>
              </li>
              <li class="mb-4 mt-4 flex">
                <dt class="w-32 text-l-sm text-gray-500">상품선택</dt>
                <dd
                  class="relative flex w-full justify-between border-x border-y border-gray-100"
                >
                  <div class="px-4 py-3">
                    <div class="flex flex-col items-start gap-3">
                      <p class="text-l-sm text-gray-500">
                        ${name}
                      </p>
                      <div
                        class="button__amount mr-2 flex h-7.5 w-[90px] border border-gray-200">
                        <button
                          type="button"
                          class="button__minus w-7.5 overflow-hidden">
                          <svg
                            role="img"
                            width="46"
                            height="84"
                            viewBox="8 46 46 84">
                            <use href="/src/assets/svg/_sprite.svg#minus" />
                          </svg>
                        </button>
                        <span
                          class="product__amount inline-block w-7.5 text-center align-top leading-[30px]">1</span>
                        <button
                          type="button"
                          class="button__plus w-7.5 overflow-hidden">
                          <svg
                            role="img"
                            width="46"
                            height="84"
                            viewBox="8 8 46 84">
                            <use href="/src/assets/svg/_sprite.svg#plus" />
                          </svg>
                          <!-- svg경로 assets에서 public으로 바꾸기! -->
                        </button>
                      </div>
                    </div>
                  </div>
                  <span class="absolute bottom-3 right-3">${price}원</span>
                </dd>
              </li>
              <li
                class="flex w-full flex-col items-end gap-2 border-t border-gray-100 py-7"
              >
                <div class="flex">
                  <p>총 상품금액:</p>
                  <div>
                    <span class="total">${price}</span>
                    <span>원</span>
                  </div>
                </div>
                <p>로그인 후, 적립 혜택 제공</p>
              </li>
              <li class="box-border flex h-14 gap-3 overflow-hidden">
                <button>
                  <svg
                    class=""
                    role="img"
                    width="56"
                    height="184"
                    viewBox="0 64 56 184"
                  >
                    <use href="/src/assets/svg/_sprite.svg#squre" />
                  </svg>
                </button>
                <button>
                  <svg
                    class=""
                    role="img"
                    width="56"
                    height="184"
                    viewBox="0 128 56 184"
                  >
                    <use href="/src/assets/svg/_sprite.svg#squre" />
                  </svg>
                </button>
                <button class="button--purple__big w-full">
                  장바구니 담기
                </button>
              </li>
            </ul>
          </div>
        </section>
      </div>
      <section>
         <ul class="nav-bar flex box-border ">
          <li class="w-full button--gray__big">
             <button class=" text-l-base">상품설명</button>
           </li>
           <li class="w-full button--gray__big">
             <button class="text-l-base">상세정보</button>
           </li>
           <li class="w-full button--gray__big">
             <button class="text-l-base">
                후기
              <span class="text-p-sm">(1,000)</p>
            </button>
          </li>
          <li class="w-full button--gray__big">
            <button class="text-l-base">문의</button>
          </li>
        </ul>
      </section>
      <section>
        <div class="pt-10 "><img class="w-262.5 h-167.5" src="/src/assets/images/ex/thumb-1.svg" alt="탱탱쫄면"></div>
        <h3 class="flex flex-col items-center">
          <span class="text-l-xl mt-[76px]">${detail}</span>
          <span class="text-h-3xl">${name}</span>
        </h3>
      </section>

  `;
  insertFirst('.mainWrapper', productTemplate);

  const minusButton = getNode('.button__minus');
  const plusButton = getNode('.button__plus');
  const amountSpan = getNode('.product__amount');

  // 클릭 이벤트 리스너 추가
  minusButton.addEventListener('click', minusAmount);
  plusButton.addEventListener('click', pulsAmount);

  function minusAmount() {
    // .product__amount의 현재 값 가져오기
    const currentValue = parseInt(amountSpan.textContent);

    // 값이 1보다 클 때만 감소시킴
    if (currentValue > 1) {
      amountSpan.textContent = currentValue - 1;
    }
  }

  function pulsAmount() {
    // .product__amount의 현재 값 가져오기
    const currentValue = parseInt(amountSpan.textContent);

    // 값 증가시킴
    amountSpan.textContent = currentValue + 1;
  }
}

renderProductData();
