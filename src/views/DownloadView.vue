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
      label="用户名"
      prop="userName"
      required
      :rules="[
        { required: true, message: '请填写用户名' }
      ]"
    >
      <input
        class="nut-input-text"
        v-model="formData.userName"
        placeholder="请填写用户名"
        type="text"
      />
    </nut-form-item>
    <nut-form-item
      label="密码"
      prop="pwd"
      required
      :rules="[
        { required: true, message: '请填写密码' }
      ]"
    >
      <input
        class="nut-input-text"
        v-model="formData.pwd"
        placeholder="请填写密码"
        type="password" 
      />
    </nut-form-item>
      <nut-cell>
        <nut-button block @click="submit" type="primary">下载</nut-button>
      </nut-cell>
    </nut-form>
  </div>
</template>
<script>
import { ref, reactive, toRefs } from "vue";
import { downFile } from "../request";
import { Toast } from "@nutui/nutui";
export default {
  components: {},
  setup() {
    const d = new Date();
    const m=d.getMonth() + 1;
    const date = `${d.getFullYear()}-${m>9?m:'0'+m}-${d.getDate()}`;
    const formData = reactive({
      date,
      userName:"",
      pwd:""
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
      ruleForm.value.validate().then(({ valid, errors }) => {
        if (valid) {
          downFile(formData);
        } else {
          console.log("error submit!!", errors);
        }
      });
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
  }
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
