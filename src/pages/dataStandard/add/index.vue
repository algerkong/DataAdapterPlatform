<template>
  <div>
    <div class="form-step-container">
      <!-- <div class="text-lg text-gray-700">{{ dataStandard?.standardName }} - 数据结构</div> -->
      <div class="">
        <t-form
          ref="searchFormRef"
          :required-mark="false"
          :data="searchForm"
          :label-width="80"
          colon
          @submit="handleSearchSubmit"
          @reset="handleSearchReset"
        >
          <t-row>
            <t-col :span="10">
              <t-row :gutter="[24, 24]">
                <t-col :span="3">
                  <t-form-item name="fieldName" label="字段名称">
                    <t-input v-model="searchForm.fieldName" placeholder="字段名称" />
                  </t-form-item>
                </t-col>
                <t-col :span="3">
                  <t-form-item name="fieldType" lable="字段类型">
                    <t-select
                      v-model="searchForm.fieldType"
                      :options="FIELD_TYPE_OPTIONS"
                      placeholder="字段类型"
                      @change="(e) => handleSelectType(e)"
                    ></t-select>
                  </t-form-item>
                </t-col>
                <t-col :span="3">
                  <t-form-item name="fieldDescription" label="字段描述">
                    <t-input v-model="searchForm.fieldDescription" placeholder="字段描述" />
                  </t-form-item>
                </t-col>
                <t-col :span="3">
                  <t-form-item label="字段默认值">
                    <t-input
                      v-if="
                        searchForm.fieldType === 'string' ||
                        searchForm.fieldType === 'int' ||
                        searchForm.fieldType === 'float'
                      "
                      v-model="searchForm.fieldDefaultValue"
                      :type="
                        searchForm.fieldType === 'string'
                          ? 'text'
                          : searchForm.fieldType === 'int'
                          ? 'number'
                          : searchForm.fieldType === 'float'
                          ? 'number'
                          : 'text'
                      "
                      placeholder="字段默认值"
                    />
                    <t-select
                      v-else-if="searchForm.fieldType === 'boolean'"
                      v-model="searchForm.fieldDefaultValue"
                      :options="[
                        { label: 'true', value: 1 },
                        { label: 'false', value: 0 },
                      ]"
                      placeholder="字段默认值"
                    ></t-select>
                    <t-date-picker
                      v-else-if="searchForm.fieldType === 'date' || searchForm.fieldType === 'datetime'"
                      v-model="searchForm.fieldDefaultValue"
                      :enable-time-picker="searchForm.fieldType === 'datetime'"
                      style="width: 100%"
                      placeholder="字段默认值"
                    />
                    <t-time-picker
                      v-else-if="searchForm.fieldType === 'time'"
                      v-model="searchForm.fieldDefaultValue"
                      placeholder="字段默认值"
                      style="width: 100%"
                    />
                    <t-input v-else v-model="searchForm.fieldDefaultValue" placeholder="字段默认值" />
                  </t-form-item>
                </t-col>
              </t-row>
            </t-col>
            <t-col :span="2" class="flex justify-end">
              <div class="flex justify-end">
                <t-button type="submit">查询</t-button>
                <t-button type="reset" variant="base" theme="default">重置</t-button>
              </div>
            </t-col>
          </t-row>
        </t-form>
      </div>
      <div>
        <t-table
          :data="data"
          :columns="DATA_STRUCTURE_COLUMN"
          row-key="id"
          table-layout="auto"
          vertical-align="top"
          :edit="{}"
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
          <template #fieldType="{ row }">
            {{ FIELD_TYPE_OPTIONS.filter((item) => item.value === row.fieldType)[0].label }}
          </template>
          <template #op="{ row }">
            <div class="flex flex-wrap">
              <a class="t-button-link" @click="handleClickEdit(row)">修改</a>
              <t-popconfirm :content="`确认删除${row.fieldName}这个数据结构吗`" @confirm="handleClickDelete(row)">
                <a class="t-button-link">删除</a>
              </t-popconfirm>
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
              <t-form-item style="width: 80px">
                <t-tooltip v-if="addList.length - 1 === index || index === 0" content="添加数据结构">
                  <t-button variant="dashed" shape="square" @click="handleClickAdd">
                    <t-icon name="add" />
                  </t-button>
                </t-tooltip>
                <t-tooltip content="删除数据结构">
                  <t-button variant="dashed" shape="square" @click="handleClickDeleteAdd(index)">
                    <t-icon name="remove" />
                  </t-button>
                </t-tooltip>
              </t-form-item>
            </t-space>
          </t-form>
        </div>
      </div>
    </div>

    <!-- 修改 -->
    <t-dialog v-model:visible="editDialogVisible" :width="600" header="修改数据结构" @confirm="handleEditConfirm">
      <t-form ref="editFormRef" :rules="ADD_DATA_STRUCTURE_RULES" :required-mark="false" :data="editData">
        <t-form-item name="fieldName" label="字段名称">
          <t-input v-model="editData.fieldName" placeholder="字段名称" />
        </t-form-item>
        <t-form-item name="fieldType" label="字段类型">
          <t-select
            v-model="editData.fieldType"
            :options="FIELD_TYPE_OPTIONS"
            placeholder="字段类型"
            @change="(e) => handleSelectType(e)"
          ></t-select>
        </t-form-item>
        <t-form-item name="fieldDefaultValue" label="字段默认值">
          <t-input
            v-if="editData.fieldType === 'string' || editData.fieldType === 'int' || editData.fieldType === 'float'"
            v-model="editData.fieldDefaultValue"
            :type="
              editData.fieldType === 'string'
                ? 'text'
                : editData.fieldType === 'int'
                ? 'number'
                : editData.fieldType === 'float'
                ? 'number'
                : 'text'
            "
            placeholder="字段默认值"
          />
          <t-select
            v-else-if="editData.fieldType === 'boolean'"
            v-model="editData.fieldDefaultValue"
            :options="[
              { label: 'true', value: 1 },
              { label: 'false', value: 0 },
            ]"
            placeholder="字段默认值"
          ></t-select>
          <t-date-picker
            v-else-if="editData.fieldType === 'date' || editData.fieldType === 'datetime'"
            v-model="editData.fieldDefaultValue"
            :enable-time-picker="editData.fieldType === 'datetime'"
            style="width: 100%"
            placeholder="字段默认值"
          />
          <t-time-picker
            v-else-if="editData.fieldType === 'time'"
            v-model="editData.fieldDefaultValue"
            placeholder="字段默认值"
            style="width: 100%"
          />
          <t-input v-else v-model="editData.fieldDefaultValue" placeholder="字段默认值" />
        </t-form-item>
        <t-form-item name="fieldDescription" label="字段描述">
          <t-input v-model="editData.fieldDescription" placeholder="字段描述" />
        </t-form-item>
        <t-form-item nem="fieldLength" label="字段长度">
          <t-input-number v-model="editData.fieldLength" theme="column" :min="0" style="width: 100%" />
        </t-form-item>
        <t-form-item name="isUnique" label="是否唯一">
          <t-switch
            v-model="editData.isUnique"
            :label="['唯一', '不唯一']"
            :custom-value="[1, 0]"
            placeholder="是否唯一"
            size="large"
          />
        </t-form-item>
        <t-form-item name="outOfUse" label="是否启用">
          <t-switch
            v-model="editData.outOfUse"
            :label="['启用', '停用']"
            :custom-value="[1, 0]"
            placeholder="是否停用"
            size="large"
          />
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { FormInstanceFunctions, MessagePlugin, PageInfo, PaginationProps } from 'tdesign-vue-next';

