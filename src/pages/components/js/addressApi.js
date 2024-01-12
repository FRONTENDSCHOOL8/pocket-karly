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

      document.getElementById('sample4_postcode').value = data.zonecode;
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
    },
  }).open();
}
