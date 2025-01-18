<template>
  <div class="order-detail">
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <h2>订单详情</h2>
            <el-tag :type="getStatusType(orderInfo.status)" class="status-tag">
              {{ getStatusLabel(orderInfo.status) }}
            </el-tag>
          </div>
          <div class="header-actions">
            <el-button type="primary" @click="printOrder">打印订单</el-button>
            <el-button type="success" @click="exportPDF">导出PDF</el-button>
          </div>
        </div>
      </template>

      <div class="detail-content" v-loading="loading">
        <!-- 基本信息 -->
        <el-divider>基本信息</el-divider>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单编号">{{ orderInfo.orderNo }}</el-descriptions-item>
          <el-descriptions-item label="下单时间">{{ orderInfo.createTime }}</el-descriptions-item>
          <el-descriptions-item label="客户名称">{{ orderInfo.customerName }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ orderInfo.phone }}</el-descriptions-item>
          <el-descriptions-item label="收货地址">{{ orderInfo.address }}</el-descriptions-item>
          <el-descriptions-item label="联系人">{{ orderInfo.contact }}</el-descriptions-item>
        </el-descriptions>

        <!-- 产品信息 -->
        <el-divider>产品信息</el-divider>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="产品类型">{{ getProductTypeName(orderInfo.productType) }}</el-descriptions-item>
          <el-descriptions-item label="产品名称">{{ orderInfo.productName }}</el-descriptions-item>
          <el-descriptions-item label="印刷数量">{{ orderInfo.quantity }}</el-descriptions-item>
          <el-descriptions-item label="成品尺寸">{{ orderInfo.length }}×{{ orderInfo.width }}mm</el-descriptions-item>
          <el-descriptions-item label="材质">{{ getMaterialName(orderInfo.material) }}</el-descriptions-item>
          <el-descriptions-item label="印刷颜色">{{ getColorName(orderInfo.colors) }}</el-descriptions-item>
          <el-descriptions-item label="后道工艺">{{ orderInfo.postProcess.join('、') || '无' }}</el-descriptions-item>
        </el-descriptions>

        <!-- 交付信息 -->
        <el-divider>交付信息</el-divider>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="交付日期">{{ orderInfo.deliveryDate }}</el-descriptions-item>
          <el-descriptions-item label="交付方式">{{ getDeliveryMethodName(orderInfo.deliveryMethod) }}</el-descriptions-item>
          <el-descriptions-item label="备注说明" :span="2">{{ orderInfo.remarks || '无' }}</el-descriptions-item>
        </el-descriptions>

        <!-- 费用信息 -->
        <el-divider>费用信息</el-divider>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="材料费用">{{ orderInfo.materialCost }}元</el-descriptions-item>
          <el-descriptions-item label="印刷费用">{{ orderInfo.printCost }}元</el-descriptions-item>
          <el-descriptions-item label="后道费用">{{ orderInfo.postProcessCost }}元</el-descriptions-item>
          <el-descriptions-item label="其他费用">{{ orderInfo.otherCost }}元</el-descriptions-item>
          <el-descriptions-item label="总计金额" :span="2">
            <span class="total-amount">{{ orderInfo.amount }}元</span>
          </el-descriptions-item>
        </el-descriptions>

        <!-- 状态记录 -->
        <el-divider>状态记录</el-divider>
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in orderInfo.statusHistory"
            :key="index"
            :type="getTimelineItemType(activity.status)"
            :timestamp="activity.time"
          >
            <h4>{{ getStatusLabel(activity.status) }}</h4>
            <p v-if="activity.operator">操作人：{{ activity.operator }}</p>
            <p v-if="activity.remark">备注：{{ activity.remark }}</p>
          </el-timeline-item>
        </el-timeline>

        <!-- 操作按钮 -->
        <div class="detail-actions">
          <el-button 
            type="success" 
            @click="updateStatus"
            v-if="canUpdateStatus(orderInfo.status)"
          >
            更新状态
          </el-button>
          <el-button 
            type="danger" 
            @click="cancelOrder"
            v-if="canCancel(orderInfo.status)"
          >
            取消订单
          </el-button>
          <el-button @click="goBack">返回列表</el-button>
        </div>
      </div>

      <!-- 状态更新对话框 -->
      <el-dialog
        v-model="statusDialogVisible"
        title="更新订单状态"
        width="500px"
        destroy-on-close
      >
        <el-form :model="statusForm" label-width="100px">
          <el-form-item label="当前状态">
            <el-tag :type="getStatusType(orderInfo.status)">
              {{ getStatusLabel(orderInfo.status) }}
            </el-tag>
          </el-form-item>
          <el-form-item label="更新状态">
            <el-select v-model="statusForm.status" placeholder="请选择新状态">
              <el-option
                v-for="item in getNextStatuses(orderInfo.status)"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注说明">
            <el-input
              v-model="statusForm.remark"
              type="textarea"
              :rows="3"
              placeholder="请输入备注说明"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="statusDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="confirmUpdateStatus">
              确认
            </el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()

// 加载状态
const loading = ref(false)

