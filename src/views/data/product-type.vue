<template>
  <div class="product-type">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>产品类型管理</h3>
          <el-button type="primary" @click="showAddDialog">新增产品类型</el-button>
        </div>
      </template>

      <!-- 产品类型列表 -->
      <el-table :data="productTypeList" style="width: 100%">
        <el-table-column prop="name" label="产品类型名称" />
        <el-table-column prop="code" label="类型编码" />
        <el-table-column prop="unit" label="计量单位" />
        <el-table-column prop="description" label="说明" show-overflow-tooltip />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'">
              {{ row.status === 'active' ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button
              size="small"
              :type="row.status === 'active' ? 'warning' : 'success'"
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 'active' ? '停用' : '启用' }}
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 新增/编辑弹窗 -->
      <el-dialog
        v-model="dialogVisible"
        :title="isEdit ? '编辑产品类型' : '新增产品类型'"
        width="50%"
      >
        <el-form :model="productTypeForm" label-width="120px">
          <el-form-item label="类型名称">
            <el-input v-model="productTypeForm.name" placeholder="请输入产品类型名称" />
          </el-form-item>

          <el-form-item label="类型编码">
            <el-input v-model="productTypeForm.code" placeholder="请输入类型编码" />
          </el-form-item>

          <el-form-item label="计量单位">
            <el-select v-model="productTypeForm.unit" placeholder="请选择计量单位">
              <el-option label="个" value="piece" />
              <el-option label="套" value="set" />
              <el-option label="本" value="book" />
            </el-select>
          </el-form-item>

          <el-form-item label="参数配置">
            <el-card class="param-card">
              <div v-for="(param, index) in productTypeForm.params" :key="index" class="param-item">
                <el-row :gutter="10">
                  <el-col :span="8">
                    <el-form-item :label="'参数名称' + (index + 1)">
                      <el-input v-model="param.name" placeholder="请输入参数名称" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="'参数类型' + (index + 1)">
                      <el-select v-model="param.type" placeholder="请选择参数类型">
                        <el-option label="文本" value="text" />
                        <el-option label="数字" value="number" />
                        <el-option label="选择" value="select" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item :label="'必填' + (index + 1)">
                      <el-switch v-model="param.required" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="2">
                    <el-button type="danger" circle @click="removeParam(index)">
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </el-col>
                </el-row>
              </div>
              <el-button type="primary" plain @click="addParam">添加参数</el-button>
            </el-card>
          </el-form-item>

          <el-form-item label="说明">
            <el-input
              v-model="productTypeForm.description"
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
import { Delete } from '@element-plus/icons-vue'
import { defineComponent } from 'vue'

// 定义组件名称
defineComponent({
  name: 'ProductTypeManagement'
})

// 定义接口
interface Parameter {
  name: string
  type: string
  required: boolean
}

interface ProductType {
  id: number
  name: string
  code: string
  unit: string
  description: string
  status: 'active' | 'inactive'
  params: Parameter[]
}

// 产品类型列表数据
const productTypeList = ref<ProductType[]>([
  {
    id: 1,
    name: '纸盒',
    code: 'BOX',
    unit: 'piece',
    description: '普通纸盒产品',
    status: 'active',
    params: [
      {
        name: '长度',
        type: 'number',
        required: true
      },
      {
        name: '宽度',
        type: 'number',
        required: true
      },
      {
        name: '高度',
        type: 'number',
        required: true
      }
    ]
  }
])

// 弹窗控制
const dialogVisible = ref(false)
const isEdit = ref(false)

// 表单数据
const productTypeForm = reactive<ProductType>({
  id: 0,
  name: '',
  code: '',
  unit: '',
  description: '',
  status: 'active',
  params: []
})

// 添加参数
const addParam = () => {
  productTypeForm.params.push({
    name: '',
    type: 'text',
    required: false
  })
}

// 删除参数
const removeParam = (index: number) => {
  productTypeForm.params.splice(index, 1)
}

// 显示新增弹窗
const showAddDialog = () => {
  isEdit.value = false
  Object.assign(productTypeForm, {
    id: 0,
    name: '',
    code: '',
    unit: '',
    description: '',
    status: 'active',
    params: []
  })
  dialogVisible.value = true
}

// 显示编辑弹窗
const handleEdit = (row: ProductType) => {
  isEdit.value = true
  Object.assign(productTypeForm, row)
  dialogVisible.value = true
}

// 切换状态
const handleToggleStatus = (row: ProductType) => {
  const action = row.status === 'active' ? '停用' : '启用'
  ElMessageBox.confirm(
    `确定要${action}该产品类型吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 调用切换状态API
    row.status = row.status === 'active' ? 'inactive' : 'active'
    ElMessage.success(`${action}成功`)
  }).catch(() => {
    // 取消操作
  })
}

// 删除产品类型
const handleDelete = (row: ProductType) => {
  ElMessageBox.confirm(
    '确定要删除该产品类型吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 调用删除API
    const index = productTypeList.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      productTypeList.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  }).catch(() => {
    // 取消删除
  })
}

// 提交表单
const handleSubmit = () => {
  if (!productTypeForm.name || !productTypeForm.code || !productTypeForm.unit) {
    ElMessage.warning('请填写完整信息')
    return
  }

  if (isEdit.value) {
    // 编辑模式
    const index = productTypeList.value.findIndex(item => item.id === productTypeForm.id)
    if (index > -1) {
      productTypeList.value[index] = { ...productTypeForm }
      ElMessage.success('修改成功')
    }
  } else {
    // 新增模式
    const newProductType: ProductType = {
      ...productTypeForm,
      id: Date.now()
    }
    productTypeList.value.push(newProductType)
    ElMessage.success('添加成功')
  }

  dialogVisible.value = false
}
</script>

<style scoped>
.product-type {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.param-card {
  margin-bottom: 10px;
}

.param-item {
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #eee;
}

.param-item:last-child {
  border-bottom: none;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

:deep(.el-form-item) {
  margin-bottom: 12px;
}
</style>
