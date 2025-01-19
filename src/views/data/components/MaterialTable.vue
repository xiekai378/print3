<template>
  <div class="material-table">
    <el-table :data="data" style="width: 100%">
      <el-table-column prop="name" label="材料名称" />
      <el-table-column prop="spec" label="规格" />
      <el-table-column prop="price" label="单价">
        <template #default="{ row }">
          {{ row.price.toFixed(2) }}元/{{ row.unit }}
        </template>
      </el-table-column>
      <el-table-column prop="supplier" label="供应商" />
      <el-table-column prop="description" label="说明" show-overflow-tooltip />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button size="small" @click="$emit('edit', row)">编辑</el-button>
          <el-button size="small" type="danger" @click="$emit('delete', row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue'

// 定义组件名称
defineComponent({
  name: 'MaterialTable'
})

// 定义接口
interface Material {
  id: number
  name: string
  type: string
  spec: string
  price: number
  unit: string
  supplier: string
  description: string
}

// 定义props
defineProps<{
  data: Material[]
}>()

// 定义事件
defineEmits<{
  (e: 'edit', material: Material): void
  (e: 'delete', material: Material): void
}>()
</script>

<style scoped>
.material-table {
  margin-top: 20px;
}
</style>
