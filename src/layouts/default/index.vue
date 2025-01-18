<template>
  <div class="layout">
    <!-- 头部 -->
    <el-header class="header">
      <div class="logo">智能印刷报价系统</div>
      <div class="user-info">
        <el-dropdown>
          <span class="el-dropdown-link">
            管理员 <el-icon><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item>修改密码</el-dropdown-item>
              <el-dropdown-item>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <div class="container">
      <!-- 侧边栏 -->
      <el-aside width="240px">
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical"
          :collapse="false"
          background-color="#001529"
          text-color="#fff"
          router
        >
          <!-- 首页 -->
          <el-menu-item index="/home">
            <el-icon><home-filled /></el-icon>
            <span>首页</span>
          </el-menu-item>

          <!-- 个性化配置 -->
          <el-sub-menu index="/personalized">
            <template #title>
              <el-icon><setting /></el-icon>
              <span>个性化配置</span>
            </template>
            <el-menu-item index="/personalized/formula">报价公式配置</el-menu-item>
            <el-menu-item index="/personalized/loss">损耗调整</el-menu-item>
            <el-sub-menu index="/personalized/product">
              <template #title>产品配置</template>
              <el-menu-item index="/personalized/product/box">纸盒盒型配置</el-menu-item>
              <el-menu-item index="/personalized/product/hardcover">精装盒盒型配置</el-menu-item>
              <el-menu-item index="/personalized/product/book">书刊画册配置</el-menu-item>
            </el-sub-menu>
            <el-menu-item index="/personalized/template">报价模板管理</el-menu-item>
          </el-sub-menu>

          <!-- 订单与客户管理 -->
          <el-sub-menu index="/order-customer">
            <template #title>
              <el-icon><document /></el-icon>
              <span>订单与客户管理</span>
            </template>
            <el-menu-item index="/order-customer/orders">订单列表</el-menu-item>
            <el-menu-item index="/order-customer/customers">客户列表</el-menu-item>
          </el-sub-menu>

          <!-- 数据管理 -->
          <el-sub-menu index="/data">
            <template #title>
              <el-icon><data-line /></el-icon>
              <span>数据管理</span>
            </template>
            <el-menu-item index="/data/product-type">产品类型管理</el-menu-item>
            <el-sub-menu index="/data/material">
              <template #title>材料管理</template>
              <el-menu-item index="/data/material/normal">普通纸类</el-menu-item>
              <el-menu-item index="/data/material/special">特种纸</el-menu-item>
              <el-menu-item index="/data/material/gray">灰板纸/密度板</el-menu-item>
              <el-menu-item index="/data/material/adhesive">不干胶</el-menu-item>
              <el-menu-item index="/data/material/other">特殊材料</el-menu-item>
              <el-menu-item index="/data/material/accessories">配件</el-menu-item>
              <el-menu-item index="/data/material/carton">纸箱材料</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="/data/process">
              <template #title>工艺管理</template>
              <el-menu-item index="/data/process/print">印刷费</el-menu-item>
              <el-menu-item index="/data/process/surface">表面工艺</el-menu-item>
              <el-menu-item index="/data/process/silk">丝印</el-menu-item>
              <el-menu-item index="/data/process/corrugated">瓦楞对裱工艺</el-menu-item>
              <el-menu-item index="/data/process/die-cutting">模切</el-menu-item>
              <el-menu-item index="/data/process/gold">烫金工艺</el-menu-item>
              <el-menu-item index="/data/process/emboss">凹凸工艺</el-menu-item>
              <el-menu-item index="/data/process/processing">加工费</el-menu-item>
            </el-sub-menu>
            <el-menu-item index="/data/machine">机器管理</el-menu-item>
          </el-sub-menu>

          <!-- 财务管理 -->
          <el-sub-menu index="/finance">
            <template #title>
              <el-icon><money /></el-icon>
              <span>财务管理</span>
            </template>
            <el-menu-item index="/finance/processing-settlement">加工费结算</el-menu-item>
            <el-menu-item index="/finance/processing-list">加工费列表</el-menu-item>
            <el-menu-item index="/finance/statement">对账单</el-menu-item>
            <el-menu-item index="/finance/customer-settlement">客户结算</el-menu-item>
            <el-menu-item index="/finance/settlement-list">客户结算列表</el-menu-item>
            <el-menu-item index="/finance/payment">客户付款单</el-menu-item>
          </el-sub-menu>

          <!-- 用户中心 -->
          <el-sub-menu index="/user">
            <template #title>
              <el-icon><user /></el-icon>
              <span>用户中心</span>
            </template>
            <el-menu-item index="/user/settings">个人设置</el-menu-item>
            <el-sub-menu index="/user/incentive">
              <template #title>用户激励</template>
              <el-menu-item index="/user/incentive/points">积分系统</el-menu-item>
              <el-menu-item index="/user/incentive/invite">邀请奖励</el-menu-item>
              <el-menu-item index="/user/incentive/activity">会员活动</el-menu-item>
              <el-menu-item index="/user/incentive/mall">积分商城</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
        </el-menu>
      </el-aside>

      <!-- 主内容区 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  HomeFilled,
  Setting,
  Document,
  DataLine,
  Money,
  User,
  ArrowDown
} from '@element-plus/icons-vue'

// 当前激活的菜单项
const route = useRoute()
const activeMenu = computed(() => {
  return route.path
})
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: #001529;
}

.container {
  flex: 1;
  display: flex;
  margin-top: 60px;
}

.el-menu-vertical {
  height: calc(100vh - 60px);
  border-right: none;
  position: fixed;
  left: 0;
  top: 60px;
  bottom: 0;
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 240px;
}

:deep(.el-sub-menu .el-menu-item) {
  min-width: 240px;
}

.el-main {
  margin-left: 240px;
  padding: 20px;
  background-color: #f0f2f5;
}
</style> 