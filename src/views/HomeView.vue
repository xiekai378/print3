<template>
  <div class="home-container">
    <!-- 顶部统计卡片 -->
    <div class="statistics-cards">
      <el-row :gutter="20">
        <el-col :span="6" v-for="(item, index) in statisticsData" :key="index">
          <el-card class="statistic-card">
            <div class="card-content">
              <div class="card-title">{{ item.title }}</div>
              <div class="card-value">{{ item.value }}</div>
              <div class="card-trend">
                <span :class="item.trend >= 0 ? 'up' : 'down'">
                  {{ Math.abs(item.trend) }}%
                </span>
                较上周
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 快捷功能区 -->
    <div class="quick-actions">
      <el-row :gutter="20">
        <el-col :span="6" v-for="(action, index) in quickActions" :key="index">
          <el-card class="action-card" @click="handleQuickAction(action)">
            <div class="action-content">
              <el-icon :size="24">
                <component :is="action.icon" />
              </el-icon>
              <div class="action-title">{{ action.title }}</div>
              <div class="action-desc">{{ action.description }}</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 报价历史 -->
    <div class="quote-history">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>最近报价记录</span>
            <el-button type="primary" link @click="viewAllHistory">查看全部</el-button>
          </div>
        </template>
        <el-table :data="quoteHistory" style="width: 100%">
          <el-table-column prop="date" label="日期" width="180" />
          <el-table-column prop="customer" label="客户名称" width="180" />
          <el-table-column prop="product" label="产品名称" />
          <el-table-column prop="amount" label="金额" width="150" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template #default="scope">
              <el-button type="primary" link @click="viewQuoteDetail(scope.row)">
                查看详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Document, 
  Histogram, 
  Collection, 
  User 
} from '@element-plus/icons-vue'

const router = useRouter()

// 定义类型
interface QuickAction {
  title: string
  description: string
  icon: string
  route: string
}

interface QuoteRecord {
  id?: string
  date: string
  customer: string
  product: string
  amount: string
  status: '已确认' | '待确认' | '已完成'
}

// 统计数据
const statisticsData = ref([
  { title: '本月报价数', value: 128, trend: 5.2 },
  { title: '本月成交额', value: '￥125,901', trend: 8.1 },
  { title: '待处理报价', value: 12, trend: -2.5 },
  { title: '客户满意度', value: '96%', trend: 1.2 }
])

// 快捷功能
const quickActions = ref([
  {
    title: '快速报价',
    description: '快速生成标准报价单',
    icon: 'Document',
    route: '/quote/quick'
  },
  {
    title: '批量报价',
    description: '批量处理多个报价需求',
    icon: 'Collection',
    route: '/quote/batch'
  },
  {
    title: '数据分析',
    description: '查看报价数据分析',
    icon: 'Histogram',
    route: '/analysis'
  },
  {
    title: '客户管理',
    description: '管理客户信息与关系',
    icon: 'User',
    route: '/customer'
  }
])

// 报价历史数据
const quoteHistory = ref([
  {
    date: '2024-01-18',
    customer: '上海某某科技有限公司',
    product: '产品手册印刷',
    amount: '￥5,280',
    status: '已确认'
  },
  {
    date: '2024-01-17',
    customer: '北京某某贸易有限公司',
    product: '包装盒印刷',
    amount: '￥12,800',
    status: '待确认'
  },
  {
    date: '2024-01-17',
    customer: '广州某某实业有限公司',
    product: '宣传海报印刷',
    amount: '￥3,600',
    status: '已完成'
  }
])

// 处理快捷功能点击
const handleQuickAction = (action: QuickAction) => {
  router.push(action.route)
}

// 查看全部历史
const viewAllHistory = () => {
  router.push('/quote/history')
}

// 查看报价详情
const viewQuoteDetail = (quote: QuoteRecord) => {
  router.push({
    path: '/quote/detail',
    query: { id: quote.id }
  })
}

// 获取状态标签类型
const getStatusType = (status: QuoteRecord['status']) => {
  const statusMap = {
    '已确认': 'success',
    '待确认': 'warning',
    '已完成': 'info'
  } as const
  return statusMap[status]
}
</script>

<style scoped>
.home-container {
  padding: 20px;
}

.statistics-cards {
  margin-bottom: 20px;
}

.statistic-card {
  height: 120px;
}

.card-content {
  text-align: center;
}

.card-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.card-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}

.card-trend {
  font-size: 12px;
  color: #999;
}

.card-trend .up {
  color: #67C23A;
}

.card-trend .down {
  color: #F56C6C;
}

.quick-actions {
  margin-bottom: 20px;
}

.action-card {
  cursor: pointer;
  transition: all 0.3s;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.action-content {
  text-align: center;
  padding: 20px;
}

.action-title {
  font-size: 16px;
  font-weight: bold;
  margin: 12px 0 8px;
}

.action-desc {
  font-size: 12px;
  color: #666;
}

.quote-history {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 