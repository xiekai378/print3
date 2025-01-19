<template>
  <div class="home-container">
    <el-row :gutter="20">
      <!-- 左侧主要内容区 -->
      <el-col :span="18">
        <!-- 客户信息输入区 -->
        <el-card class="section-card">
          <template #header>
            <div class="card-header">
              <span>客户信息</span>
              <el-button type="primary" link @click="loadCustomerInfo">
                读取已有客户
              </el-button>
            </div>
          </template>
          <el-form :model="customerForm" label-width="100px">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="客户名称">
                  <el-input v-model="customerForm.name" placeholder="请输入客户名称" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="联系电话">
                  <el-input v-model="customerForm.phone" placeholder="请输入联系电话" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="联系地址">
                  <el-input v-model="customerForm.address" placeholder="请输入联系地址" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>

        <!-- 数据输入区 -->
        <el-card class="section-card">
          <template #header>
            <div class="card-header">
              <span>产品信息</span>
            </div>
          </template>
          <el-form :model="productForm" label-width="100px">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="产品类型">
                  <el-select v-model="productForm.type" placeholder="请选择产品类型" @change="handleTypeChange">
                    <el-option v-for="item in productTypes" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="材料选择">
                  <el-select v-model="productForm.material" placeholder="请选择材料">
                    <el-option v-for="item in materials" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="数量">
                  <el-input-number v-model="productForm.quantity" :min="1" />
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 输入方式选择 -->
            <el-row>
              <el-col :span="24">
                <el-form-item label="输入方式">
                  <el-radio-group v-model="productForm.inputType">
                    <el-radio label="flat">平面</el-radio>
                    <el-radio label="box">立体</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 尺寸输入 -->
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="尺寸信息">
                  <!-- 平面尺寸输入 -->
                  <div v-if="productForm.inputType === 'flat'" class="size-inputs">
                    <el-input-number v-model="productForm.length" :min="0" placeholder="长" />
                    <span class="size-separator">×</span>
                    <el-input-number v-model="productForm.width" :min="0" placeholder="宽" />
                    <span class="unit">mm</span>
                  </div>
                  <!-- 立体尺寸输入 -->
                  <div v-else class="size-inputs">
                    <el-input-number v-model="productForm.length" :min="0" placeholder="长" />
                    <span class="size-separator">×</span>
                    <el-input-number v-model="productForm.width" :min="0" placeholder="宽" />
                    <span class="size-separator">×</span>
                    <el-input-number v-model="productForm.height" :min="0" placeholder="高" />
                    <span class="unit">mm</span>
                    <el-select v-model="productForm.boxType" placeholder="请选择盒型" class="box-type-select">
                      <el-option v-for="item in boxTypes" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 工艺选择 -->
            <el-row>
              <el-col :span="24">
                <el-form-item label="工艺选择">
                  <el-checkbox-group v-model="productForm.processes">
                    <el-checkbox v-for="process in processes" :key="process.value" :label="process.value">
                      {{ process.label }}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 操作按钮 -->
            <el-row>
              <el-col :span="24">
                <div class="button-group">
                  <el-button type="primary" @click="calculatePrice">计算报价</el-button>
                  <el-button @click="saveTemp">暂存</el-button>
                  <el-button @click="resetForm">重置</el-button>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </el-card>

        <!-- 报价显示区 -->
        <el-card v-if="showQuote" class="section-card">
          <template #header>
            <div class="card-header">
              <span>报价结果</span>
              <el-button type="primary" link @click="createOrder">
                生成订单
              </el-button>
            </div>
          </template>
          <el-descriptions :column="3" border>
            <el-descriptions-item label="材料费用">{{ quoteResult.materialCost }}元</el-descriptions-item>
            <el-descriptions-item label="加工费用">{{ quoteResult.processCost }}元</el-descriptions-item>
            <el-descriptions-item label="其他费用">{{ quoteResult.otherCost }}元</el-descriptions-item>
            <el-descriptions-item label="总计金额" :span="3">
              <span class="total-amount">{{ quoteResult.totalAmount }}元</span>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>

      <!-- 右侧暂存区 -->
      <el-col :span="6">
        <el-card class="temp-card">
          <template #header>
            <div class="card-header">
              <span>暂存记录</span>
              <el-button type="primary" link @click="clearTemp">
                清空
              </el-button>
            </div>
          </template>
          <div class="temp-list">
            <div v-for="(item, index) in tempList" :key="index" class="temp-item" @click="loadTemp(item)">
              <div class="temp-item-header">
                <span>{{ item.customerName }}</span>
                <span class="temp-time">{{ item.time }}</span>
              </div>
              <div class="temp-item-content">
                <p>{{ item.productType }} - {{ item.quantity }}件</p>
                <p>{{ item.totalAmount }}元</p>
              </div>
            </div>
            <el-empty v-if="!tempList.length" description="暂无记录" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'

