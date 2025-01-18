<template>
  <div class="formula-config">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>报价公式配置</h3>
          <el-button type="primary" @click="showAddDialog">新增公式</el-button>
        </div>
      </template>

      <!-- 公式列表 -->
      <el-table :data="formulaList" style="width: 100%">
        <el-table-column prop="name" label="公式名称" />
        <el-table-column prop="productType" label="适用产品类型" />
        <el-table-column prop="formula" label="公式内容" show-overflow-tooltip />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 新增/编辑弹窗 -->
      <el-dialog
        v-model="dialogVisible"
        :title="isEdit ? '编辑公式' : '新增公式'"
        width="50%"
      >
        <el-form :model="formulaForm" label-width="120px">
          <el-form-item label="公式名称">
            <el-input v-model="formulaForm.name" placeholder="请输入公式名称" />
          </el-form-item>

          <el-form-item label="适用产品类型">
            <el-select v-model="formulaForm.productType" placeholder="请选择产品类型">
              <el-option label="纸盒" value="box" />
              <el-option label="精装盒" value="hardcover" />
              <el-option label="书刊画册" value="book" />
            </el-select>
          </el-form-item>

          <el-form-item label="公式内容">
            <el-input
              v-model="formulaForm.formula"
              type="textarea"
              :rows="4"
              placeholder="请输入公式内容"
            />
          </el-form-item>

          <el-form-item label="公式说明">
            <el-input
              v-model="formulaForm.description"
              type="textarea"
              :rows="3"
              placeholder="请输入公式说明"
            />
          </el-form-item>
        </el-form>

        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleSubmit">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { defineComponent } from 'vue'

// 定义组件名称
defineComponent({
  name: 'FormulaConfig'
})

interface Formula {
  id: number
  name: string
  productType: string
  formula: string
  description: string
}

// 公式列表数据
const formulaList = ref<Formula[]>([
  {
    id: 1,
    name: '基础纸盒报价公式',
    productType: 'box',
    formula: '(长 * 宽 * 材料单价 + 加工费) * (1 + 利润率)',
    description: '适用于基础纸盒的报价计算'
  }
])

// 弹窗表单数据
const formulaForm = reactive({
  id: 0,
  name: '',
  productType: '',
  formula: '',
  description: ''
})

const dialogVisible = ref(false)
const isEdit = ref(false)

// 显示新增弹窗
const showAddDialog = () => {
  isEdit.value = false
  Object.assign(formulaForm, {
    id: 0,
    name: '',
    productType: '',
    formula: '',
    description: ''
  })
  dialogVisible.value = true
}

// 显示编辑弹窗
const handleEdit = (row: Formula) => {
  isEdit.value = true
  Object.assign(formulaForm, row)
  dialogVisible.value = true
}

// 删除公式
const handleDelete = (row: Formula) => {
  ElMessageBox.confirm(
    '确定要删除该公式吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 调用删除API
    const index = formulaList.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      formulaList.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  }).catch(() => {
    // 取消删除
  })
}

// 提交表单
const handleSubmit = () => {
  if (!formulaForm.name || !formulaForm.productType || !formulaForm.formula) {
    ElMessage.warning('请填写完整信息')
    return
  }

  if (isEdit.value) {
    // 编辑模式
    const index = formulaList.value.findIndex(item => item.id === formulaForm.id)
    if (index > -1) {
      formulaList.value[index] = { ...formulaForm }
      ElMessage.success('修改成功')
    }
  } else {
    // 新增模式
    const newFormula: Formula = {
      ...formulaForm,
      id: Date.now() // 临时使用时间戳作为ID
    }
    formulaList.value.push(newFormula)
    ElMessage.success('添加成功')
  }

  dialogVisible.value = false
}
</script>

<style scoped>
.formula-config {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
