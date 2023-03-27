<template>
  <t-dialog v-model:visible="formVisible" :header="title" :width="680" :footer="false">
    <template #body>
      <!-- 表单内容 -->
      <t-form ref="form" :data="formData" :rules="rules" :label-width="100" @submit="onSubmit">
        <t-form-item label="系统图标" name="systemIcon">
          <t-upload
            v-model="uploadModel"
            :action="`${proxy.baseUrl}/api/system/upload`"
            theme="image"
            accept="image/*"
            :auto-upload="true"
            :format-response="formatImgResponse"
            :locale="{
              triggerUploadText: {
                image: '请选择图片',
              },
            }"
            @success="handleSuccess"
          ></t-upload>
        </t-form-item>
        <t-form-item label="系统名称" name="systemName">
          <t-input v-model="formData.systemName" placeholder="请输入系统名称" />
        </t-form-item>
        <t-form-item label="系统描述" name="remark">
          <t-textarea v-model="formData.remark" placeholder="请输入系统描述" />
        </t-form-item>
        <t-form-item label="系统链接地址" name="systemUrl">
          <t-input v-model="formData.systemUrl" placeholder="请输入链接地址" />
        </t-form-item>
        <t-form-item label="负责人姓名" name="principalName">
          <t-input v-model="formData.principalName" placeholder="请输入负责人姓名" />
        </t-form-item>
        <t-form-item label="负责人手机号" name="principalPhone">
          <t-input v-model="formData.principalPhone" placeholder="请输入负责人手机号" />
        </t-form-item>
        <t-form-item label="系统类型" name="type">
          <t-select v-model="formData.systemTag" clearable>
            <t-option v-for="(item, index) in SELECT_OPTIONS" :key="index" :value="item.value" :label="item.label">
              {{ item.label }}
            </t-option>
          </t-select>
        </t-form-item>
        <t-form-item style="float: right">
          <t-button variant="outline" @click="onClickCloseBtn">取消</t-button>
          <t-button theme="primary" type="submit">确定</t-button>
        </t-form-item>
      </t-form>
    </template>
  </t-dialog>
</template>

<script setup lang="ts">
import { onUpdated, ref, watch, watchEffect } from 'vue';
import { MessagePlugin, FormRule, SubmitContext, Data, SuccessContext, UploadFile } from 'tdesign-vue-next';
import { SystemModel } from '@/api/model/system';
import { addSystem, editSystem } from '@/api/system';
import proxy from '@/config/proxy';
// import { AddIcon } from 'tdesign-icons-vue-next';

const INITIAL_DATA: SystemModel = {
  systemIcon: '',
  systemName: '',
  systemUrl: '',
  principalName: '',
  principalPhone: '',
  remark: '',
  systemTag: '',
};

const SELECT_OPTIONS = [
  { label: '网关', value: '1' },
  { label: '人工智能', value: '2' },
  { label: 'CVM', value: '3' },
];

const emit = defineEmits(['update:visible', 'change']);

const props = defineProps<{
  visible: boolean;
  data: SystemModel;
  isEdit: boolean;
}>();

const title = ref('');
watchEffect(() => {
  title.value = !props.isEdit ? '新增系统' : '编辑系统';
});

onUpdated(() => {
  form.value?.clearValidate();
});

const formVisible = ref(false);
const formData = ref<SystemModel>(null);
const form = ref(null);
formData.value = !props.isEdit ? { ...INITIAL_DATA } : { ...props.data };

// 打开文件选择 选择图片 png jpg svg
// const chooseIcon = () => {
//   const input = document.createElement('input');
//   input.type = 'file';
//   input.accept = '.jpg,.jpeg,.png,.svg';
//   input.onchange = (e) => {
//     const file = (e.target as HTMLInputElement).files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = (e) => {
//         const base64 = e.target?.result as string;
//         formData.value.systemIcon = base64;
//       };
//     }
//   };
//   input.click();
// };

const handleSuccess = (context: SuccessContext) => {
  console.log('context', context);
};

const onSubmit = async ({ validateResult, firstError }: SubmitContext<Data>) => {
  if (!firstError) {
    console.log('formData', formData.value);
    const { id } = formData.value;
    const params = { ...formData.value };
    delete params.id;
    delete params.isOnline;
    Object.keys(params).forEach((key) => {
      if (params[key] === '') {
        delete params[key];
      }
    });
    if (!props.isEdit) {
      await addSystem(params);
      emit('change');
    } else {
      console.log('params', params);
      await editSystem(id, params);
    }
    emit('change');
    MessagePlugin.success('提交成功');
    formVisible.value = false;
  } else {
    console.log('Errors: ', validateResult);
    MessagePlugin.warning(firstError);
  }
};

const onClickCloseBtn = () => {
  formVisible.value = false;
  formData.value = { ...INITIAL_DATA };
};

const uploadModel = ref<UploadFile[]>([]);

watchEffect(() => {
  emit('update:visible', formVisible.value);
});

watch(
  () => props.visible,
  (val) => {
    formVisible.value = val;
    uploadModel.value = [];
    if (!formVisible.value) {
      formData.value = { ...INITIAL_DATA };
    } else {
      formData.value = !props.isEdit ? { ...INITIAL_DATA } : { ...props.data };
      if (props.isEdit) {
        uploadModel.value = [
          {
            url: `${proxy.baseUrl}/images/${formData.value.systemIcon}`,
          },
        ];
      }
    }
  },
);

const validatePhone = (val) => {
  const reg = /^1[3456789]\d{9}$/;
  if (val && !reg.test(val)) {
    return false;
  }
  return true;
};

const rules: Record<string, FormRule[]> = {
  systemName: [{ required: true, message: '请输入系统名称', type: 'error', trigger: 'blur' }],
  systemIcon: [{ required: true, message: '请选择系统图标', type: 'error', trigger: 'blur' }],
  systemUrl: [{ required: true, message: '请输入系统链接地址', type: 'error', trigger: 'blur' }],
  principalPhone: [{ validator: validatePhone, trigger: 'blur', message: '请输入正确的手机号码', type: 'error' }],
};

watchEffect(() => {
  console.log('formData,,,,,', formData.value);
});

const formatImgResponse = (res) => {
  formData.value = {
    ...formData.value,
    systemIcon: res.data,
  };
  console.log('formData1111111111', formData.value);
  return { name: 'file', url: `${proxy.baseUrl}/images/${res.data}` };
};
</script>
