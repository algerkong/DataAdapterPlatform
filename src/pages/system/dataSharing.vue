<template>
  <t-card :bordered="false" hover-shadow>
    <div>
      <t-button @click="clickReturn">返回系统列表</t-button>
      <t-button @click="addClickdatas(true)">新增数据共享</t-button>
    </div>

    <div style="width: 100%; margin-top: 15px">
      <t-table :data="data" :columns="columns" row-key="property">
        <!-- 插槽方式 自定义单元格：cell 的值为插槽名称，参数有：{col, colIndex, row, rowIndex}  -->
        <template #type-slot-name="{ col, row }">
          {{ row[col.colKey] }}
        </template>

        <!-- 插槽方式 自定义单元格， colKey 的值默认为插槽名称  -->
        <template #status="{ row }">
          <t-tag shape="round" variant="light-outline">
            <check-circle-filled-icon v-if="row.status === 0" />
            <close-circle-filled-icon v-else-if="row.status === 1" />
            <error-circle-filled-icon v-else />
            <!-- {{ statusNameListMap[row.status].label }} -->
          </t-tag>
        </template>

        <template #operates="{ row }">
          <t-button theme="default" variant="text" @click="editClickdatas(false)">
            {{ row.isOnline ? '下线' : '上线' }}
          </t-button>
          <t-button theme="default" variant="text" @click="editClickdatas(false)">编辑</t-button>
          <t-button theme="default" variant="text">删除</t-button>
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

    <t-dialog
      v-model:visible="visible"
      :header="status ? '新增' : '编辑'"
      body="对话框内容"
      attach="body"
      :confirm-on-enter="true"
      :on-close="close"
      :on-confirm="onConfirmAnother"
      width="800px"
    >
      <t-form ref="form" :data="formData" :colon="true" label-align="right" label-width="150px">
        <t-form-item label="数据共享项目名称  " name="taskName">
          <t-input v-model="formData.taskName" placeholder="请输入内容" @enter="onEnter"></t-input>
        </t-form-item>

        <t-form-item label="数据规范" name="college">
          <t-select v-model="formData.dataStandardId" class="demo-select-base" clearable filterable>
            <t-option v-for="item in Dataspecification" :key="item.id" :value="item.id" :label="item.standardName">
              {{ item.standardName }}
            </t-option>
          </t-select>
        </t-form-item>

        <t-form-item label="任务执行频率(毫秒)" name="taskFrequency">
          <t-input v-model="formData.taskFrequency" placeholder="请输入数字" />
        </t-form-item>

        <t-form-item label="推送方式" name="college">
          <t-select v-model="formData.transmissionType" class="demo-select-base" clearable filterable>
            <t-option value="0" label="API推送">API推送</t-option>
            <t-option value="1" label="DB推送">DB推送</t-option>
          </t-select>
        </t-form-item>
      </t-form>
    </t-dialog>
  </t-card>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ErrorCircleFilledIcon, CheckCircleFilledIcon, CloseCircleFilledIcon } from 'tdesign-icons-vue-next';
import { BaseTableColumns, MessagePlugin } from 'tdesign-vue-next';
import { getDataSharingList, getDataSpecification } from '@/api/dataSharing';

const Route = useRoute();
const Router = useRouter();
const total = ref(0);
const id = ref(Route.params.id);
const visible = ref(false);
const status = ref(null);
const Dataspecification = ref([]);
// const formData = reactive({
//   name: '',
// });
const lists = reactive({
  data: [],
  formData: {
    taskName: '',
    dataStandardId: '',
    taskFrequency: '',
    transmissionType: '',
  },
});
const { data, formData } = toRefs(lists);
const pages = reactive({
  current: 1,
  pageSize: 10,
});
const columns: BaseTableColumns = [
  {
    colKey: 'applicant',
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
    title: '推送方式',
    align: 'center',
  },
  { colKey: 'createTime', title: '申请时间', align: 'center' },
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
  });
};
const clickReturn = () => {
  Router.back();
};

const addClickdatas = async (value: any) => {
  status.value = value;
  visible.value = true;
  await getDataSpecification({
    page: pages.current,
    pageSize: 999,
  }).then((res: any) => {
    Dataspecification.value = res.list;
  });
};
const editClickdatas = (value: any) => {
  status.value = value;
};
const onConfirmAnother = () => {
  visible.value = false;
};
const close = () => {
  visible.value = false;
};

const onEnter = (_, { e }) => {
  e.preventDefault();
};

const onPageSizeChange = (size) => {
  console.log('page-size:', size);
  MessagePlugin.success(`pageSize变化为${size}`);
};

const onCurrentChange = (index, pageInfo) => {
  MessagePlugin.success(`转到第${index}页`);
  console.log(pageInfo);
};

getLists();
</script>

<style lang="scss" scoped></style>
