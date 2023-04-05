<template>
  <t-card :bordered="false" hover-shadow>
    <div>
      <t-form ref="form" :data="formlist" :label-width="80" colon @reset="searchReset" @submit="fetchData">
        <t-row>
          <t-col :span="10">
            <t-row :gutter="[24, 24]">
              <t-col :span="3">
                <t-form-item label="任务名称" name="taskName">
                  <t-input
                    v-model="formlist.taskName"
                    class="form-item-content"
                    type="search"
                    placeholder="请输入任务名称"
                    :style="{ minWidth: '134px' }"
                  />
                </t-form-item>
              </t-col>
              <t-col :span="3">
                <t-form-item label="执行频率" name="descripition">
                  <t-input
                    v-model="formlist.taskFrequency"
                    class="form-item-content"
                    placeholder="请输入任务执行频率(毫秒)"
                    :style="{ minWidth: '134px' }"
                  />
                </t-form-item>
              </t-col>
              <t-col :span="3">
                <t-form-item label="数据标准" name="standardName">
                  <t-input
                    v-model="formlist.standardName"
                    class="form-item-content"
                    placeholder="请输入数据标准"
                    :style="{ minWidth: '134px' }"
                  />
                </t-form-item>
              </t-col>
              <t-col :span="3">
                <t-form-item label="传输模式" name="status">
                  <t-select
                    v-model="formlist.status"
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
            <t-button theme="primary" type="submit" :style="{ marginLeft: 'var(--td-comp-margin-s)' }"> 查询 </t-button>
            <t-button type="reset" variant="base" theme="default"> 重置 </t-button>
          </t-col>
        </t-row>
      </t-form>
    </div>

    <div style="margin-top: 30px">
      <div>
        <!-- <t-button @click="clickReturn">返回系统列表</t-button> -->
        <t-button @click="addClickdatas(true)">新增数据共享</t-button>
      </div>
    </div>

    <div style="width: 100%; margin-top: 15px">
      <t-table :data="data" :columns="columns" row-key="property" :loading="dataLoading" stripe @row-click="rowclick">
        <!-- 插槽方式 自定义单元格， colKey 的值默认为插槽名称  -->
        <template #status="{ row }">
          <t-tag theme="primary" variant="light">
            {{ +row.transmissionType ? 'DB推送' : 'API推送' }}
          </t-tag>
        </template>

        <template #operates="{ row }">
          <t-popconfirm :content="row.isOnline ? '确认下线吗' : '确认上线吗'" @confirm="clickStatus(row)">
            <t-button theme="primary" variant="text">
              {{ row.isOnline ? '下线' : '上线' }}
            </t-button>
          </t-popconfirm>
          <t-button theme="primary" variant="text" @click="editClickdatas(false)">编辑</t-button>
          <t-button theme="primary" variant="text" @click="deleteClick">删除</t-button>
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

        <t-form-item label="数据规范" name="moduleId">
          <t-select
            v-model="formData.moduleId"
            class="demo-select-base"
            placeholder="请先选择模块名称"
            @change="selectModele"
          >
            <t-option value="0" label="模块1"></t-option>
            <t-option value="1" label="模块2"></t-option>
            <t-option value="2" label="模块3"></t-option>
          </t-select>

          <t-select
            v-model="formData.dataStandardId"
            class="demo-select-base"
            placeholder="对应选择模块下的数据规范"
            @change="selectLists"
          >
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
</template>

