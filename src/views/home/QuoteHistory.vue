<template>
  <div class="quote-history">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>报价历史</h2>
          <div class="header-actions">
            <el-button type="primary" @click="exportSelected" :disabled="!selectedRows.length">
              导出选中
            </el-button>
          </div>
        </div>
      </template>

      <!-- 搜索条件 -->
      <el-form :model="searchForm" class="search-form" inline>
        <el-form-item label="客户名称">
          <el-input
            v-model="searchForm.customerName"
            placeholder="请输入客户名称"
            clearable
            @clear="handleSearch"
          />
        </el-form-item>
        <el-form-item label="产品类型">
          <el-select
            v-model="searchForm.productType"
            placeholder="请选择产品类型"
            clearable
            @clear="handleSearch"
          >
            <el-option
              v-for="item in productTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="报价时间">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            @change="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 报价历史表格 -->
      <el-table
        :data="quoteHistory"
        style="width: 100%"
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="date" label="报价日期" width="180" sortable />
        <el-table-column prop="customerName" label="客户名称" width="180" />
        <el-table-column prop="productType" label="产品类型" width="120">
          <template #default="scope">
            {{ getProductTypeName(scope.row.productType) }}
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="产品名称" />
        <el-table-column prop="quantity" label="数量" width="100" sortable />
        <el-table-column prop="amount" label="报价金额" width="120" sortable>
          <template #default="scope">
            <span class="amount">{{ scope.row.amount }}元</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="primary" link @click="viewDetail(scope.row)">
              查看详情
            </el-button>
            <el-button type="success" link @click="copyQuote(scope.row)">
              复制报价
            </el-button>
            <el-button 
              type="danger" 
              link 
              @click="deleteQuote(scope.row)"
              v-if="scope.row.status === '草稿'"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="报价详情"
      width="800px"
      destroy-on-close
    >
      <quote-detail v-if="detailVisible" :quote-id="currentQuoteId" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { QuoteRecord } from '@/types/quote'
import QuoteDetail from '@/components/quote/QuoteDetail.vue'

// 产品类型选项
const productTypes = [
  { label: '画册印刷', value: 'book' },
  { label: '包装印刷', value: 'package' },
  { label: '名片印刷', value: 'card' },
  { label: '海报印刷', value: 'poster' }
]

// 搜索表单
const searchForm = reactive({
  customerName: '',
  productType: '',
  dateRange: []
})

// 表格数据
const loading = ref(false)
const quoteHistory = ref<QuoteRecord[]>([])
const selectedRows = ref<QuoteRecord[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 详情对话框
const detailVisible = ref(false)
const currentQuoteId = ref('')

// 获取产品类型名称
const getProductTypeName = (value: string) => {
  const type = productTypes.find(item => item.value === value)
  return type ? type.label : value
}

// 获取状态标签类型
const getStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    '草稿': 'info',
    '待确认': 'warning',
    '已确认': 'success',
    '已取消': 'danger'
  }
  return statusMap[status] || 'info'
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    // 这里应该调用API获取数据
    // 模拟数据
    await new Promise(resolve => setTimeout(resolve, 1000))
    quoteHistory.value = [
      {
        id: '1',
        date: '2024-01-18',
        customerName: '上海某某科技有限公司',
        productType: 'book',
        productName: '产品手册印刷',
        quantity: 1000,
        amount: 5280,
        status: '已确认'
      },
      {
        id: '2',
        date: '2024-01-17',
        customerName: '北京某某贸易有限公司',
        productType: 'package',
        productName: '包装盒印刷',
        quantity: 500,
        amount: 12800,
        status: '待确认'
      },
      {
        id: '3',
        date: '2024-01-17',
        customerName: '广州某某实业有限公司',
        productType: 'poster',
        productName: '宣传海报印刷',
        quantity: 2000,
        amount: 3600,
        status: '草稿'
      }
    ]
    total.value = 100
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
  loadData()
}

// 重置搜索
const resetSearch = () => {
  Object.assign(searchForm, {
    customerName: '',
    productType: '',
    dateRange: []
  })
  handleSearch()
}

// 处理分页
const handleSizeChange = (val: number) => {
  pageSize.value = val
  loadData()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  loadData()
}

// 处理表格选择
const handleSelectionChange = (val: QuoteRecord[]) => {
  selectedRows.value = val
}

// 查看详情
const viewDetail = (row: QuoteRecord) => {
  currentQuoteId.value = row.id
  detailVisible.value = true
}

// 复制报价
const copyQuote = (row: QuoteRecord) => {
  // 这里应该跳转到报价页面，并带上当前报价的数据
  ElMessage.success('复制报价成功')
}

// 删除报价
const deleteQuote = (row: QuoteRecord) => {
  ElMessageBox.confirm(
    '确定要删除这条报价记录吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    // 这里应该调用API删除数据
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success('删除成功')
    loadData()
  }).catch(() => {})
}

// 导出选中
const exportSelected = () => {
  // 这里应该处理导出逻辑
  ElMessage.success(`已选中${selectedRows.value.length}条记录，开始导出...`)
}

// 初始化加载数据
loadData()
</script>

<style scoped>
.quote-history {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-bottom: 20px;
  padding: 20px;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  background-color: #f5f7fa;
}

.amount {
  color: #f56c6c;
  font-weight: bold;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 