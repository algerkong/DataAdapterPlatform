<template>
  <t-dialog v-model:visible="formVisible" :header="title" :width="680" :footer="false">
    <template #body>
      <!-- 表单内容 -->
      <t-form ref="form" :data="formData" :rules="rules" :label-width="100" @submit="onSubmit">
        <t-form-item label="系统名称" name="systemName">
          <t-input v-model="formData.systemName" placeholder="请输入系统名称" />
        </t-form-item>
        <t-form-item label="系统图标" name="systemIcon">
          <t-input v-model="formData.systemIcon" placeholder="请输入系统名称" />
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
import { MessagePlugin, FormRule, SubmitContext, Data } from 'tdesign-vue-next';
import { SystemModel } from '@/api/model/system';
import { addSystem, editSystem } from '@/api/system';

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
const formData = ref(null);
const form = ref(null);
formData.value = !props.isEdit ? { ...INITIAL_DATA } : { ...props.data };

const onSubmit = async ({ validateResult, firstError }: SubmitContext<Data>) => {
  if (!firstError) {
    if (!props.isEdit) {
      await addSystem(formData.value);
      emit('change');
    } else {
      const { id } = formData.value;
      const params = { ...formData.value };
      delete params.id;
      delete params.isOnline;
      await editSystem(id, params);
      console.log('编辑系统', formData.value);
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

watchEffect(() => {
  if (!formVisible.value) {
    formData.value = { ...INITIAL_DATA };
  } else {
    formData.value = !props.isEdit ? { ...INITIAL_DATA } : { ...props.data };
  }
  emit('update:visible', formVisible.value);
});

watch(
  () => props.visible,
  (val) => {
    formVisible.value = val;
  },
);

watch(
  () => props.data,
  (val) => {
    formData.value = val;
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
  systemIcon: [{ required: true, message: '请输入系统图标', type: 'error', trigger: 'blur' }],
  systemUrl: [{ required: true, message: '请输入系统链接地址', type: 'error', trigger: 'blur' }],
  principalPhone: [{ validator: validatePhone, trigger: 'blur', message: '请输入正确的手机号码', type: 'error' }],
};
</script>
