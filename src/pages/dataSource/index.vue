<template>
  <div class="list-common-table">
    <t-form ref="form" :model="searchFormData" :label-width="120" colon @reset="searchReset" @submit="fetchData">
      <t-row>
        <t-col :span="10">
          <t-row>
            <t-col :span="3">
              <t-form-item label="数据源名称" name="name">
                <t-input v-model="searchFormData.name" placeholder="请输入数据源名称" />
              </t-form-item>
            </t-col>
            <t-col :span="3">
              <t-form-item label="数据源地址" name="url">
                <t-input v-model="searchFormData.url" placeholder="请输入数据源地址" />
              </t-form-item>
            </t-col>
            <t-col :span="3">
              <t-form-item label="数据源表名" name="table">
                <t-input v-model="searchFormData.table" placeholder="请输入数据源表名" />
              </t-form-item>
            </t-col>
            <t-col :span="3">
              <t-form-item label="数据源用户名" name="username">
                <t-input v-model="searchFormData.username" placeholder="请输入数据源用户名" />
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
        <t-button @click="toAdd">新建数据源</t-button>
      </div>

      <t-table
        :data="data"
        :columns="DATA_SOURCE_COLUMNS"
        :row-key="rowKey"
        :vertical-align="verticalAlign"
        :hover="hover"
        :loading="dataLoading"
      >
        <template #op="{ row }">
          <t-button theme="primary" size="small" @click="handleClickEdit({ row })"> 编辑 </t-button>
          <t-button theme="danger" size="small" @click="handleClickDelete({ row })"> 删除 </t-button>
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

      <t-dialog v-model:visible="addVisible" :header="dialogTitle" :width="600" :footer="false" destroy-on-close>
        <t-form
          ref="addForm"
          :data="formData"
          :label-width="120"
          colon
          :rules="DATA_SOURCE_FORM_RULES"
          @submit="onConfirmAdd"
        >
          <t-form-item label="数据源名称" name="name">
            <t-input v-model="formData.name" placeholder="请输入数据源名称" />
          </t-form-item>
          <t-form-item label="数据库名称" name="database">
            <t-input v-model="formData.database" placeholder="请输入数据库名称" />
          </t-form-item>
          <t-form-item label="数据源表名" name="table">
            <t-input v-model="formData.table" placeholder="请输入数据源表名" />
          </t-form-item>

          <t-form-item label="数据源地址" name="url">
            <t-input v-model="formData.url" placeholder="请输入数据源地址" />
          </t-form-item>

          <t-form-item label="数据源端口" name="port">
            <t-input v-model="formData.port" placeholder="请输入数据源端口" />
          </t-form-item>

          <t-form-item label="数据源密码" name="password">
            <t-input v-model="formData.password" placeholder="请输入数据源密码" />
          </t-form-item>

          <t-form-item label="数据源用户名" name="username">
            <t-input v-model="formData.username" placeholder="请输入数据源用户名" />
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
import { DATA_SOURCE_COLUMNS, DATA_SOURCE_FORM, DATA_SOURCE_FORM_RULES } from './constants';
import { DataSourceModel } from '@/api/model/dataSourceModel';
import { getDataSourceList, delDataSource, editDataSource, addDataSource } from '@/api/dataSource';

// 搜索
const searchFormData = ref({ ...DATA_SOURCE_FORM });

// 新增编辑
const addVisible = ref(false);
const formData = ref<DataSourceModel>({ ...DATA_SOURCE_FORM });
const addForm = ref<FormInstanceFunctions>(null);

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
    const search = { ...searchFormData.value };
    const { list, total } = await getDataSourceList({
      page,
      pageSize,
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
  searchFormData.value = { ...DATA_SOURCE_FORM };
  fetchData();
};

onMounted(() => {
  fetchData();
});

const handleClickDelete = async ({ row }) => {
  const dialog = DialogPlugin.confirm({
    header: '确认删除当前所选数据源？',
    body: '删除后将无法恢复',
    onConfirm: async () => {
      try {
        await delDataSource(row.id);
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
  return isEdit.value ? '编辑数据源' : '新增数据源';
});

const handleClickEdit = async ({ row }) => {
  addVisible.value = true;
  formData.value = { ...row };
};

watch(addVisible, (newVal) => {
  if (!newVal) {
    formData.value = { ...DATA_SOURCE_FORM };
    addForm.value?.clearValidate();
  }
});

const onConfirmAdd = async ({ firstError }: SubmitContext<Data>) => {
  console.log('isEdit.value', isEdit.value);
  console.log('formData.value', formData.value);
  if (firstError) {
    MessagePlugin.warning(firstError);
    return;
  }
  try {
    const params = {
      ...formData.value,
    };
    if (isEdit.value) {
      delete params.id;
      await editDataSource(formData.value.id, params);
      MessagePlugin.success('编辑成功');
    } else {
      await addDataSource(params);
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

<style scoped lang="less">
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
