export interface DataSourceModel {
  id?: string; // 数据源id
  name?: string; // 数据源名称
  code?: string; // 数据源编码
  url?: string; // 数据源地址
  port?: string; // 数据源端口
  username?: string; // 数据源用户名
  password?: string; // 数据源密码
  database?: string; // 数据源数据库名称
  table?: string; // 数据源表名
  [propName: string]: any;
}
