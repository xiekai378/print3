<template>
  <div class="craft-table">
    <el-table :data="data" style="width: 100%">
      <el-table-column prop="name" label="工艺名称" />
      <el-table-column prop="spec" label="规格" />
      <el-table-column prop="priceType" label="计价方式">
        <template #default="{ row }">
          {{ getPriceTypeName(row.priceType) }}
        </template>
      </el-table-column>
      <el-table-column prop="price" label="单价">
        <template #default="{ row }">
          {{ row.price.toFixed(2) }}{{ getPriceUnit(row.priceType) }}
        </template>
      </el-table-column>
      <el-table-column prop="minQuantity" label="最小起订量" />
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
  name: 'CraftTable'
})

// 定义接口
interface Craft {
  id: number
  name: string
  type: string
  spec: string
  priceType: string
  price: number
  minQuantity: number
  description: string
}

// 定义props
defineProps<{
  data: Craft[]
}>()

// 定义事件
defineEmits<{
  (e: 'edit', craft: Craft): void
  (e: 'delete', craft: Craft): void
}>()

// 获取计价方式名称
const getPriceTypeName = (type: string) => {
  const typeMap: Record<string, string> = {
    area: '按面积',
    quantity: '按数量',
    time: '按时间'
  }
  return typeMap[type] || type
}

// 获取价格单位
const getPriceUnit = (type: string) => {
  const unitMap: Record<string, string> = {
    area: '元/平方厘米',
    quantity: '元/个',
    time: '元/小时'
  }
  return unitMap[type] || '元'
}
</script>

<style scoped>
.craft-table {
  margin-top: 20px;
}
</style>
