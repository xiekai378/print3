<template>
  <div class="material-config">
    <el-row :gutter="20">
      <!-- 左侧菜单 -->
      <el-col :span="4">
        <el-card class="menu-card">
          <el-menu
            :default-active="activeTab"
            class="material-menu"
            @select="handleSelect"
          >
            <el-menu-item index="normal">
              <el-icon><document /></el-icon>
              <span>普通纸类</span>
            </el-menu-item>
            <el-menu-item index="special">
              <el-icon><collection /></el-icon>
              <span>特种纸</span>
            </el-menu-item>
            <el-menu-item index="gray">
              <el-icon><files /></el-icon>
              <span>灰板纸/密度板</span>
            </el-menu-item>
            <el-menu-item index="adhesive">
              <el-icon><stamp /></el-icon>
              <span>不干胶</span>
            </el-menu-item>
            <el-menu-item index="other">
              <el-icon><more /></el-icon>
              <span>特殊材料</span>
            </el-menu-item>
            <el-menu-item index="accessories">
              <el-icon><goods /></el-icon>
              <span>配件</span>
            </el-menu-item>
            <el-menu-item index="carton">
              <el-icon><box /></el-icon>
              <span>纸箱材料</span>
            </el-menu-item>
          </el-menu>
        </el-card>
      </el-col>

      <!-- 右侧内容区 -->
      <el-col :span="20">
        <component :is="currentComponent" v-if="currentComponent" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Component } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  Document, 
  Collection, 
  Files, 
  Stamp, 
  More, 
  Goods,
  Box 
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// 当前激活的标签
const activeTab = ref('normal')

// 动态组件
const currentComponent = shallowRef<Component | null>(null)

// 处理菜单选择
const handleSelect = (key: string) => {
  activeTab.value = key
  loadComponent(key)
}

// 加载组件
const loadComponent = async (type: string) => {
  try {
    // 根据类型加载对应的组件
    let component
    switch (type) {
      case 'normal':
        component = await import('./material/NormalPaper.vue')
        break
      case 'special':
        component = await import('./material/SpecialPaper.vue')
        break
      case 'gray':
        component = await import('./material/GrayPaper.vue')
        break
      case 'adhesive':
        component = await import('./material/AdhesivePaper.vue')
        break
      case 'other':
        component = await import('./material/OtherMaterial.vue')
        break
      case 'accessories':
        component = await import('./material/Accessories.vue')
        break
      case 'carton':
        component = await import('./material/CartonPaper.vue')
        break
      default:
        component = await import('./material/NormalPaper.vue')
    }
    currentComponent.value = component.default
  } catch (error) {
    console.error('加载组件失败:', error)
    ElMessage.error('加载组件失败，请稍后重试')
  }
}

// 初始化
onMounted(() => {
  // 从路由参数获取初始标签
  const type = route.params.type || 'normal'
  activeTab.value = type as string
  loadComponent(type as string)
})
</script>

<style scoped>
.material-config {
  padding: 0;
}

.menu-card {
  height: calc(100vh - 60px);
  border-radius: 0;
}

.material-menu {
  border-right: none;
}

:deep(.el-menu-item) {
  height: 50px;
  line-height: 50px;
}

:deep(.el-menu-item.is-active) {
  background-color: #ecf5ff;
}

.el-icon {
  margin-right: 8px;
}

:deep(.el-card) {
  border-radius: 0;
  border: none;
}
</style> 