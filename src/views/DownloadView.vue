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
          :start-date="`2023-01-25`"
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
        <nut-button block @click="()=>{submit('download')}" type="primary">下载</nut-button>
      </nut-cell>
      <nut-cell>
        <nut-button block @click="()=>{submit('del')}" type="primary">删除所选日期数据</nut-button>
      </nut-cell>
    </nut-form>
  <nut-cell-group>
    <nut-cell title="上传过港车辆数据" desc="仅能上传 xlsx 格式数据"></nut-cell>
    <nut-uploader :url="url" @success="handleSucc" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" >
    <nut-button type="success" size="small">上传文件</nut-button></nut-uploader>
  </nut-cell-group>
  </div>
</template>
<script>
import { ref, reactive, toRefs } from "vue";
import { downFile,delData,uploadApi } from "../request";
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
    const url = reactive('');
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

    const submit = (type) => {
      ruleForm.value.validate().then(({ valid, errors }) => {
        if (valid) {
          if(type==='download'){
            downFile(formData);
          }else if(type==='del'){
            delData(formData).then(res=>{
              Toast.success(res.data.msg)
            });
          }
          
        } else {
          console.log("error submit!!", errors);
        }
      });
    };
    const radioVal = ref("");
    return {
      ruleForm,
      formData,
      url,
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
      url: uploadApi,
    };
  },
  mounted(){
    this.url
  },
  methods:{
    handleSucc({responseText}){
      const rslt=JSON.parse(responseText);
      if(rslt.code===200){
        Toast.success(`成功上传 ${rslt.data} 条数据！`);
      }else{
        Toast.fail('上传失败，请稍后再试！');
      }
    }
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
/deep/.nut-uploader{
  margin: 16px 0 16px 16px;
  border-radius: 6px;
}
/deep/.nut-input-label{
  width: auto !important;
}
/deep/.nut-cell-group__warp{
  margin: 0;
}
</style>
