<template>
  <div class="box-config">
    <h1>测试内容 - 如果你能看到这个标题，说明组件已正确加载</h1>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>纸盒盒型配置</span>
          <el-button type="primary">添加盒型</el-button>
        </div>
      </template>
      
      <el-table :data="boxTypes" style="width: 100%">
        <el-table-column prop="name" label="盒型名称" />
        <el-table-column prop="code" label="盒型编码" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

console.log('BoxConfig 组件开始初始化')

// 盒型数据
const boxTypes = ref([
  {
    name: '天地盖',
    code: 'TDG',
    description: '上下盖结构的包装盒'
  },
  {
    name: '抽屉盒',
    code: 'CTH',
    description: '抽拉式结构的包装盒'
  }
])

onMounted(() => {
  console.log('BoxConfig 组件已挂载')
  console.log('当前路由：', route.path)
  // 添加一个简单的提示
  alert('BoxConfig 组件已加载')
})

// 编辑盒型
const handleEdit = (row: any) => {
  console.log('编辑', row)
}

// 删除盒型
const handleDelete = (row: any) => {
  console.log('删除', row)
}
</script>

<style scoped>
.box-config {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.box-card {
  width: 100%;
  margin-top: 20px;
}

h1 {
  color: red;
  margin-bottom: 20px;
}
</style> 