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
        <nut-button block @click="submit" type="primary">设置</nut-button>
      </nut-cell>
    </nut-form>

  <nut-cell-group title="已设置数据&预约数" desc="剩余可预约数 / 可预约总数">
    <nut-cell v-for="slot in remains" :title="`${slot.remain} / ${slot.total}`"  :desc="`${slot.date} ${slot.clockNum}:00 - ${slot.clockNum + 1}:00`"></nut-cell>
  </nut-cell-group>
  </div>
</template>
<script>
import { ref, reactive, toRefs } from "vue";
import {setSlots,getSlotsRemain} from'../request';
import { Toast } from "@nutui/nutui";
export default {
  components: {},
  setup() {
    const d = new Date();
    const m=d.getMonth() + 1;
    const date = `${d.getFullYear()}-${m>9?m:'0'+m}-${d.getDate()}`;
    const formData = reactive({
      date,
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
      const {date,slots} =formData
      let s={};
      slots.forEach((count,index)=>{
        if(count>0||count===-1){
          s[index||'0']=count;
        }
      })
      console.log(s)
      setSlots({date,slots:JSON.stringify(s)}).then(response=>{
        console.log(response.data)
        if(response.data.code===200){
          Toast.success('设置成功！');
        }else{
          Toast.fail('网络异常，请重试！')
        }
      })
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
  data() {
    return {
      remains: []
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
        const {data} = response.data;
        console.log(data)
        this.remains = data;
      });
    },
  },
  mounted() {
    Toast.loading('数据加载中...', {duration: 0});
    this.setRemains();
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
/deep/.nut-cell__title{
  flex: 0.5;
}
/deep/.nut-input-label{
  width: auto !important;
}
  /deep/.nut-cell-group__warp{
    margin: 0;
  }
</style>
