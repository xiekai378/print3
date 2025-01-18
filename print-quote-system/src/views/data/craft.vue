<template>
  <div class="craft">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>工艺管理</h3>
          <el-button type="primary" @click="showAddDialog">新增工艺</el-button>
        </div>
      </template>

      <!-- 工艺分类选择 -->
      <el-tabs v-model="activeTab" class="craft-tabs">
        <el-tab-pane label="印刷费" name="printing">
          <craft-table
            :data="getCraftsByType('printing')"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </el-tab-pane>
        <el-tab-pane label="表面工艺" name="surface">
          <craft-table
            :data="getCraftsByType('surface')"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </el-tab-pane>
        <el-tab-pane label="丝印" name="screen">
          <craft-table
            :data="getCraftsByType('screen')"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </el-tab-pane>
        <el-tab-pane label="烫金工艺" name="gilding">
          <craft-table
            :data="getCraftsByType('gilding')"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </el-tab-pane>
        <el-tab-pane label="UV工艺" name="uv">
          <craft-table
            :data="getCraftsByType('uv')"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </el-tab-pane>
      </el-tabs>

      <!-- 新增/编辑弹窗 -->
      <el-dialog
        v-model="dialogVisible"
        :title="isEdit ? '编辑工艺' : '新增工艺'"
        width="50%"
      >
        <el-form :model="craftForm" label-width="120px">
          <el-form-item label="工艺名称">
            <el-input v-model="craftForm.name" placeholder="请输入工艺名称" />
          </el-form-item>

          <el-form-item label="工艺分类">
            <el-select v-model="craftForm.type" placeholder="请选择工艺分类">
              <el-option label="印刷费" value="printing" />
              <el-option label="表面工艺" value="surface" />
              <el-option label="丝印" value="screen" />
              <el-option label="烫金工艺" value="gilding" />
              <el-option label="UV工艺" value="uv" />
            </el-select>
          </el-form-item>

          <el-form-item label="工艺规格">
            <el-input v-model="craftForm.spec" placeholder="请输入工艺规格" />
          </el-form-item>

          <el-form-item label="计价方式">
            <el-select v-model="craftForm.priceType" placeholder="请选择计价方式">
              <el-option label="按面积" value="area" />
              <el-option label="按数量" value="quantity" />
              <el-option label="按时间" value="time" />
            </el-select>
          </el-form-item>

          <el-form-item label="单价">
            <el-input-number
              v-model="craftForm.price"
              :precision="2"
              :step="0.1"
              :min="0"
            />
            <span class="unit-text">
              {{ getPriceUnit(craftForm.priceType) }}
            </span>
          </el-form-item>

          <el-form-item label="最小起订量">
            <el-input-number
              v-model="craftForm.minQuantity"
              :min="0"
              :step="1"
            />
          </el-form-item>

          <el-form-item label="说明">
            <el-input
              v-model="craftForm.description"
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
import CraftTable from './components/CraftTable.vue'

// 定义组件名称
defineComponent({
  name: 'CraftManagement'
})

// 定义接口
interface Craft {
  id: number
  name: string
  type: string
  spec: string
  priceType: string
  price: number
  minQuantity: number
  description: string
}

// 工艺列表数据
const craftList = ref<Craft[]>([
  {
    id: 1,
    name: '四色印刷',
    type: 'printing',
    spec: 'CMYK',
    priceType: 'area',
    price: 0.5,
    minQuantity: 100,
    description: '标准四色印刷'
  },
  {
    id: 2,
    name: '光膜',
    type: 'surface',
    spec: '过油',
    priceType: 'area',
    price: 0.3,
    minQuantity: 100,
    description: '表面光膜处理'
  }
])

// 当前激活的标签页
const activeTab = ref('printing')

// 弹窗控制
const dialogVisible = ref(false)
const isEdit = ref(false)

// 表单数据
const craftForm = reactive<Craft>({
  id: 0,
  name: '',
  type: '',
  spec: '',
  priceType: '',
  price: 0,
  minQuantity: 0,
  description: ''
})

// 根据类型获取工艺列表
const getCraftsByType = (type: string) => {
  return craftList.value.filter(item => item.type === type)
}

// 获取价格单位
const getPriceUnit = (priceType: string) => {
  const unitMap: Record<string, string> = {
    area: '元/平方厘米',
    quantity: '元/个',
    time: '元/小时'
  }
  return unitMap[priceType] || '元'
}

// 显示新增弹窗
const showAddDialog = () => {
  isEdit.value = false
  Object.assign(craftForm, {
    id: 0,
    name: '',
    type: activeTab.value,
    spec: '',
    priceType: '',
    price: 0,
    minQuantity: 0,
    description: ''
  })
  dialogVisible.value = true
}

// 显示编辑弹窗
const handleEdit = (row: Craft) => {
  isEdit.value = true
  Object.assign(craftForm, row)
  dialogVisible.value = true
}

// 删除工艺
const handleDelete = (row: Craft) => {
  ElMessageBox.confirm(
    '确定要删除该工艺吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 调用删除API
    const index = craftList.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      craftList.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  }).catch(() => {
    // 取消删除
  })
}

// 提交表单
const handleSubmit = () => {
  if (!craftForm.name || !craftForm.type || !craftForm.priceType) {
    ElMessage.warning('请填写完整信息')
    return
  }

  if (isEdit.value) {
    // 编辑模式
    const index = craftList.value.findIndex(item => item.id === craftForm.id)
    if (index > -1) {
      craftList.value[index] = { ...craftForm }
      ElMessage.success('修改成功')
    }
  } else {
    // 新增模式
    const newCraft: Craft = {
      ...craftForm,
      id: Date.now()
    }
    craftList.value.push(newCraft)
    ElMessage.success('添加成功')
  }

  dialogVisible.value = false
}
</script>

<style scoped>
.craft {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.craft-tabs {
  margin-top: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.unit-text {
  margin-left: 8px;
  color: #666;
}
</style>
