<template>
  <div class="home">
    <h1>Mint Summary</h1>
    <p>
      A tool for token mint statistics
    </p>
    <ConnectWallet />
    <MintTable v-if='bsc' />
  </div>
</template>

<script>

import ConnectWallet from './ConnectWallet.vue';
import MintTable from './MintTable.vue';
import { mapState } from "vuex";

export default {
  name: 'HomePage',
  components: {
    ConnectWallet,
    MintTable
  },
  computed: mapState({
      bsc: "bsc"
  })
}
</script>
