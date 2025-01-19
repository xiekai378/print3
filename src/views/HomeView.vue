<template>
  <div class="home-layout">
    <div class="main-content">
      <!-- 客户信息区 -->
      <el-card class="section customer-info">
        <template #header>
          <div class="section-header">
            <span>客户信息</span>
          </div>
        </template>
        <el-form :model="customerForm" label-width="80px">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="联系人">
                <el-input v-model="customerForm.contactName" placeholder="请输入联系人" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="电话">
                <el-input v-model="customerForm.phone" placeholder="请输入电话" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="地址">
                <el-input v-model="customerForm.address" placeholder="请输入地址" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>

      <!-- 产品信息区 -->
      <el-card class="section product-info">
        <template #header>
          <div class="section-header">
            <span>产品信息</span>
          </div>
        </template>
        <el-form :model="productForm" label-width="80px">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="报价方式">
                <el-radio-group v-model="productForm.quoteType">
                  <el-radio label="平面">平面</el-radio>
                  <el-radio label="立体">立体</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 尺寸和数量 -->
          <el-row :gutter="20">
            <template v-if="productForm.quoteType === '平面'">
              <el-col :span="6">
                <el-form-item label="长">
                  <el-input-number v-model="productForm.length" :min="1" placeholder="毫米" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="宽">
                  <el-input-number v-model="productForm.width" :min="1" placeholder="毫米" />
                </el-form-item>
              </el-col>
            </template>
            <template v-else>
              <el-col :span="6">
                <el-form-item label="长">
                  <el-input-number v-model="productForm.length" :min="1" placeholder="毫米" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="宽">
                  <el-input-number v-model="productForm.width" :min="1" placeholder="毫米" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="高">
                  <el-input-number v-model="productForm.height" :min="1" placeholder="毫米" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="盒型">
                  <el-select v-model="productForm.boxType" placeholder="请选择">
                    <el-option label="盒型1" value="type1" />
                    <el-option label="盒型2" value="type2" />
                  </el-select>
                </el-form-item>
              </el-col>
            </template>
            <el-col :span="6">
              <el-form-item label="数量">
                <el-input-number v-model="productForm.quantity" :min="1" placeholder="数量" />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 材料和工艺 -->
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="材料">
                <el-select v-model="productForm.material" placeholder="请选择材料" class="full-width">
                  <el-option label="材料1" value="material1" />
                  <el-option label="材料2" value="material2" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工艺">
                <el-checkbox-group v-model="productForm.processes">
                  <el-checkbox label="印刷">印刷</el-checkbox>
                  <el-checkbox label="覆膜">覆膜</el-checkbox>
                  <el-checkbox label="烫金">烫金</el-checkbox>
                  <el-checkbox label="UV">UV</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <!-- 操作按钮 -->
        <div class="button-group">
          <el-button type="primary" @click="calculateQuote">计算报价</el-button>
          <el-button @click="resetForm">重置</el-button>
          <el-button @click="saveQuote">暂存</el-button>
          <el-button type="danger" @click="submitOrder">下单</el-button>
        </div>
      </el-card>

      <!-- 报价结果区 -->
      <el-card v-if="showResult" class="section quote-result">
        <template #header>
          <div class="section-header">
            <span>报价结果</span>
          </div>
        </template>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="材料费用">¥500</el-descriptions-item>
          <el-descriptions-item label="加工费用">¥300</el-descriptions-item>
          <el-descriptions-item label="其他费用">¥200</el-descriptions-item>
          <el-descriptions-item label="总金额" :span="3">
            <span class="total-amount">{{ totalAmount }}</span>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
    </div>

    <!-- 右侧暂存区 -->
    <div class="quote-cache">
      <el-card class="cache-card">
        <template #header>
          <div class="section-header">
            <span>暂存区</span>
            <el-button link type="primary" @click="clearCache">清空</el-button>
          </div>
        </template>
        <div class="cache-list">
          <el-empty v-if="cachedQuotes.length === 0" description="暂无数据" />
          <div v-else class="cache-item" v-for="(quote, index) in cachedQuotes" :key="index">
            <div class="cache-item-header">
              <span>{{ quote.customerName }}</span>
              <span class="cache-item-amount">{{ quote.amount }}</span>
            </div>
            <div class="cache-item-info">
              <span>{{ quote.productInfo }}</span>
              <span>{{ quote.date }}</span>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 客户信息表单
const customerForm = ref({
  contactName: '',
  phone: '',
  address: ''
})

// 产品信息表单
const productForm = ref({
  quoteType: '平面',
  length: undefined as number | undefined,
  width: undefined as number | undefined,
  height: undefined as number | undefined,
  boxType: '',
  quantity: undefined as number | undefined,
  material: '',
  processes: [] as string[]
})

// 报价结果
const showResult = ref(false)
const totalAmount = ref('¥1,000')

// 暂存数据
const cachedQuotes = ref([
  {
    customerName: '张三',
    amount: '¥1,000',
    productInfo: '产品画册 200x300mm',
    date: '2024-01-20'
  },
  {
    customerName: '李四',
    amount: '¥2,500',
    productInfo: '包装盒 100x150x50mm',
    date: '2024-01-19'
  }
])

// 计算报价
const calculateQuote = () => {
  showResult.value = true
}

// 重置表单
const resetForm = () => {
  customerForm.value = {
    contactName: '',
    phone: '',
    address: ''
  }
  productForm.value = {
    quoteType: '平面',
    length: undefined,
    width: undefined,
    height: undefined,
    boxType: '',
    quantity: undefined,
    material: '',
    processes: []
  }
  showResult.value = false
}

// 暂存报价
const saveQuote = () => {
  if (cachedQuotes.value.length >= 6) {
    cachedQuotes.value.pop() // 移除最后一个
  }
  cachedQuotes.value.unshift({
    customerName: customerForm.value.contactName || '未命名客户',
    amount: totalAmount.value,
    productInfo: `${productForm.value.length}x${productForm.value.width}mm`,
    date: new Date().toLocaleDateString()
  })
}

// 清空暂存区
const clearCache = () => {
  cachedQuotes.value = []
}

// 提交订单
const submitOrder = () => {
  // 提交订单逻辑
}
</script>

<style scoped>
.home-layout {
  display: flex;
  gap: 20px;
  padding: 20px;
  background-color: #f4f4f4;
  min-height: calc(100vh - 60px);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section {
  background: #fff;
  border-radius: 4px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  justify-content: center;
}

.quote-result {
  margin-top: auto;
}

.total-amount {
  font-size: 24px;
  color: #f56c6c;
  font-weight: bold;
}

.quote-cache {
  width: 300px;
  flex-shrink: 0;
}

.cache-card {
  position: sticky;
  top: 20px;
}

.cache-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cache-item {
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.cache-item:hover {
  background-color: #f5f7fa;
}

.cache-item-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-weight: bold;
}

.cache-item-amount {
  color: #f56c6c;
}

.cache-item-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
}

:deep(.el-form-item) {
  margin-bottom: 18px;
}

:deep(.el-input-number) {
  width: 100%;
}

.full-width {
  width: 100%;
}

:deep(.el-radio-group),
:deep(.el-checkbox-group) {
  display: flex;
  gap: 20px;
}
</style> 