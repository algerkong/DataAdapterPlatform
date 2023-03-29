import { PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
export const DATA_STRUCTURE_COLUMN: PrimaryTableCol<TableRowData>[] = [
  {
    title: '字段名称',
    ellipsis: true,
    colKey: 'fieldName',
  },
  {
    title: '字段类型',
    ellipsis: true,
    colKey: 'fieldType',
  },
  {
    title: '字段描述',
    ellipsis: true,
    colKey: 'fieldDescription',
  },
  {
    title: '字段长度',
    ellipsis: true,
    colKey: 'fieldLength',
  },
  {
    title: '字段默认值',
    ellipsis: true,
    colKey: 'fieldDefaultValue',
  },
  {
    title: '是否唯一',
    ellipsis: true,
    colKey: 'isUnique',
  },
  {
    title: '是否废弃',
    ellipsis: true,
    colKey: 'outOfUse',
  },
  {
    title: '创建时间',
    width: 160,
    ellipsis: true,
    colKey: 'createdTime',
  },
  {
    title: '更新时间',
    width: 160,
    ellipsis: true,
    colKey: 'updatedTime',
  },
  {
    align: 'left',
    fixed: 'right',
    width: 240,
    title: '操作',
    colKey: 'op',
  },
];

export const ADD_DATA_STRUCTURE_FROM = {
  fieldName: '',
  fieldType: '',
  fieldDescription: '',
  fieldLength: null,
  fieldDefaultValue: '',
  isUnique: 0,
  outOfUse: 0,
};

export const ADD_DATA_STRUCTURE_RULES = {
  fieldName: [
    {
      required: true,
      message: '请输入字段名称',
      trigger: 'blur',
    },
  ],
  fieldType: [
    {
      required: true,
      message: '请输入字段类型',
      trigger: 'blur',
    },
  ],
  fieldLength: [
    {
      required: true,
      message: '请输入字段长度',
      trigger: 'blur',
    },
  ],
  isUnique: [
    {
      required: true,
      message: '请选择是否唯一',
      trigger: 'blur',
    },
  ],
  outOfUse: [
    {
      required: true,
      message: '请选择是否废弃',
      trigger: 'blur',
    },
  ],
};
