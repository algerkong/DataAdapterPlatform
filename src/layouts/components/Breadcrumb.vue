<template>
  <t-breadcrumb :max-item-width="'150'" class="tdesign-breadcrumb">
    <t-breadcrumbItem v-for="item in crumbs" :key="item.to" :to="item.to">
      {{ item.title }}
    </t-breadcrumbItem>
    <t-breadcrumbItem v-if="!route.meta?.notBack" @click="router.back()"> 返回 </t-breadcrumbItem>
  </t-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const crumbs = computed(() => {
  const pathArray = route.path.split('/');
  pathArray.shift();

  const breadcrumbs = pathArray.reduce((breadcrumbArray, path, idx) => {
    // 如果路由下有hiddenBreadcrumb或当前遍历到参数则隐藏
    if (route.matched[idx]?.meta?.hiddenBreadcrumb || Object.values(route.params).includes(path)) {
      return breadcrumbArray;
    }

    breadcrumbArray.push({
      path,
      to: breadcrumbArray[idx - 1] ? `/${breadcrumbArray[idx - 1].path}/${path}` : `/${path}`,
      title: route.matched[idx]?.meta?.title ?? path,
    });
    return breadcrumbArray;
  }, []);
  return breadcrumbs;
});
</script>
<style scoped>
.tdesign-breadcrumb {
  margin-bottom: 24px;
}
</style>
