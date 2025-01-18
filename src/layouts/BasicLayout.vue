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

        <el-sub-menu index="/data">
          <template #title>
            <el-icon><Folder /></el-icon>
            <span>数据管理</span>
          </template>
          <el-menu-item index="/data/product-type">产品类型管理</el-menu-item>
          <el-menu-item index="/data/material">材料管理</el-menu-item>
          <el-menu-item index="/data/craft">工艺管理</el-menu-item>
          <el-menu-item index="/data/machine">设备管理</el-menu-item>
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
            <el-dropdown>
              <span class="user-info">
                管理员 <el-icon><ArrowDown /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>个人信息</el-dropdown-item>
                  <el-dropdown-item>修改密码</el-dropdown-item>
                  <el-dropdown-item divided>退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-header>
      
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { HomeFilled, Setting, Folder, ArrowDown } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const activeMenu = ref(route.path)

// 监听路由变化
watch(() => route.path, (newPath) => {
  activeMenu.value = newPath
})

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

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 10px;
}

.el-menu-vertical {
  height: 100%;
  border-right: none;
}

.el-main {
  background-color: #f5f7fa;
  padding: 20px;
}
</style> 