<template>
  <div>
    <div class="form-step-container">
      <!-- 简单步骤条 -->
      <t-card :bordered="false">
        <t-steps class="step-container" :current="1" status="process">
          <t-step-item title="提交申请" content="已于12月21日提交" />
          <t-step-item title="电子信息" content="预计1-3个工作日" />
          <t-step-item title="发票已邮寄" content="电子发票开出后联系" />
          <t-step-item title="完成申请" content="如有疑问联系客服" />
        </t-steps>
      </t-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getDataStandard } from '@/api/dataStandard';

const router = useRouter();
const {
  params: { id },
} = router.currentRoute.value;

const dataStandard = ref({});
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
