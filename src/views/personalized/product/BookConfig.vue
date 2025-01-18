<template>
  <div class="book-config">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>书刊画册配置</span>
          <el-button type="primary">添加配置</el-button>
        </div>
      </template>
      
      <el-table :data="bookTypes" style="width: 100%">
        <el-table-column prop="name" label="类型名称" />
        <el-table-column prop="code" label="类型编码" />
        <el-table-column prop="bindingType" label="装订方式" />
        <el-table-column prop="paperType" label="用纸类型" />
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

// 书刊画册类型数据
const bookTypes = ref([
  {
    name: '胶装画册',
    code: 'JZ-HC',
    bindingType: '无线胶装',
    paperType: '铜版纸',
    description: '常规画册装订方式'
  },
  {
    name: '骑马钉画册',
    code: 'QMD-HC',
    bindingType: '骑马钉',
    paperType: '铜版纸',
    description: '适合页数较少的画册'
  },
  {
    name: '精装画册',
    code: 'JZ-HC',
    bindingType: '精装',
    paperType: '铜版纸+封面纸',
    description: '高档画册装订方式'
  },
  {
    name: '活页画册',
    code: 'HY-HC',
    bindingType: '活页装订',
    paperType: '铜版纸',
    description: '可更换内页的画册'
  }
])

// 编辑配置
const handleEdit = (row: any) => {
  console.log('编辑', row)
}

// 删除配置
const handleDelete = (row: any) => {
  console.log('删除', row)
}
</script>

<style scoped>
.book-config {
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