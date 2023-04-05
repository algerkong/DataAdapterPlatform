import { FormRule, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { DataSourceModel } from '@/api/model/dataSourceModel';

export const DATA_SOURCE_COLUMNS: PrimaryTableCol<TableRowData>[] = [
  { title: '数据源名称', ellipsis: true, colKey: 'name' },
  { title: '数据源地址', ellipsis: true, colKey: 'url' },
  { title: '数据源端口', ellipsis: true, colKey: 'port' },
  { title: '数据源用户名', ellipsis: true, colKey: 'username' },
  { title: '数据源数据库名称', ellipsis: true, colKey: 'database' },
  { title: '数据源表名', ellipsis: true, colKey: 'table' },
  { title: '创建时间', ellipsis: true, colKey: 'createdTime' },
  { title: '更新时间', ellipsis: true, colKey: 'updatedTime' },
  { title: '操作', colKey: 'op', width: 200 },
];

export const DATA_SOURCE_FORM: DataSourceModel = {
  name: '',
  code: '',
  url: '',
  port: '',
  username: '',
  password: '',
  database: '',
  table: '',
};

export const DATA_SOURCE_FORM_RULES: Record<string, FormRule[]> = {
  name: [{ required: true, message: '请输入数据源名称' }],
  url: [{ required: true, message: '请输入数据源地址' }],
  port: [{ required: true, message: '请输入数据源端口' }],
  username: [{ required: true, message: '请输入数据源用户名' }],
  password: [{ required: true, message: '请输入数据源密码' }],
  database: [{ required: true, message: '请输入数据源数据库名称' }],
  table: [{ required: true, message: '请输入数据源表名' }],
};
