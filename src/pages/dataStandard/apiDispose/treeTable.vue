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
      :loading="demo1.loading"
      :tree-config="demo1.treeConfig"
      :edit-config="{ trigger: 'click', mode: 'row', showStatus: true }"
      :data="demo1.tableData"
      height="200px"
    >
      <vxe-column tree-node width="60px"></vxe-column>
      <vxe-column field="name" title="字段名" :edit-render="{}" width="150px">
        <template #edit="{ row }">
          <vxe-input v-model="row.name" type="text" placeholder="请输入字段名" :disabled="row.id === 10000"></vxe-input>
        </template>
      </vxe-column>
      <vxe-column field="size" title="默认值" :edit-render="{}" width="150px">
        <template #edit="{ row }">
          <vxe-input v-model="row.size" type="text" placeholder="请输入默认值" :disabled="row.id === 10000"></vxe-input>
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
      <vxe-column field="date" title="说明" :edit-render="{}" width="150px">
        <template #edit="{ row }">
          <vxe-textarea v-model="row.date" :disabled="row.id === 10000" placeholder="请输入说明"></vxe-textarea>
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
import { reactive, ref, nextTick } from 'vue';
import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table';

const demo1 = reactive({
  loading: false,
  tableData: [] as any[],
  treeConfig: {
    transform: true,
    rowField: 'id',
    parentField: 'parentId',
  },
});

const xTable = ref<VxeTableInstance>();
const xToolbar = ref<VxeToolbarInstance>();

const findList = () => {
  demo1.loading = true;
  return new Promise((resolve) => {
    setTimeout(() => {
      demo1.tableData = [{ id: 10000, parentId: null, name: '根节点', type: 'Object', size: 'mock', date: '说明' }];
      demo1.loading = false;
      resolve(null);
    }, 300);
  });
};

const insertRow = async (currRow: any, locat: string) => {
  const $table = xTable.value;
  // 如果 null 则插入到目标节点顶部
  // 如果 -1 则插入到目标节点底部
  // 如果 row 则有插入到效的目标节点该行的位置// 插入子节点
  if (locat === 'top') {
    const record = {
      name: '',
      id: Date.now(),
      parentId: currRow.id,
      type: '', // 需要指定父节点，自动插入该节点中
      date: '',
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
  tableData: demo1,
});
</script>

<style lang="less" scoped>
.vxe-select--panel {
  position: fixed !important;
  min-width: 10% !important;
  left: auto !important;
}
</style>
