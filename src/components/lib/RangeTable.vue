<template>
  <el-col>
    <el-col>
      <span>
        Block Range: {{ startBlk }} (
        <BlockNum :number="this.startBlk" />
        ) ---{{ endBlk }}
      </span>
      <el-tag type="info" size="mini">
        End Block may be adjusted according to actual blocktime
      </el-tag>
    </el-col>
    <el-col>
      <el-col :span="4">
        <el-button
          type="primary"
          size="small"
          v-loading="loading"
          @click="load"
        >
          Load History
        </el-button>
      </el-col>
      <el-col :span="4">
        <el-tag type="info">Sync to block {{ lastLoadBlk }}</el-tag>
      </el-col>
      <el-col :span="8">
        <el-tag type="success">Your Position: {{ userPos }}</el-tag>
      </el-col>
    </el-col>

    <el-table
      class="font"
      :data="minthist"
      :row-class-name="tableRowClassName"
      strip
      border
      style="width: 96%,text-aligin:center"
      ref="minthist"
      highlight-current-row
    >
      <el-table-column type="index" width="50" />
      <el-table-column label="Address">
        <template slot-scope="scope">
          <a :href="scope.row.addrlink" target="_blank" class="buttonText">{{
            scope.row.addr
          }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="sumval" label="Amount" width="250" />
      <el-table-column label="Times" width="100">
        <template slot-scope="scope">
          <a :href="scope.row.timeslink" target="_blank" class="buttonText">{{
            scope.row.times
          }}</a>
        </template>
      </el-table-column>
    </el-table>
  </el-col>
</template>
<script>
import { ethers } from "ethers";
import BlockNum from "./BlockNum";

export default {
  name: "RangeTable",
  components: {
    BlockNum,
  },
  props: ["bsc", "startBlk", "endBlk"],
  data() {
    return {
      minthist: [],
      mtxs: {},
      loading: false,
      decimals: 0,
      lastLoadBlk: 0,
      userPos: "Unknown",
    };
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 0) {
        return "top-row";
      } else if (rowIndex < 3) {
        return "sec-row";
      } else if (rowIndex < 10) {
        return "top10-row";
      }
      if (!row) return false;
      return "";
    },
    load: async function () {
      const ctr = this.bsc.ctrs.wxcc;
      this.loading = true;
      if (!this.decimals) {
        this.decimals = await ctr.decimals();
      }
      try {
        const mints = await this.load_mints(
          this.bsc.provider,
          ctr,
          this.startBlk,
          this.endBlk
        );
        console.log("11", mints);
        const minthist = [];
        for (var k in mints) {
          minthist.push(mints[k]);
        }
        minthist.sort(function (a, b) {
          if (a.amount.gt(b.amount)) return -1;
          if (a.amount.lt(b.amount)) return 1;
          return 0;
        });
        let crow = -1;
        for (let i in minthist) {
          if (minthist[i].addr == this.bsc.addr) {
            crow = i;
          }
          minthist[
            i
          ].addrlink = `https://bscscan.com/address/${minthist[i].addr}`;
          minthist[
            i
          ].timeslink = `https://bscscan.com/token/${ctr.address}?a=${minthist[i].addr}`;
          minthist[i].sumval = ethers.utils.formatUnits(
            minthist[i].amount,
            this.decimals
          );
        }
        this.minthist = minthist;
        if (crow >= 0) {
          this.$refs.minthist.setCurrentRow(this.minthist[crow]);
          this.userPos = parseInt(crow) + 1;
        } else {
          this.userPos = "None";
        }
      } catch (error) {
        console.log("load err", error);
      }

      this.loading = false;
    },
    load_mints: async function (provider, ctr, startblk, endblk) {
      const stepMax = 2000;
      const curblk = await provider.getBlockNumber();
      console.log("curblk", curblk, typeof curblk);
      if (!endblk || curblk < endblk) {
        endblk = curblk;
      }
      let mints = {};

      let lstart = startblk;
      if (lstart < this.lastLoadBlk) {
        lstart = this.lastLoadBlk;
      }
      while (lstart < endblk) {
        let lend = lstart + stepMax;
        if (lend > endblk) {
          lend = endblk;
        }
        const txs = await ctr.queryFilter("Transfer", lstart, lend);
        this.lastLoadBlk = lend;
        for (let i in txs) {
          this.mtxs[txs[i].transactionHash] = txs[i];
        }
        lstart = lend;
      }
      for (let i in this.mtxs) {
        const tx = this.mtxs[i];
        if (tx.args.from != ethers.constants.AddressZero) {
          continue;
        }
        const toaddr = tx.args.to;
        if (!(toaddr in mints)) {
          mints[toaddr] = {
            addr: toaddr,
            amount: ethers.BigNumber.from(0),
            times: 0,
          };
        }
        mints[toaddr].amount = mints[toaddr].amount.add(tx.args.value);
        mints[toaddr].times++;
      }
      console.log("mints", mints);
      return mints;
    },
  },
};
</script>
<style>
.el-table {
  min-width: 500px;
}
.el-table .top-row {
  background-color: #49ab3b8c !important;
}
.el-table .sec-row {
  background-color: #6aa74c63 !important;
}
.el-table .top10-row {
  background-color: #8394b657 !important;
}
a {
  text-decoration: none;
  color: #000000;
}
a:hover {
  color: #668b66;
}
</style>