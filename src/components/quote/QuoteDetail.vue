<template>
  <div class="quote-detail" v-loading="loading">
    <el-descriptions :column="2" border>
      <el-descriptions-item label="客户名称">{{ detail.customerName }}</el-descriptions-item>
      <el-descriptions-item label="联系电话">{{ detail.phone }}</el-descriptions-item>
      <el-descriptions-item label="产品类型">{{ getProductTypeName(detail.productType) }}</el-descriptions-item>
      <el-descriptions-item label="产品名称">{{ detail.productName }}</el-descriptions-item>
      <el-descriptions-item label="印刷数量">{{ detail.quantity }}</el-descriptions-item>
      <el-descriptions-item label="成品尺寸">{{ detail.length }}×{{ detail.width }}mm</el-descriptions-item>
      <el-descriptions-item label="材质">{{ getMaterialName(detail.material) }}</el-descriptions-item>
      <el-descriptions-item label="印刷方式">{{ getPrintMethodName(detail.printMethod) }}</el-descriptions-item>
      <el-descriptions-item label="印刷颜色">{{ getColorName(detail.colors) }}</el-descriptions-item>
      <el-descriptions-item label="后道工艺">{{ detail.postProcess.join('、') || '无' }}</el-descriptions-item>
      <el-descriptions-item label="备注说明" :span="2">{{ detail.remarks || '无' }}</el-descriptions-item>
    </el-descriptions>

    <el-divider>费用明细</el-divider>
    
    <el-descriptions :column="2" border>
      <el-descriptions-item label="材料费用">{{ detail.materialCost }}元</el-descriptions-item>
      <el-descriptions-item label="印刷费用">{{ detail.printCost }}元</el-descriptions-item>
      <el-descriptions-item label="后道费用">{{ detail.postProcessCost }}元</el-descriptions-item>
      <el-descriptions-item label="其他费用">{{ detail.otherCost }}元</el-descriptions-item>
      <el-descriptions-item label="总计金额" :span="2">
        <span class="total-amount">{{ detail.amount }}元</span>
      </el-descriptions-item>
    </el-descriptions>

    <el-divider>报价信息</el-divider>

    <el-descriptions :column="2" border>
      <el-descriptions-item label="报价日期">{{ detail.date }}</el-descriptions-item>
      <el-descriptions-item label="报价状态">
        <el-tag :type="getStatusType(detail.status)">{{ detail.status }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="创建时间">{{ detail.createTime }}</el-descriptions-item>
      <el-descriptions-item label="更新时间">{{ detail.updateTime }}</el-descriptions-item>
      <el-descriptions-item label="操作人员">{{ detail.operator }}</el-descriptions-item>
    </el-descriptions>

    <div class="actions">
      <el-button type="primary" @click="handlePrint">打印报价单</el-button>
      <el-button type="success" @click="handleExport">导出PDF</el-button>
      <el-button 
        type="warning" 
        @click="handleCopy"
        v-if="detail.status !== '已取消'"
      >
        复制报价
      </el-button>
      <el-button 
        type="danger" 
        @click="handleCancel"
        v-if="detail.status === '待确认'"
      >
        取消报价
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { QuoteDetail } from '@/types/quote'

const props = defineProps<{
  quoteId: string
}>()

// 加载状态
const loading = ref(false)

// 报价详情
const detail = ref<QuoteDetail>({
  id: '',
  date: '',
  customerName: '',
  phone: '',
  productType: '',
  productName: '',
  quantity: 0,
  length: 0,
  width: 0,
  material: '',
  printMethod: '',
  colors: '',
  postProcess: [],
  remarks: '',
  amount: 0,
  materialCost: 0,
  printCost: 0,
  postProcessCost: 0,
  otherCost: 0,
  status: '草稿',
  createTime: '',
  updateTime: '',
  operator: ''
})

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

// 获取产品类型名称
const getProductTypeName = (value: string) => {
  const type = productTypes.find(item => item.value === value)
  return type ? type.label : value
}

// 获取材质名称
const getMaterialName = (value: string) => {
  const material = materials.find(item => item.value === value)
  return material ? material.label : value
}

// 获取印刷方式名称
const getPrintMethodName = (value: string) => {
  const method = printMethods.find(item => item.value === value)
  return method ? method.label : value
}

// 获取颜色名称
const getColorName = (value: string) => {
  const colorMap: Record<string, string> = {
    '1': '单色',
    '2': '双色',
    '4': '四色',
    'special': '专色'
  }
  return colorMap[value] || value
}

// 获取状态标签类型
const getStatusType = (status: QuoteDetail['status']) => {
  const statusMap: Record<QuoteDetail['status'], string> = {
    '草稿': 'info',
    '待确认': 'warning',
    '已确认': 'success',
    '已取消': 'danger'
  }
  return statusMap[status]
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    // 这里应该调用API获取数据
    // 模拟数据
    await new Promise(resolve => setTimeout(resolve, 1000))
    Object.assign(detail.value, {
      id: props.quoteId,
      date: '2024-01-18',
      customerName: '上海某某科技有限公司',
      phone: '13800138000',
      productType: 'book',
      productName: '产品手册印刷',
      quantity: 1000,
      length: 210,
      width: 285,
      material: 'art_paper_200',
      printMethod: 'offset',
      colors: '4',
      postProcess: ['覆膜', '装订'],
      remarks: '需要在下周三之前完成',
      amount: 5280,
      materialCost: 2000,
      printCost: 2500,
      postProcessCost: 500,
      otherCost: 280,
      status: '已确认',
      createTime: '2024-01-18 10:00:00',
      updateTime: '2024-01-18 10:30:00',
      operator: '张三'
    })
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

// 打印报价单
const handlePrint = () => {
  window.print()
}

// 导出PDF
const handleExport = () => {
  ElMessage.success('开始导出PDF...')
}

// 复制报价
const handleCopy = () => {
  ElMessage.success('复制报价成功')
}

// 取消报价
const handleCancel = () => {
  ElMessageBox.confirm(
    '确定要取消这个报价吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    // 这里应该调用API取消报价
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success('报价已取消')
    detail.value.status = '已取消'
  }).catch(() => {})
}

// 初始化
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.quote-detail {
  padding: 20px;
}

.total-amount {
  font-size: 20px;
  color: #f56c6c;
  font-weight: bold;
}

.actions {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

@media print {
  .actions {
    display: none;
  }
}
</style> 