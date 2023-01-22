<template>
  <div>
    <nut-form :model-value="formData" ref="ruleForm">
      <nut-form-item label="数据日期" prop="date">
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
          :show-sub-title="false"
          @close="closeSwitch('isVisible')"
          @choose="setChooseValue"
        >
        </nut-calendar>
      </nut-form-item>
      <nut-form-item
        label="随机校验码"
        prop="random"
      >
        <input
          class="nut-input-text"
          placeholder="点这里输入"
          v-model="formData.random"
          type="text"
        />
      </nut-form-item>
      <nut-cell>
        <nut-row :gutter="10">
          <nut-col
            :span="3"
            v-for="(slot, index) in formData.slots"
            :key="index"
            ><nut-input
              :label="index || '0'"
              class="slots-number"
              label-align="center"
              input-align="center"
              placeholder="请输入数字"
              v-model="formData.slots[index]"
              type="number"
            />
          </nut-col>
        </nut-row>
      </nut-cell>
      <nut-cell>
        <nut-button block @click="submit" type="primary">预约</nut-button>
      </nut-cell>
    </nut-form>
  </div>
</template>
<script>
import { ref, reactive, toRefs } from "vue";
import {setSlots} from'../request';
import { Toast } from "@nutui/nutui";
export default {
  components: {},
  setup() {
    const d = new Date();
    const m=d.getMonth() + 1;
    const date = `${d.getFullYear()}-${m>9?m:'0'+m}-${d.getDate()}`;
    const formData = reactive({
      date,
      random: "",
      slots: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
    });
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
      const {date,random="",slots} =formData
      let s={};
      slots.forEach((count,index)=>{
        if(count>0||count===-1){
          s[index||'0']=count;
        }
      })
      console.log(s)
      setSlots({date,random,slots:JSON.stringify(s)})
    };
    const radioVal = ref("");
    return {
      ruleForm,
      formData,
      submit,
      radioVal,
      ...toRefs(state),
      openSwitch,
      closeSwitch,
      setChooseValue,
    };
  },
};
</script>
<style scoped>
.date-desc {
  color: #00b897;
  text-align: right;
}
.slots-number {
  flex-direction: column;
  padding-left: 0;
  padding-right: 0;
}
/deep/.nut-input-label{
  width: auto !important;
}
  /deep/.nut-cell-group__warp{
    margin: 0;
  }
</style>
