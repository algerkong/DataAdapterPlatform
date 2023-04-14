<template>
  <div class="list-common-table">
    <t-form ref="form" :data="formData" :label-width="80" colon @reset="searchReset" @submit="fetchData">
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[24, 24]">
            <t-col :span="3">
              <t-form-item label="标准名称" name="standardName">
                <t-input
                  v-model="formData.standardName"
                  class="form-item-content"
                  type="search"
                  placeholder="请输入数据标准名称"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :span="3">
              <t-form-item label="标准详情" name="descripition">
                <t-input
                  v-model="formData.descripition"
                  class="form-item-content"
                  placeholder="请输入标准详情"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :span="3">
              <t-form-item label="模块ID" name="moduleId">
                <t-input
                  v-model="formData.moduleId"
                  class="form-item-content"
                  placeholder="请输入模块ID"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :span="3">
              <t-form-item label="传输模式" name="moduleId">
                <t-select
                  v-model="formData.transmissionMode"
                  style="display: inline-block"
                  class="form-item-content"
                  :options="CONTRACT_TYPE_OPTIONS"
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

    <div class="table-container">
      <div class="mt-4">
        <t-button @click="toAdd">新建标准</t-button>
      </div>

      <t-table
        :data="data"
        :columns="COLUMNS"
        :row-key="rowKey"
        table-layout="auto"
        :vertical-align="verticalAlign"
        :hover="hover"
        :stripe="true"
        :loading="dataLoading"
      >
        <template #moduleId="slotProps">
          <t-tag theme="success" variant="light">{{
            MODULE.find((item) => item.value == slotProps.row.moduleId)?.label
          }}</t-tag>
        </template>

        <template #transmissionMode="slotProps">
          <t-tag theme="primary" variant="light">
            {{ TRANSMISSON_MODE.find((item) => item.value == slotProps.row.transmissionMode)?.label }}
          </t-tag>
        </template>
        <template #op="slotProps">
          <div class="flex flex-wrap">
            <a class="t-button-link" @click="handleClickOp(slotProps)">数据结构</a>
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

      <t-dialog v-model:visible="addVisible" :header="dialogTitle" width="600px" :footer="false">
        <t-form
          ref="addForm"
          :data="addFormData"
          :label-width="80"
          colon
          :rules="ADD_FROM_RULES"
          @submit="onConfirmAdd"
        >
          <t-form-item label="标准名称" name="standardName">
            <t-input
              v-model="addFormData.standardName"
              class="form-item-content"
              type="search"
              placeholder="请输入数据标准名称"
              :style="{ minWidth: '134px' }"
            />
          </t-form-item>
          <t-form-item label="标准详情" name="descripition">
            <t-textarea
              v-model="addFormData.descripition"
              class="form-item-content"
              placeholder="请输入标准详情"
              :style="{ minWidth: '134px' }"
            ></t-textarea>
          </t-form-item>
          <t-form-item label="功能模块" name="moduleId">
            <t-select
              v-model="addFormData.moduleId"
              style="display: inline-block"
              class="form-item-content"
              :options="MODULE"
              placeholder="请选择功能模块"
            />
          </t-form-item>
          <t-form-item label="传输模式" name="moduleId">
            <t-select
              v-model="addFormData.transmissionMode"
              style="display: inline-block"
              class="form-item-content"
              :options="TRANSMISSON_MODE"
              placeholder="请选择传输模式"
            />
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
import { ref, computed, onMounted, watchEffect } from 'vue';
import { Data, DialogPlugin, FormInstanceFunctions, MessagePlugin, SubmitContext } from 'tdesign-vue-next';
import { useRouter } from 'vue-router';

import { CONTRACT_TYPE_OPTIONS } from '@/constants';
import { addDataStandard, delDataStandard, getDataStandardList, editDataStandard } from '@/api/dataStandard';
import { DataStandardModel } from '@/api/model/dataStandardModel';
import { ADD_FORM, ADD_FROM_RULES, TRANSMISSON_MODE, MODULE, COLUMNS } from './constants';

const router = useRouter();

const searchForm = {
  standardName: '',
  descripition: '',
  moduleId: '',
  transmissionMode: '',
};

const formData = ref({ ...searchForm });
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

const data = ref([]);

const dataLoading = ref(false);
const fetchData = async () => {
  dataLoading.value = true;
  try {
    const { page, pageSize } = pagination.value;
    const { list, total } = await getDataStandardList({
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

onMounted(() => {
  fetchData();
});

const handleClickDelete = async ({ row }) => {
  const dialog = DialogPlugin.confirm({
    header: '确认删除当前所选标准？',
    body: '删除后将无法恢复',
    onConfirm: async () => {
      try {
        await delDataStandard(row.id);
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
  return !!addFormData.value.id;
});

const dialogTitle = computed(() => {
  return isEdit.value ? '编辑数据标准' : '新增数据标准';
});

const handleClickEdit = async ({ row }) => {
  addVisible.value = true;
  addFormData.value = { ...row };
};

const handleClickOp = ({ row }) => {
  router.push({
    path: `/dataStandard/add/${row.id}`,
  });
};

const addVisible = ref(false);
const addFormData = ref<DataStandardModel>({ ...ADD_FORM });
const addForm = ref<FormInstanceFunctions>(null);
watchEffect(() => {
  if (!addVisible.value) {
    addFormData.value = { ...ADD_FORM };
    addForm.value?.clearValidate();
  }
});

const onConfirmAdd = async ({ firstError }: SubmitContext<Data>) => {
  if (firstError) {
    MessagePlugin.warning(firstError);
    return;
  }
  try {
    const params = {
      ...addFormData.value,
    };
    if (isEdit.value) {
      delete params.id;
      await editDataStandard(addFormData.value.id, params);
      MessagePlugin.success('编辑成功');
    } else {
      await addDataStandard(addFormData.value);
      MessagePlugin.success('添加成功');
    }
    fetchData();
  } catch (error) {
    MessagePlugin.error('操作错误');
  } finally {
    addVisible.value = false;
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
</style>
