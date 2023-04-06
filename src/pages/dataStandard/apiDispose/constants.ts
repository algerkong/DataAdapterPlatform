import { FormRule, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { ApiDisposeModel } from '@/api/model/apiDisposeModel';

/*
export interface ApiDisposeModel {
  id?: string; // 数据传输方式ID
  apiName?: string; // api名称
  url?: string; // api地址
  method?: string; // 请求方式
  contentType?: string; // 请求内容类型
  response?: string; // 响应内容配置
  responseFieldMapping?: string; // 接口返回值字段与数据规范的映射
  sampleReqInfo?: string; // 示例请求信息
  sharedDataStandardId?: string; // 数据标准ID
  apiConfigItems?: any[]; // 配置项
}

*/
export const API_DISPOSE_COLUMNS: PrimaryTableCol<TableRowData>[] = [
  // q:
  { title: 'API名称', ellipsis: true, colKey: 'apiName' },
  { title: 'API地址', ellipsis: true, colKey: 'url' },
  { title: '请求方式', ellipsis: true, colKey: 'method' },
  { title: '请求内容类型', ellipsis: true, colKey: 'contentType' },
  { title: '创建时间', ellipsis: true, colKey: 'createdTime' },
  { title: '修改时间', ellipsis: true, colKey: 'updatedTime' },
  { title: '操作', colKey: 'op', width: 200 },
];

export const API_DISPOSE_FORM: ApiDisposeModel = {
  apiName: '',
  url: '',
  method: '',
  contentType: '',
  response: '',
  responseFieldMapping: '',
  sampleReqInfo: '',
  sharedDataStandardId: '',
  dataSourceId: '',
};

export const API_DISPOSE_SEARCH_FORM: ApiDisposeModel = {
  apiName: '',
  url: '',
  method: '',
  contentType: '',
};

export const API_DISPOSE_FORM_RULES: Record<string, FormRule[]> = {
  apiName: [{ required: true, message: '请输入API名称' }],
  url: [{ required: true, message: '请输入API地址' }],
  method: [{ required: true, message: '请选择请求方式' }],
  response: [{ required: true, message: '请输入响应内容配置' }],
  responseFieldMapping: [{ required: true, message: '请输入接口返回值字段与数据规范的映射' }],
  sampleReqInfo: [{ required: true, message: '请输入示例请求信息' }],
  dataSourceId: [{ required: true, message: '请选择数据源' }],
};

export const API_DISPOSE_CONTENE_TYPE = [
  { label: 'json', value: 'json' },
  { label: 'form-data', value: 'form-data' },
  { label: 'query', value: 'query' },
  { label: 'x-www-form-urlencoded', value: 'x-www-form-urlencoded' },
  { label: 'raw', value: 'raw' },
  { label: 'binary', value: 'binary' },
  { label: 'xml', value: 'xml' },
];

export const API_DISPOSE_METHOD = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
  { label: 'PUT', value: 'PUT' },
  { label: 'DELETE', value: 'DELETE' },
  { label: 'PATCH', value: 'PATCH' },
];
