<template>
  <div>
    <div class="list-card-operation">
      <t-button @click="handleAddSystem"> 新建系统 </t-button>
      <div class="search-input">
        <t-input v-model="searchValue" placeholder="请输入你需要搜索的内容" clearable>
          <template #suffix-icon>
            <search-icon v-if="searchValue === ''" size="var(--td-comp-size-xxxs)" />
          </template>
        </t-input>
      </div>
    </div>

    <dialog-form v-model:visible="formDialogVisible" :is-edit="isEdit" :data="formData" @change="fetchData" />

    <template v-if="pagination.total > 0 && !dataLoading">
      <div class="list-card-items">
        <t-row :gutter="[16, 16]">
          <t-col
            v-for="system in systemList.slice(
              pagination.pageSize * (pagination.page - 1),
              pagination.pageSize * pagination.page,
            )"
            :key="system.index"
            :lg="4"
            :xs="6"
            :xl="3"
          >
            <item-card
              class="list-card-item"
              :item="system"
              @delete-item="handleDeleteItem"
              @manage-product="handleManageProduct"
            />
          </t-col>
        </t-row>
      </div>
      <div class="list-card-pagination">
        <t-pagination
          v-model="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-size-options="[12, 24, 36]"
          @page-size-change="onPageSizeChange"
          @current-change="onCurrentChange"
        />
      </div>
    </template>

    <div v-else-if="dataLoading" class="list-card-loading">
      <t-loading size="large" text="加载数据中..." />
    </div>

    <t-dialog
      v-model:visible="confirmVisible"
      header="确认删除所选系统？"
      :body="confirmBody"
      :on-cancel="onCancel"
      @confirm="onConfirmDelete"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'ListCard',
};
</script>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { SearchIcon } from 'tdesign-icons-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import ItemCard from '@/components/item-card/index.vue';
import DialogForm from './components/DialogForm.vue';
import { delSystem, getSystemList } from '@/api/system';
import { SystemModel } from '@/api/model/system';

const pagination = ref({ page: 1, pageSize: 12, total: 0 });
const deleteSystem = ref(undefined);

const systemList = ref([]);
const dataLoading = ref(true);
const isEdit = ref(false);

const fetchData = async () => {
  try {
    const { page, pageSize } = pagination.value;
    const { list, total } = await getSystemList({ page, pageSize });
    systemList.value = list;
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

const confirmBody = computed(() =>
  deleteSystem.value ? `确认删除后${deleteSystem.value.name}的所有系统信息将被清空, 且无法恢复` : '',
);

onMounted(() => {
  fetchData();
});

const formDialogVisible = ref(false);
const searchValue = ref('');
const confirmVisible = ref(false);
const formData = ref<SystemModel>(null);

const onPageSizeChange = (size: number) => {
  pagination.value.pageSize = size;
  pagination.value.page = 1;
};
const onCurrentChange = (page: number) => {
  pagination.value.page = page;
};
const handleDeleteItem = (product) => {
  confirmVisible.value = true;
  deleteSystem.value = product;
};
const onConfirmDelete = async () => {
  await delSystem(deleteSystem.value.id);
  MessagePlugin.success('删除成功');
  fetchData();
};
const onCancel = () => {
  deleteSystem.value = undefined;
  formData.value = null;
};
const handleAddSystem = () => {
  isEdit.value = false;
  formDialogVisible.value = true;
};
const handleManageProduct = (system) => {
  isEdit.value = true;
  formDialogVisible.value = true;
  formData.value = { ...system };
};
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>