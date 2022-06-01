<template>
  <el-col id="connect">
    <span v-if="bsc" style="color: #fff" class="baddr font">
      <el-tooltip effect="light" placement="bottom" :content="bsc.addr">
        <!-- <span slot="content">{{ bsc.addr }}</span> -->
        <el-button class="font">
          {{ addr }}
        </el-button>
      </el-tooltip>
    </span>
    <el-button
      v-else
      @click="connect_wallet"
      class="connect"
      v-loading="connect_loading"
    >
      Connect Wallet
    </el-button>
  </el-col>
</template>
<script>
import { mapState } from "vuex";
import pbw from "pbwallet";

export default {
  name: "ConnectWallet",
  computed: mapState({
    bsc: "bsc",
    addr: function (state) {
      if (state.bsc.addr) {
        return (
          state.bsc.addr.substr(0, 6) + "..." + state.bsc.addr.substr(-4, 4)
        );
      }
      return false;
    },
  }),
  data() {
    return {
      connect_loading: false,
      connect_faild: false,
    };
  },
  methods: {
    connect_wallet: async function () {
      this.connect_loading = true;
      const commit = this.$store.commit;
      try {
        const bsc = await pbw.connect(false);
        if (typeof bsc == "string" || !bsc) {
          if (bsc) {
            this.$message.error(`Connect failed: ${bsc}`);
          } else {
            this.connect_faild = true;
          }
          this.connect_loading = false;
        } else {
          commit("setBsc", bsc);
          this.connect_loading = false;
        }
      } catch (e) {
        console.log("connect wallet err", e);
        window.location.reload(true);
      }
    },
  },
};
</script>
<style>
#connect .el-button {
  margin-top: 25px;
  background-color: #38f2af;
  color: #000000;
  height: 40px;
  text-align: center;
  font-size: 14px;
  cursor: pointer;
  padding: 0px;
  box-shadow: 0px 2px 2px 0px rgba(56, 242, 175, 0.08);
}
#connect .baddr {
  color: #38f2af;
  width: 99%;
  margin: 0 auto;
  font-size: 16px;
  display: inline-block;
  margin: 0 auto;
}
</style>
