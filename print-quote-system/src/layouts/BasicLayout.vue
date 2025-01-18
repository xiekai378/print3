<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside width="200px">
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical"
        @select="handleSelect"
      >
        <el-menu-item index="/">
          <el-icon><HomeFilled /></el-icon>
          <span>首页</span>
        </el-menu-item>

        <el-sub-menu index="/personalized">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>个性化配置</span>
          </template>
          <el-menu-item index="/personalized/formula">报价公式配置</el-menu-item>
          <el-menu-item index="/personalized/loss">损耗调整</el-menu-item>
          <el-menu-item index="/personalized/product">产品配置</el-menu-item>
          <el-menu-item index="/personalized/template">报价模板管理</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/order-customer">
          <template #title>
            <el-icon><Document /></el-icon>
            <span>订单与客户管理</span>
          </template>
          <el-menu-item index="/order-customer/orders">订单列表</el-menu-item>
          <el-menu-item index="/order-customer/customers">客户列表</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/data">
          <template #title>
            <el-icon><DataLine /></el-icon>
            <span>数据管理</span>
          </template>
          <el-menu-item index="/data/product-type">产品类型管理</el-menu-item>
          <el-menu-item index="/data/material">材料管理</el-menu-item>
          <el-menu-item index="/data/craft">工艺管理</el-menu-item>
          <el-menu-item index="/data/machine">机器管理</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/financial">
          <template #title>
            <el-icon><Money /></el-icon>
            <span>财务管理</span>
          </template>
          <el-menu-item index="/financial/processing">加工费结算</el-menu-item>
          <el-menu-item index="/financial/processing-list">加工费列表</el-menu-item>
          <el-menu-item index="/financial/statement">对账单</el-menu-item>
          <el-menu-item index="/financial/customer-settlement">客户结算</el-menu-item>
          <el-menu-item index="/financial/settlement-list">客户结算列表</el-menu-item>
          <el-menu-item index="/financial/payment">客户付款单</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/user">
          <template #title>
            <el-icon><User /></el-icon>
            <span>用户中心</span>
          </template>
          <el-menu-item index="/user/settings">个人设置</el-menu-item>
          <el-menu-item index="/user/rewards">用户激励</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>

    <!-- 主内容区 -->
    <el-container>
      <el-header>
        <!-- 顶部导航栏 -->
        <div class="header-content">
          <h2>智能印刷报价系统</h2>
          <div class="header-right">
            <!-- 用户信息等 -->
            <el-dropdown>
              <span class="el-dropdown-link">
                <el-avatar :size="32" icon="UserFilled" />
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>个人设置</el-dropdown-item>
                  <el-dropdown-item divided>退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-header>

      <el-main>
        <!-- 路由出口 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  HomeFilled,
  Setting,
  Document,
  DataLine,
  Money,
  User,
  UserFilled
} from '@element-plus/icons-vue'

const router = useRouter()
const activeMenu = ref(router.currentRoute.value.path)

const handleSelect = (index: string) => {
  router.push(index)
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.el-header {
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
  padding: 0 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.header-right {
  display: flex;
  align-items: center;
}

.el-menu-vertical {
  height: 100%;
  border-right: none;
}

.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
}
</style>
