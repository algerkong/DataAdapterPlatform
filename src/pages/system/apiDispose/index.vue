<template>
  <div class="list-common-table">
    <t-form ref="form" :data="searchFormData" :label-width="120" colon @reset="searchReset" @submit="fetchData">
      <t-row>
        <t-col :span="10">
          <t-row>
            <t-col :span="3" :lg="3" :md="6" :xs="12">
              <t-form-item label="API名称" name="apiName">
                <t-input
                  v-model="searchFormData.apiName"
                  class="form-item-content"
                  type="search"
                  placeholder="请输入API名称"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :span="3" :lg="3" :md="6" :xs="12">
              <t-form-item label="API地址" name="url">
                <t-input
                  v-model="searchFormData.url"
                  class="form-item-content"
                  placeholder="请输入API地址"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :span="3" :lg="3" :md="6" :xs="12">
              <t-form-item label="请求方式" name="method">
                <t-select
                  v-model="searchFormData.method"
                  style="display: inline-block"
                  class="form-item-content"
                  :options="API_DISPOSE_METHOD"
                  placeholder="请选择请求方式"
                  @change="onMethodSelectChange"
                />
              </t-form-item>
            </t-col>
            <t-col :span="3" :lg="3" :md="6" :xs="12">
              <t-form-item label="参数类型" name="contentType">
                <t-select
                  v-model="searchFormData.contentType"
                  style="display: inline-block"
                  class="form-item-content"
                  :options="apiDisposeContentType"
                  placeholder="请选择请求内容类型"
                  @change="onContentTypeSelectChange"
                />
              </t-form-item>
            </t-col>
          </t-row>
        </t-col>

        <t-col :span="2" class="operation-container">
          <t-button theme="primary" type="submit" :style="{ marginLeft: 'var(--td-comp-margin-s)' }"> 查询 </t-button>
          <t-button type="reset" variant="base" theme="default"> 重置 </t-button>
        </t-col>
      </t-row>
    </t-form>

    <div class="table-container">
      <div class="mt-4">
        <t-button @click="addVisible = true">新建API配置</t-button>
      </div>

      <t-table
        :data="data"
        :columns="API_DISPOSE_COLUMNS"
        :row-key="rowKey"
        table-layout="auto"
        :vertical-align="verticalAlign"
        :hover="hover"
        :stripe="true"
        :loading="dataLoading"
      >
        <template #op="slotProps">
          <div class="flex flex-wrap">
            <a class="t-button-link" @click="handleClickOp(slotProps)">管理</a>
            <a class="t-button-link" @click="handleClickEdit(slotProps)">修改</a>
            <a class="t-button-link" @click="handleClickDelete(slotProps)">删除</a>
          </div>
        </template>
      </t-table>
      <div class="h-4"></div>
      <t-pagination
        v-model="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-size-options="[12, 24, 36]"
        @page-size-change="onPageSizeChange"
        @current-change="onCurrentChange"
      />

      <t-dialog v-model:visible="addVisible" :header="dialogTitle" width="1200px" top="50px" destroy-on-close>
        <t-form
          ref="addForm"
          :data="formData"
          :label-width="120"
          colon
          :rules="API_DISPOSE_FORM_RULES"
          class="form-scroll relative"
        >
          <t-row :gutter="[12, 12]" class="mb-6">
            <t-col :span="6">
              <t-form-item label="API名称" name="apiName">
                <t-input v-model="formData.apiName" class="form-item-content" placeholder="请输入API名称" />
              </t-form-item>
            </t-col>
            <t-col :span="6">
              <t-form-item label="API地址" name="url">
                <t-input v-model="formData.url" class="form-item-content" placeholder="请输入API地址" />
              </t-form-item>
            </t-col>
          </t-row>
          <t-row :gutter="[12, 12]" class="mb-6 font">
            <t-col :span="6">
              <t-form-item label="请求方式" name="method">
                <t-select
                  v-model="formData.method"
                  style="display: inline-block"
                  class="form-item-content"
                  :options="API_DISPOSE_METHOD"
                  placeholder="请选择请求方式"
                  @change="onMethodSelectChange"
                />
              </t-form-item>
            </t-col>
            <t-col :span="6">
              <t-form-item label="请求内容类型" name="contentType">
                <t-select
                  v-model="formData.contentType"
                  style="display: inline-block"
                  class="form-item-content"
                  :options="apiDisposeContentType"
                  placeholder="请选择请求内容类型"
                  @change="onContentTypeSelectChange"
                />
              </t-form-item>
            </t-col>
          </t-row>
          <t-row :gutter="[12, 12]" class="mb-6 font">
            <t-col :span="6">
              <t-form-item label="数据源" name="dataSourceId">
                <t-select
                  v-model="formData.dataSourceId"
                  style="display: inline-block"
                  class="form-item-content"
                  :options="selectDataSource"
                  placeholder="请选择数据源"
                  @change="onContentTypeSelectChange"
                />
              </t-form-item>
            </t-col>
            <t-col :span="6">
              <t-form-item label="数据结构" name="sharedDataStandardId">
                <t-select
                  v-model="formData.sharedDataStandardId"
                  style="display: inline-block"
                  class="form-item-content"
                  :options="selectDataStandard"
                  placeholder="请选择数据结构"
                  @change="onDataStandardSelectChange"
                />
              </t-form-item>
            </t-col>
          </t-row>

          <t-form-item label="响应内容配置">
            <tree-table ref="treeTableRef" :value="treeTableData" @change-table="onTreeTableChange" />
          </t-form-item>
          <t-form-item label="映射" name="responseFieldMapping">
            <div class="w-full">
              <div v-for="(item, index) in responseFieldMappingList" :key="index" class="mb-4">
                <t-form
                  :ref="
                    (el) => {
                      responseFieldMappingRefs[index] = el;
                    }
                  "
                  :data="item"
                  colon
                  :rules="RESPONSE_FIELD_MAPPING_RULES"
                >
                  <t-row :gutter="[12, 12]">
                    <t-col :span="5">
                      <t-form-item label="数据结构" name="fieldName">
                        <t-select
                          v-model="item.fieldName"
                          :options="selectDataStructure"
                          placeholder="请选择数据结构"
                          @change="
                            (e) => {
                              onSelectDataStructureChange(e, index);
                            }
                          "
                        />
                      </t-form-item>
                    </t-col>
                    <t-col :span="5">
                      <t-form-item label="映射字段" name="fieldMapping">
                        <t-tree-select
                          :value="item.fieldMapping"
                          :data="treeData"
                          :min-collapsed-num="0"
                          :tree-props="{
                            keys: {
                              label: 'fieldName',
                              value: 'id',
                            },
                          }"
                          placeholder="请选择"
                          @change="(_, context) => onTreeSelectChange(context, index)"
                        />
                      </t-form-item>
                    </t-col>
                    <t-col :span="2">
                      <t-tooltip v-if="responseFieldMappingList.length - 1 === index || index === 0" content="添加映射">
                        <t-button variant="dashed" shape="square" @click="handleAddMapping">
                          <t-icon name="add" />
                        </t-button>
                      </t-tooltip>
                      <t-tooltip content="删除映射">
                        <t-button variant="dashed" shape="square" @click="handleDelMapping(index)">
                          <t-icon name="remove" />
                        </t-button>
                      </t-tooltip>
                    </t-col>
                  </t-row>
                </t-form>
              </div>
            </div>
          </t-form-item>
          <t-form-item label="示例请求信息" name="sampleReqInfo" class="over">
            <t-textarea
              v-model="formData.sampleReqInfo"
              class="form-item-content"
              :autosize="{ minRows: 10 }"
              placeholder="请输入示例请求信息"
            />
          </t-form-item>
        </t-form>
        <template #footer>
          <t-button variant="outline" @click="addVisible = false">取消</t-button>
          <t-button theme="primary" type="submit" @click="onConfirmAdd">确定</t-button>
        </template>
      </t-dialog>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { Data, DialogPlugin, FormInstanceFunctions, MessagePlugin, SubmitContext } from 'tdesign-vue-next';
