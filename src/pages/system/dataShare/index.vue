<template>
  <div class="page">
    <t-card :bordered="false" hover-shadow>
      <div>
        <t-form ref="form" :data="searchForm" :label-width="80" colon @reset="searchReset" @submit="fetchData">
          <t-row>
            <t-col :span="10">
              <t-row :gutter="[24, 24]">
                <t-col :span="3">
                  <t-form-item label="任务名称" name="taskName">
                    <t-input
                      v-model="searchForm.taskName"
                      class="form-item-content"
                      type="search"
                      placeholder="请输入任务名称"
                      :style="{ minWidth: '134px' }"
                    />
                  </t-form-item>
                </t-col>
                <t-col :span="3">
                  <t-form-item label="传输模式" name="status">
                    <t-select
                      v-model="searchForm.status"
                      style="display: inline-block"
                      class="form-item-content"
                      :options="TRANSMISSON_MODE"
                      placeholder="请选择传输模式"
                    />
                  </t-form-item>
                </t-col>
              </t-row>
            </t-col>

            <t-col :span="2" class="operation-container">
              <t-button theme="primary" type="submit" :style="{ marginLeft: 'var(--td-comp-margin-s)' }">
                查询
              </t-button>
              <t-button type="reset" variant="base" theme="default"> 重置 </t-button>
            </t-col>
          </t-row>
        </t-form>
      </div>

      <div style="margin-top: 30px">
        <div>
          <!-- <t-button @click="clickReturn">返回系统列表</t-button> -->
          <t-button @click="handleAdd(true)">新增数据共享</t-button>
        </div>
      </div>

      <div style="width: 100%; margin-top: 15px">
        <t-table
          :data="dataList"
          :columns="DATA_SHARE_TABLE_COLUMNS"
          row-key="property"
          :loading="dataLoading"
          stripe
          @row-click="rowClick"
        >
          <!-- 插槽方式 自定义单元格， colKey 的值默认为插槽名称  -->
          <template #status="{ row }">
            <t-tag theme="primary" variant="light">
              {{ +row.transmissionType ? 'DB推送' : 'API推送' }}
            </t-tag>
            <a
              class="t-button-link text-blue-800 ml-2"
              @click="
                $router.push({
                  name: 'dataShareApi',
                  params: { id: row.id },
                })
              "
            >
              配置
            </a>
          </template>

          <template #operates="{ row }">
            <div class="flex flex-wrap">
              <t-popconfirm :content="row.isOnline ? '确认下线吗' : '确认上线吗'" @confirm="clickStatus(row)">
                <a class="t-button-link">{{ row.isOnline ? '下线' : '上线' }}</a>
              </t-popconfirm>
              <a class="t-button-link" @click="toLog(row)">日志</a>
              <a class="t-button-link" @click="handleEdit(false)">编辑</a>
              <a class="t-button-link" @click="deleteClick">删除</a>
            </div>
          </template>
        </t-table>
      </div>

      <div style="margin-top: 15px">
        <t-pagination
          v-model="pages.current"
          v-model:pageSize="pages.pageSize"
          :total="total"
          @page-size-change="onPageSizeChange"
          @current-change="onCurrentChange"
        />
      </div>

      <t-dialog v-model:visible="visible" colon :header="status ? '新增' : '编辑'" width="700px" :footer="false">
        <t-form
          ref="form"
          :data="formData"
          :rules="DATA_SHARE_FORM_RULES"
          label-align="right"
          label-width="150px"
          @submit="onSubmit"
        >
          <t-form-item label="数据共享项目名称  " name="taskName">
            <t-input v-model="formData.taskName" placeholder="请输入数据共享名称"></t-input>
          </t-form-item>
          <t-form-item label="任务执行时间(cron)" name="taskFrequency">
            <div class="pop-content flex items-center">
              <t-input v-model="formData.taskFrequency" placeholder="请输入corn格式" style="width: 300px" />
              <t-popconfirm placement="bottom">
                <template #icon> </template>
                <template #content>
                  <div class="overflow-y-scroll cron-page">
                    <vue3-cron-core v-model:value="formData.taskFrequency" i18n="cn" />
                  </div>
                </template>
                <t-button size="small" class="block ml-8" variant="outline"> 界面选择cron </t-button>
              </t-popconfirm>
            </div>
          </t-form-item>

          <t-form-item label="推送方式" name="transmissionType">
            <t-select v-model="formData.transmissionType" class="demo-select-base" placeholder="请选择推送方式">
              <t-option value="0" label="API推送"></t-option>
              <t-option value="1" label="DB推送"></t-option>
            </t-select>
          </t-form-item>
          <t-form-item style="float: right">
            <t-button variant="outline" @click="visible = false">取消</t-button>
            <t-button theme="primary" type="submit">确定</t-button>
          </t-form-item>
        </t-form>
      </t-dialog>
    </t-card>

    <t-dialog
      v-model:visible="confirmVisible"
      header="确认删除所选系统？"
      body="删除的数据不可恢复"
      :on-cancel="onCancel"
      @confirm="onConfirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { MessagePlugin } from 'tdesign-vue-next';
