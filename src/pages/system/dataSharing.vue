<template>
  <t-card :bordered="false" hover-shadow>
    <div style="display: flex; justify-content: space-between">
      <div>
        <t-button @click="clickReturn">返回系统列表</t-button>
        <t-button @click="addClickdatas(true)">新增数据共享</t-button>
      </div>

      <div style="width: 360px" class="flex">
        <t-input v-model="searchValue" placeholder="请输入任务名称(Enter 确认搜索)" @enter="onSearch">
          <template #suffix-icon>
            <search-icon v-if="searchValue === ''" size="var(--td-comp-size-xxxs)" />
          </template>
        </t-input>
        <t-button theme="primary" class="ml-2" @click="refresh">
          <template #icon><refresh-icon size="26px" /></template>
          重置
        </t-button>
      </div>
    </div>

    <div style="width: 100%; margin-top: 15px">
      <t-table :data="data" :columns="columns" row-key="property" :loading="dataLoading" @row-click="rowclick">
        <!-- 插槽方式 自定义单元格， colKey 的值默认为插槽名称  -->
        <template #status="{ row }">
          <t-tag theme="primary" variant="light">
            {{ +row.transmissionType ? 'DB推送' : 'API推送' }}
          </t-tag>
        </template>

        <template #operates="{ row }">
          <t-popconfirm :content="row.isOnline ? '确认下线吗' : '确认上线吗'" @confirm="clickStatus(row)">
            <t-button theme="default" variant="text">
              {{ row.isOnline ? '上线' : '下线' }}
            </t-button>
          </t-popconfirm>
          <t-button theme="default" variant="text" @click="editClickdatas(false)">编辑</t-button>
          <t-button theme="default" variant="text" @click="deleteClick(row)">删除</t-button>
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
      <t-form ref="form" :data="formData" :rules="rules" label-align="right" label-width="150px" @submit="onSubmit">
        <t-form-item label="数据共享项目名称  " name="taskName">
          <t-input v-model="formData.taskName" placeholder="请输入数据共享名称"></t-input>
        </t-form-item>

        <t-form-item label="数据规范" name="dataStandardId">
          <t-select v-model="formData.dataStandardId" class="demo-select-base">
            <t-option
              v-for="item in Dataspecification"
              :key="item.id"
              :value="item.id"
              :label="item.standardName"
            ></t-option>
          </t-select>
        </t-form-item>

        <t-form-item label="任务执行频率(毫秒)" name="taskFrequency">
          <t-input v-model="formData.taskFrequency" placeholder="请输入数字" />
        </t-form-item>

        <t-form-item label="推送方式" name="transmissionType">
          <t-select v-model="formData.transmissionType" class="demo-select-base">
            <t-option value="0" label="API推送">API推送</t-option>
            <t-option value="1" label="DB推送">DB推送</t-option>
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
</template>

