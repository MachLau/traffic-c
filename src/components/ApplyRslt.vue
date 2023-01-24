<template>
  <div>
    <div v-if="applyData&&applyData.applyClockNum">
      <div class="qrcode">
        <qrcode-vue :value="value" size="300"></qrcode-vue>
      </div>
      <div class="title">恭喜你，预约成功!</div>
      <div class="title">排队号：{{applyData.applyId}}</div>
      <div class="desc">
        请<span class="hightlight" style="font-size: 20px;">截图</span>保存当前页面，进港出示给工作人员<br />
        预约通行车牌号为：<span class="hightlight">{{ applyData.number }}</span
        ><br />请于
        <span class="hightlight">{{ `${applyData.date.split('-')[1]}月${applyData.date.split('-')[2]}日 ${applyData.applyClockNum}:00-${applyData.applyClockNum + 1}:00` }}</span
        >时段，<br />通过打开百度地图或高德地图搜索<p class="hightlight">"海口港海关东门"</p>导航进港。
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
  line-height: 22px;
  text-align: center;
  color: #f21f57;
  margin-top: 12px;
}
.desc {
  font-size: 16px;
  line-height: 26px;
  text-align: center;
  color: #111111;
  margin: 9px auto 0;
  width: 345px;
}
.qrcode {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}
.hightlight {
  color: #f21f57;
  font-weight: 700;
  font-size: 22px;
  line-height: 30px;
}
</style>