import {
  getDataSharingList,
  getDataStandard,
  addShareData,
  onShareData,
  offShareData,
  delShareData,
  editShareData,
} from '@/api/dataShare';
import Vue3CronCore from '@/components/vue3-cron-core/Index.vue';
import {
  DATA_SHARE_FORM_DATA,
  DATA_SHARE_FORM_RULES,
  DATA_SHARE_SEARCH_FORM,
  DATA_SHARE_TABLE_COLUMNS,
  TRANSMISSON_MODE,
} from './constans';

const Route = useRoute();
const form = ref(null);
const total = ref(0);
const id = ref(Route.params.id);
const dataSharedTaskId = ref('');
const visible = ref(false);
const confirmVisible = ref(false);
const status = ref(null);
const modelDataStandardOptions = ref([]);
const dataLoading = ref(true);

const dataList = ref([]);
const formData = ref({ ...DATA_SHARE_FORM_DATA });

const searchForm = ref({ ...DATA_SHARE_SEARCH_FORM });
const pages = reactive({
  current: 1,
  pageSize: 10,
});

const getLists = async () => {
  await getDataSharingList({
    page: pages.current,
    pageSize: pages.pageSize,
    system: id.value,
  }).then((res: any) => {
    dataList.value = res.list;
    total.value = res.total;
    dataLoading.value = false;
  });
};

const handleAdd = (value: any) => {
  status.value = value;
  visible.value = true;
};
const fetchData = async () => {
  dataLoading.value = true;
  await getDataSharingList({
    page: pages.current,
    pageSize: pages.pageSize,
    taskName: searchForm.value.taskName,
    taskFrequency: searchForm.value.taskFrequency,
    standardName: searchForm.value.standardName,
    isOnline: searchForm.value.status,
  }).then((res) => {
    dataList.value = res.list;
    dataLoading.value = false;
  });
};
const searchReset = () => {
  searchForm.value = { ...DATA_SHARE_SEARCH_FORM };
  getLists();
};
const handleEdit = (value: any) => {
  status.value = value;
  visible.value = true;
};

const dataSpecificationLists = () => {
  getDataStandard({
    page: pages.current,
    pageSize: 999,
  }).then((res: any) => {
    modelDataStandardOptions.value = res.list;
  });
};

const deleteClick = () => {
  confirmVisible.value = true;
};
const onCancel = () => {
  confirmVisible.value = false;
};
const onConfirmDelete = async () => {
  confirmVisible.value = true;
  await delShareData(dataSharedTaskId.value).then((res) => {
    MessagePlugin.success(res.message);
    confirmVisible.value = false;
    getLists();
  });
};
const clickStatus = async (value) => {
  if (value.isOnline) {
    await offShareData(value.id).then((res) => {
      console.log(res);
    });
  } else {
    await onShareData(value.id).then((res) => {
      console.log(res);
    });
  }
  MessagePlugin.success('修改成功');
  getLists();
};
const rowClick = (value: any) => {
  if (!status.value) {
    formData.value = { ...value.row };
  }
  dataSharedTaskId.value = value.row.id;
};
const onSubmit = async ({ validateResult, firstError }) => {
  if (validateResult === true) {
    if (status.value) {
      await addShareData({
        system: id.value,
        taskName: formData.value.taskName,
        transmissionType: formData.value.transmissionType,
        taskFrequency: formData.value.taskFrequency,
      }).then((res) => {
        MessagePlugin.success(res.message);
        visible.value = false;
        getLists();
      });
    } else {
      await editShareData(dataSharedTaskId.value, {
        taskName: formData.value.taskName,
        transmissionType: formData.value.transmissionType,
        taskFrequency: formData.value.taskFrequency,
      }).then(() => {
        MessagePlugin.success('修改成功');
        visible.value = false;
        getLists();
      });
    }
  } else {
    console.log('Errors: ', validateResult);
    MessagePlugin.warning(firstError);
  }
};
watchEffect(() => {
  if (visible.value === false) {
    formData.value = { ...DATA_SHARE_FORM_DATA };
    form.value?.clearValidate();
  } else {
    dataSpecificationLists();
  }
});

const onPageSizeChange = (size) => {
  pages.pageSize = size;
  getLists();
};

const onCurrentChange = (index) => {
  pages.current = index;
  getLists();
};

getLists();

const router1 = useRouter();
const toLog = (row) => {
  console.log(id, 'id');
  // 在新窗口打开
  const { href } = router1.resolve({
    path: '/log/index',
    query: {
      id: row.id,
      name: `任务日志-${row.taskName}`,
    },
  });
  window.open(href, '_blank');
};
</script>

<style scoped lang="less">
.cron-page {
  width: 100%;
  max-height: 500px;
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
