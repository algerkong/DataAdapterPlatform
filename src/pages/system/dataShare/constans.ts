import { BaseTableColumns, FormRule } from 'tdesign-vue-next';
import { CustomValidateResolveType } from 'tdesign-vue-next/es/form/type';

export const DATA_SHARE_FORM_DATA = {
  taskName: '',
  taskFrequency: '',
  transmissionType: '',
};

export const DATA_SHARE_SEARCH_FORM = {
  taskName: '',
  taskFrequency: '',
  standardName: '',
  status: '',
};

const cronValidator = (value: string): CustomValidateResolveType => {
  //   校验 cron 时间格式
  const reg =
    /^\s*($|#|\w+\s*=|(\?|\*|(?:[0-5]?\d)(?:(?:-|\/|\,)(?:[0-5]?\d))?(?:,(?:[0-5]?\d)(?:(?:-|\/|\,)(?:[0-5]?\d))?)*)\s+(\?|\*|(?:[0-5]?\d)(?:(?:-|\/|\,)(?:[0-5]?\d))?(?:,(?:[0-5]?\d)(?:(?:-|\/|\,)(?:[0-5]?\d))?)*)\s+(\?|\*|(?:[01]?\d|2[0-3])(?:(?:-|\/|\,)(?:[01]?\d|2[0-3]))?(?:,(?:[01]?\d|2[0-3])(?:(?:-|\/|\,)(?:[01]?\d|2[0-3]))?)*)\s+(\?|\*|(?:0?[1-9]|[12]\d|3[01])(?:(?:-|\/|\,)(?:0?[1-9]|[12]\d|3[01]))?(?:,(?:0?[1-9]|[12]\d|3[01])(?:(?:-|\/|\,)(?:0?[1-9]|[12]\d|3[01]))?)*)\s+(\?|\*|(?:[1-9]|1[012])(?:(?:-|\/|\,)(?:[1-9]|1[012]))?(?:L|W)?(?:,(?:[1-9]|1[012])(?:(?:-|\/|\,)(?:[1-9]|1[012]))?(?:L|W)?)*|\?|\*|(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?(?:,(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?)*)\s+(\?|\*|(?:[0-6])(?:(?:-|\/|\,|#)(?:[0-6]))?(?:L)?(?:,(?:[0-6])(?:(?:-|\/|\,|#)(?:[0-6]))?(?:L)?)*|\?|\*|(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?(?:,(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?)*)(|\s)+(\?|\*|(?:|\d{4})(?:(?:-|\/|\,)(?:|\d{4}))?(?:,(?:|\d{4})(?:(?:-|\/|\,)(?:|\d{4}))?)*))$/;
  if (reg.test(value)) {
    return { result: true, message: '', type: 'success' };
  }
  return { result: false, message: '请输入正确的cron格式', type: 'error' };
};

export const DATA_SHARE_FORM_RULES: Record<string, FormRule[]> = {
  taskName: [{ required: true, message: '请输入数据共享名称', type: 'error', trigger: 'blur' }],
  taskFrequency: [
    { required: true, message: '请输入执行任务时间', type: 'error', trigger: 'blur' },
    { validator: cronValidator, trigger: 'blur' },
  ],
  transmissionType: [{ required: true, message: '请选择推送方式', type: 'error', trigger: 'blur' }],
};

export const DATA_SHARE_TABLE_COLUMNS: BaseTableColumns = [
  {
    colKey: 'taskName',
    title: '任务名称',
    // type-slot-name 会被用于自定义单元格的插槽名称
    cell: 'type-slot-name',
    align: 'center',
  },
  {
    title: '传输类型',
    // 没有 cell 的情况下， platform 会被用作自定义单元格的插槽名称
    colKey: 'status',
    align: 'center',
  },
  {
    colKey: 'taskFrequency',
    title: '任务执行时间',
    align: 'center',
  },
  { colKey: 'createdTime', title: '申请时间', align: 'center' },
  { colKey: 'updatedTime', title: '修改时间', align: 'center' },
  { colKey: 'operates', title: '操作', align: 'center' },
];

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
