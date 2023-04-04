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
        <t-button @click="toAdd">新建API配置</t-button>
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
            <a class="t-button-link" @click="rehandleClickOp(slotProps)">管理</a>
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

      <t-dialog v-model:visible="addVisible" :header="dialogTitle" width="1200px" :footer="false" destroy-on-close>
        <t-form
          ref="addForm"
          :data="formData"
          :label-width="120"
          colon
          :rules="API_DISPOSE_FORM_RULES"
          class="form-scroll"
          @submit="onConfirmAdd"
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

          <t-form-item label="响应内容配置" name="response">
            <!-- <t-textarea v-model="formData.response" class="form-item-content" placeholder="请输入响应内容配置" /> -->
            <t-tree :data="items" activable hover transition expand-all draggable />
          </t-form-item>
          <t-form-item label="映射" name="responseFieldMapping">
            <t-textarea
              v-model="formData.responseFieldMapping"
              class="form-item-content"
              placeholder="请输入接口返回值字段与数据规范的映射"
            />
          </t-form-item>
          <t-form-item label="示例请求信息" name="sampleReqInfo" class="over">
            <t-textarea v-model="formData.sampleReqInfo" class="form-item-content" placeholder="请输入示例请求信息" />
          </t-form-item>
          <t-form-item style="float: right">
            <t-button variant="outline" @click="addVisible = false">取消</t-button>
            <t-button theme="primary" type="submit">确定</t-button>
          </t-form-item>
        </t-form>
      </t-dialog>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { Data, DialogPlugin, FormInstanceFunctions, MessagePlugin, SubmitContext } from 'tdesign-vue-next';
import { useRoute, useRouter } from 'vue-router';
import { addApiDispose, delApiDispose, getApiDisposeList, editApiDispose } from '@/api/apiDispose';
import {
  API_DISPOSE_FORM_RULES,
  API_DISPOSE_FORM,
  API_DISPOSE_COLUMNS,
  API_DISPOSE_CONTENE_TYPE,
  API_DISPOSE_METHOD,
  API_DISPOSE_SEARCH_FORM,
} from './constants';
import { ApiDisposeModel } from '@/api/model/apiDisposeModel';

const router = useRouter();

// 搜索
const searchFormData = ref({ ...API_DISPOSE_SEARCH_FORM });
const apiDisposeContentType = ref([...API_DISPOSE_CONTENE_TYPE]);

// 新增编辑
const addVisible = ref(false);
const formData = ref<ApiDisposeModel>({ ...API_DISPOSE_FORM });
const addForm = ref<FormInstanceFunctions>(null);
const items = [
  {
    value: '1',
    label: '1',
    children: [
      {
        value: '1.1',
        label: '1.1',
        children: [
          {
            value: '1.1.1',
            label: '1.1.1',
            children: [
              {
                value: '1.1.1.1',
                label: '1.1.1.1',
              },
              {
                value: '1.1.1.2',
                label: '1.1.1.2',
              },
            ],
          },
          {
            value: '1.1.2',
            label: '1.1.2',
            children: [
              {
                value: '1.1.2.1',
                label: '1.1.2.1',
              },
              {
                value: '1.1.2.2',
                label: '1.1.2.2',
              },
            ],
          },
        ],
      },
    ],
  },
];

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

const rowKey = 'id';
const verticalAlign = 'top' as const;
const hover = true;

const pagination = ref({
  page: 1,
  pageSize: 12,
  total: 0,
});

const onPageSizeChange = (size: number) => {
  pagination.value.pageSize = size;
  pagination.value.page = 1;
  fetchData();
};
const onCurrentChange = (page: number) => {
  pagination.value.page = page;
  fetchData();
};

const route = useRoute();
const { id } = route.params as { id: string };

const data = ref([]);
const dataLoading = ref(false);
const fetchData = async () => {
  dataLoading.value = true;
  try {
    const { page, pageSize } = pagination.value;
    const search = { ...searchFormData.value };
    const { list, total } = await getApiDisposeList({
      page,
      pageSize,
      sharedDataStandardId: id || '',
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

onMounted(() => {
  fetchData();
});

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

const isEdit = computed(() => {
  return !!formData.value.id;
});

const dialogTitle = computed(() => {
  return isEdit.value ? '编辑API配置' : '新增API配置';
});

const handleClickEdit = async ({ row }) => {
  addVisible.value = true;
  formData.value = { ...row };
  onMethodSelectChange(formData.value.method);
};

const rehandleClickOp = ({ row }) => {
  router.push({
    path: `/dataStandard/apiConfig/${row.id}`,
  });
};

watch(addVisible, (newVal) => {
  if (!newVal) {
    formData.value = { ...API_DISPOSE_FORM };
    addForm.value?.clearValidate();
  }
  searchFormData.value.contentType = '';
  searchFormData.value.method = '';
});

const onConfirmAdd = async ({ firstError }: SubmitContext<Data>) => {
  if (firstError) {
    MessagePlugin.warning(firstError);
    return;
  }
  try {
    const params = {
      ...formData.value,
      sharedDataStandardId: id,
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

const toAdd = () => {
  addVisible.value = true;
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
  max-height: 600px;
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
