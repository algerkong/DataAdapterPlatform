<template>
  <div class="list-common-table">
    <t-form ref="form" :data="searchForm" :label-width="80" colon @reset="searchReset" @submit="fetchData">
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[24, 24]">
            <t-col :span="3">
              <t-form-item label="请求路径" name="moduleId">
                <t-input
                  v-model="searchForm.url"
                  class="form-item-content"
                  placeholder="请输入请求路径"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :span="3">
              <t-form-item label="请求方法" name="standardName">
                <t-select
                  v-model="searchForm.handler"
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
                  v-model="searchForm.status"
                  class="form-item-content"
                  placeholder="请输入请求状态"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :span="3">
              <t-form-item label="返回信息" name="moduleId">
                <t-input
                  v-model="searchForm.message"
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
        :columns="LOG_COLUMNS"
        :row-key="rowKey"
        :vertical-align="verticalAlign"
        :hover="hover"
        :stripe="true"
        :loading="dataLoading"
      >
        <template #exception="{ row }">
          <div class="flex justify-center items-center">
            <t-tag :theme="row.exception === '' ? 'success' : 'danger'" variant="light">
              {{ row.exception === '' ? '正常' : '失败' }}
            </t-tag>
          </div>
        </template>
        <template #op="{ row }">
          <div class="flex justify-center items-center">
            <a class="t-button-link" @click="handlerDetail(row)">详情</a>
          </div>
        </template>
      </t-table>
      <div class="h-4"></div>
      <t-pagination
        v-model="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-size-options="[12, 20, 30, 40, 50]"
        @page-size-change="onPageSizeChange"
        @current-change="onCurrentChange"
      />
    </div>

    <t-dialog v-model:visible="visible" header="详情日志" :confirm-btn="null" width="1000px" destroy-on-close top="80">
      <t-row class="form-scroll">
        <t-col class="col flex">
          <div class="label">URL：</div>
          <div>{{ rowDetail.url }}</div>
        </t-col>
        <t-col class="col flex">
          <div class="label">请求时间：</div>
          <div>{{ rowDetail.createdTime }}</div>
        </t-col>
        <t-col class="col flex">
          <div class="label">message：</div>
          <div>{{ rowDetail.message }}</div>
        </t-col>
        <t-col class="col flex">
          <div class="label">IP：</div>
          <div>{{ rowDetail.ip }}</div>
        </t-col>
        <!-- <t-col class="pt-5">
          <div class="label">params：</div>
          <json-viewer :value="JSON.parse(rowDetail.params)"></json-viewer>
        </t-col> -->
        <t-col class="col">
          <div class="label">body(请求参数)：</div>
          <json-viewer :value="JSON.parse(rowDetail.body)"></json-viewer>
        </t-col>
        <t-col class="col">
          <div class="label">result(返回参数)：</div>
          <json-viewer :value="JSON.parse(rowDetail.result)"></json-viewer>
        </t-col>
      </t-row>
    </t-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import JsonViewer from 'vue-json-viewer';
import { useRoute } from 'vue-router';
import { getLogLists } from '@/api/log';
import { API_DISPOSE_METHOD } from '@/pages/system/apiDispose/constants';
import { LOG_COLUMNS, LOG_SEARCH_FORM } from '@/pages/log/constants';

const rowDetail = ref({ body: '{}', result: '{}', params: '{}', createdTime: '{}', message: '', url: '{}', ip: '' });

const visible = ref(false);
const searchForm = ref({ ...LOG_SEARCH_FORM });
const rowKey = 'id';
const verticalAlign = 'top' as const;
const hover = true;

const route = useRoute();
if (route.query?.id) {
  searchForm.value = {
    ...searchForm.value,
    taskId: route.query?.id as string,
  };
  document.title = (route.query?.name as string) || '日志';
}

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

const data = ref([]);

const dataLoading = ref(false);
const fetchData = async () => {
  dataLoading.value = true;
  try {
    const { page, pageSize } = pagination.value;
    const { list, total } = await getLogLists({
      page,
      pageSize,
      ...searchForm.value,
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
  searchForm.value = { ...LOG_SEARCH_FORM };
  fetchData();
};

const handlerDetail = (row) => {
  visible.value = true;
  rowDetail.value = row;
};

onMounted(() => {
  fetchData();
});
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