import { useRoute, useRouter } from 'vue-router';
import { addApiDispose, delApiDispose, getApiDisposeList, editApiDispose } from '@/api/apiDispose';
import { getDataSourceList } from '@/api/dataSource';
import {
  API_DISPOSE_FORM_RULES,
  API_DISPOSE_FORM,
  API_DISPOSE_COLUMNS,
  API_DISPOSE_CONTENE_TYPE,
  API_DISPOSE_METHOD,
  API_DISPOSE_SEARCH_FORM,
  RESPONSE_FIELD_MAPPING,
  RESPONSE_FIELD_MAPPING_RULES,
  RESPONSE_FIELD_MAPPING_TYPE,
} from './constants';
import { ApiDisposeModel } from '@/api/model/apiDisposeModel';
import TreeTable from './treeTable.vue';
import { getDataStructureList } from '@/api/dataStructure';
import { getDataStandardList } from '@/api/dataStandard';

const router = useRouter();
const treeTableRef = ref(null);
const treeTableData = ref(null);
const treeData = ref(null);

// 数据源选项
const selectDataSource = ref([]);
// 数据规范选项
const selectDataStructure = ref([]);
// 数据结构选项
const selectDataStandard = ref([]);

// 搜索
const searchFormData = ref({ ...API_DISPOSE_SEARCH_FORM });
const apiDisposeContentType = ref([...API_DISPOSE_CONTENE_TYPE]);

