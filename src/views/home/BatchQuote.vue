<template>
  <div class="batch-quote">
    <el-card class="quote-form">
      <template #header>
        <div class="card-header">
          <h2>批量报价</h2>
          <div class="header-actions">
            <el-button type="primary" @click="importTemplate">下载模板</el-button>
            <el-upload
              class="upload-demo"
              action="#"
              :auto-upload="false"
              :on-change="handleFileChange"
              accept=".xlsx,.xls"
            >
              <el-button type="success">导入Excel</el-button>
            </el-upload>
          </div>
        </div>
      </template>

      <!-- 批量报价表格 -->
      <el-table
        :data="quoteList"
        style="width: 100%"
        :border="true"
        height="500"
        v-loading="loading"
      >
        <el-table-column type="index" width="50" />
        <el-table-column prop="customerName" label="客户名称" width="150">
          <template #default="scope">
            <el-input v-model="scope.row.customerName" placeholder="请输入客户名称" />
          </template>
        </el-table-column>
        <el-table-column prop="productType" label="产品类型" width="150">
          <template #default="scope">
            <el-select v-model="scope.row.productType" placeholder="请选择">
              <el-option
                v-for="item in productTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="数量" width="120">
          <template #default="scope">
            <el-input-number v-model="scope.row.quantity" :min="1" />
          </template>
        </el-table-column>
        <el-table-column label="尺寸(mm)" width="200">
          <template #default="scope">
            <div class="size-inputs">
              <el-input-number v-model="scope.row.length" :min="1" placeholder="长" />
              <span class="multiply">×</span>
              <el-input-number v-model="scope.row.width" :min="1" placeholder="宽" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="material" label="材质" width="150">
          <template #default="scope">
            <el-select v-model="scope.row.material" placeholder="请选择">
              <el-option
                v-for="item in materials"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="printMethod" label="印刷方式" width="150">
          <template #default="scope">
            <el-select v-model="scope.row.printMethod" placeholder="请选择">
              <el-option
                v-for="item in printMethods"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="colors" label="印刷颜色" width="120">
          <template #default="scope">
            <el-select v-model="scope.row.colors" placeholder="请选择">
              <el-option label="单色" value="1" />
              <el-option label="双色" value="2" />
              <el-option label="四色" value="4" />
              <el-option label="专色" value="special" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="postProcess" label="后道工艺" width="200">
          <template #default="scope">
            <el-select
              v-model="scope.row.postProcess"
              multiple
              collapse-tags
              placeholder="请选择"
            >
              <el-option label="覆膜" value="覆膜" />
              <el-option label="烫金" value="烫金" />
              <el-option label="UV" value="UV" />
              <el-option label="模切" value="模切" />
              <el-option label="装订" value="装订" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="报价金额" width="120">
          <template #default="scope">
            <span class="amount">{{ scope.row.amount || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="scope">
            <el-button type="danger" link @click="removeRow(scope.$index)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 表格操作 -->
      <div class="table-actions">
        <el-button type="primary" @click="addRow">添加行</el-button>
        <el-button type="danger" @click="clearTable">清空表格</el-button>
        <el-button type="success" @click="calculateAll">批量计算</el-button>
        <el-button type="warning" @click="exportQuotes">导出报价单</el-button>
      </div>

      <!-- 汇总信息 -->
      <div class="summary-info" v-if="totalAmount > 0">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="报价总数">{{ quoteList.length }}个</el-descriptions-item>
          <el-descriptions-item label="合计金额">
            <span class="total-amount">{{ totalAmount }}元</span>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { UploadFile } from 'element-plus'

interface QuoteItem {
  customerName: string
  productType: string
  quantity: number
  length: number
  width: number
  material: string
  printMethod: string
  colors: string
  postProcess: string[]
  amount: number
}

// 加载状态
const loading = ref(false)

// 报价列表
const quoteList = ref<QuoteItem[]>([])

// 产品类型选项
const productTypes = [
  { label: '画册印刷', value: 'book' },
  { label: '包装印刷', value: 'package' },
  { label: '名片印刷', value: 'card' },
  { label: '海报印刷', value: 'poster' }
]

// 材质选项
const materials = [
  { label: '铜版纸157g', value: 'art_paper_157' },
  { label: '铜版纸200g', value: 'art_paper_200' },
  { label: '铜版纸250g', value: 'art_paper_250' },
  { label: '双铜纸300g', value: 'double_paper_300' }
]

// 印刷方式
const printMethods = [
  { label: '胶印', value: 'offset' },
  { label: '数码印刷', value: 'digital' },
  { label: '丝网印刷', value: 'screen' }
]

// 计算总金额
const totalAmount = computed(() => {
  return quoteList.value.reduce((sum, item) => sum + (item.amount || 0), 0)
})

// 添加行
const addRow = () => {
  quoteList.value.push({
    customerName: '',
    productType: '',
    quantity: 100,
    length: 210,
    width: 285,
    material: '',
    printMethod: '',
    colors: '',
    postProcess: [],
    amount: 0
  })
}

// 删除行
const removeRow = (index: number) => {
  quoteList.value.splice(index, 1)
}

// 清空表格
const clearTable = () => {
  quoteList.value = []
}

// 计算单个报价
const calculateQuote = (quote: QuoteItem) => {
  const basePrice = 100 // 基础价格
  const quantityFactor = quote.quantity / 100 // 数量因素
  const sizeFactor = (quote.length * quote.width) / 10000 // 尺寸因素
  const colorFactor = Number(quote.colors) * 50 // 颜色因素
  const postProcessFactor = quote.postProcess.length * 30 // 后道工艺因素

  const materialCost = Math.round(basePrice * sizeFactor)
  const printCost = Math.round(colorFactor * quantityFactor)
  const postProcessCost = Math.round(postProcessFactor * sizeFactor)
  const otherCost = Math.round(basePrice * 0.1)

  return Math.round(materialCost + printCost + postProcessCost + otherCost)
}

// 批量计算
const calculateAll = async () => {
  if (quoteList.value.length === 0) {
    ElMessage.warning('请先添加报价项')
    return
  }

  loading.value = true
  try {
    // 模拟异步计算
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    quoteList.value = quoteList.value.map(quote => ({
      ...quote,
      amount: calculateQuote(quote)
    }))
    
    ElMessage.success('批量计算完成')
  } catch (error) {
    ElMessage.error('计算过程中出现错误')
  } finally {
    loading.value = false
  }
}

// 处理文件导入
const handleFileChange = (file: UploadFile) => {
  // 这里应该处理Excel文件的解析
  ElMessage.success('文件上传成功，开始解析...')
}

// 下载模板
const importTemplate = () => {
  // 这里应该提供模板下载功能
  ElMessage.success('模板下载中...')
}

// 导出报价单
const exportQuotes = () => {
  if (quoteList.value.length === 0) {
    ElMessage.warning('没有可导出的报价数据')
    return
  }
  // 这里应该处理导出Excel功能
  ElMessage.success('报价单导出中...')
}

// 初始化添加一行
addRow()
</script>

<style scoped>
.batch-quote {
  padding: 20px;
}

.quote-form {
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.size-inputs {
  display: flex;
  align-items: center;
  gap: 5px;
}

.multiply {
  margin: 0 5px;
}

.table-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.summary-info {
  margin-top: 20px;
}

.amount {
  color: #f56c6c;
  font-weight: bold;
}

.total-amount {
  font-size: 20px;
  color: #f56c6c;
  font-weight: bold;
}

:deep(.el-upload) {
  margin-left: 10px;
}

:deep(.el-table .el-input-number) {
  width: 100%;
}

:deep(.el-table .el-select) {
  width: 100%;
}
</style> 