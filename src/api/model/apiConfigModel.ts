export interface ApiConfigModel {
  id?: string; // 配置项ID
  configType: string; // 配置类型
  key: string; // 配置项key
  value: string; // 配置项value
  transmissionModeId?: string; // 数据传输方式ID
}
