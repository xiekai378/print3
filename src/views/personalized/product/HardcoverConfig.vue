<template>
  <div class="hardcover-config">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>精装盒盒型配置</span>
          <el-button type="primary">添加盒型</el-button>
        </div>
      </template>
      
      <el-table :data="hardcoverTypes" style="width: 100%">
        <el-table-column prop="name" label="盒型名称" />
        <el-table-column prop="code" label="盒型编码" />
        <el-table-column prop="material" label="材质" />
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
import { ref } from 'vue'

// 精装盒型数据
const hardcoverTypes = ref([
  {
    name: '精装硬壳',
    code: 'JZ-YK',
    material: '灰板+封面纸',
    description: '传统精装书籍封面'
  },
  {
    name: '精装软壳',
    code: 'JZ-RK',
    material: '双铜纸+覆膜',
    description: '轻型精装书籍封面'
  },
  {
    name: '布面精装',
    code: 'JZ-BM',
    material: '灰板+布料',
    description: '高档精装书籍封面'
  }
])

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
.hardcover-config {
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
</style> 