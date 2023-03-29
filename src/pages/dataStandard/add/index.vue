<template>
  <div>
    <div class="form-step-container">
      <div class="text-lg text-gray-700">{{ dataStandard?.standardName }} - 数据结构</div>
      <div>
        <t-table
          :data="data"
          :columns="DATA_STRUCTURE_COLUMN"
          row-key="id"
          table-layout="auto"
          vertical-align="top"
          :hover="true"
          :stripe="true"
          :loading="dataLoading"
          :pagination="({
            defaultPageSize: pagenation.pageSize,
            current: pagenation.page,
            pageSize: pagenation.pageSize,
            total: pagenation.total,
            pageSizeOptions:[10, 20, 30, 40, 50]
          } as PaginationProps)"
          @page-change="handlePageChange"
        >
          <template #op="slotProps">
            <div class="flex flex-wrap">
              <a class="t-button-link" @click="handleClickEdit(slotProps)">修改</a>
              <a class="t-button-link" @click="handleClickDelete(slotProps)">删除</a>
            </div>
          </template>
        </t-table>
      </div>
    </div>

    <div class="form-step-container mt-4">
      <div class="text-lg text-gray-700 flex items-center justify-between">
        <div>添加数据结构</div>
        <t-button class="mr-10" @click="handleClickSave">保存</t-button>
      </div>
      <div class="mt-2">
        <div v-for="(item, index) in addList" :key="index" class="p-2">
          <t-form
            :ref="
              (el) => {
                formRefList[index] = el as any;
              }
            "
            :rules="ADD_DATA_STRUCTURE_RULES"
            :required-mark="false"
            :data="item"
          >
            <t-space break-line>
              <t-form-item style="min-width: 240px" name="fieldName">
                <t-input v-model="item.fieldName" placeholder="字段名称" />
              </t-form-item>
              <t-form-item style="width: 180px" name="fieldType">
                <t-select
                  v-model="item.fieldType"
                  :options="FIELD_TYPE_OPTIONS"
                  placeholder="字段类型"
                  @change="(e) => handleSelectType(e, index)"
                ></t-select>
              </t-form-item>
              <t-form-item style="width: 240px" name="fieldDefaultValue">
                <t-input
                  v-if="item.fieldType === 'string' || item.fieldType === 'int' || item.fieldType === 'float'"
                  v-model="item.fieldDefaultValue"
                  :type="
                    item.fieldType === 'string'
                      ? 'text'
                      : item.fieldType === 'int'
                      ? 'number'
                      : item.fieldType === 'float'
                      ? 'number'
                      : 'text'
                  "
                  placeholder="字段默认值"
                />
                <t-select
                  v-else-if="item.fieldType === 'boolean'"
                  v-model="item.fieldDefaultValue"
                  :options="[
                    { label: 'true', value: 1 },
                    { label: 'false', value: 0 },
                  ]"
                  placeholder="字段默认值"
                ></t-select>
                <t-date-picker
                  v-else-if="item.fieldType === 'date' || item.fieldType === 'datetime'"
                  v-model="item.fieldDefaultValue"
                  :enable-time-picker="item.fieldType === 'datetime'"
                  placeholder="字段默认值"
                  style="width: 240px"
                />
                <t-time-picker
                  v-else-if="item.fieldType === 'time'"
                  v-model="item.fieldDefaultValue"
                  style="width: 240px"
                  placeholder="字段默认值"
                />
                <t-input v-else v-model="item.fieldDefaultValue" placeholder="字段默认值" />
              </t-form-item>
              <t-form-item style="width: 280px" name="fieldDescription">
                <t-input v-model="item.fieldDescription" placeholder="字段描述" style="width: 280px" />
              </t-form-item>
              <t-form-item style="width: 180px" nem="fieldLength">
                <t-input-number
                  v-model="item.fieldLength"
                  theme="column"
                  align="center"
                  :min="0"
                  label="字段长度"
                  style="width: 180px"
                />
              </t-form-item>
              <t-form-item style="width: 70px">
                <t-switch
                  v-model="item.isUnique"
                  :label="['唯一', '不唯一']"
                  :custom-value="[1, 0]"
                  placeholder="是否唯一"
                  size="large"
                />
              </t-form-item>
              <t-form-item style="width: 70px">
                <t-switch
                  v-model="item.outOfUse"
                  :label="['启用', '停用']"
                  :custom-value="[1, 0]"
                  placeholder="是否停用"
                  size="large"
                />
              </t-form-item>
              <t-form-item style="width: 40px">
                <t-tooltip content="删除数据结构">
                  <t-button shape="circle" theme="danger" @click="handleClickDeleteAdd(index)">
                    <template #icon> <close-icon /></template>
                  </t-button>
                </t-tooltip>
              </t-form-item>
              <t-form-item v-if="addList.length - 1 === index" style="width: 40px">
                <t-tooltip content="添加数据结构">
                  <t-button shape="circle" theme="primary" @click="handleClickAdd()">
                    <template #icon> <add-icon /></template>
                  </t-button>
                </t-tooltip>
              </t-form-item>
            </t-space>
          </t-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { AddIcon, CloseIcon } from 'tdesign-icons-vue-next';
