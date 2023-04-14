import { BaseTableColumns } from 'tdesign-vue-next';

export const LOG_SEARCH_FORM = {
  handler: '',
  status: '',
  url: '',
  message: '',
  taskId: '',
};

export const LOG_ROW_DETAIL = {
  body: '{}',
  result: '{}',
  params: '{}',
  createdTime: '{}',
  message: '',
  url: '{}',
  ip: '',
};

export const LOG_COLUMNS: BaseTableColumns = [
  {
    colKey: 'url',
    title: '请求路径',
    width: '300px',
    ellipsis: true,
  },
  {
    colKey: 'handler',
    title: '请求方法',
    // type-slot-name 会被用于自定义单元格的插槽名称
    cell: 'type-slot-name',
    align: 'center',
  },
  {
    title: 'IP',
    // 没有 cell 的情况下， platform 会被用作自定义单元格的插槽名称
    colKey: 'ip',
    align: 'center',
    ellipsis: true,
  },
  {
    colKey: 'status',
    title: '请求状态',
    align: 'center',
  },
  {
    colKey: 'message',
    title: '返回消息',
    ellipsis: true,
    align: 'center',
  },
  {
    colKey: 'exception',
    title: '异常信息',
    align: 'center',
    ellipsis: true,
  },
  { colKey: 'createdTime', title: '请求时间', align: 'center' },
  { colKey: 'op', title: '操作', align: 'center' },
];
