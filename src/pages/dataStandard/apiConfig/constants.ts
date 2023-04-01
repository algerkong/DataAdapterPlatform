import { FormRule, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { ApiConfigModel } from '@/api/model/apiConfigModel';

export const API_CONFIG_COLUMNS: PrimaryTableCol<TableRowData>[] = [
  { title: '配置类型', ellipsis: true, colKey: 'configType' },
  { title: '配置项key', ellipsis: true, colKey: 'key' },
  { title: '配置项value', ellipsis: true, colKey: 'value' },
  { title: '创建时间', ellipsis: true, colKey: 'createdTime' },
  { title: '修改时间', ellipsis: true, colKey: 'updatedTime' },
  { title: '操作', colKey: 'op', width: 200 },
];

export const API_CONFIG_FORM: ApiConfigModel = {
  configType: '',
  key: '',
  value: '',
};

export const API_CONFIG_FORM_RULES: Record<string, FormRule[]> = {
  configType: [{ required: true, message: '请选择配置类型' }],
  key: [{ required: true, message: '请输入配置项key' }],
  value: [{ required: true, message: '请输入配置项value' }],
};

export const API_CONFIG_CONFIG_TYPE = [
  { label: 'HEADERS', value: 'HEADERS' },
  { label: 'BODY', value: 'BODY' },
  { label: 'RESPONSE', value: 'RESPONSE' },
];