<script setup lang="ts">
import { ref, reactive, toRefs, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { BaseTableColumns, FormRule, MessagePlugin } from 'tdesign-vue-next';
import { TRANSMISSON_MODE } from '../dataStandard/constants';
import {
  getDataSharingList,
  getDataSpecification,
  postaddDate,
  reviseStatuson,
  reviseStatusoff,
  deleteDatas,
  reviseDates,
} from '@/api/dataSharing';

const Route = useRoute();
const form = ref(null);
const total = ref(0);
const id = ref(Route.params.id);
const dataSharedTaskId = ref('');
const visible = ref(false);
const confirmVisible = ref(false);
const status = ref(null);
const Dataspecification = ref([]);
const dataLoading = ref(true);
const FORMDATA_VALUE = {
  taskName: '',
  dataStandardId: '',
  taskFrequency: '',
  transmissionType: '',
  moduleId: '',
};
const lists = reactive({
  data: [],
  formData: { ...FORMDATA_VALUE },
});
const { data, formData } = toRefs(lists);

const searchForm = {
  taskName: '',
  taskFrequency: '',
  standardName: '',
  status: '',
};

const formlist = ref({ ...searchForm });
const pages = reactive({
  current: 1,
  pageSize: 10,
});
const rules: Record<string, FormRule[]> = {
  taskName: [{ required: true, message: '请输入数据共享名称', type: 'error', trigger: 'blur' }],
  taskFrequency: [{ required: true, message: '请输入执行任务毫秒', type: 'error', trigger: 'blur' }],
  moduleId: [{ required: true, message: '请选择模块', type: 'error', trigger: 'blur' }],
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
    align: 'center',
  },
  {
    title: '传输类型',
    // 没有 cell 的情况下， platform 会被用作自定义单元格的插槽名称
    colKey: 'status',
    align: 'center',
  },
  {
    colKey: 'taskFrequency',
    title: '任务执行频率(毫秒)',
    align: 'center',
  },
  {
    colKey: 'dataStandardId.standardName',
    title: '数据标准',
    align: 'center',
  },
  { colKey: 'createdTime', title: '申请时间', align: 'center' },
  { colKey: 'updatedTime', title: '修改时间', align: 'center' },
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
// const clickReturn = () => {
//   Router.push('/system');
// };

const addClickdatas = (value: any) => {
  status.value = value;
  visible.value = true;
};
const fetchData = async () => {
  dataLoading.value = true;
  await getDataSharingList({
    page: pages.current,
    pageSize: pages.pageSize,
    taskName: formlist.value.taskName,
    taskFrequency: formlist.value.taskFrequency,
    standardName: formlist.value.standardName,
    isOnline: formlist.value.status,
  }).then((res) => {
    data.value = res.list;
    dataLoading.value = false;
  });
};
const searchReset = () => {
  formlist.value = { ...searchForm };
  getLists();
};
const editClickdatas = (value: any) => {
  status.value = value;
  visible.value = true;
};
const selectModele = async (value: any) => {
  if (value) {
    formData.value.dataStandardId = '';
  }
  await getDataSpecification({
    page: pages.current,
    pageSize: 999,
    moduleId: value,
  }).then((res: any) => {
    Dataspecification.value = res.list;
  });
};

const selectLists = (e) => {
  console.log('编辑', 1111);

  Dataspecification.value.forEach((element) => {
    if (element.id === e) {
      formData.value.moduleId = element.moduleId;
    }
  });
};

const dataSpecificationLists = () => {
  getDataSpecification({
    page: pages.current,
    pageSize: 999,
  }).then((res: any) => {
    Dataspecification.value = res.list;
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
  await deleteDatas(dataSharedTaskId.value).then((res) => {
    MessagePlugin.success(res.message);
    confirmVisible.value = false;
    getLists();
  });
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
  if (!status.value) {
    formData.value = { ...value.row };
    formData.value.dataStandardId = value.row.dataStandardId.standardName;
    formData.value.moduleId = value.row.dataStandardId.moduleId;

    // formData.value.moduleId = value.row.dataSharedTaskId.moduleId;
  }
  dataSharedTaskId.value = value.row.id;
};
const onSubmit = async ({ validateResult, firstError }) => {
  if (validateResult === true) {
    if (status.value) {
      await postaddDate({
        system: id.value,
        taskName: formData.value.taskName,
        dataStandardId: formData.value.dataStandardId,
        transmissionType: formData.value.transmissionType,
        taskFrequency: formData.value.taskFrequency,
        moduleId: formData.value.moduleId,
      }).then((res) => {
        MessagePlugin.success(res.message);
        visible.value = false;
        getLists();
      });
    } else {
      await reviseDates(dataSharedTaskId.value, {
        taskName: formData.value.taskName,
        dataStandardId: formData.value.dataStandardId,
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
    formData.value = { ...FORMDATA_VALUE };
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
</script>

<style lang="scss" scoped></style>
