import {
  launch,
  goto,
  checkPopup,
  evalCode,
  evalSigungu,
  closeAlert,
  getPageLength,
  getData,
  writeFile,
} from "./module/crawler.js";

async function main() {
  console.log("start");

  // 실행
  await launch();

  // 페이지 이동
  await goto();

  // 팝업 체크
  await checkPopup();

  // 시도 이동
  await evalCode("jeju");

  // 시군구 이동
  await evalSigungu("jeju");

  // 경고창 종료
  await closeAlert();

  // 페이지 길이
  await getPageLength();

  // 데이터 추출
  await getData();

  // JSON 파일 생성
  await writeFile();

  console.log("end");
}

main();
