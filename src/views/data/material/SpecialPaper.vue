<template>
  <div class="special-paper">
    <el-card class="content-card">
      <template #header>
        <div class="card-header">
          <span>特种纸管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><plus /></el-icon>添加材料
          </el-button>
        </div>
      </template>

      <!-- 搜索栏 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="材料名称">
          <el-input v-model="searchForm.name" placeholder="请输入材料名称" />
        </el-form-item>
        <el-form-item label="克重范围">
          <el-input-number 
            v-model="searchForm.weightMin" 
            :min="0" 
            placeholder="最小克重"
            class="weight-input"
          />
          <span class="separator">-</span>
          <el-input-number 
            v-model="searchForm.weightMax" 
            :min="0" 
            placeholder="最大克重"
            class="weight-input"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><search /></el-icon>搜索
          </el-button>
          <el-button @click="resetSearch">
            <el-icon><refresh /></el-icon>重置
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 材料列表 -->
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="name" label="材料名称" />
        <el-table-column prop="weight" label="克重(g/m²)" width="120" />
        <el-table-column prop="size" label="规格尺寸" width="150" />
        <el-table-column prop="price" label="单价(元)" width="120" />
        <el-table-column prop="supplier" label="供应商" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === '启用' ? 'success' : 'danger'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button-group>
              <el-button type="primary" link @click="handleEdit(scope.row)">
                编辑
              </el-button>
              <el-button type="primary" link @click="handleDelete(scope.row)">
                删除
              </el-button>
              <el-button 
                type="primary" 
                link 
                @click="handleStatusChange(scope.row)"
              >
                {{ scope.row.status === '启用' ? '停用' : '启用' }}
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
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

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加材料' : '编辑材料'"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        class="dialog-form"
      >
        <el-form-item label="材料名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入材料名称" />
        </el-form-item>
        <el-form-item label="克重" prop="weight">
          <el-input-number 
            v-model="form.weight" 
            :min="0" 
            placeholder="请输入克重"
            class="full-width"
          />
        </el-form-item>
        <el-form-item label="规格尺寸" prop="size">
          <el-input v-model="form.size" placeholder="请输入规格尺寸" />
        </el-form-item>
        <el-form-item label="单价" prop="price">
          <el-input-number
            v-model="form.price"
            :min="0"
            :precision="2"
            placeholder="请输入单价"
            class="full-width"
          />
        </el-form-item>
        <el-form-item label="供应商" prop="supplier">
          <el-input v-model="form.supplier" placeholder="请输入供应商" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="启用">启用</el-radio>
            <el-radio label="停用">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Refresh } from '@element-plus/icons-vue'

// 搜索表单
const searchForm = reactive({
  name: '',
  weightMin: undefined as number | undefined,
  weightMax: undefined as number | undefined
})

// 表格数据
const tableData = ref([
  {
    id: 1,
    name: '珠光纸',
    weight: 250,
    size: '787*1092mm',
    price: 8.5,
    supplier: '特种纸业',
    status: '启用'
  },
  {
    id: 2,
    name: '镭射纸',
    weight: 300,
    size: '787*1092mm',
    price: 12.8,
    supplier: '华特纸业',
    status: '启用'
  }
])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(2)
const loading = ref(false)

// 对话框相关
const dialogVisible = ref(false)
const dialogType = ref('add')
const formRef = ref()
const form = reactive({
  name: '',
  weight: undefined as number | undefined,
  size: '',
  price: undefined as number | undefined,
  supplier: '',
  status: '启用'
})

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入材料名称', trigger: 'blur' }],
  weight: [{ required: true, message: '请输入克重', trigger: 'blur' }],
  size: [{ required: true, message: '请输入规格尺寸', trigger: 'blur' }],
  price: [{ required: true, message: '请输入单价', trigger: 'blur' }],
  supplier: [{ required: true, message: '请输入供应商', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

// 搜索
const handleSearch = () => {
  // TODO: 实现搜索逻辑
  console.log('搜索条件:', searchForm)
}

// 重置搜索
const resetSearch = () => {
  searchForm.name = ''
  searchForm.weightMin = undefined
  searchForm.weightMax = undefined
  handleSearch()
}

// 添加材料
const handleAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
  Object.assign(form, {
    name: '',
    weight: undefined,
    size: '',
    price: undefined,
    supplier: '',
    status: '启用'
  })
}

// 编辑材料
const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  dialogVisible.value = true
  Object.assign(form, row)
}

// 删除材料
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    `确定要删除材料"${row.name}"吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 实现删除逻辑
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 更改状态
const handleStatusChange = (row: any) => {
  const newStatus = row.status === '启用' ? '停用' : '启用'
  ElMessageBox.confirm(
    `确定要${newStatus}材料"${row.name}"吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    row.status = newStatus
    ElMessage.success(`${newStatus}成功`)
  }).catch(() => {})
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid: boolean) => {
    if (valid) {
      // TODO: 实现提交逻辑
      ElMessage.success(dialogType.value === 'add' ? '添加成功' : '编辑成功')
      dialogVisible.value = false
    }
  })
}

// 分页相关方法
const handleSizeChange = (val: number) => {
  pageSize.value = val
  // TODO: 重新加载数据
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  // TODO: 重新加载数据
}
</script>

<style scoped>
.special-paper {
  height: 100%;
}

.content-card {
  height: calc(100vh - 140px);
  overflow-y: auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-bottom: 20px;
}

.weight-input {
  width: 130px;
}

.separator {
  margin: 0 10px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.dialog-form {
  max-height: 60vh;
  overflow-y: auto;
}

.full-width {
  width: 100%;
}

:deep(.el-form-item__content) {
  justify-content: flex-start;
}
</style> 