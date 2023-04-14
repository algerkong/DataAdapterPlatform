import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/system',
    name: 'system',
    component: Layout,
    redirect: '/system/index',
    meta: { title: '系统管理', icon: 'control-platform', orderNo: 0 },
    children: [
      {
        path: 'index',
        name: 'SystemIndex',
        component: () => import('@/pages/system/index.vue'),
        meta: { title: '系统管理', notBack: true, hiddenBreadcrumb: true },
      },
      {
        path: 'dataShare/:id',
        name: 'DataShare',
        component: () => import('@/pages/system/dataShare/index.vue'),
        meta: { title: '数据共享' },
      },
      {
        path: 'api/:id',
        name: 'dataShareApi',
        component: () => import('@/pages/system/apiDispose/index.vue'),
        meta: { title: '配置API' },
      },
      {
        path: 'apiConfig/:id',
        name: 'dataShareApiConfig',
        component: () => import('@/pages/system/apiConfig/index.vue'),
        meta: { title: 'API接口配置项' },
      },
    ],
  },
  {
    path: '/dataStandard',
    name: 'dataStandard',
    component: Layout,
    redirect: '/dataStandard/index',
    meta: { title: '数据标准', icon: 'layers', orderNo: 0 },
    children: [
      {
        path: 'index',
        name: 'dataStandardIndex',
        component: () => import('@/pages/dataStandard/index.vue'),
        meta: { title: '数据标准' },
      },
      {
        path: 'add/:id',
        name: 'dataStandardAdd',
        component: () => import('@/pages/dataStandard/add/index.vue'),
        meta: { title: '添加数据结构' },
      },
    ],
  },
  {
    path: '/log',
    name: 'log',
    component: Layout,
    redirect: '/log/index',
    meta: { title: '日志管理', icon: 'layers', orderNo: 0 },
    children: [
      {
        path: 'index',
        name: 'logIndex',
        component: () => import('@/pages/log/index.vue'),
        meta: { title: '日志管理' },
      },
    ],
  },
  {
    path: '/dataSource',
    name: 'dataSource',
    component: Layout,
    redirect: '/dataSource/index',
    meta: { title: '数据源管理', icon: 'layers', orderNo: 0 },
    children: [
      {
        path: 'index',
        name: 'dataSourceIndex',
        component: () => import('@/pages/dataSource/index.vue'),
        meta: { title: '数据源管理' },
      },
    ],
  },
];