import { FormInstanceFunctions, MessagePlugin, PageInfo, PaginationProps } from 'tdesign-vue-next';

import { getDataStandard } from '@/api/dataStandard';
import { addDataStructure, getDataStructureList } from '@/api/dataStructure';
import { dataStandardModel } from '@/api/model/dataStandardModel';
import {
  DATA_STRUCTURE_COLUMN,
  ADD_DATA_STRUCTURE_RULES,
  ADD_DATA_STRUCTURE_FROM,
  FIELD_TYPE_OPTIONS,
} from './constants';
import { dataStructureModel } from '@/api/model/dataStructureModel';

const router = useRouter();
const {
  params: { id },
} = router.currentRoute.value;

const dataLoading = ref(false);

const pagenation = ref({
  page: 1,
  pageSize: 10,
  total: 0,
});

const handlePageChange = (pageInfo: PageInfo) => {
  pagenation.value = {
    ...pagenation.value,
    page: pageInfo.current,
    pageSize: pageInfo.pageSize,
  };
  getData();
};

const dataStandard = ref<dataStandardModel>();
const data = ref<Array<dataStructureModel>>([]);
const getData = async () => {
  dataLoading.value = true;
  try {
    dataStandard.value = await getDataStandard(id as string);
    const { page, pageSize } = pagenation.value;
    const { list, total } = await getDataStructureList({
      page,
      pageSize,
    });
    data.value = list;
    pagenation.value.total = total;
  } catch (error) {
    console.log(error);
  } finally {
    dataLoading.value = false;
  }
};

onMounted(() => {
  getData();
});
const handleClickDelete = async ({ row }) => {};

const handleClickEdit = async ({ row }) => {};

const addList = ref<Array<dataStructureModel>>([{ ...ADD_DATA_STRUCTURE_FROM }]);
const formRefList = ref<Array<FormInstanceFunctions>>([]);

const handleSelectType = (e, index) => {
  let defaultValue: any = '';
  let length = 0;
  switch (e) {
    case 'string':
      length = 255;
      defaultValue = '';
      break;
    case 'int':
    case 'float':
      length = 11;
      defaultValue = 0;
      break;
    case 'boolean':
      length = 1;
      defaultValue = 0;
      break;
    case 'date':
      length = 10;
      defaultValue = new Date().toLocaleDateString();
      break;
    case 'datetime':
      length = 19;
      defaultValue = new Date().toLocaleString();
      break;
    case 'time':
      length = 8;
      defaultValue = new Date().toLocaleTimeString();
      break;
    default:
      length = 0;
      defaultValue = '';
      break;
  }
  addList.value[index].fieldLength = length;
  addList.value[index].fieldDefaultValue = defaultValue;
};
const validateForm = async () => {
  let res = true;
  const promises = formRefList.value.filter((item) => item).map((item) => item.validate());
  const validList = await Promise.all(promises);
  for (const valid of validList) {
    if (valid !== true) {
      res = false;
    }
  }
  if (res === false) {
    MessagePlugin.error('请检查表单是否填写正确');
  }
  return res;
};

const handleClickAdd = async () => {
  console.log('formData', formRefList.value);
  if (!(await validateForm())) {
    return;
  }
  addList.value.push({ ...ADD_DATA_STRUCTURE_FROM });
};

const handleClickDeleteAdd = async (index: number) => {
  if (addList.value.length === 1) {
    addList.value = [{ ...ADD_DATA_STRUCTURE_FROM }];
    MessagePlugin.error('没有数据了');
    return;
  }
  addList.value.splice(index, 1);
};

const handleClickSave = async () => {
  if (!(await validateForm())) {
    return;
  }
  const promises = addList.value.map((item) => addDataStructure({ ...item, sharedDataStandardId: id as string }));
  const res = await Promise.all(promises);
  if (res) {
    MessagePlugin.success('保存成功');
    getData();
  }
};
</script>

<style lang="less" scoped>
@import url('./index.less');
:deep(.t-form__controls) {
  margin-left: 0 !important;
}
</style>
