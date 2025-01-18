import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/home/index.vue')
    },
    // 个性化配置
    {
      path: '/personalized',
      name: 'personalized',
      component: () => import('../views/personalized/index.vue'),
      children: [
        {
          path: 'formula',
          name: 'formula',
          component: () => import('../views/personalized/formula.vue')
        },
        {
          path: 'loss',
          name: 'loss',
          component: () => import('../views/personalized/loss.vue')
        },
        {
          path: 'product',
          name: 'product',
          component: () => import('../views/personalized/product.vue')
        },
        {
          path: 'template',
          name: 'template',
          component: () => import('../views/personalized/template.vue')
        }
      ]
    },
    // 订单与客户管理
    {
      path: '/order-customer',
      name: 'orderCustomer',
      component: () => import('../views/order-customer/index.vue'),
      children: [
        {
          path: 'orders',
          name: 'orders',
          component: () => import('../views/order-customer/orders.vue')
        },
        {
          path: 'customers',
          name: 'customers',
          component: () => import('../views/order-customer/customers.vue')
        }
      ]
    },
    // 数据管理
    {
      path: '/data',
      name: 'data',
      component: () => import('../views/data/index.vue'),
      children: [
        {
          path: 'product-type',
          name: 'productType',
          component: () => import('../views/data/product-type.vue')
        },
        {
          path: 'material',
          name: 'material',
          component: () => import('../views/data/material.vue')
        },
        {
          path: 'craft',
          name: 'craft',
          component: () => import('../views/data/craft.vue')
        },
        {
          path: 'machine',
          name: 'machine',
          component: () => import('../views/data/machine.vue')
        }
      ]
    },
    // 财务管理
    {
      path: '/financial',
      name: 'financial',
      component: () => import('../views/financial/index.vue'),
      children: [
        {
          path: 'processing',
          name: 'processing',
          component: () => import('../views/financial/processing.vue')
        },
        {
          path: 'processing-list',
          name: 'processingList',
          component: () => import('../views/financial/processing-list.vue')
        },
        {
          path: 'statement',
          name: 'statement',
          component: () => import('../views/financial/statement.vue')
        },
        {
          path: 'customer-settlement',
          name: 'customerSettlement',
          component: () => import('../views/financial/customer-settlement.vue')
        },
        {
          path: 'settlement-list',
          name: 'settlementList',
          component: () => import('../views/financial/settlement-list.vue')
        },
        {
          path: 'payment',
          name: 'payment',
          component: () => import('../views/financial/payment.vue')
        }
      ]
    },
    // 用户中心
    {
      path: '/user',
      name: 'user',
      component: () => import('../views/user/index.vue'),
      children: [
        {
          path: 'settings',
          name: 'settings',
          component: () => import('../views/user/settings.vue')
        },
        {
          path: 'rewards',
          name: 'rewards',
          component: () => import('../views/user/rewards.vue')
        }
      ]
    }
  ]
})

export default router
