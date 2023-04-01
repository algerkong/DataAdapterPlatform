<template>
  <div class="list-common-table">
    <t-form ref="form" :data="searchFormData" :label-width="100" colon @reset="searchReset" @submit="fetchData">
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[24, 24]">
            <t-col :span="3">
              <t-form-item label="配置类型" name="apiName">
                <t-select
                  v-model="searchFormData.configType"
                  style="display: inline-block"
                  class="form-item-content"
                  :options="API_CONFIG_CONFIG_TYPE"
                  placeholder="请选择请求方式"
                />
              </t-form-item>
            </t-col>
            <t-col :span="3">
              <t-form-item label="配置项key" name="url">
                <t-input
                  v-model="searchFormData.key"
                  class="form-item-content"
                  placeholder="请输入配置项key"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :span="3">
              <t-form-item label="配置项value" name="url">
                <t-input
                  v-model="searchFormData.value"
                  class="form-item-content"
                  placeholder="请输入配置项value"
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
      <div class="mt-4">
        <t-button @click="toAdd">新建API配置项</t-button>
      </div>

      <t-table
        :data="data"
        :columns="API_CONFIG_COLUMNS"
        :row-key="rowKey"
        table-layout="auto"
        :vertical-align="verticalAlign"
        :hover="hover"
        :stripe="true"
        :loading="dataLoading"
      >
        <template #op="slotProps">
          <div class="flex flex-wrap">
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

      <t-dialog v-model:visible="addVisible" :header="dialogTitle" width="600px" :footer="false" destroy-on-close>
        <t-form
          ref="addForm"
          :data="formData"
          :label-width="120"
          colon
          :rules="API_CONFIG_FORM_RULES"
          @submit="onConfirmAdd"
        >
          <t-form-item label="配置类型" name="configType">
            <t-select
              v-model="formData.configType"
              style="display: inline-block"
              class="form-item-content"
              :options="API_CONFIG_CONFIG_TYPE"
              placeholder="请选择配置类型"
            />
          </t-form-item>
          <t-form-item label="配置项key" name="key">
            <t-input v-model="formData.key" class="form-item-content" placeholder="请输入配置项key" />
          </t-form-item>
          <t-form-item label="配置项value" name="value">
            <t-input v-model="formData.value" class="form-item-content" placeholder="请输入配置项value" />
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
import { useRoute } from 'vue-router';
import { getApiConfigList, addApiConfig, editApiConfig, delApiConfig } from '@/api/apiConfig';
import { API_CONFIG_CONFIG_TYPE, API_CONFIG_FORM, API_CONFIG_COLUMNS, API_CONFIG_FORM_RULES } from './constants';
import { ApiConfigModel } from '@/api/model/apiConfigModel';

// 搜索
const searchFormData = ref({ ...API_CONFIG_FORM });

// 新增编辑
const addVisible = ref(false);
const formData = ref<ApiConfigModel>({ ...API_CONFIG_FORM });
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

const route = useRoute();
const { id } = route.params as { id: string };

const data = ref([]);
const dataLoading = ref(false);
const fetchData = async () => {
  dataLoading.value = true;
  try {
    const { page, pageSize } = pagination.value;
    const search = { ...searchFormData.value };
    const { list, total } = await getApiConfigList({
      page,
      pageSize,
      transmissionModeId: id || '',
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
  searchFormData.value = { ...API_CONFIG_FORM };
  fetchData();
};

onMounted(() => {
  fetchData();
});

const handleClickDelete = async ({ row }) => {
  const dialog = DialogPlugin.confirm({
    header: '确认删除当前所选API配置项？',
    body: '删除后将无法恢复',
    onConfirm: async () => {
      try {
        await delApiConfig(row.id);
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
  return isEdit.value ? '编辑API配置项' : '新增API配置项';
});

const handleClickEdit = async ({ row }) => {
  addVisible.value = true;
  formData.value = { ...row };
};

watch(addVisible, (newVal) => {
  if (!newVal) {
    formData.value = { ...API_CONFIG_FORM };
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
      ...formData.value,
      transmissionModeId: id,
    };
    if (isEdit.value) {
      delete params.id;
      await editApiConfig(formData.value.id, params);
      MessagePlugin.success('编辑成功');
    } else {
      await addApiConfig(params);
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
</style>
