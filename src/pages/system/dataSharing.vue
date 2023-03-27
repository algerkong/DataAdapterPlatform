<template>
  <t-card :bordered="false" hover-shadow>
    <div>
      <t-button @click="clickReturn">返回系统列表</t-button>
      <t-button @click="addClickdatas">新增数据共享</t-button>
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

        <template #operates="">
          <t-button theme="default" variant="text">编辑</t-button>
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
      header="对话框标题"
      body="对话框内容"
      attach="body"
      :confirm-on-enter="true"
      :on-close="close"
      :on-confirm="onConfirmAnother"
    />
  </t-card>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ErrorCircleFilledIcon, CheckCircleFilledIcon, CloseCircleFilledIcon } from 'tdesign-icons-vue-next';
import { BaseTableColumns, MessagePlugin } from 'tdesign-vue-next';
import { getDataSharingList } from '@/api/dataSharing';

const Route = useRoute();
const Router = useRouter();
const total = ref(0);
const id = ref(Route.params.id);
const lists = reactive({
  data: [],
});
const { data } = toRefs(lists);
const pages = reactive({
  current: 1,
  pageSize: 10,
});
const visible = true;
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
  {
    title: '是否在线',
    colKey: 'email',
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

const addClickdatas = () => {
  console.log(111);
};
const onConfirmAnother = () => {
  console.log(111);
};
const close = () => {
  console.log(111);
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
