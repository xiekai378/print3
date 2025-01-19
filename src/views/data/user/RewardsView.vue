<template>
  <div class="rewards-container">
    <h1>奖励中心</h1>
    <el-card class="rewards-card">
      <div class="rewards-content">
        <!-- 奖励内容将在这里展示 -->
        <el-empty description="暂无奖励记录"></el-empty>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 导入所需的组件和工具
import { ref } from 'vue'
import { ElCard, ElEmpty } from 'element-plus'

// 组件逻辑将在这里实现
const rewardsList = ref([])
</script>

<style scoped>
.rewards-container {
  padding: 20px;
}

.rewards-card {
  margin-top: 20px;
}

.rewards-content {
  min-height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style> 