<script setup lang="ts">
import { ref, reactive, toRefs, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { SearchIcon, RefreshIcon } from 'tdesign-icons-vue-next';
import { BaseTableColumns, FormRule, MessagePlugin } from 'tdesign-vue-next';
import {
  getDataSharingList,
  getDataSpecification,
  postaddDate,
  reviseStatuson,
  reviseStatusoff,
  deleteDatas,
} from '@/api/dataSharing';

const Route = useRoute();
const Router = useRouter();
const form = ref(null);
const total = ref(0);
const id = ref(Route.params.id);
const dataSharedTaskId = ref('');
const visible = ref(false);
const confirmVisible = ref(false);
const status = ref(null);
const Dataspecification = ref([]);
const searchValue = ref('');
const dataLoading = ref(true);

const FORMDATA_VALUE = {
  taskName: '',
  dataStandardId: '',
  taskFrequency: '',
  transmissionType: '',
};
const lists = reactive({
  data: [],
  formData: { ...FORMDATA_VALUE },
});
const { data } = toRefs(lists);
const formData = ref({ ...FORMDATA_VALUE });
const pages = reactive({
  current: 1,
  pageSize: 10,
});
watchEffect(() => {
  console.log(formData.value, '1111111');
});
const rules: Record<string, FormRule[]> = {
  taskName: [{ required: true, message: '请输入数据共享名称', type: 'error', trigger: 'blur' }],
  taskFrequency: [{ required: true, message: '请输入执行任务毫秒', type: 'error', trigger: 'blur' }],
  transmissionType: [{ required: true, message: '请选择推送方式', type: 'error', trigger: 'blur' }],
  dataStandardId: [
    // 注意：trigger: blur 仅在输入框或选择框失去焦点时触发，需要注意配合 trigger: change 使用
    { required: true, message: '请选择数据规范', type: 'error', trigger: 'blur' },
  ],
};
const columns: BaseTableColumns = [
  {
    colKey: 'taskName',
    title: '任务名称',
    // type-slot-name 会被用于自定义单元格的插槽名称
    cell: 'type-slot-name',
    width: 120,
    align: 'center',
  },
  {
    title: '传输类型',
    // 没有 cell 的情况下， platform 会被用作自定义单元格的插槽名称
    colKey: 'status',
    width: 120,
    align: 'center',
  },
  {
    colKey: 'taskFrequency',
    title: '任务执行频率(毫秒)',
    align: 'center',
  },
  { colKey: 'createdTime', title: '申请时间', align: 'center' },
  { colKey: 'operates', title: '操作', align: 'center' },
];
const getLists = async () => {
  await getDataSharingList({
    page: pages.current,
    pageSize: pages.pageSize,
    system: id.value,
  }).then((res: any) => {
    data.value = res.list;
    total.value = res.total;
    dataLoading.value = false;
  });
};
const clickReturn = () => {
  Router.push('/system');
};

const gainlists = () => {
  getDataSpecification({
    page: pages.current,
    pageSize: 999,
  }).then((res: any) => {
    Dataspecification.value = res.list;
  });
};

const addClickdatas = (value: any) => {
  status.value = value;
  visible.value = true;
  gainlists();
};
const onSearch = async () => {
  await getDataSharingList({
    page: pages.current,
    pageSize: pages.pageSize,
    taskName: searchValue.value,
  }).then((res) => {
    data.value = res.list;
  });
};
const refresh = () => {
  searchValue.value = '';
  getLists();
};
const editClickdatas = (value: any) => {
  status.value = value;
  visible.value = true;
  gainlists();
};
const deleteClick = (value) => {
  confirmVisible.value = true;
  dataSharedTaskId.value = value.id;
};
const onCancel = () => {
  confirmVisible.value = false;
};
const onConfirmDelete = async () => {
  confirmVisible.value = true;
  await deleteDatas(dataSharedTaskId.value).then((res) => {
    MessagePlugin.success(res.message);
    confirmVisible.value = false;
  });
  getLists();
};
const clickStatus = async (value) => {
  if (value.isOnline) {
    await reviseStatusoff(value.id).then((res) => {
      console.log(res);
    });
  } else {
    await reviseStatuson(value.id).then((res) => {
      console.log(res);
    });
  }
  MessagePlugin.success('修改成功');
  getLists();
};
const rowclick = (value: any) => {
  formData.value = { ...value.row };
};

const onSubmit = async ({ validateResult, firstError }) => {
  if (validateResult === true) {
    await postaddDate({
      system: id.value,
      taskName: formData.value.taskName,
      dataStandardId: formData.value.dataStandardId,
      transmissionType: formData.value.transmissionType,
      taskFrequency: formData.value.taskFrequency,
    }).then((res) => {
      MessagePlugin.success(res.message);
      visible.value = false;
      getLists();
    });
  } else {
    console.log('Errors: ', validateResult);
    MessagePlugin.warning(firstError);
  }
};
watchEffect(() => {
  if (visible.value === false) {
    formData.value = { ...FORMDATA_VALUE };
    form.value?.clearValidate();
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
</script>

<style lang="scss" scoped></style>