// 状态更新对话框
const statusDialogVisible = ref(false)
const statusForm = reactive({
  status: '',
  remark: ''
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

// 订单状态选项
const orderStatuses = [
  { label: '待确认', value: 'pending' },
  { label: '生产中', value: 'producing' },
  { label: '待发货', value: 'ready' },
  { label: '已发货', value: 'shipped' },
  { label: '已完成', value: 'completed' },
  { label: '已取消', value: 'cancelled' }
]

// 订单信息
const orderInfo = reactive({
  orderNo: '',
  createTime: '',
  customerName: '',
  phone: '',
  address: '',
  contact: '',
  productType: '',
  productName: '',
  quantity: 0,
  length: 0,
  width: 0,
  material: '',
  colors: '',
  postProcess: [] as string[],
  deliveryDate: '',
  deliveryMethod: '',
  remarks: '',
  materialCost: 0,
  printCost: 0,
  postProcessCost: 0,
  otherCost: 0,
  amount: 0,
  status: '',
  statusHistory: [] as Array<{
    status: string
    time: string
    operator: string
    remark: string
  }>
})

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

// 获取交付方式名称
const getDeliveryMethodName = (value: string) => {
  const methodMap: Record<string, string> = {
    'express': '快递配送',
    'self': '上门自提',
    'delivery': '送货上门'
  }
  return methodMap[value] || value
}

// 获取状态标签类型
const getStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    'pending': 'warning',
    'producing': 'primary',
    'ready': 'success',
    'shipped': 'info',
    'completed': 'success',
    'cancelled': 'danger'
  }
  return statusMap[status] || 'info'
}

// 获取状态显示文本
const getStatusLabel = (status: string) => {
  const statusItem = orderStatuses.find(item => item.value === status)
  return statusItem ? statusItem.label : status
}

// 获取时间线项目类型
const getTimelineItemType = (status: string) => {
  const typeMap: Record<string, string> = {
    'pending': 'warning',
    'producing': 'primary',
    'ready': 'success',
    'shipped': 'info',
    'completed': 'success',
    'cancelled': 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取下一步可选状态
const getNextStatuses = (status: string) => {
  const statusMap: Record<string, string[]> = {
    'pending': ['producing', 'cancelled'],
    'producing': ['ready', 'cancelled'],
    'ready': ['shipped', 'cancelled'],
    'shipped': ['completed']
  }
  const nextStatusValues = statusMap[status] || []
  return orderStatuses.filter(item => nextStatusValues.includes(item.value))
}

// 判断是否可以更新状态
const canUpdateStatus = (status: string) => {
  return ['pending', 'producing', 'ready', 'shipped'].includes(status)
}

// 判断是否可以取消订单
const canCancel = (status: string) => {
  return ['pending', 'producing', 'ready'].includes(status)
}

// 加载订单数据
const loadOrderData = async () => {
  const orderId = route.query.id
  if (!orderId) {
    ElMessage.error('订单ID不能为空')
    return
  }

  loading.value = true
  try {
    // 这里应该调用API获取订单数据
    // 模拟数据
    await new Promise(resolve => setTimeout(resolve, 1000))
    Object.assign(orderInfo, {
      orderNo: 'PO202401180001',
      createTime: '2024-01-18 10:00:00',
      customerName: '上海某某科技有限公司',
      phone: '13800138000',
      address: '上海市浦东新区某某路88号',
      contact: '张三',
      productType: 'book',
      productName: '产品手册印刷',
      quantity: 1000,
      length: 210,
      width: 285,
      material: 'art_paper_200',
      colors: '4',
      postProcess: ['覆膜', '装订'],
      deliveryDate: '2024-01-25',
      deliveryMethod: 'express',
      remarks: '需要在下周三之前完成',
      materialCost: 2000,
      printCost: 2500,
      postProcessCost: 500,
      otherCost: 280,
      amount: 5280,
      status: 'producing',
      statusHistory: [
        {
          status: 'pending',
          time: '2024-01-18 10:00:00',
          operator: '李四',
          remark: '订单创建'
        },
        {
          status: 'producing',
          time: '2024-01-18 11:00:00',
          operator: '王五',
          remark: '开始生产'
        }
      ]
    })
  } catch (error) {
    ElMessage.error('加载订单数据失败')
  } finally {
    loading.value = false
  }
}

// 更新状态
const updateStatus = () => {
  statusForm.status = ''
  statusForm.remark = ''
  statusDialogVisible.value = true
}

// 确认更新状态
const confirmUpdateStatus = async () => {
  if (!statusForm.status) {
    ElMessage.warning('请选择新状态')
    return
  }

  try {
    // 这里应该调用API更新状态
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success('状态更新成功')
    statusDialogVisible.value = false
    loadOrderData()
  } catch (error) {
    ElMessage.error('状态更新失败')
  }
}

// 取消订单
const cancelOrder = () => {
  ElMessageBox.confirm(
    '确定要取消这个订单吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    // 这里应该调用API取消订单
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success('订单已取消')
    loadOrderData()
  }).catch(() => {})
}

// 打印订单
const printOrder = () => {
  window.print()
}

// 导出PDF
const exportPDF = () => {
  ElMessage.success('开始导出PDF...')
}

// 返回列表
const goBack = () => {
  router.push('/order-customer/orders')
}

// 初始化
onMounted(() => {
  loadOrderData()
})
</script>

<style scoped>
.order-detail {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-tag {
  font-size: 14px;
}

.detail-content {
  max-width: 1200px;
  margin: 0 auto;
}

.total-amount {
  font-size: 20px;
  color: #f56c6c;
  font-weight: bold;
}

.detail-actions {
  margin-top: 20px;
  text-align: center;
}

:deep(.el-divider__text) {
  font-size: 16px;
  font-weight: bold;
  color: #409eff;
}

:deep(.el-timeline-item__node) {
  width: 16px;
  height: 16px;
}

:deep(.el-timeline-item__content) {
  h4 {
    font-size: 14px;
    margin: 0 0 8px;
  }
  p {
    font-size: 13px;
    color: #666;
    margin: 4px 0;
  }
}

@media print {
  .header-actions,
  .detail-actions {
    display: none;
  }
}
</style> 