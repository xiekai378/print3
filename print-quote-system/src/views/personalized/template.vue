<template>
  <div class="template-config">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>报价模板管理</h3>
          <el-button type="primary" @click="showAddDialog">新增模板</el-button>
        </div>
      </template>

      <!-- 模板列表 -->
      <el-table :data="templateList" style="width: 100%">
        <el-table-column prop="name" label="模板名称" />
        <el-table-column prop="productType" label="适用产品类型">
          <template #default="{ row }">
            {{ getProductTypeName(row.productType) }}
          </template>
        </el-table-column>
        <el-table-column prop="description" label="说明" show-overflow-tooltip />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作" width="250">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="success" @click="handleApply(row)">套用</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 新增/编辑弹窗 -->
      <el-dialog
        v-model="dialogVisible"
        :title="isEdit ? '编辑模板' : '新增模板'"
        width="60%"
      >
        <el-form :model="templateForm" label-width="120px">
          <el-form-item label="模板名称">
            <el-input v-model="templateForm.name" placeholder="请输入模板名称" />
          </el-form-item>

          <el-form-item label="适用产品类型">
            <el-select v-model="templateForm.productType" placeholder="请选择产品类型">
              <el-option label="纸盒" value="box" />
              <el-option label="精装盒" value="hardcover" />
              <el-option label="书刊画册" value="book" />
            </el-select>
          </el-form-item>

          <!-- 材料配置 -->
          <el-form-item label="材料配置">
            <el-card class="config-card">
              <el-form-item label="材料类型">
                <el-select v-model="templateForm.material.type" placeholder="请选择材料类型">
                  <el-option label="普通纸" value="normal_paper" />
                  <el-option label="特种纸" value="special_paper" />
                  <el-option label="灰板纸" value="grey_board" />
                </el-select>
              </el-form-item>
              <el-form-item label="材料规格">
                <el-input v-model="templateForm.material.spec" placeholder="请输入材料规格" />
              </el-form-item>
            </el-card>
          </el-form-item>

          <!-- 工艺配置 -->
          <el-form-item label="工艺配置">
            <el-card class="config-card">
              <el-checkbox-group v-model="templateForm.crafts">
                <el-checkbox label="印刷">
                  <el-form-item label="印刷方式" v-if="templateForm.crafts.includes('印刷')">
                    <el-select v-model="templateForm.craftConfig.printing">
                      <el-option label="四色印刷" value="cmyk" />
                      <el-option label="专色印刷" value="spot" />
                    </el-select>
                  </el-form-item>
                </el-checkbox>
                <el-checkbox label="覆膜">
                  <el-form-item label="覆膜类型" v-if="templateForm.crafts.includes('覆膜')">
                    <el-select v-model="templateForm.craftConfig.laminating">
                      <el-option label="光膜" value="gloss" />
                      <el-option label="哑膜" value="matte" />
                    </el-select>
                  </el-form-item>
                </el-checkbox>
                <el-checkbox label="烫金" />
                <el-checkbox label="UV" />
              </el-checkbox-group>
            </el-card>
          </el-form-item>

          <!-- 价格配置 -->
          <el-form-item label="价格配置">
            <el-card class="config-card">
              <el-form-item label="利润率">
                <el-input-number
                  v-model="templateForm.priceConfig.profitRate"
                  :min="0"
                  :max="100"
                  :precision="2"
                  :step="0.1"
                >
                  <template #suffix>%</template>
                </el-input-number>
              </el-form-item>
              <el-form-item label="运费">
                <el-input-number
                  v-model="templateForm.priceConfig.shippingFee"
                  :min="0"
                  :precision="2"
                  :step="10"
                />
              </el-form-item>
            </el-card>
          </el-form-item>

          <el-form-item label="说明">
            <el-input
              v-model="templateForm.description"
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

      <!-- 套用模板确认弹窗 -->
      <el-dialog
        v-model="applyDialogVisible"
        title="套用模板"
        width="30%"
      >
        <p>确定要套用该模板吗？这将覆盖当前的报价配置。</p>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="applyDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="confirmApplyTemplate">确定</el-button>
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
  name: 'TemplateConfig'
})

