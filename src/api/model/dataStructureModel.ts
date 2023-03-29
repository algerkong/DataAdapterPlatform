export interface dataStructureModel {
  id?: string;
  fieldName: string; // 字段名称
  fieldType: string; // 字段类型
  fieldDescription?: string; // 字段描述
  fieldLength: number; // 字段长度
  fieldDefaultValue: any; // 字段默认值
  isUnique?: number; // 是否唯一
  outOfUse?: number; // 是否废弃
  sharedDataStandardId?: string; // 共享数据标准ID
}
