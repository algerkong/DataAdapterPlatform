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
        path: 'dataSharing/:id',
        name: 'DataSharingIndex',
        component: () => import('@/pages/system/dataSharing.vue'),
        meta: { title: '数据共享' },
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
      {
        path: 'api/:id',
        name: 'dataStandardApi',
        component: () => import('@/pages/dataStandard/apiDispose/index.vue'),
        meta: { title: '配置API' },
      },
      {
        path: 'apiConfig/:id',
        name: 'dataStandardApiConfig',
        component: () => import('@/pages/dataStandard/apiConfig/index.vue'),
        meta: { title: 'API接口配置项' },
      },
    ],
  },
];