// 定义接口
interface Template {
  id: number
  name: string
  productType: string
  description: string
  createTime: string
  material: {
    type: string
    spec: string
  }
  crafts: string[]
  craftConfig: {
    printing?: string
    laminating?: string
  }
  priceConfig: {
    profitRate: number
    shippingFee: number
  }
}

// 模板列表数据
const templateList = ref<Template[]>([
  {
    id: 1,
    name: '标准纸盒模板',
    productType: 'box',
    description: '适用于普通纸盒的标准报价模板',
    createTime: '2024-03-21',
    material: {
      type: 'normal_paper',
      spec: '250g铜版纸'
    },
    crafts: ['印刷', '覆膜'],
    craftConfig: {
      printing: 'cmyk',
      laminating: 'gloss'
    },
    priceConfig: {
      profitRate: 30,
      shippingFee: 100
    }
  }
])

// 弹窗控制
const dialogVisible = ref(false)
const applyDialogVisible = ref(false)
const isEdit = ref(false)
const currentTemplate = ref<Template | null>(null)

// 表单数据
const templateForm = reactive({
  id: 0,
  name: '',
  productType: '',
  description: '',
  material: {
    type: '',
    spec: ''
  },
  crafts: [] as string[],
  craftConfig: {
    printing: '',
    laminating: ''
  },
  priceConfig: {
    profitRate: 30,
    shippingFee: 0
  }
})

// 获取产品类型名称
const getProductTypeName = (type: string) => {
  const typeMap: Record<string, string> = {
    box: '纸盒',
    hardcover: '精装盒',
    book: '书刊画册'
  }
  return typeMap[type] || type
}

// 显示新增弹窗
const showAddDialog = () => {
  isEdit.value = false
  Object.assign(templateForm, {
    id: 0,
    name: '',
    productType: '',
    description: '',
    material: {
      type: '',
      spec: ''
    },
    crafts: [],
    craftConfig: {
      printing: '',
      laminating: ''
    },
    priceConfig: {
      profitRate: 30,
      shippingFee: 0
    }
  })
  dialogVisible.value = true
}

// 显示编辑弹窗
const handleEdit = (row: Template) => {
  isEdit.value = true
  Object.assign(templateForm, row)
  dialogVisible.value = true
}

// 显示套用模板弹窗
const handleApply = (row: Template) => {
  currentTemplate.value = row
  applyDialogVisible.value = true
}

// 确认套用模板
const confirmApplyTemplate = () => {
  if (currentTemplate.value) {
    // TODO: 调用套用模板API
    ElMessage.success('套用模板成功')
    applyDialogVisible.value = false
  }
}

// 删除模板
const handleDelete = (row: Template) => {
  ElMessageBox.confirm(
    '确定要删除该模板吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 调用删除API
    const index = templateList.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      templateList.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  }).catch(() => {
    // 取消删除
  })
}

// 提交表单
const handleSubmit = () => {
  if (!templateForm.name || !templateForm.productType) {
    ElMessage.warning('请填写完整信息')
    return
  }

  if (isEdit.value) {
    // 编辑模式
    const index = templateList.value.findIndex(item => item.id === templateForm.id)
    if (index > -1) {
      templateList.value[index] = {
        ...templateForm,
        createTime: templateList.value[index].createTime
      }
      ElMessage.success('修改成功')
    }
  } else {
    // 新增模式
    const newTemplate: Template = {
      ...templateForm,
      id: Date.now(),
      createTime: new Date().toISOString().split('T')[0]
    }
    templateList.value.push(newTemplate)
    ElMessage.success('添加成功')
  }

  dialogVisible.value = false
}
</script>

<style scoped>
.template-config {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.config-card {
  margin-bottom: 10px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

:deep(.el-form-item) {
  margin-bottom: 12px;
}

:deep(.el-card__body) {
  padding: 12px;
}
</style>