// 新增编辑
const addVisible = ref(false);
const formData = ref<ApiDisposeModel>({ ...API_DISPOSE_FORM });
const addForm = ref<FormInstanceFunctions>(null);

const rowKey = 'id';
const verticalAlign = 'top' as const;
const hover = true;

const pagination = ref({
  page: 1,
  pageSize: 12,
  total: 0,
});

const route = useRoute();
const { id } = route.params as { id: string };

const data = ref([]);
const dataLoading = ref(false);

const onPageSizeChange = (size: number) => {
  pagination.value.pageSize = size;
  pagination.value.page = 1;
  fetchData();
};
const onCurrentChange = (page: number) => {
  pagination.value.page = page;
  fetchData();
};

// 基础数据
const fetchData = async () => {
  dataLoading.value = true;
  try {
    const { page, pageSize } = pagination.value;
    const search = { ...searchFormData.value };
    const { list, total } = await getApiDisposeList({
      page,
      pageSize,
      shareDataId: id || '',
      ...search,
    });
    data.value = list;
    pagination.value = {
      ...pagination.value,
      total,
    };
  } catch (e) {
    console.log(e);
  } finally {
    dataLoading.value = false;
  }
};

const searchReset = () => {
  searchFormData.value = { ...API_DISPOSE_SEARCH_FORM };
  fetchData();
};

// 页面初始化
onMounted(async () => {
  await fetchData();
  const { list: dataSourceList } = await getDataSourceList();
  selectDataSource.value = dataSourceList.map((item) => {
    return { label: item.name, value: item.id };
  });

  // 获取所有数据结构
  const { list } = await getDataStandardList();
  selectDataStandard.value = list.map((item) => {
    return { label: item.standardName, value: item.id };
  });
});

// 删除
const handleClickDelete = async ({ row }) => {
  const dialog = DialogPlugin.confirm({
    header: '确认删除当前所选API配置？',
    body: '删除后将无法恢复',
    onConfirm: async () => {
      try {
        await delApiDispose(row.id);
        MessagePlugin.success('删除成功');
        dialog.destroy();
        fetchData();
      } catch (error) {
        console.error('error', error);
        MessagePlugin.error('删除失败');
        dialog.destroy();
      }
    },
  });
};

const handleClickOp = ({ row }) => {
  router.push({
    name: 'dataShareApiConfig',
    params: {
      id: row.id,
    },
  });
};

// 判断是否在编辑状态
const isEdit = computed(() => {
  return !!formData.value.id;
});

// 标题
const dialogTitle = computed(() => {
  return isEdit.value ? '编辑API配置' : '新增API配置';
});

const onTreeTableChange = (data) => {
  treeData.value = data;
};

const onMethodSelectChange = (e) => {
  if (e === 'GET') {
    apiDisposeContentType.value = [{ label: 'query', value: 'query' }];
    formData.value.contentType = 'query';
    searchFormData.value.contentType = 'query';
  } else {
    apiDisposeContentType.value = [...API_DISPOSE_CONTENE_TYPE];
  }
};

const onContentTypeSelectChange = (e) => {
  if (e === 'query') {
    formData.value.method = 'GET';
    searchFormData.value.method = 'GET';
  }
};

const onDataStandardSelectChange = async (e) => {
  // 获取所有id下的数据结构
  const { list: dataStructureList } = await getDataStructureList({ sharedDataStandardId: e || '' });
  selectDataStructure.value = dataStructureList.map((item) => {
    let label = `${item.fieldName}(${item.fieldDescription})`;
    if (item?.isUnique) {
      label = `${item.fieldName}(${item.fieldDescription}) [唯一]`;
    }
    return { label, value: item.fieldName, ...item };
  });
};

// 编辑之前
const handleClickEdit = async ({ row }) => {
  treeTableData.value = JSON.parse(row.response);
  responseFieldMappingList.value = JSON.parse(row.responseFieldMapping);
  console.log(row, 'row');
  formData.value = { ...row, dataSourceId: row.dataSourceId?.id, sharedDataStandardId: row.sharedDataStandardId?.id };
  await onDataStandardSelectChange(row.sharedDataStandardId?.id);
  onMethodSelectChange(formData.value.method);
  addVisible.value = true;
};

