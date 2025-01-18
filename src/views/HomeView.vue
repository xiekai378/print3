<template>
  <div class="container">
    <!-- 客户信息 -->
    <div class="form-section">
      <label>客户信息</label>
      <el-input v-model="contactName" placeholder="联系人" />
      <el-input v-model="address" placeholder="地址" />
      <el-input v-model="phone" placeholder="电话" />
    </div>

    <!-- 报价方式选择 -->
    <div class="form-section">
      <label>报价方式</label>
      <div class="radio-group">
        <el-radio-group v-model="quoteType">
          <el-radio label="平面">平面</el-radio>
          <el-radio label="立体">立体</el-radio>
        </el-radio-group>
      </div>
    </div>

    <!-- 尺寸选择 -->
    <div class="form-section">
      <label>尺寸选择</label>
      <div v-if="quoteType === '平面'" class="dimensions">
        <div class="dimension-item">
          <label>长 (毫米)</label>
          <el-input-number v-model="flatLength" :min="1" placeholder="输入长度" />
        </div>
        <div class="dimension-item">
          <label>宽 (毫米)</label>
          <el-input-number v-model="flatWidth" :min="1" placeholder="输入宽度" />
        </div>
      </div>
      <div v-else class="dimensions">
        <div class="dimension-item">
          <label>长 (毫米)</label>
          <el-input-number v-model="boxLength" :min="1" placeholder="输入长度" />
        </div>
        <div class="dimension-item">
          <label>宽 (毫米)</label>
          <el-input-number v-model="boxWidth" :min="1" placeholder="输入宽度" />
        </div>
        <div class="dimension-item">
          <label>高 (毫米)</label>
          <el-input-number v-model="boxHeight" :min="1" placeholder="输入高度" />
        </div>
        <div class="dimension-item">
          <label>盒型</label>
          <el-select v-model="boxType" placeholder="请选择盒型">
            <el-option label="盒型1" value="type1" />
            <el-option label="盒型2" value="type2" />
          </el-select>
        </div>
      </div>
    </div>

    <!-- 材料选择 -->
    <div class="form-section">
      <label>材料选择</label>
      <el-select v-model="material" placeholder="请选择材料" class="full-width">
        <el-option label="材料1" value="material1" />
        <el-option label="材料2" value="material2" />
      </el-select>
    </div>

    <!-- 工艺选项 -->
    <div class="form-section">
      <label>工艺选项</label>
      <div class="process-options">
        <el-checkbox-group v-model="selectedProcesses">
          <el-checkbox label="印刷">印刷</el-checkbox>
          <el-checkbox label="覆膜">覆膜</el-checkbox>
          <el-checkbox label="烫金">烫金</el-checkbox>
          <el-checkbox label="UV">UV</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>

    <!-- 按钮组 -->
    <div class="button-group">
      <el-button type="primary" @click="calculateQuote">计算报价</el-button>
      <el-button @click="resetForm">重置</el-button>
      <el-button @click="saveQuote">暂存</el-button>
      <el-button type="danger" @click="submitOrder">下单</el-button>
    </div>

    <!-- 报价结果 -->
    <div v-if="showResult" class="form-section quote-result">
      <h2>报价结果</h2>
      <p class="total-amount">总金额: {{ totalAmount }}</p>
      <div class="quote-details">
        <!-- 报价详细信息 -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 表单数据
const contactName = ref('')
const address = ref('')
const phone = ref('')
const quoteType = ref('平面')
const flatLength = ref<number>()
const flatWidth = ref<number>()
const boxLength = ref<number>()
const boxWidth = ref<number>()
const boxHeight = ref<number>()
const boxType = ref('')
const material = ref('')
const selectedProcesses = ref<string[]>([])
const showResult = ref(false)
const totalAmount = ref('1000元')

// 计算报价
const calculateQuote = () => {
  showResult.value = true
}

// 重置表单
const resetForm = () => {
  contactName.value = ''
  address.value = ''
  phone.value = ''
  quoteType.value = '平面'
  flatLength.value = undefined
  flatWidth.value = undefined
  boxLength.value = undefined
  boxWidth.value = undefined
  boxHeight.value = undefined
  boxType.value = ''
  material.value = ''
  selectedProcesses.value = []
  showResult.value = false
}

// 暂存报价
const saveQuote = () => {
  // 暂存逻辑
}

// 提交订单
const submitOrder = () => {
  // 提交订单逻辑
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  background: #fff;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  min-height: calc(100vh - 100px);
}

.form-section {
  margin-bottom: 20px;
}

.form-section label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #333;
}

.form-section :deep(.el-input),
.form-section :deep(.el-select) {
  margin-bottom: 10px;
}

.radio-group {
  margin-bottom: 10px;
}

.dimensions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.dimension-item {
  display: flex;
  flex-direction: column;
}

.dimension-item label {
  margin-bottom: 4px;
  font-weight: normal;
}

.process-options {
  display: flex;
  gap: 20px;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 30px;
}

.quote-result {
  margin-top: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.quote-result h2 {
  margin-bottom: 16px;
  color: #333;
}

.total-amount {
  font-size: 20px;
  color: #f56c6c;
  font-weight: bold;
  margin-bottom: 16px;
}

.full-width {
  width: 100%;
}

:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-radio-group) {
  display: flex;
  gap: 20px;
}

:deep(.el-checkbox-group) {
  display: flex;
  gap: 20px;
}
</style> 