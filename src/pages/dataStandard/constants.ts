import { FormRule, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';

export const COLUMNS: PrimaryTableCol<TableRowData>[] = [
  {
    title: '标准名称',
    ellipsis: true,
    colKey: 'standardName',
  },
  {
    title: '标准详情',
    width: 160,
    ellipsis: true,
    colKey: 'descripition',
  },
  {
    title: '功能模块id',
    width: 160,
    ellipsis: true,
    colKey: 'moduleId',
  },
  {
    title: '数据传输方式',
    width: 160,
    ellipsis: true,
    colKey: 'transmissionMode',
  },
  // {
  //   title: '数据抽取配置id',
  //   width: 160,
  //   ellipsis: true,
  //   colKey: 'transmissionConfigId',
  // },
  // {
  //   title: '是否已删除',
  //   width: 160,
  //   ellipsis: true,
  //   colKey: 'isDelete',
  // },
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

export const ADD_FORM = {
  standardName: '',
  descripition: '',
  moduleId: '',
  transmissionMode: '',
  transmissionConfigId: '',
};

export const ADD_FROM_RULES: Record<string, FormRule[]> = {
  standardName: [
    {
      required: true,
      message: '请输入标准名称',
      type: 'error',
      trigger: 'blur',
    },
  ],
  descripition: [
    {
      required: true,
      message: '请输入标准详情',
      type: 'error',
      trigger: 'blur',
    },
  ],
  moduleId: [
    {
      required: true,
      message: '请选择功能模块',
      type: 'error',
      trigger: 'blur',
    },
  ],
  transmissionMode: [
    {
      required: true,
      message: '请选择数据传输方式',
      type: 'error',
      trigger: 'blur',
    },
  ],
  transmissionConfigId: [
    {
      required: true,
      message: '请选择数据抽取配置',
      type: 'error',
      trigger: 'blur',
    },
  ],
};

export const TRANSMISSON_MODE = [
  {
    label: 'API传输',
    value: '0',
  },
  {
    label: 'DB传输',
    value: '1',
  },
];

export const MODULE = [
  {
    label: '模块1',
    value: '0',
  },
  {
    label: '模块2',
    value: '1',
  },
  {
    label: '模块3',
    value: '2',
  },
];