watch(addVisible, (newVal) => {
  if (!newVal) {
    formData.value = { ...API_DISPOSE_FORM };
    addForm.value?.clearValidate();
  } else if (!isEdit.value) {
    treeData.value = null;
    treeTableData.value = null;
    responseFieldMappingList.value = [{ ...RESPONSE_FIELD_MAPPING }];
  }
  searchFormData.value.contentType = '';
  searchFormData.value.method = '';
});

const responseFieldMappingList = ref<Array<RESPONSE_FIELD_MAPPING_TYPE>>([{ ...RESPONSE_FIELD_MAPPING }]);
const responseFieldMappingRefs = ref<Array<FormInstanceFunctions>>([]);

const validateForm = async () => {
  let res = true;
  const promises = responseFieldMappingRefs.value.filter((item) => item).map((item) => item.validate());
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

const handleAddMapping = async () => {
  if (!(await validateForm())) {
    return;
  }
  responseFieldMappingList.value.push({ ...RESPONSE_FIELD_MAPPING });
};
const handleDelMapping = async (index) => {
  if (responseFieldMappingList.value.length === 1) {
    responseFieldMappingList.value = [RESPONSE_FIELD_MAPPING];
    MessagePlugin.warning('至少保留一条映射关系');
    return;
  }
  responseFieldMappingList.value.splice(index, 1);
};

const onSelectDataStructureChange = (e, index) => {
  const dataStructure = selectDataStructure.value.find((item) => item.value === e);
  if (dataStructure) {
    responseFieldMappingList.value[index].isUnique = dataStructure.isUnique;
  }
  console.log(responseFieldMappingList.value[index], 'responseFieldMappingList.value[index]');
};

const onTreeSelectChange = (context, index) => {
  if (context.node.data.children) {
    return;
  }
  const { id } = context.node.data;
  console.log(context, 'context');
  console.log('getRoot', context.node.getRoot());
  try {
    const { data: parent } = context.node.getRoot();
    responseFieldMappingList.value[index].fieldMapping = getTreePath(id, { id: 'w', children: [parent] });
  } catch (e) {
    responseFieldMappingList.value[index].fieldMapping = context.node.data.fieldName;
  }
};
// 根据 ID 获取树形结构的路径 例如：a.b.c
// 父级结构为 data: { id: 1,fieldName:'a', children: [{ id: 2,fieldName:'b', children: [{ id: 3,fieldName:'c', }] }]
const getTreePath = (id, parent) => {
  const { children } = parent;
  let path = '';
  for (const item of children) {
    if (item.id === id) {
      path += item.fieldName;
      break;
    }
    if (item.children) {
      const res = getTreePath(id, item);
      if (res) {
        path += `${item.fieldName}.${res}`;
        break;
      }
    }
  }
  return path;
};
// 添加和编辑
const onConfirmAdd = async ({ firstError }: SubmitContext<Data>) => {
  const tableDate = JSON.stringify(treeData.value);
  if (firstError) {
    MessagePlugin.warning(firstError);
    return;
  }
  const valid = await treeTableRef.value.fullValidEvent();
  console.log(valid, 'valid');
  if (valid?.fieldName.length > 0) {
    MessagePlugin.warning('请检查表单是否填写正确');
    return;
  }
  try {
    const params = {
      ...formData.value,
      shareDataId: id,
      response: tableDate,
      responseFieldMapping: JSON.stringify(responseFieldMappingList.value),
    };
    if (isEdit.value) {
      delete params.id;
      await editApiDispose(formData.value.id, params);
      MessagePlugin.success('编辑成功');
    } else {
      await addApiDispose(params);
      MessagePlugin.success('添加成功');
    }
    fetchData();
    addVisible.value = false;
  } catch (error) {
    MessagePlugin.error('操作错误');
  }
};
</script>

<style lang="less" scoped>
.list-common-table {
  background-color: var(--td-bg-color-container);
  padding: var(--td-comp-paddingTB-xxl) var(--td-comp-paddingLR-xxl);
  border-radius: var(--td-radius-medium);

  .table-container {
    margin-top: var(--td-comp-margin-xxl);
  }
}

.form-item-content {
  width: 100%;
}

.operation-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .expand {
    .t-button__text {
      display: flex;
      align-items: center;
    }
  }
}

.payment-col {
  display: flex;

  .trend-container {
    display: flex;
    align-items: center;
    margin-left: var(--td-comp-margin-s);
  }
}

.form-scroll {
  overflow-y: scroll;
  overflow-x: hidden;
  max-height: 750px;
  &::-webkit-scrollbar {
    width: 8px;
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 6px;
    border: 2px solid transparent;
    background-clip: content-box;
    background-color: var(--td-scrollbar-color);
  }
}
</style>