import { getDataStandard } from '@/api/dataStandard';
import { addDataStructure, deleteDataStructure, getDataStructureList, editDataStructure } from '@/api/dataStructure';
import { DataStandardModel } from '@/api/model/dataStandardModel';
import {
  DATA_STRUCTURE_COLUMN,
  ADD_DATA_STRUCTURE_RULES,
  ADD_DATA_STRUCTURE_FROM,
  FIELD_TYPE_OPTIONS,
  SEARCH_DATA_STRUCTURE_FROM,
} from './constants';
import { dataStructureModel } from '@/api/model/dataStructureModel';

const router = useRouter();
const {
  params: { id },
} = router.currentRoute.value;

const dataLoading = ref(false);

const PAGENATION_DEFAULT = {
  page: 1,
  pageSize: 10,
  total: 0,
};
const pagenation = ref({
  ...PAGENATION_DEFAULT,
});

const handlePageChange = (pageInfo: PageInfo) => {
  pagenation.value = {
    ...pagenation.value,
    page: pageInfo.current,
    pageSize: pageInfo.pageSize,
  };
  getData();
};

const dataStandard = ref<DataStandardModel>();
const data = ref<Array<dataStructureModel>>([]);
const getData = async () => {
  dataLoading.value = true;
  try {
    dataStandard.value = await getDataStandard(id as string);
    const { page, pageSize } = pagenation.value;
    const { list, total } = await getDataStructureList({
      page,
      pageSize,
      sharedDataStandardId: id as string,
      ...searchForm.value,
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
const handleClickDelete = async (row) => {
  try {
    await deleteDataStructure(row.id);
    MessagePlugin.success('删除成功');
    getData();
  } catch (error) {
    console.log(error);
  }
};
const searchFormRef = ref<FormInstanceFunctions>();
const searchForm = ref({ ...SEARCH_DATA_STRUCTURE_FROM });
const handleSearchSubmit = () => {
  pagenation.value = { ...PAGENATION_DEFAULT };
  getData();
};
const handleSearchReset = () => {
  searchFormRef.value.reset();
  handleSearchSubmit();
};

const addList = ref<Array<dataStructureModel>>([{ ...ADD_DATA_STRUCTURE_FROM }]);
const formRefList = ref<Array<FormInstanceFunctions>>([]);

const handleSelectType = (e, index?) => {
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
  if (index >= 0) {
    addList.value[index].fieldLength = length;
    addList.value[index].fieldDefaultValue = defaultValue;
    return;
  }
  if (editDialogVisible.value) {
    editData.value.fieldLength = length;
    editData.value.fieldDefaultValue = defaultValue;
    return;
  }
  searchForm.value.fieldDefaultValue = defaultValue;
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

const editData = ref<dataStructureModel>({ ...ADD_DATA_STRUCTURE_FROM });
const editDialogVisible = ref(false);
const editFormRef = ref<FormInstanceFunctions>();

const handleClickEdit = async (row) => {
  editDialogVisible.value = true;
  editData.value = { ...row };
};

const handleEditConfirm = async () => {
  if (!(await editFormRef.value.validate())) {
    return;
  }
  const data = { ...editData.value };
  delete data.id;
  try {
    await editDataStructure(editData.value.id, data);
    MessagePlugin.success('编辑成功');
    getData();
    editDialogVisible.value = false;
  } catch (error) {
    console.error(error);
  }
};
</script>

<style lang="less" scoped>
@import url('./index.less');
:deep(.form-step-container .t-form__controls) {
  margin-left: 0 !important;
}
</style>
