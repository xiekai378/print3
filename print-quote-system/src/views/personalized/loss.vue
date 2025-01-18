<template>
  <div class="loss-config">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>损耗调整</h3>
          <el-button type="primary" @click="showAddDialog">新增损耗配置</el-button>
        </div>
      </template>

      <!-- 损耗配置列表 -->
      <el-table :data="lossList" style="width: 100%">
        <el-table-column prop="material" label="材料" />
        <el-table-column prop="craft" label="工艺" />
        <el-table-column prop="lossRate" label="损耗比例">
          <template #default="{ row }">
            {{ row.lossRate }}%
          </template>
        </el-table-column>
        <el-table-column prop="description" label="说明" show-overflow-tooltip />
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
        :title="isEdit ? '编辑损耗配置' : '新增损耗配置'"
        width="50%"
      >
        <el-form :model="lossForm" label-width="120px">
          <el-form-item label="材料">
            <el-select v-model="lossForm.material" placeholder="请选择材料">
              <el-option label="普通纸" value="normal_paper" />
              <el-option label="特种纸" value="special_paper" />
              <el-option label="灰板纸" value="grey_board" />
            </el-select>
          </el-form-item>

          <el-form-item label="工艺">
            <el-select v-model="lossForm.craft" placeholder="请选择工艺">
              <el-option label="印刷" value="printing" />
              <el-option label="覆膜" value="laminating" />
              <el-option label="烫金" value="gilding" />
              <el-option label="UV" value="uv" />
            </el-select>
          </el-form-item>

          <el-form-item label="损耗比例">
            <el-input-number
              v-model="lossForm.lossRate"
              :min="0"
              :max="100"
              :precision="2"
              :step="0.1"
            >
              <template #suffix>%</template>
            </el-input-number>
          </el-form-item>

          <el-form-item label="说明">
            <el-input
              v-model="lossForm.description"
              type="textarea"
              :rows="3"
              placeholder="请输入说明"
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
  name: 'LossConfig'
})

interface Loss {
  id: number
  material: string
  craft: string
  lossRate: number
  description: string
}

// 损耗配置列表数据
const lossList = ref<Loss[]>([
  {
    id: 1,
    material: 'normal_paper',
    craft: 'printing',
    lossRate: 3.5,
    description: '普通纸印刷损耗'
  },
  {
    id: 2,
    material: 'special_paper',
    craft: 'gilding',
    lossRate: 5.0,
    description: '特种纸烫金损耗'
  }
])

// 弹窗表单数据
const lossForm = reactive({
  id: 0,
  material: '',
  craft: '',
  lossRate: 0,
  description: ''
})

const dialogVisible = ref(false)
const isEdit = ref(false)

// 显示新增弹窗
const showAddDialog = () => {
  isEdit.value = false
  Object.assign(lossForm, {
    id: 0,
    material: '',
    craft: '',
    lossRate: 0,
    description: ''
  })
  dialogVisible.value = true
}

// 显示编辑弹窗
const handleEdit = (row: Loss) => {
  isEdit.value = true
  Object.assign(lossForm, row)
  dialogVisible.value = true
}

// 删除损耗配置
const handleDelete = (row: Loss) => {
  ElMessageBox.confirm(
    '确定要删除该损耗配置吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 调用删除API
    const index = lossList.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      lossList.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  }).catch(() => {
    // 取消删除
  })
}

// 提交表单
const handleSubmit = () => {
  if (!lossForm.material || !lossForm.craft || lossForm.lossRate === 0) {
    ElMessage.warning('请填写完整信息')
    return
  }

  if (isEdit.value) {
    // 编辑模式
    const index = lossList.value.findIndex(item => item.id === lossForm.id)
    if (index > -1) {
      lossList.value[index] = { ...lossForm }
      ElMessage.success('修改成功')
    }
  } else {
    // 新增模式
    const newLoss: Loss = {
      ...lossForm,
      id: Date.now() // 临时使用时间戳作为ID
    }
    lossList.value.push(newLoss)
    ElMessage.success('添加成功')
  }

  dialogVisible.value = false
}
</script>

<style scoped>
.loss-config {
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
