<template>
  <q-page class="main-layout">
    <!-- table info -->
    <!-- :rows="mapData" -->
    <!-- @는 이벤트 처리 -->
    <div class="row">
      <q-table
        v-model="selected"
        class="map-table"
        title="약국정보"
        :rows="rows"
        :columns="columns"
        row-key="id"
        :pagination="initialPagination"
        @update:pagination="pagingHandler"
        @row-click="rowClick"
      />

      <!-- kakao map -->
      <div ref="mapContainer" class="map-layout col"></div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

// Firebase 실시간 데이터베이스 map 앱
import { useMap } from "../composable/map";

const columns = [
  {
    name: "name",
    required: true,
    label: "약국이름",
    align: "center",
    field: "name",
  },
  {
    name: "address",
    required: true,
    label: "주소",
    align: "center",
    field: "address",
  },
  {
    name: "tel",
    required: true,
    label: "전화번호",
    align: "center",
    field: "tel",
  },
  {
    name: "time",
    required: true,
    label: "영업시간",
    align: "center",
    field: "time",
  },
  {
    name: "count",
    required: true,
    label: "조회수",
    align: "center",
    field: "count",
    format: (val) => (!val ? 0 : val),
  },
];

export default defineComponent({
  name: "IndexPage",

  setup() {
    // Firebase 실시간 데이터베이스 map 앱
    const {
      rows,
      initialPagination,
      mapContainer,
      pagingHandler,
      rowClick,
      selected,
    } = useMap();

    return {
      columns,
      initialPagination,
      mapContainer,
      pagingHandler,
      rowClick,
      selected,
      rows,
    };
  },
});
</script>

<style lang="scss" scoped>
.main-layout {
  padding: 16px;

  .map-table {
    width: 50%;
    height: calc(100vh - 90px);
  }

  .map-layout {
    width: 100%;
    height: calc(100vh - 90px);
    margin-left: 8px;
  }
}
</style>
