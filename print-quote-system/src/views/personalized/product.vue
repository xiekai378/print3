<template>
  <div class="product-config">
    <el-tabs v-model="activeTab">
      <!-- 纸盒配置 -->
      <el-tab-pane label="纸盒盒型" name="box">
        <el-card>
          <template #header>
            <div class="card-header">
              <h3>纸盒盒型配置</h3>
              <el-button type="primary" @click="showAddDialog('box')">新增盒型</el-button>
            </div>
          </template>

          <el-table :data="boxList" style="width: 100%">
            <el-table-column prop="name" label="盒型名称" />
            <el-table-column prop="code" label="盒型编码" />
            <el-table-column prop="description" label="说明" show-overflow-tooltip />
            <el-table-column label="操作" width="200">
              <template #default="{ row }">
                <el-button size="small" @click="handleEdit('box', row)">编辑</el-button>
                <el-button size="small" type="danger" @click="handleDelete('box', row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <!-- 精装盒配置 -->
      <el-tab-pane label="精装盒盒型" name="hardcover">
        <el-card>
          <template #header>
            <div class="card-header">
              <h3>精装盒盒型配置</h3>
              <el-button type="primary" @click="showAddDialog('hardcover')">新增盒型</el-button>
            </div>
          </template>

          <el-table :data="hardcoverList" style="width: 100%">
            <el-table-column prop="name" label="盒型名称" />
            <el-table-column prop="code" label="盒型编码" />
            <el-table-column prop="description" label="说明" show-overflow-tooltip />
            <el-table-column label="操作" width="200">
              <template #default="{ row }">
                <el-button size="small" @click="handleEdit('hardcover', row)">编辑</el-button>
                <el-button size="small" type="danger" @click="handleDelete('hardcover', row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <!-- 书刊画册配置 -->
      <el-tab-pane label="书刊画册" name="book">
        <el-card>
          <template #header>
            <div class="card-header">
              <h3>书刊画册配置</h3>
              <el-button type="primary" @click="showAddDialog('book')">新增规格</el-button>
            </div>
          </template>

          <el-table :data="bookList" style="width: 100%">
            <el-table-column prop="name" label="规格名称" />
            <el-table-column prop="size" label="尺寸规格" />
            <el-table-column prop="bindingType" label="装订方式" />
            <el-table-column prop="description" label="说明" show-overflow-tooltip />
            <el-table-column label="操作" width="200">
              <template #default="{ row }">
                <el-button size="small" @click="handleEdit('book', row)">编辑</el-button>
                <el-button size="small" type="danger" @click="handleDelete('book', row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="getDialogTitle"
      width="50%"
    >
      <el-form :model="productForm" label-width="120px">
        <!-- 通用字段 -->
        <el-form-item label="名称">
          <el-input v-model="productForm.name" :placeholder="getNamePlaceholder" />
        </el-form-item>

        <!-- 纸盒和精装盒特有字段 -->
        <template v-if="['box', 'hardcover'].includes(activeTab)">
          <el-form-item label="盒型编码">
            <el-input v-model="productForm.code" placeholder="请输入盒型编码" />
          </el-form-item>
        </template>

        <!-- 书刊画册特有字段 -->
        <template v-if="activeTab === 'book'">
          <el-form-item label="尺寸规格">
            <el-input v-model="productForm.size" placeholder="请输入尺寸规格" />
          </el-form-item>
          <el-form-item label="装订方式">
            <el-select v-model="productForm.bindingType" placeholder="请选择装订方式">
              <el-option label="骑马钉" value="saddle" />
              <el-option label="胶装" value="perfect" />
              <el-option label="锁线" value="sewn" />
            </el-select>
          </el-form-item>
        </template>

        <el-form-item label="说明">
          <el-input
            v-model="productForm.description"
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { defineComponent } from 'vue'

// 定义组件名称
defineComponent({
  name: 'ProductConfig'
})

// 定义接口
interface BaseProduct {
  id: number
  name: string
  description: string
}

interface BoxProduct extends BaseProduct {
  code: string
}

interface BookProduct extends BaseProduct {
  size: string
  bindingType: string
}

// 数据列表
const boxList = ref<BoxProduct[]>([
  {
    id: 1,
    name: '天地盖',
    code: 'BOX-001',
    description: '标准天地盖盒型'
  }
])

const hardcoverList = ref<BoxProduct[]>([
  {
    id: 1,
    name: '精装天地盖',
    code: 'HC-001',
    description: '标准精装天地盖盒型'
  }
])

const bookList = ref<BookProduct[]>([
  {
    id: 1,
    name: 'A4画册',
    size: '210×297mm',
    bindingType: 'perfect',
    description: '标准A4尺寸画册'
  }
])

// 当前激活的标签页
const activeTab = ref('box')

// 弹窗控制
const dialogVisible = ref(false)
const isEdit = ref(false)

// 表单数据
const productForm = reactive({
  id: 0,
  name: '',
  code: '',
  size: '',
  bindingType: '',
  description: ''
})

// 计算属性：获取弹窗标题
const getDialogTitle = computed(() => {
  const action = isEdit.value ? '编辑' : '新增'
  const type = {
    box: '纸盒盒型',
    hardcover: '精装盒盒型',
    book: '书刊画册规格'
  }[activeTab.value]
  return `${action}${type}`
})

// 计算属性：获取名称输入框提示文字
const getNamePlaceholder = computed(() => {
  return {
    box: '请输入盒型名称',
    hardcover: '请输入盒型名称',
    book: '请输入规格名称'
  }[activeTab.value]
})

// 显示新增弹窗
const showAddDialog = (type: string) => {
  isEdit.value = false
  Object.assign(productForm, {
    id: 0,
    name: '',
    code: '',
    size: '',
    bindingType: '',
    description: ''
  })
  dialogVisible.value = true
}

// 显示编辑弹窗
const handleEdit = (type: string, row: BoxProduct | BookProduct) => {
  isEdit.value = true
  Object.assign(productForm, row)
  dialogVisible.value = true
}

// 删除配置
const handleDelete = (type: string, row: BoxProduct | BookProduct) => {
  ElMessageBox.confirm(
    '确定要删除该配置吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 调用删除API
    const list = {
      box: boxList,
      hardcover: hardcoverList,
      book: bookList
    }[type]

    if (list) {
      const index = list.value.findIndex(item => item.id === row.id)
      if (index > -1) {
        list.value.splice(index, 1)
        ElMessage.success('删除成功')
      }
    }
  }).catch(() => {
    // 取消删除
  })
}

// 提交表单
const handleSubmit = () => {
  if (!productForm.name) {
    ElMessage.warning('请填写完整信息')
    return
  }

  const list = {
    box: boxList,
    hardcover: hardcoverList,
    book: bookList
  }[activeTab.value]

  if (!list) return

  if (isEdit.value) {
    // 编辑模式
    const index = list.value.findIndex(item => item.id === productForm.id)
    if (index > -1) {
      list.value[index] = { ...productForm as any }
      ElMessage.success('修改成功')
    }
  } else {
    // 新增模式
    const newProduct = {
      ...productForm,
      id: Date.now()
    }
    list.value.push(newProduct as any)
    ElMessage.success('添加成功')
  }

  dialogVisible.value = false
}
</script>

<style scoped>
.product-config {
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
