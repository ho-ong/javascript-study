import axios from "axios";
import dotenv from "dotenv";

// Kakao API Key
dotenv.config();
const API_KEY = process.env.VUE_APP_REST_API_KEY;

async function addressParser(data) {
  const res = await axios.get(
    "https://dapi.kakao.com/v2/local/search/address.json",
    {
      params: {
        query: data.address,
      },
      headers: {
        Authorization: "KakaoAK " + API_KEY,
      },
    }
  );

  let lng = 0;
  let lat = 0;

  if (res.data.documents.length > 0) {
    lng = res.data.documents[0].address.x;
    lat = res.data.documents[0].address.y;
  }

  // 문자열 -> 정수 변환
  data.lng = Number(lng);
  data.lat = Number(lat);

  return data;
}

export { addressParser };
