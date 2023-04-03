<template>
  <div class="list-common-table">
    <t-form ref="form" :data="formData" :label-width="80" colon @reset="searchReset" @submit="fetchData">
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[24, 24]">
            <t-col :span="3">
              <t-form-item label="请求方法" name="standardName">
                <t-select
                  v-model="formData.handler"
                  style="display: inline-block"
                  class="form-item-content"
                  :options="API_DISPOSE_METHOD"
                  placeholder="请选择请求方法"
                />
              </t-form-item>
            </t-col>
            <t-col :span="3">
              <t-form-item label="请求状态" name="descripition">
                <t-input
                  v-model="formData.status"
                  class="form-item-content"
                  placeholder="请输入请求状态"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :span="3">
              <t-form-item label="请求路径" name="moduleId">
                <t-input
                  v-model="formData.url"
                  class="form-item-content"
                  placeholder="请输入请求路径"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :span="3">
              <t-form-item label="返回信息" name="moduleId">
                <t-input
                  v-model="formData.message"
                  class="form-item-content"
                  placeholder="请输入返回信息"
                  :style="{ minWidth: '134px' }"
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
      <t-table
        :data="data"
        :columns="columns"
        :row-key="rowKey"
        table-layout="auto"
        :vertical-align="verticalAlign"
        :hover="hover"
        :stripe="true"
        :loading="dataLoading"
      >
        <template #op="{ row }">
          <div class="flex flex-wrap">
            <a class="t-button-link" @click="handlerDetail(row)">详情</a>
          </div>
        </template>
        <template #exception="{ row }">
          <div class="flex justify-center items-center">
            <t-tag :theme="row.exception === '' ? 'success' : 'danger'" variant="light">
              {{ row.exception === '' ? '正常' : '失败' }}
            </t-tag>
          </div>
        </template>
      </t-table>
      <div class="h-4"></div>
      <t-pagination
        v-model="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-size-options="[10, 20, 30, 40, 50]"
        @page-size-change="onPageSizeChange"
        @current-change="onCurrentChange"
      />
    </div>

    <t-dialog v-model:visible="visible" header="详情日志" :confirm-btn="null" width="1000px" destroy-on-close top="80">
      <t-row class="form-scroll">
        <t-col :span="6">
          <span class="text-blue-800 font-bold">URL：</span>
          <span>{{ rowDetail.url }}</span>
        </t-col>
        <t-col :span="6">
          <span class="text-blue-800 font-bold">请求时间：</span>
          <span>{{ rowDetail.createdTime }}</span>
        </t-col>
        <t-col :span="6" class="py-5">
          <span class="text-blue-800 font-bold">message：</span>
          <span>{{ rowDetail.message }}</span>
        </t-col>
        <t-col :span="6" class="py-5">
          <span class="text-blue-800 font-bold">IP：</span>
          <span>{{ rowDetail.ip }}</span>
        </t-col>
        <t-col class="py-5">
          <span class="text-blue-800 font-bold">params：</span>
          <json-viewer :value="JSON.parse(rowDetail.params)"></json-viewer>
        </t-col>
        <t-col>
          <span class="text-blue-800 font-bold">body(请求参数)：</span>
          <json-viewer :value="JSON.parse(rowDetail.result)"></json-viewer>
        </t-col>
        <t-col>
          <span class="text-blue-800 font-bold">result(返回参数)：</span>
          <json-viewer :value="JSON.parse(rowDetail.body)"></json-viewer>
        </t-col>
      </t-row>
    </t-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { BaseTableColumns } from 'tdesign-vue-next';
import JsonViewer from 'vue-json-viewer';
import { getLogLists } from '@/api/log';
import { API_DISPOSE_METHOD } from '../dataStandard/apiDispose/constants';

const searchForm = {
  handler: '',
  status: '',
  url: '',
  message: '',
};

const rowDetail = ref({ body: '{}', result: '{}', params: '{}', createdTime: '{}', message: '', url: '{}', ip: '' });

const visible = ref(false);
const formData = ref({ ...searchForm });
const rowKey = 'id';
const verticalAlign = 'top' as const;
const hover = true;

const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0,
});

const columns: BaseTableColumns = [
  {
    colKey: 'handler',
    title: '请求方法',
    // type-slot-name 会被用于自定义单元格的插槽名称
    cell: 'type-slot-name',
    align: 'center',
  },
  {
    title: 'IP',
    // 没有 cell 的情况下， platform 会被用作自定义单元格的插槽名称
    colKey: 'ip',
    align: 'center',
  },
  {
    colKey: 'url',
    title: '请求路径',
    align: 'center',
  },
  {
    colKey: 'status',
    title: '请求状态',
    align: 'center',
  },
  {
    colKey: 'message',
    title: '返回消息',
    align: 'center',
  },
  {
    colKey: 'exception',
    title: '异常信息',
    align: 'center',
  },
  { colKey: 'createdTime', title: '请求时间', align: 'center' },
  { colKey: 'op', title: '操作', align: 'center' },
];

const onPageSizeChange = (size: number) => {
  pagination.value.pageSize = size;
  pagination.value.page = 1;
  fetchData();
};
const onCurrentChange = (page: number) => {
  pagination.value.page = page;
  fetchData();
};

const data = ref([]);

const dataLoading = ref(false);
const fetchData = async () => {
  try {
    const { page, pageSize } = pagination.value;
    const { list, total } = await getLogLists({
      page,
      pageSize,
      ...formData.value,
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
  formData.value = { ...searchForm };
  fetchData();
};

const handlerDetail = (row) => {
  console.log(row);

  visible.value = true;
  rowDetail.value = row;
};

onMounted(() => {
  fetchData();
});
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
  font-size: 16px;
  max-height: 600px;
  overflow-y: scroll;
  overflow-x: hidden;
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
