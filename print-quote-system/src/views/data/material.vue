<template>
  <div class="material">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>材料管理</h3>
          <el-button type="primary" @click="showAddDialog">新增材料</el-button>
        </div>
      </template>

      <!-- 材料分类选择 -->
      <el-tabs v-model="activeTab" class="material-tabs">
        <el-tab-pane label="普通纸类" name="normal_paper">
          <material-table
            :data="getMaterialsByType('normal_paper')"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </el-tab-pane>
        <el-tab-pane label="特种纸" name="special_paper">
          <material-table
            :data="getMaterialsByType('special_paper')"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </el-tab-pane>
        <el-tab-pane label="灰板纸/密度板" name="grey_board">
          <material-table
            :data="getMaterialsByType('grey_board')"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </el-tab-pane>
        <el-tab-pane label="不干胶" name="adhesive">
          <material-table
            :data="getMaterialsByType('adhesive')"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </el-tab-pane>
        <el-tab-pane label="特殊材料" name="special">
          <material-table
            :data="getMaterialsByType('special')"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </el-tab-pane>
      </el-tabs>

      <!-- 新增/编辑弹窗 -->
      <el-dialog
        v-model="dialogVisible"
        :title="isEdit ? '编辑材料' : '新增材料'"
        width="50%"
      >
        <el-form :model="materialForm" label-width="120px">
          <el-form-item label="材料名称">
            <el-input v-model="materialForm.name" placeholder="请输入材料名称" />
          </el-form-item>

          <el-form-item label="材料分类">
            <el-select v-model="materialForm.type" placeholder="请选择材料分类">
              <el-option label="普通纸类" value="normal_paper" />
              <el-option label="特种纸" value="special_paper" />
              <el-option label="灰板纸/密度板" value="grey_board" />
              <el-option label="不干胶" value="adhesive" />
              <el-option label="特殊材料" value="special" />
            </el-select>
          </el-form-item>

          <el-form-item label="规格">
            <el-input v-model="materialForm.spec" placeholder="请输入规格" />
          </el-form-item>

          <el-form-item label="单价">
            <el-input-number
              v-model="materialForm.price"
              :precision="2"
              :step="0.1"
              :min="0"
            />
          </el-form-item>

          <el-form-item label="单位">
            <el-select v-model="materialForm.unit" placeholder="请选择单位">
              <el-option label="张" value="sheet" />
              <el-option label="令" value="ream" />
              <el-option label="千克" value="kg" />
              <el-option label="米" value="meter" />
            </el-select>
          </el-form-item>

          <el-form-item label="供应商">
            <el-select
              v-model="materialForm.supplier"
              placeholder="请选择供应商"
              filterable
              allow-create
            >
              <el-option
                v-for="supplier in supplierList"
                :key="supplier"
                :label="supplier"
                :value="supplier"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="说明">
            <el-input
              v-model="materialForm.description"
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
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { defineComponent } from 'vue'
import MaterialTable from './components/MaterialTable.vue'

// 定义组件名称
defineComponent({
  name: 'MaterialManagement'
})

// 定义接口
interface Material {
  id: number
  name: string
  type: string
  spec: string
  price: number
  unit: string
  supplier: string
  description: string
}

// 材料列表数据
const materialList = ref<Material[]>([
  {
    id: 1,
    name: '157g铜版纸',
    type: 'normal_paper',
    spec: '787*1092mm',
    price: 5.5,
    unit: 'sheet',
    supplier: '供应商A',
    description: '常用铜版纸'
  },
  {
    id: 2,
    name: '触感纸',
    type: 'special_paper',
    spec: '787*1092mm',
    price: 12.0,
    unit: 'sheet',
    supplier: '供应商B',
    description: '高档触感纸'
  }
])

// 供应商列表
const supplierList = ref([
  '供应商A',
  '供应商B',
  '供应商C'
])

// 当前激活的标签页
const activeTab = ref('normal_paper')

// 弹窗控制
const dialogVisible = ref(false)
const isEdit = ref(false)

// 表单数据
const materialForm = reactive<Material>({
  id: 0,
  name: '',
  type: '',
  spec: '',
  price: 0,
  unit: '',
  supplier: '',
  description: ''
})

// 根据类型获取材料列表
const getMaterialsByType = (type: string) => {
  return materialList.value.filter(item => item.type === type)
}

// 显示新增弹窗
const showAddDialog = () => {
  isEdit.value = false
  Object.assign(materialForm, {
    id: 0,
    name: '',
    type: activeTab.value,
    spec: '',
    price: 0,
    unit: '',
    supplier: '',
    description: ''
  })
  dialogVisible.value = true
}

// 显示编辑弹窗
const handleEdit = (row: Material) => {
  isEdit.value = true
  Object.assign(materialForm, row)
  dialogVisible.value = true
}

// 删除材料
const handleDelete = (row: Material) => {
  ElMessageBox.confirm(
    '确定要删除该材料吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 调用删除API
    const index = materialList.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      materialList.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  }).catch(() => {
    // 取消删除
  })
}

// 提交表单
const handleSubmit = () => {
  if (!materialForm.name || !materialForm.type || !materialForm.spec || !materialForm.unit) {
    ElMessage.warning('请填写完整信息')
    return
  }

  if (isEdit.value) {
    // 编辑模式
    const index = materialList.value.findIndex(item => item.id === materialForm.id)
    if (index > -1) {
      materialList.value[index] = { ...materialForm }
      ElMessage.success('修改成功')
    }
  } else {
    // 新增模式
    const newMaterial: Material = {
      ...materialForm,
      id: Date.now()
    }
    materialList.value.push(newMaterial)
    ElMessage.success('添加成功')
  }

  dialogVisible.value = false
}
</script>

<style scoped>
.material {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.material-tabs {
  margin-top: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
