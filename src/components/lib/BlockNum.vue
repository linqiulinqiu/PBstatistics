<template>
  <span>
    <a :href="preweb + number">Block</a>
  </span>
</template>
<script>
export default {
  name: "BlockNum",
  props: ["number"],
  data() {
    return {
      preweb: "https://bscscan.com/block/",
    };
  },
};
</script>
<style scoped>
a {
  color: #668b66;
  text-decoration: none;
}
a:hover {
  color: #38f2af;
}
</style>