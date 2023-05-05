import puppeteer from "puppeteer-core";
import os from "os";
import fs from "fs";
import short from "short-uuid";
import { addressParser } from "./parser.js";

// Chrome Browser
const macUrl = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const winUrl = "C:/Program Files (x86)/Google/Chrome/Application/Chrome.exe";
const currentOs = os.type();

const launchConfig = {
  // headless: false,
  headless: true, // id 추출 시 사용
  defaultViewport: null,
  ignoreDefaultArgs: ["--disable-extensions"],
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-notifications",
    "--disable-extensions",
  ],
  executablePath: currentOs == "Darwin" ? macUrl : winUrl,
};

// 전역변수 global
const pagingSelector =
  "body > table:nth-child(2) > tbody > tr > td:nth-child(1) > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(5) > td > table:nth-child(5) > tbody > tr:nth-child(4) > td > table > tbody > tr > td:nth-child(3)";

let browser;
let page;
let pageNum;
let sido;
let sigungu;

let finalData = [];

// 실행
const launch = async () => {
  browser = await puppeteer.launch(launchConfig); // Chrome Browser 실행
  const pages = await browser.pages();
  page = pages[0];
};

// 페이지 이동
const goto = async () => {
  await page.goto("https://www.pharm114.or.kr/main.asp");
};

// 팝업 체크
const checkPopup = async () => {
  const pages = await browser.pages();
  await pages.at(-1).close(); // .at(-1)하면 맨 마지막 값을 가져온다.
};

// 시도 이동
const evalCode = async (sidoCode) => {
  sido = sidoCode;

  await page.evaluate((sido) => {
    const selector = `#continents > li.${sido} > a`;
    document.querySelector(selector).click();
  }, sido);
};

// 시군구 이동
const evalSigungu = async (sigunguCode) => {
  sigungu = sigunguCode;

  // jung_gu, seoguipo
  // const selector = `#continents > li.${sigungu} > a`;

  // jeju
  const selector = `#container > #continents > li.${sigungu} > a`;

  await page.waitForSelector(selector); // 대기

  await page.evaluate((selector) => {
    document.querySelector(selector).click();
  }, selector);
};

// 경고창 종료
const closeAlert = async () => {
  await page.on("dialog", async function (dialog) {
    await dialog.accept();
  });
};

// 페이지 길이
const getPageLength = async () => {
  await page.waitForSelector(pagingSelector); // 대기

  pageNum = await page.evaluate((pagingSelector) => {
    const pageLength = document.querySelector(pagingSelector).children.length;
    return pageLength;
  }, pagingSelector);

  console.log(pageNum);
};

// 데이터 추출
const getData = async () => {
  // pageNum까지 반복
  for (let i = 0; i < pageNum; i++) {
    await page.waitForSelector(pagingSelector);

    let info = await page.evaluate(() => {
      var trArr = Array.from(
        document.querySelectorAll("#printZone > table:nth-child(2) > tbody tr")
      );

      var data = trArr
        .map((el) => {
          return {
            name: el.querySelectorAll("td")[1]?.innerText, // 약국명
            address: el
              .querySelector(".class_addr")
              ?.innerText.replaceAll("\t", "")
              .replaceAll("\n", ""), // 주소
            tel: el.querySelectorAll("td")[3]?.innerText, // 전화번호
            time: el.querySelectorAll("td")[4]?.innerText, // 운영시간
          };
        })
        .filter((val) => val.address != undefined);

      return data;
    });

    // id 생성 (short-uuid)
    info = Array.from(info).map((val) => {
      val.id = short.generate();
      return val;
    });

    // 최종 데이터 추출
    finalData = finalData.concat(info);
    console.log(finalData.length);

    if (pageNum != i) {
      await page.evaluate(
        (pagingSelector, i) => {
          document.querySelector(pagingSelector).children[i].click();
        },
        pagingSelector,
        i
      );

      await page.waitForSelector("#printZone"); // 대기
    }
  }

  // Browser 종료
  browser.close();
};

// JSON 파일 생성
const writeFile = async () => {
  const promiseArr = finalData.map((data) => addressParser(data));

  try {
    finalData = await Promise.all(promiseArr);

    const dirPath = `./json/${sido}`;
    const filePath = `${dirPath}/${sigungu}.json`;
    const exist = fs.existsSync(dirPath);

    // 경로에 디렉토리가 존재하지 않을 경우 디렉토리 생성
    if (!exist) {
      fs.mkdir(dirPath, { recursive: true }, (err) => {
        console.log(err);
      });
    }

    // 최종 데이터를 JSON 파일로 변환 후
    // ./json/sido/sigungu.json으로 저장
    fs.writeFileSync(filePath, JSON.stringify(finalData));
  } catch (e) {}
};

export {
  launch,
  goto,
  checkPopup,
  evalCode,
  evalSigungu,
  closeAlert,
  getPageLength,
  getData,
  writeFile,
};
