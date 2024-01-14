import { removeClass, addClass, attr } from '/src/lib/';

export function execDaumPostcode() {
  new daum.Postcode({
    oncomplete(data) {
      const roadAddr = data.roadAddress;
      let extraRoadAddr = '';

      if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
        extraRoadAddr += data.bname;
      }
      if (data.buildingName !== '' && data.apartment === 'Y') {
        extraRoadAddr +=
          extraRoadAddr !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      if (extraRoadAddr !== '') {
        extraRoadAddr = ` (${extraRoadAddr})`;
      }

      document.getElementById('address').value = roadAddr;
      document.getElementById('address').value = data.jibunAddress;

      const guideTextBox = document.getElementById('guide');

      if (data.autoRoadAddress) {
        const expRoadAddr = data.autoRoadAddress + extraRoadAddr;
        guideTextBox.innerHTML = `(예상 도로명 주소 : ${expRoadAddr})`;
        guideTextBox.style.display = 'block';
      } else if (data.autoJibunAddress) {
        const expJibunAddr = data.autoJibunAddress;
        guideTextBox.innerHTML = `(예상 지번 주소 : ${expJibunAddr})`;
        guideTextBox.style.display = 'block';
      }

      // cart.js
      const addressElem = document.querySelector('address');
      const addressInput = document.querySelector('#address');
      const detailAddress = document.querySelector('.detail-address');
      const detailAddressInput = document.querySelector('#detailAddress');
      const detailAddressButton = document.querySelector(
        '.button__detail-address'
      );
      addressElem.textContent = addressInput.value;
      detailAddress.classList.remove('hidden');

      // register.js의 activeButton 함수(233번째 줄)를 export해서 쓰고 싶은데
      // 적용하니까 이상한 부분에서 오류가 나네요...(35번째 줄 checkAll에서 오류가 떠요)
      function activeButton() {
        if (detailAddressInput.value) {
          removeClass(detailAddressButton, 'text-gray-300');
          addClass(detailAddressButton, 'border-primary');
          addClass(detailAddressButton, 'text-primary');
          attr(detailAddressButton, 'disabled', '');
        } else {
          removeClass(detailAddressButton, 'text-primary');
          removeClass(detailAddressButton, 'border-primary');
          addClass(detailAddressButton, 'text-gray-300');
          attr(detailAddressButton, 'disabled', true);
        }
      }

      const addDetailAddress = () => {
        addressElem.textContent += ` ${detailAddressInput.value}`;
        detailAddress.classList.add('hidden');
      };
      detailAddressInput.addEventListener('input', activeButton);
      detailAddressButton.addEventListener('click', addDetailAddress);
    },
  }).open();
}
