<template>
  <div class="w-full">
    <vxe-table
      ref="xTable"
      show-overflow
      keep-source
      border="full"
      round
      :row-config="{ keyField: 'id', isHover: true }"
      :column-config="{ resizable: true }"
      :loading="treeData.loading"
      :tree-config="treeData.treeConfig"
      :edit-config="{ trigger: 'click', mode: 'row', showIcon: false }"
      :edit-rules="validRules"
      :data="treeData.tableData"
    >
      <vxe-column tree-node field="fieldName" title="字段名" :edit-render="{}" min-width="200">
        <template #edit="{ row }">
          <vxe-input
            v-model="row.fieldName"
            type="text"
            placeholder="请输入字段名"
            :disabled="!isDisabled(row)"
          ></vxe-input>
        </template>
      </vxe-column>
      <vxe-column field="defaultValue" title="默认值" :edit-render="{}">
        <template #edit="{ row }">
          <vxe-input
            v-model="row.defaultValue"
            type="text"
            placeholder="请输入默认值"
            :disabled="!isDisabled(row)"
          ></vxe-input>
        </template>
      </vxe-column>
      <vxe-column field="type" title="类型" :edit-render="{}">
        <template #edit="{ row }">
          <vxe-select
            v-model="row.type"
            :disabled="!isDisabled(row)"
            clearable
            transfer
            placeholder="请选择类型"
            @change="(e) => changeSelect(e, row)"
          >
            <vxe-option value="string" label="string"></vxe-option>
            <vxe-option value="boolean" label="boolean"></vxe-option>
            <vxe-option value="array" label="array"></vxe-option>
            <vxe-option value="object" label="object"></vxe-option>
            <vxe-option value="number" label="number"></vxe-option>
          </vxe-select>
        </template>
      </vxe-column>
      <vxe-column field="explain" title="说明" :edit-render="{}">
        <template #edit="{ row }">
          <vxe-input v-model="row.explain" :disabled="!isDisabled(row)" placeholder="请输入说明"></vxe-input>
        </template>
      </vxe-column>
      <vxe-column title="操作" width="150px">
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
import { ref, nextTick, defineProps, onMounted, computed, watch } from 'vue';
import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table';
import { MessagePlugin } from 'tdesign-vue-next';

const treeData = ref({
  loading: false,
  tableData: [
    {
      id: 10000,
      parentId: null,
      fieldName: '根节点',
      type: 'object',
      defaultValue: '',
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
// 深层监听treeData.value.tableData对象 可以监听到新增的数据 如push splice等
const emits = defineEmits(['changeTable']);
watch(
  treeData,
  (newValue) => {
    emits('changeTable', newValue.tableData[0].children);
  },
  { deep: true },
);

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
        insertRow(element, 'false', 10000);
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

const changeSelect = async (e, row) => {
  const $table = xTable.value;
  console.log(e.value, row);
  if (e.value === 'array') {
    const data = {
      fieldName: 'items[]',
      id: Date.now(),
      parentId: row.id,
      type: 'object',
      defaultValue: '',
      explain: '数组项',
    };
    row.children = [];
    const { row: newRow } = await $table.insert(data);
    await $table.setTreeExpand(row, true); // 将父节点展开
    await $table.setEditRow(newRow); // 插入子节点
  } else if (e.value === 'object') {
    row.children = [];
    await insertRow(row, 'top');
  }
};

// 传参根据id'判断是否可以编辑
const isDisabled = computed(() => {
  return (row) => {
    if (row.id === 10000) {
      return false;
    }
    try {
      const data = findNode(row.parentId, treeData.value.tableData);
      if (data.children[0].fieldName === 'items[]') {
        return false;
      }
    } catch (e) {
      return true;
    }
    return true;
  };
});

// 根据ID查询节点
const findNode = (id, data) => {
  let result = null;
  for (let i = 0; i < data.length; i++) {
    if (data[i].id === id) {
      result = data[i];
      break;
    } else if (data[i].children && data[i].children.length > 0) {
      result = findNode(id, data[i].children);
      if (result) {
        break;
      }
    }
  }
  return result;
};

const insertRow = async (currRow: any, locate: string, id?) => {
  const $table = xTable.value;
  // 如果 null 则插入到目标节点顶部
  // 如果 -1 则插入到目标节点底部
  // 如果 row 则有插入到效的目标节点该行的位置// 插入子节点
  let record = {};
  if (locate === 'top') {
    record = {
      fieldName: '',
      id: Date.now(),
      parentId: currRow.id,
      type: 'string',
      defaultValue: '',
      explain: '',
    };
  } else if (id) {
    record = {
      parentId: id,
      ...currRow,
    };
  }
  try {
    const { row: newRow } = await $table.insertAt(record, locate === 'top' ? -1 : 1);
    await $table.setTreeExpand(currRow, true); // 将父节点展开
    await $table.setEditRow(newRow); // 插入子节点
  } catch (e) {
    console.error(e);
  }
};

const removeRow = async (row: any) => {
  if (row.id === 10000) {
    return;
  }
  const $table = xTable.value;
  await $table.remove(row);
};

const validRules = ref({
  fieldName: [{ required: true, message: '字段名必须填写' }],
  type: [{ required: true, message: '字段类型必须选择' }],
});

const fullValidEvent = async () => {
  const $table = xTable.value;
  const errMap = await $table.fullValidate();
  if (errMap) {
    const msgList: string[] = [];
    Object.values(errMap).forEach((errList: any) => {
      errList.forEach((params: any) => {
        const { column, rules } = params;
        rules.forEach((rule: any) => {
          msgList.push(`"${column.title}"校验错误：${rule.message}`);
        });
      });
    });

    msgList.forEach((msg) => {
      MessagePlugin.warning(msg);
    });
  }
};
nextTick(() => {
  // 将表格和工具栏进行关联
  const $table = xTable.value;
  const $toolbar = xToolbar.value;
  $table.connect($toolbar);
  findList();
});

defineExpose({
  fullValidEvent,
});
</script>

<style lang="less" scoped>
//.vxe-select--panel {

//}
.vxe-select--panel {
  z-index: 999999999 !important;
}
</style>
