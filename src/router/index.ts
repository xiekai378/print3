// 路由配置文件
import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import DefaultLayout from '@/layouts/default/index.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: DefaultLayout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/HomeView.vue'),
      },
      {
        path: 'personalized',
        name: 'personalized',
        component: () => import('@/views/PersonalizedView.vue'),
        children: [
          {
            path: 'formula',
            name: 'formula',
            component: () => import('@/views/data/personalized/FormulaView.vue'),
          },
          {
            path: 'loss',
            name: 'loss',
            component: () => import('@/views/data/personalized/LossView.vue'),
          },
          {
            path: 'product',
            name: 'product',
            component: () => import('@/views/data/personalized/ProductView.vue'),
            children: [
              {
                path: 'box',
                name: 'box',
                component: () => import('@/views/data/personalized/product/BoxView.vue'),
              },
              {
                path: 'hardcover',
                name: 'hardcover',
                component: () => import('@/views/data/personalized/product/HardcoverView.vue'),
              },
              {
                path: 'book',
                name: 'book',
                component: () => import('@/views/data/personalized/product/BookView.vue'),
              },
            ],
          },
          {
            path: 'template',
            name: 'template',
            component: () => import('@/views/data/personalized/TemplateView.vue'),
          },
        ],
      },
      {
        path: 'order-customer',
        name: 'order-customer',
        component: () => import('@/views/OrderCustomerView.vue'),
        children: [
          {
            path: 'orders',
            name: 'orders',
            component: () => import('@/views/data/order-customer/OrdersView.vue'),
          },
          {
            path: 'customers',
            name: 'customers',
            component: () => import('@/views/data/order-customer/CustomersView.vue'),
          },
        ],
      },
      {
        path: 'data',
        name: 'data',
        component: () => import('@/views/DataView.vue'),
        children: [
          {
            path: 'product-type',
            name: 'product-type',
            component: () => import('@/views/data/ProductTypeView.vue'),
          },
          {
            path: 'material',
            name: 'material',
            component: () => import('@/views/data/MaterialView.vue'),
            children: [
              {
                path: 'normal',
                name: 'normal',
                component: () => import('@/views/data/material/NormalPaper.vue'),
              },
              {
                path: 'special',
                name: 'special',
                component: () => import('@/views/data/material/SpecialPaper.vue'),
              },
              {
                path: 'gray',
                name: 'gray',
                component: () => import('@/views/data/material/GrayBoard.vue'),
              },
              {
                path: 'adhesive',
                name: 'adhesive',
                component: () => import('@/views/data/material/Adhesive.vue'),
              },
              {
                path: 'other',
                name: 'other',
                component: () => import('@/views/data/material/OtherMaterial.vue'),
              },
              {
                path: 'accessories',
                name: 'accessories',
                component: () => import('@/views/data/material/Accessories.vue'),
              },
              {
                path: 'carton',
                name: 'carton',
                component: () => import('@/views/data/material/Carton.vue'),
              },
            ],
          },
          {
            path: 'process',
            name: 'process',
            component: () => import('@/views/data/ProcessView.vue'),
            children: [
              {
                path: 'print',
                name: 'print',
                component: () => import('@/views/data/process/PrintingFee.vue'),
              },
              {
                path: 'surface',
                name: 'surface',
                component: () => import('@/views/data/process/SurfaceProcess.vue'),
              },
              {
                path: 'silk',
                name: 'silk',
                component: () => import('@/views/data/process/SilkScreen.vue'),
              },
              {
                path: 'corrugated',
                name: 'corrugated',
                component: () => import('@/views/data/process/CorrugatedProcess.vue'),
              },
              {
                path: 'die-cutting',
                name: 'die-cutting',
                component: () => import('@/views/data/process/DieCutting.vue'),
              },
              {
                path: 'gold',
                name: 'gold',
                component: () => import('@/views/data/process/GoldStamping.vue'),
              },
              {
                path: 'emboss',
                name: 'emboss',
                component: () => import('@/views/data/process/Embossing.vue'),
              },
              {
                path: 'processing',
                name: 'processing',
                component: () => import('@/views/data/process/ProcessingFee.vue'),
              },
            ],
          },
          {
            path: 'machine',
            name: 'machine',
            component: () => import('@/views/data/MachineView.vue'),
          },
        ],
      },
      {
        path: 'finance',
        name: 'finance',
        component: () => import('@/views/FinanceView.vue'),
        children: [
          {
            path: 'processing-settlement',
            name: 'processing-settlement',
            component: () => import('@/views/data/finance/ProcessingSettlement.vue'),
          },
          {
            path: 'processing-list',
            name: 'processing-list',
            component: () => import('@/views/data/finance/ProcessingList.vue'),
          },
          {
            path: 'statement',
            name: 'statement',
            component: () => import('@/views/data/finance/Statement.vue'),
          },
          {
            path: 'customer-settlement',
            name: 'customer-settlement',
            component: () => import('@/views/data/finance/CustomerSettlement.vue'),
          },
          {
            path: 'settlement-list',
            name: 'settlement-list',
            component: () => import('@/views/data/finance/SettlementList.vue'),
          },
          {
            path: 'payment',
            name: 'payment',
            component: () => import('@/views/data/finance/Payment.vue'),
          },
          {
            path: 'processing',
            name: 'processing',
            component: () => import('@/views/data/finance/ProcessingSettlement.vue'),
          },
        ],
      },
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/UserView.vue'),
        children: [
          {
            path: 'settings',
            name: 'settings',
            component: () => import('@/views/data/user/Settings.vue'),
          },
          {
            path: 'incentive',
            name: 'incentive',
            component: () => import('@/views/data/user/IncentiveView.vue'),
            children: [
              {
                path: 'points',
                name: 'points',
                component: () => import('@/views/data/user/incentive/Points.vue'),
              },
              {
                path: 'invite',
                name: 'invite',
                component: () => import('@/views/data/user/incentive/Invite.vue'),
              },
              {
                path: 'activity',
                name: 'activity',
                component: () => import('@/views/data/user/incentive/Activity.vue'),
              },
              {
                path: 'mall',
                name: 'mall',
                component: () => import('@/views/data/user/incentive/Mall.vue'),
              },
            ],
          },
          {
            path: 'rewards',
            name: 'rewards',
            component: () => import('@/views/data/user/RewardsView.vue'),
          },
        ],
      },
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router 