import { ref, onMounted } from "vue";
import { db } from "boot/firebase";
import { ref as dbRef, onValue, update } from "firebase/database";
import { Loading } from "quasar";

// 마커 이미지의 이미지 주소
var imageSrc =
  "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

export function useMap() {
  const rows = ref([]);

  const initialPagination = ref({
    page: 1,
    rowsPerPage: 10,
  });

  // ref() : mapContainer.value처럼 value 값을 가져와야 사용 가능
  // proxy로 인해 바로 참조가 되지 않으므로 value가 붙어야 한다.
  const mapContainer = ref();
  const selected = ref([]);

  let map;
  let markers = [];
  let mapInit = false;

  // Loading 화면 표시
  Loading.show();

  // onMounted() : elemnet 렌더링 완료 시 가져오기
  onMounted(() => {
    const mapOption = {
      center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
      level: 9, // 지도의 확대 레벨
    };

    map = new kakao.maps.Map(mapContainer.value, mapOption); // 지도를 생성
  });

  const pagingHandler = (newPagination) => {
    initialPagination.value = newPagination;

    // start, end page
    const { page, rowsPerPage } = newPagination;
    const start = (page - 1) * rowsPerPage;
    const end = page * rowsPerPage;

    createMarker(start, end);
  };

  // marker 생성
  const createMarker = (start = 0, end) => {
    // 조회수 count
    const currentDate = rows.value.slice(start, end);

    // position
    // 마커를 표시할 위치와 title 객체 배열
    const positions = currentDate.map((data) => {
      return {
        title: data.name,
        latlng: new kakao.maps.LatLng(data.lat, data.lng),
      };
    });

    // marker 초기화
    markers.forEach((marker) => marker.setMap(null));

    markers = positions.map((position) => {
      // 마커 이미지의 이미지 크기
      const imageSize = new kakao.maps.Size(24, 35);

      // 마커 이미지를 생성
      const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

      // 마커를 생성
      const marker = new kakao.maps.Marker({
        map: map, // 마커를 표시할 지도
        position: position.latlng, // 마커를 표시할 위치
        title: position.title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시
        image: markerImage, // 마커 이미지
      });

      return marker;
    });

    // timeout 설정할 경우
    // const timeoutTime = !mapInit ? 500 : 0;

    // 0.5초 후 실행
    // setTimeout(() => {
    // }, timeoutTime);
  };

  const rowClick = (evt, row, index) => {
    selected.value = [row];

    const { lat, lng } = row;

    // 이동할 위도 경도 위치를 생성
    const moveLatLon = new kakao.maps.LatLng(lat, lng);

    map.setLevel(3);

    // 지도 중심을 부드럽게 이동
    // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동
    map.panTo(moveLatLon);

    // 조회수 count update
    const { id, count } = row;
    const refPath = `map/${id}`;
    const updateValue = count ? count + 1 : 1;

    update(dbRef(db, refPath), {
      count: updateValue,
    });
  };

  // map 데이터
  const mapRef = dbRef(db, "map");

  onValue(mapRef, (snapshot) => {
    const data = snapshot.val();
    rows.value = Object.entries(data).map((data) => data[1]);

    if (!mapInit) {
      // start, end page
      const { page, rowsPerPage } = initialPagination.value;
      const start = (page - 1) * rowsPerPage;
      const end = page * rowsPerPage;

      createMarker(start, end);
      mapInit = true;

      Loading.hide();
    }
  });

  return {
    rows,
    initialPagination,
    mapContainer,
    pagingHandler,
    rowClick,
    selected,
  };
}
