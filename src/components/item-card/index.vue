<template>
  <t-card theme="poster2">
    <template #avatar>
      <div
        class="rounded-full bg-blue-100 flex justify-center items-center ring-4 overflow-hidden"
        style="width: 60px; height: 60px"
      >
        <img
          v-if="systemItem.systemIcon"
          class="w-full h-full"
          :src="`${proxy.baseUrl}/images/${systemItem.systemIcon}`"
        />
        <shop-icon v-else class="text-gray-400 text-3xl" />
      </div>
    </template>
    <template #status>
      <t-popconfirm :content="systemItem.isOnline ? '确认停用吗' : '确认启用吗'" @confirm="clickOnline">
        <t-tag v-if="systemItem.isOnline" theme="success">已启用</t-tag>
        <t-tag v-else theme="primary" variant="outline">已停用</t-tag>
      </t-popconfirm>
    </template>
    <template #content>
      <p class="list-card-item_detail--name">{{ systemItem.systemName }}</p>
      <p class="list-card-item_detail--desc">{{ systemItem.remark }}</p>
    </template>
    <template #footer>
      <div class="flex justify-between items-center">
        <t-avatar-group cascading="left-up" :max="2">
          <t-avatar>{{ systemItem.principalName }}</t-avatar>
        </t-avatar-group>
        <div>
          <t-button size="small" ghost @click.stop="toDataShare">数据共享</t-button>
        </div>
      </div>
    </template>
    <template #actions>
      <t-dropdown trigger="click" :options="dropdownOptions">
        <t-button theme="default" shape="square" variant="text" @click.stop>
          <more-icon />
        </t-button>
      </t-dropdown>
    </template>
  </t-card>
</template>
<script setup lang="ts">
import { MessagePlugin } from 'tdesign-vue-next';
import { PropType, ref, watchEffect } from 'vue';
import { ShopIcon, MoreIcon } from 'tdesign-icons-vue-next';
import { useRouter } from 'vue-router';
import { SystemModel } from '@/api/model/system';
import { systemOn, systemOff } from '@/api/system';
import proxy from '@/config/proxy';

const props = defineProps({
  item: {
    type: Object as PropType<SystemModel>,
  },
});

const systemItem = ref<SystemModel>(null);
watchEffect(() => {
  systemItem.value = props.item;
});

const dropdownOptions = ref([
  {
    content: '管理',
    value: 'manage',
    onClick: () => handleClickManage(),
  },
  {
    content: '删除',
    value: 'delete',
    onClick: () => handleClickDelete(),
  },
]);
const emit = defineEmits(['manage-product', 'delete-item', 'item-click', 'refresh']);

const handleClickManage = () => {
  emit('manage-product', props.item);
};

const handleClickDelete = () => {
  if (systemItem.value.isOnline) {
    MessagePlugin.error('请先停用该系统');
    return;
  }
  emit('delete-item', props.item);
};

const clickOnline = async () => {
  const { isOnline, id } = systemItem.value;
  if (isOnline) {
    await systemOff(id);
    MessagePlugin.success('停用成功');
  } else {
    await systemOn(id);
    MessagePlugin.success('启用成功');
  }
  emit('refresh');
};

const Router = useRouter();

const toDataShare = () => {
  Router.push({
    path: `/system/dataShare/${props.item.id}`,
  });
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
