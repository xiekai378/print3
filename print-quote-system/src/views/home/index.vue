<template>
  <div class="home">
    <el-row :gutter="20">
      <!-- 核心报价区 -->
      <el-col :span="16">
        <el-card class="quote-card">
          <template #header>
            <div class="card-header">
              <h3>报价计算</h3>
            </div>
          </template>

          <el-form :model="quoteForm" label-width="120px">
            <!-- 产品类型选择 -->
            <el-form-item label="产品类型">
              <el-select v-model="quoteForm.productType" placeholder="请选择产品类型">
                <el-option label="纸盒" value="box" />
                <el-option label="精装盒" value="hardcover" />
                <el-option label="书刊画册" value="book" />
              </el-select>
            </el-form-item>

            <!-- 客户选择 -->
            <el-form-item label="客户">
              <el-select
                v-model="quoteForm.customer"
                placeholder="请选择客户"
                filterable
              >
                <el-option label="测试客户1" value="customer1" />
                <el-option label="测试客户2" value="customer2" />
              </el-select>
            </el-form-item>

            <!-- 基本参数 -->
            <el-form-item label="尺寸">
              <el-input-number v-model="quoteForm.length" :min="1" placeholder="长" />
              <span class="mx-2">×</span>
              <el-input-number v-model="quoteForm.width" :min="1" placeholder="宽" />
              <span class="mx-2">×</span>
              <el-input-number v-model="quoteForm.height" :min="1" placeholder="高" />
              <span class="ml-2">mm</span>
            </el-form-item>

            <el-form-item label="数量">
              <el-input-number v-model="quoteForm.quantity" :min="1" />
            </el-form-item>

            <!-- 材料选择 -->
            <el-form-item label="材料">
              <el-select v-model="quoteForm.material" placeholder="请选择材料">
                <el-option label="材料1" value="material1" />
                <el-option label="材料2" value="material2" />
              </el-select>
            </el-form-item>

            <!-- 工艺选择 -->
            <el-form-item label="工艺">
              <el-checkbox-group v-model="quoteForm.crafts">
                <el-checkbox label="印刷" />
                <el-checkbox label="覆膜" />
                <el-checkbox label="烫金" />
                <el-checkbox label="UV" />
              </el-checkbox-group>
            </el-form-item>

            <!-- 按钮组 -->
            <el-form-item>
              <el-button type="primary" @click="calculateQuote">开始报价</el-button>
              <el-button @click="resetForm">重置</el-button>
              <el-button type="success" @click="saveQuote">保存报价</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <!-- 报价结果展示 -->
      <el-col :span="8">
        <el-card class="result-card">
          <template #header>
            <div class="card-header">
              <h3>报价结果</h3>
            </div>
          </template>

          <div v-if="quoteResult" class="quote-result">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="材料费">{{ quoteResult.materialCost }}元</el-descriptions-item>
              <el-descriptions-item label="加工费">{{ quoteResult.processingCost }}元</el-descriptions-item>
              <el-descriptions-item label="工艺费">{{ quoteResult.craftCost }}元</el-descriptions-item>
              <el-descriptions-item label="总计">
                <span class="total-price">{{ quoteResult.total }}元</span>
              </el-descriptions-item>
            </el-descriptions>

            <div class="action-buttons">
              <el-button type="primary" @click="addToOrder">添加到订单</el-button>
              <el-button @click="exportQuote">导出报价单</el-button>
            </div>
          </div>
          <el-empty v-else description="暂无报价结果" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { defineComponent } from 'vue'

// 定义组件名称
defineComponent({
  name: 'HomePage'
})

interface QuoteResult {
  materialCost: number
  processingCost: number
  craftCost: number
  total: number
}

// 报价表单数据
const quoteForm = reactive({
  productType: '',
  customer: '',
  length: 0,
  width: 0,
  height: 0,
  quantity: 1,
  material: '',
  crafts: [] as string[]
})

// 报价结果
const quoteResult = ref<QuoteResult | null>(null)

// 计算报价
const calculateQuote = () => {
  // 模拟报价计算
  quoteResult.value = {
    materialCost: 1000,
    processingCost: 500,
    craftCost: 300,
    total: 1800
  }
}

// 重置表单
const resetForm = () => {
  Object.assign(quoteForm, {
    productType: '',
    customer: '',
    length: 0,
    width: 0,
    height: 0,
    quantity: 1,
    material: '',
    crafts: []
  })
  quoteResult.value = null
}

// 保存报价
const saveQuote = () => {
  // TODO: 实现保存报价逻辑
}

// 添加到订单
const addToOrder = () => {
  // TODO: 实现添加到订单逻辑
}

// 导出报价单
const exportQuote = () => {
  // TODO: 实现导出报价单逻辑
}
</script>

<style scoped>
.home {
  padding: 20px;
}

.quote-card,
.result-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mx-2 {
  margin: 0 8px;
}

.ml-2 {
  margin-left: 8px;
}

.quote-result {
  margin-top: 20px;
}

.total-price {
  color: #f56c6c;
  font-size: 20px;
  font-weight: bold;
}

.action-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}
</style>
