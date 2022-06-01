<template>
  <el-container class="home">
    <el-header height="100px">
      <el-row>
        <el-col
          :lg="{ span: 7, offset: 3 }"
          :md="{ span: 6, offset: 3 }"
          :sm="{ span: 11, offset: 2 }"
          :xs="{ span: 14, offset: 1 }"
        >
          <h1>Mint WXCC Summary</h1>
          <p>A tool for WXCC token mint statistics</p>
        </el-col>
        <el-col
          :lg="{ span: 6, offset: 8 }"
          :md="{ span: 6, offset: 9 }"
          :sm="{ span: 6, offset: 5 }"
          :xs="{ span: 4, offset: 1 }"
        >
          <ConnectWallet />
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <MintTable v-if="bsc" />
      <el-col v-else class="details">
        <h2>Details please connect wallet.</h2>
      </el-col>
    </el-main>
  </el-container>
</template>

<script>
import ConnectWallet from "./ConnectWallet.vue";
import MintTable from "./MintTable.vue";
import { mapState } from "vuex";

export default {
  name: "HomePage",
  components: {
    ConnectWallet,
    MintTable,
  },
  computed: mapState({
    bsc: "bsc",
  }),
};
</script>
<style>
.font {
  font-family: monospace;
}
.home {
  min-width: 390px;
}
.details {
  text-align: center;
  padding-top: 200px;
}
.home > .el-main {
  margin-top: 50px;
}
</style>