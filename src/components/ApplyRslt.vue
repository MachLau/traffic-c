<template>
  <div>
    <div v-if="applyData&&applyData.applyClockNum">
      <div class="qrcode">
        <qrcode-vue :value="value" size="300"></qrcode-vue>
      </div>
      <div class="title">恭喜你，预约成功！<p style="color: #f21f57;">请截图保存当前页面，进港出示给工作人员</p></div>
      <div class="desc">
        预约通行车牌号为：<span class="hightlight">{{ applyData.number }}</span
        ><br />请于
        <span class="hightlight">{{ `${applyData.applyClockNum}:00-${applyData.applyClockNum + 1}:00` }}</span
        >时段，通过打开百度地图或高德地图搜索“秀英港网约进港通道入口”导航进港。
      </div>
    </div>
    <div v-else class="qrcode">
      <div class="title">抱歉没有查询到你的预约信息！</div>
    </div>
  </div>
</template>
<script>
import QrcodeVue from "qrcode.vue";
import { getRslt } from "../request";
export default {
  components: {
    QrcodeVue,
  },
  data() {
    return {
      value: "",
      applyData: {},
    };
  },
  mounted() {
    this.value=location.href
    console.log('222',this.$route)
    getRslt(this.$route.query).then((response)=>{
      const rslt=response.data.data
      this.applyData=rslt.length>0?rslt[0]:null;
    })
    document.title="预约结果";
  },
};
</script>
<style scoped>
.title {
  font-weight: 700;
  font-size: 18px;
  line-height: 26px;
  text-align: center;
  color: #000000;
  margin-top: 16px;
}
.desc {
  font-size: 16px;
  line-height: 26px;
  text-align: center;
  color: #111111;
  margin: 9px auto 0;
  width: 300px;
}
.qrcode {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}
.hightlight {
  color: #f21f57;
  font-weight: 700;
  font-size: 30px;
}
</style>
