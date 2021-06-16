<template>
  <view class="content">
    <view class="section">
      <view class="title">使用 am-badge</view>
      <am-badge text="99" />
    </view>
    <view class="section">
      <view class="title">使用 am-button</view>
      <am-button type="primary">按钮</am-button>
    </view>
    <view class="section">
      <view class="title">使用 am-search-bar</view>
      <am-search-bar></am-search-bar>
    </view>

  </view>
</template>

<script>
export default {
  data() {
    return {
      title: "Hello"
    };
  },
  onLoad() {},
  methods: {}
};
</script>

<style>
.section {
  margin-top: 40rpx;
}
.title {
  text-align: center;
}
</style>
