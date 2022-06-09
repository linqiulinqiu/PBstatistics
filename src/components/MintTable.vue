<template>
  <el-card id="mints">
    <div slot="header" class="clearfix">
      <h4>Mint Summary List</h4>
    </div>
    <range-table :bsc="bsc" :startBlk="18267021" :endBlk="18438725" />
    <range-table :bsc="bsc" :startBlk="18524544" :endBlk="18697344" />
    <h4>Phases 3 have not yet begun.</h4>
  </el-card>
</template>
<script>
import { mapState } from "vuex";
import RangeTable from "./lib/RangeTable.vue";

export default {
  name: "MintTable",
  components: {
    RangeTable,
  },
  computed: mapState({
    bsc: "bsc",
  }),
  data() {
    return {};
  },
  methods: {},
};
</script>
<style>
.mini-font {
  font-size: 12px;
}
.el-table .top-row {
  background: #409eff;
}

.el-table .sec-row {
  background: #67c23a;
}

.el-table .top10-row {
  background: #909399;
}
</style>
