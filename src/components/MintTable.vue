<template>
  <el-col id="mints">
    <el-button type="primary" v-if="bsc" @click="load">Load History</el-button>
    <span>{{lastLoadBlk}}</span>
    <el-table :data='minthist' strip border style="width: 95%">
        <el-table-column prop="addr" label="Address" width="420" />
        <el-table-column prop="sumval" label="Amount" width="250" />
        <el-table-column prop="times" label="Times" width="100" />
    </el-table>
  </el-col>
</template>
<script>
import { mapState } from "vuex";
import { ethers } from 'ethers';


export default {
  name: "MintTable",
  computed: mapState({
    bsc: "bsc"
  }),
  data(){
      return {
          minthist: [],
          mtxs: {},
          loading: false,
          decimals: 0,
          startBlk: 18267035,
          lastLoadBlk: 0
      }
  },
  methods: {
    load: async function () {
      const ctr = this.bsc.ctrs.wxcc
      this.loading = true;
      if(!this.decimals){
          this.decimals = await ctr.decimals()
      }
      const mints = await this.load_mints(this.bsc.provider, ctr, this.startBlk)
      const minthist = []
      for(var k in mints){
        minthist.push(mints[k])
      }
      minthist.sort(function(a,b){
          if(a.amount.gt(b.amount)) return -1;
          if(a.amount.lt(b.amount)) return 1;
          return 0;
      })
      for(let i in minthist){
          minthist[i].sumval = ethers.utils.formatUnits(minthist[i].amount, this.decimals)
      }
      this.minthist = minthist;
      console.log('minthist', minthist)
    },
    load_mints: async function(provider, ctr, startblk, endblk){
        const stepMax = 5000
        if(!endblk){
            endblk = await provider.getBlockNumber()
        }
        let mints = {}

        let lstart = startblk
        if(lstart<this.lastLoadBlk){
            lstart = this.lastLoadBlk
        }
        while(lstart<endblk){
            let lend = lstart + stepMax
            if(lend>endblk){
                lend = endblk
            }
            const txs = await ctr.queryFilter('Transfer', lstart, lend)
            this.lastLoadBlk = lend
            for(let i in txs){
                this.mtxs[txs[i].transactionHash] = txs[i]
            }
            lstart = lend
        }

        for(let i in this.mtxs){
            const tx = this.mtxs[i]
            if(tx.args.from!=ethers.constants.AddressZero){
                continue
            }
            const toaddr = tx.args.to
            if(!(toaddr in mints)){
                mints[toaddr] = {
                    addr: toaddr,
                    amount: ethers.BigNumber.from(0),
                    times: 0
                }
            }
            mints[toaddr].amount = mints[toaddr].amount.add(tx.args.value)
            mints[toaddr].times++
        }

        return mints
    }
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
