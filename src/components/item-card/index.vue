<template>
  <t-card theme="poster2">
    <template #avatar>
      <t-avatar size="56px">
        <template #icon>
          <shop-icon />
        </template>
      </t-avatar>
    </template>
    <template #status>
      <t-tag :theme="item.isOnline ? 'success' : 'default'" :disabled="!item.isOnline">{{
        item.isOnline ? '已启用' : '已停用'
      }}</t-tag>
    </template>
    <template #content>
      <p class="list-card-item_detail--name">{{ item.systemName }}</p>
      <p class="list-card-item_detail--desc">{{ item.remark }}</p>
    </template>
    <template #footer>
      <t-avatar-group cascading="left-up" :max="2">
        <t-avatar>{{ item.principalName }}</t-avatar>
        <t-avatar
          ><template #icon>
            <add-icon />
          </template>
        </t-avatar>
      </t-avatar-group>
    </template>
    <template #actions>
      <t-dropdown
        trigger="click"
        :options="[
          {
            content: '管理',
            value: 'manage',
            onClick: () => handleClickManage(item),
          },
          {
            content: '删除',
            value: 'delete',
            onClick: () => handleClickDelete(item),
          },
        ]"
      >
        <t-button theme="default" shape="square" variant="text">
          <more-icon />
        </t-button>
      </t-dropdown>
    </template>
  </t-card>
</template>
<script setup lang="ts">
import { onMounted, PropType } from 'vue';
import { ShopIcon, MoreIcon, AddIcon } from 'tdesign-icons-vue-next';
import { SystemModel } from '@/api/model/system';
// eslint-disable-next-line
const props = defineProps({
  item: {
    type: Object as PropType<SystemModel>,
  },
});

onMounted(() => {
  console.log('product', props.item);
});

const emit = defineEmits(['manage-product', 'delete-item']);

const handleClickManage = (product: SystemModel) => {
  emit('manage-product', product);
};

const handleClickDelete = (product: SystemModel) => {
  emit('delete-item', product);
};
</script>

<style lang="less" scoped>
.list-card-item {
  display: flex;
  flex-direction: column;
  cursor: pointer;

  &_detail {
    min-height: 140px;

    &--name {
      margin-bottom: 8px;
      font-size: 16px;
      font-weight: 400;
      color: var(--td-text-color-primary);
    }

    &--desc {
      color: var(--td-text-color-secondary);
      font-size: 12px;
      line-height: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      height: 40px;
    }
  }
}
</style>