// 客户信息表单
const customerForm = reactive({
  name: '',
  phone: '',
  address: ''
})

// 产品信息表单
const productForm = reactive({
  type: '',
  material: '',
  quantity: 1,
  inputType: 'flat',
  length: 0,
  width: 0,
  height: 0,
  boxType: '',
  processes: []
})

// 产品类型选项
const productTypes = [
  { value: 'box', label: '包装盒' },
  { value: 'book', label: '画册' },
  { value: 'paper', label: '纸张' }
]

// 材料选项
const materials = [
  { value: 'material1', label: '材料1' },
  { value: 'material2', label: '材料2' }
]

// 工艺选项
const processes = [
  { value: 'print', label: '印刷' },
  { value: 'uv', label: 'UV' },
  { value: 'hot', label: '烫金' }
]

// 盒型选项
const boxTypes = [
  { value: 'type1', label: '天地盖' },
  { value: 'type2', label: '抽屉盒' },
  { value: 'type3', label: '书型盒' },
  { value: 'type4', label: '吸塑盒' },
  { value: 'type5', label: '卡纸盒' }
]

// 报价结果
const showQuote = ref(false)
const quoteResult = reactive({
  materialCost: 0,
  processCost: 0,
  otherCost: 0,
  totalAmount: 0
})

// 暂存列表
const tempList = ref([
  {
    customerName: '测试客户1',
    time: '2024-01-18 15:30',
    productType: '包装盒',
    quantity: 1000,
    totalAmount: 5000
  }
])

// 处理产品类型变化
const handleTypeChange = (value: string) => {
  // TODO: 根据产品类型加载对应的材料和工艺选项
}

// 计算报价
const calculatePrice = () => {
  // TODO: 调用后端API计算报价
  showQuote.value = true
  quoteResult.materialCost = 2000
  quoteResult.processCost = 2000
  quoteResult.otherCost = 1000
  quoteResult.totalAmount = 5000
}

// 暂存当前报价
const saveTemp = () => {
  if (tempList.value.length >= 6) {
    ElMessage.warning('暂存数量已达上限')
    return
  }
  
  tempList.value.unshift({
    customerName: customerForm.name || '未命名客户',
    time: new Date().toLocaleString(),
    productType: productTypes.find(t => t.value === productForm.type)?.label || '',
    quantity: productForm.quantity,
    totalAmount: quoteResult.totalAmount
  })
  
  ElMessage.success('暂存成功')
}

// 加载暂存记录
const loadTemp = (item: any) => {
  // TODO: 加载暂存的报价详情
  ElMessage.success('加载成功')
}

// 清空暂存记录
const clearTemp = () => {
  tempList.value = []
  ElMessage.success('清空成功')
}

// 重置表单
const resetForm = () => {
  Object.assign(customerForm, {
    name: '',
    phone: '',
    address: ''
  })
  
  Object.assign(productForm, {
    type: '',
    material: '',
    quantity: 1,
    inputType: 'flat',
    length: 0,
    width: 0,
    height: 0,
    boxType: '',
    processes: []
  })
  
  showQuote.value = false
}

// 读取已有客户信息
const loadCustomerInfo = () => {
  // TODO: 打开客户选择对话框
}

// 生成订单
const createOrder = () => {
  // TODO: 生成订单
  ElMessage.success('订单已生成')
}
</script>

<style scoped>
.home-container {
  padding: 20px;
}

.section-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.size-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
}

.size-separator {
  color: #666;
}

.unit {
  margin-left: 10px;
  color: #666;
}

.total-amount {
  font-size: 20px;
  color: #f56c6c;
  font-weight: bold;
}

.temp-card {
  position: sticky;
  top: 20px;
}

.temp-list {
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

.temp-item {
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.3s;
}

.temp-item:hover {
  background-color: #f5f7fa;
}

.temp-item:last-child {
  border-bottom: none;
}

.temp-item-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.temp-time {
  font-size: 12px;
  color: #999;
}

.temp-item-content {
  font-size: 14px;
  color: #666;
}

.temp-item-content p {
  margin: 5px 0;
}

.box-type-select {
  margin-left: 20px;
  width: 200px;
}
</style>
