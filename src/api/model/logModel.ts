export interface logModule {
  id?: string; // id
  taskId?: string; // 任务id
  taskName?: string; // 任务名称
  taskFrequency?: string; // 任务频率
  handler?: string; // 请求方法
  ip?: string; // ip
  url?: string; // 请求路径
  params?: string; // 请求参数
  body?: string; // Body
  result?: string; // 请求结果
  status?: string; // 请求状态
  message?: string; // message
  exception?: string; // 异常信息
}
