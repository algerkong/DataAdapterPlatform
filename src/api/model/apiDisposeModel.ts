export interface ApiDisposeModel {
  id?: string; // 数据传输方式ID
  apiName?: string; // api名称
  url?: string; // api地址
  method?: string; // 请求方式
  contentType?: any; // 请求内容类型
  response?: string; // 响应内容配置
  responseFieldMapping?: string; // 接口返回值字段与数据规范的映射
  sampleReqInfo?: string; // 示例请求信息
  sharedDataStandardId?: string; // 数据标准ID
  apiConfigItems?: any[]; // 配置项
  dataSourceId?: string; // 数据源id
}
