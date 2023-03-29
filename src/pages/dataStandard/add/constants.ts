import { FormRule, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';

export const FIELD_TYPE_OPTIONS = [
  { label: '字符串', value: 'string' },
  { label: '整数', value: 'int' },
  { label: '浮点数', value: 'float' },
  { label: '布尔', value: 'boolean' },
  { label: '日期', value: 'date' },
  { label: '时间', value: 'time' },
  { label: '日期时间', value: 'datetime' },
  { label: '数组', value: 'array' },
  { label: '对象', value: 'object' },
];

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
  fieldType: 'string',
  fieldDescription: '',
  fieldLength: 255,
  fieldDefaultValue: '',
  isUnique: 1,
  outOfUse: 1,
};

export const ADD_DATA_STRUCTURE_RULES: Record<string, FormRule[]> = {
  fieldName: [
    {
      required: true,
      message: '请输入字段名称',
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
