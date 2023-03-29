<template>
  <div>
    <div class="form-step-container">
      <div class="text-lg text-gray-700">{{ dataStandard?.standardName }} - 数据结构 - 列表</div>
      <div>
        <t-table
          :data="data"
          :columns="DATA_STRUCTURE_COLUMN"
          row-key="id"
          tableLayout="auto"
          vertical-align="top"
          :hover="true"
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
      </div>
    </div>

    <div class="form-step-container mt-4">
      <div class="text-lg text-gray-700">{{ dataStandard?.standardName }} - 数据结构 - 添加</div>
      <div>
        <t-table
          :data="data"
          :columns="DATA_STRUCTURE_COLUMN"
          row-key="id"
          tableLayout="auto"
          vertical-align="top"
          :hover="true"
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getDataStandard } from '@/api/dataStandard';
import { getDataStructureList } from '@/api/dataStructure';
import { dataStandardModel } from '@/api/model/dataStandardModel';
import { DATA_STRUCTURE_COLUMN, ADD_DATA_STRUCTURE_RULES, ADD_DATA_STRUCTURE_FROM } from './constants';
import { dataStructureModel } from '@/api/model/dataStructureModel';
const router = useRouter();
const {
  params: { id },
} = router.currentRoute.value;

const dataLoading = ref(false);

const pagenation = ref({
  page: 1,
  pageSize: 10,
  total: 0,
});

const dataStandard = ref<dataStandardModel>();
const data = ref<Array<dataStructureModel>>([]);
const getData = async () => {
  dataLoading.value = true;
  try {
    dataStandard.value = await getDataStandard(id as string);
    const { page, pageSize } = pagenation.value;
    const { list, total } = await getDataStructureList({
      page,
      pageSize,
    });
    data.value = list;
    pagenation.value.total = total;
  } catch (error) {
    console.log(error);
  } finally {
    dataLoading.value = false;
  }
};

onMounted(() => {
  getData();
});

const handleClickDelete = async ({ row }) => {};

const handleClickEdit = async ({ row }) => {};
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
