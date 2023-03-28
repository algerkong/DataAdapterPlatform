import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/system',
    name: 'system',
    component: Layout,
    redirect: '/system',
    meta: { title: '系统管理', icon: 'control-platform', orderNo: 0 },
    children: [
      {
        path: '',
        name: 'SystemIndex',
        component: () => import('@/pages/system/index.vue'),
        meta: { title: '系统管理' },
      },
      {
        path: '/system/dataSharing/:id',
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
    meta: { title: '数据标准', icon: 'layers', orderNo: 0 },
    redirect: '/dataStandard',
    children: [
      {
        path: '',
        name: 'dataStandardIndex',
        component: () => import('@/pages/dataSpecification/index.vue'),
        meta: { title: '数据标准' },
      },
      {
        path: '/dataStandard/add/:id',
        name: 'dataStandardAdd',
        component: () => import('@/pages/dataSpecification/add/index.vue'),
        meta: { title: '添加数据标准' },
      },
    ],
  },
];
