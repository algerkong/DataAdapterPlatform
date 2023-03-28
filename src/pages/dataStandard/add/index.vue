<template>
  <div>
    <div class="form-step-container">
      <div class="text-lg text-gray-700">{{ dataStandard?.standardName }} - 数据结构</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getDataStandard } from '@/api/dataStandard';
import { dataStandardModel } from '@/api/model/dataStandardModel';

const router = useRouter();
const {
  params: { id },
} = router.currentRoute.value;

const dataStandard = ref<dataStandardModel>();
const getData = async () => {
  dataStandard.value = await getDataStandard(id as string);
  console.log('dataStandard.value', dataStandard.value);
};

onMounted(() => {
  getData();
});
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
