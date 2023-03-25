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
        meta: { title: '系统管理' },
      },
    ],
  },
];
