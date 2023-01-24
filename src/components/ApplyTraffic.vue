<script>
import { ref, reactive,toRefs } from "vue";
import { Toast } from "@nutui/nutui";
import router from "../router";
import ChineseNumberPlateSelector from "./ChineseNumberPlateSelector.vue";
import { getSlotsRemain,applyAction } from "../request";
export default {
  setup() {
    const d = new Date();
    const m=d.getMonth() + 1;
    const date = `${d.getFullYear()}-${m>9?m:'0'+m}-${d.getDate()}`;
    const formData = reactive({
      tel: "",
      applyTime: "",
      date,
      isNewPower:false
    });
    const cpfRef = ref(null);
    const ruleForm = ref(null);
    const state = reactive({
      isVisible: false,
    });
    const openSwitch = (param) => {
      state[`${param}`] = true;
    };
    const closeSwitch = (param) => {
      state[`${param}`] = false;
    };
    const setChooseValue = (param) => {
      console.log("param", param);
      formData.date = param[3];
    };

    const submit = () => {

      ruleForm.value.validate().then(({ valid, errors }) => {
        const cph = cpfRef.value.getCPH();
        if (cph.length < 7) {
          Toast.fail("请输入您完整车牌号！");
        }
        if (valid) {
          applyAction(Object.assign({ number: encodeURIComponent(cph) }, formData)).then(
            (response) => {
              const { code, msg, data } = response.data;
              if (code == 200) {
                Toast.success(msg);
                router.push({name:"rslt", query: { cph }});
              } else {
                Toast.fail(msg);
              }
            }
          );
          console.log("success", formData);
        } else {
          console.log("error submit!!", errors);
        }
      });
    };
    // Promise 异步校验
    const asyncValidator = (val) => {
      return new Promise((resolve) => {
        // Toast.loading("模拟异步验证中...");
        // setTimeout(() => {
        //   Toast.hide();
        //   resolve(
        //     /^400(-?)[0-9]{7}$|^1\d{10}$|^0[0-9]{2,3}-[0-9]{7,8}$/.test(val)
        //   );
        // }, 1000);
        resolve(
          /^400(-?)[0-9]{7}$|^1\d{10}$|^0[0-9]{2,3}-[0-9]{7,8}$/.test(val)
        );
      });
    };
    // const back = () => {
    //   if (window.history.length > 1) {
    //     window.history.back();
    //   } else {
    //     window.close();
    //   }
    // };
    return {
      ruleForm,
      cpfRef,
      formData,
      asyncValidator,
      submit,
      ...toRefs(state),
      openSwitch,
      closeSwitch,
      setChooseValue,
      // back,
    };
  },
  components: {
    ChineseNumberPlateSelector,
  },

  data() {
    return {
      remains: [],
      currentD:0,
      currentH:0,
      currentM:0
    };
  },
  watch:{
    'formData.date'(){
      this.setRemains()
    }
  },
  methods: {
    setRemains() {
      getSlotsRemain({date:this.formData.date}).then((response) => {
        Toast.hide();
        const {data,serverTs} = response.data;
        this.remains = data;
        const ts = new Date(serverTs);
        this.currentD=ts.getDate();
        this.currentH=ts.getHours();
        this.currentM=ts.getMinutes();
        console.log(this.currentH,this.currentM)
      });
    },

    disabledRatio(item){
      if(item.remain <= 0)return true;
      const dateOfSelector = this.formData.date.split('-').pop();
      if(dateOfSelector<this.currentD)return true
      if(dateOfSelector>this.currentD)return false;
      //同一天
      return this.currentH>item.clockNum || ((this.currentH===item.clockNum)&&(this.currentM>=30))
    }
  },
  mounted() {
    Toast.loading('数据加载中...', {
        duration: 0
      });
    this.setRemains();
  },
};
</script>
<template>
  <nut-cell-group>
    <nut-cell title="是否新能源车">
      <template v-slot:link>
        <nut-switch v-model="formData.isNewPower" />
      </template>
    </nut-cell>
    <nut-cell title="预约通行车辆车牌号">
      <template v-slot:icon>
        <span style="color: #fa2c19;margin-right: 4px;">*</span>
      </template>
    </nut-cell>
    <ChineseNumberPlateSelector :isNewPower="formData.isNewPower" ref="cpfRef" />
  </nut-cell-group>
  <nut-form :model-value="formData" ref="ruleForm">
    <nut-form-item
      label="联系电话"
      prop="tel"
      required
      :rules="[
        { required: true, message: '请填写联系电话' },
        { validator: asyncValidator, message: '电话格式不正确' },
      ]"
    >
      <input
        class="nut-input-text"
        v-model="formData.tel"
        placeholder="请填写联系电话"
        type="text"
      />
    </nut-form-item>
    <nut-form-item label="预计通行日期" prop="date">
        <div
          class="date-desc"
          @click="
            () => {
              openSwitch('isVisible');
            }
          "
        >
          {{ formData.date }}
        </div>

        <nut-calendar
          v-model:visible="isVisible"
          :default-value="formData.date"
          :show-title="false"
          @close="closeSwitch('isVisible')"
          @choose="setChooseValue"
        >
        </nut-calendar>
      </nut-form-item>
    <nut-form-item
      label="预计通行时段"
      prop="applyTime"
      :label-width="70"
      required
      :rules="[{ required: true, message: '请选择通行时段' }]"
    >
      <nut-radiogroup v-if="remains.length>0" v-model="formData.applyTime" direction="horizontal">
        <nut-radio
          v-for="item in remains"
          :key="item.clockNum"
          shape="button"
          :label="JSON.stringify(item)"
          :disabled="disabledRatio(item)"
          >
          {{
            `${item.clockNum}:00-${item.clockNum + 1}:00 (${item.remain})`
          }}</nut-radio
        >
      </nut-radiogroup>
      <div v-else>暂未开放预约时间段</div>
    </nut-form-item>
    <nut-cell>
      <nut-button block @click="submit"  type="primary">{{remains.length>0?'预约':'暂未开放'}}</nut-button>
    </nut-cell>
  </nut-form>
</template>
<style scoped>

.date-desc {
  color: #00b897;
  text-align: right;
}
  /deep/.nut-cell-group__warp{
    margin: 0;
  }
  /deep/.nut-radio__button{
    padding: 6px 12px;
  }
</style>