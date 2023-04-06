<template>
  <div>
    <vxe-table
      ref="xTable"
      show-overflow
      keep-source
      :row-config="{ keyField: 'id' }"
      :column-config="{ resizable: true }"
      :print-config="{}"
      :export-config="{}"
      :loading="treeData.loading"
      :tree-config="treeData.treeConfig"
      :edit-config="{ trigger: 'click', mode: 'row', showStatus: true }"
      :data="treeData.tableData"
      height="200px"
    >
      <vxe-column tree-node width="60px"></vxe-column>
      <vxe-column field="fieldName" title="字段名" :edit-render="{}" width="150px">
        <template #edit="{ row }">
          <vxe-input
            v-model="row.fieldName"
            type="text"
            placeholder="请输入字段名"
            :disabled="row.id === 10000"
          ></vxe-input>
        </template>
      </vxe-column>
      <vxe-column field="defaultValue" title="默认值" :edit-render="{}" width="150px">
        <template #edit="{ row }">
          <vxe-input
            v-model="row.defaultValue"
            type="text"
            placeholder="请输入默认值"
            :disabled="row.id === 10000"
          ></vxe-input>
        </template>
      </vxe-column>
      <vxe-column field="type" title="类型" :edit-render="{}" width="150px">
        <template #edit="{ row }">
          <vxe-select v-model="row.type" :disabled="row.id === 10000" clearable placeholder="请选择类型">
            <vxe-option value="string" label="string"></vxe-option>
            <vxe-option value="boolean" label="boolean"></vxe-option>
            <vxe-option value="array" label="array"></vxe-option>
            <vxe-option value="object" label="object"></vxe-option>
            <vxe-option value="number" label="number"></vxe-option>
          </vxe-select>
        </template>
      </vxe-column>
      <vxe-column field="explain" title="说明" :edit-render="{}" width="150px">
        <template #edit="{ row }">
          <vxe-textarea v-model="row.explain" :disabled="row.id === 10000" placeholder="请输入说明"></vxe-textarea>
        </template>
      </vxe-column>
      <vxe-column title="操作" width="300px">
        <template #default="{ row }">
          <vxe-button
            v-if="row.type === 'object' || row.id === 10000"
            type="text"
            status="primary"
            @click="insertRow(row, 'top')"
            >添加</vxe-button
          >
          <vxe-button type="text" status="primary" @click="removeRow(row)">删除</vxe-button>
        </template>
      </vxe-column>
    </vxe-table>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, defineProps, onMounted } from 'vue';
import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table';

const treeData = ref({
  loading: false,
  tableData: [
    {
      id: 10000,
      parentId: null,
      fieldName: '根节点',
      type: 'Object',
      defaultValue: 'mock',
      explain: '说明',
      children: [],
    },
  ] as any[],
  treeConfig: {
    transform: true,
    rowField: 'id',
    parentField: 'parentId',
  },
});

const xTable = ref<VxeTableInstance>();
const xToolbar = ref<VxeToolbarInstance>();

const props = defineProps({
  value: {
    type: Object,
  },
});

// watch(
//   () => props.value,
//   (newProps) => {
//     console.log(newProps);
//   },
//   { deep: true },
// );
onMounted(() => {
  if (props.value !== null) {
    setTimeout(() => {
      props.value.forEach((element) => {
        insertRow(element, false, 10000);
      });
    }, 200);
  }
});

const findList = () => {
  treeData.value.loading = true;
  // setTimeout(() => {
  //   treeData.value.tableData = [
  //     {
  //       id: 10000,
  //       parentId: null,
  //       fieldName: '根节点',
  //       type: 'Object',
  //       defaultValue: 'mock',
  //       explain: '说明',
  //       children: props.value,
  //     },
  //   ];
  //   console.log('11111', treeData.value.tableData);
  //   console.log('props', props.value);
  // }, 200);

  treeData.value.loading = false;
};

const insertRow = async (currRow: any, locat: string, id) => {
  const $table = xTable.value;
  // 如果 null 则插入到目标节点顶部
  // 如果 -1 则插入到目标节点底部
  // 如果 row 则有插入到效的目标节点该行的位置// 插入子节点
  if (locat === 'top') {
    const record = {
      fieldName: '',
      id: Date.now(),
      parentId: currRow.id,
      type: '',
      defaultValue: '',
      explain: '',
    };
    const { row: newRow } = await $table.insert(record);
    await $table.setTreeExpand(currRow, true); // 将父节点展开
    await $table.setEditRow(newRow); // 插入子节点
  } else if (id) {
    const record = {
      parentId: id,
      ...currRow,
    };
    const { row: newRow } = await $table.insert(record);
    await $table.setTreeExpand(currRow, true); // 将父节点展开
    await $table.setEditRow(newRow); // 插入子节点
  }
};

const removeRow = async (row: any) => {
  if (row.id === 10000) {
    return;
  }
  const $table = xTable.value;
  await $table.remove(row);
};

nextTick(() => {
  // 将表格和工具栏进行关联
  const $table = xTable.value;
  const $toolbar = xToolbar.value;
  $table.connect($toolbar);
  findList();
});

defineExpose({
  tableData: treeData,
});
</script>

<style lang="less" scoped>
.vxe-select--panel {
  position: fixed !important;
  min-width: 10% !important;
  left: auto !important;
}
</style>
