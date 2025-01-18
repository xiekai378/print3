<template>
  <div class="material">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>材料管理</h2>
          <div class="header-actions">
            <el-button type="primary" @click="addMaterial">新增材料</el-button>
          </div>
        </div>
      </template>

      <!-- 材料列表 -->
      <el-table
        :data="materialList"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="name" label="材料名称" width="180">
          <template #default="scope">
            <el-input
              v-if="scope.row.editing"
              v-model="scope.row.name"
              placeholder="请输入材料名称"
            />
            <span v-else>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="材料编码" width="150">
          <template #default="scope">
            <el-input
              v-if="scope.row.editing"
              v-model="scope.row.code"
              placeholder="请输入材料编码"
            />
            <span v-else>{{ scope.row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="材料类型" width="150">
          <template #default="scope">
            <el-select
              v-if="scope.row.editing"
              v-model="scope.row.type"
              placeholder="请选择"
            >
              <el-option label="铜版纸" value="art_paper" />
              <el-option label="双铜纸" value="double_paper" />
              <el-option label="特种纸" value="special_paper" />
            </el-select>
            <span v-else>{{ getMaterialTypeName(scope.row.type) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="weight" label="克重(g)" width="120">
          <template #default="scope">
            <el-input-number
              v-if="scope.row.editing"
              v-model="scope.row.weight"
              :min="1"
              :max="1000"
              style="width: 100px"
            />
            <span v-else>{{ scope.row.weight }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="单价(元/m²)" width="120">
          <template #default="scope">
            <el-input-number
              v-if="scope.row.editing"
              v-model="scope.row.price"
              :min="0"
              :precision="2"
              :step="0.1"
              style="width: 100px"
            />
            <span v-else>{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="材料说明">
          <template #default="scope">
            <el-input
              v-if="scope.row.editing"
              v-model="scope.row.description"
              placeholder="请输入材料说明"
            />
            <span v-else>{{ scope.row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              :disabled="!scope.row.editing"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <template v-if="scope.row.editing">
              <el-button type="primary" link @click="saveMaterial(scope.row)">
                保存
              </el-button>
              <el-button type="info" link @click="cancelEdit(scope.row)">
                取消
              </el-button>
            </template>
            <template v-else>
              <el-button type="primary" link @click="editMaterial(scope.row)">
                编辑
              </el-button>
              <el-button type="danger" link @click="deleteMaterial(scope.row)">
                删除
              </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

interface Material {
  id: string
  name: string
  code: string
  type: string
  weight: number
  price: number
  description: string
  status: number
  editing?: boolean
}

// 加载状态
const loading = ref(false)

// 材料列表
const materialList = ref<Material[]>([
  {
    id: '1',
    name: '铜版纸157g',
    code: 'art_paper_157',
    type: 'art_paper',
    weight: 157,
    price: 3.5,
    description: '适用于画册、宣传册等印刷品',
    status: 1
  },
  {
    id: '2',
    name: '铜版纸200g',
    code: 'art_paper_200',
    type: 'art_paper',
    weight: 200,
    price: 4.2,
    description: '适用于画册、宣传册等印刷品',
    status: 1
  },
  {
    id: '3',
    name: '双铜纸250g',
    code: 'double_paper_250',
    type: 'double_paper',
    weight: 250,
    price: 5.8,
    description: '适用于包装盒等印刷品',
    status: 1
  },
  {
    id: '4',
    name: '特种纸300g',
    code: 'special_paper_300',
    type: 'special_paper',
    weight: 300,
    price: 8.5,
    description: '适用于高端包装等印刷品',
    status: 1
  }
])

// 获取材料类型名称
const getMaterialTypeName = (type: string) => {
  const typeMap: Record<string, string> = {
    'art_paper': '铜版纸',
    'double_paper': '双铜纸',
    'special_paper': '特种纸'
  }
  return typeMap[type] || type
}

// 新增材料
const addMaterial = () => {
  const newMaterial: Material = {
    id: String(Date.now()),
    name: '',
    code: '',
    type: '',
    weight: 0,
    price: 0,
    description: '',
    status: 1,
    editing: true
  }
  materialList.value.unshift(newMaterial)
}

// 编辑材料
const editMaterial = (row: Material) => {
  row.editing = true
}

// 保存材料
const saveMaterial = async (row: Material) => {
  if (!row.name || !row.code || !row.type) {
    ElMessage.warning('请填写完整信息')
    return
  }

  try {
    // 这里应该调用API保存数据
    await new Promise(resolve => setTimeout(resolve, 500))
    row.editing = false
    ElMessage.success('保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

// 取消编辑
const cancelEdit = (row: Material) => {
  if (!row.id) {
    materialList.value = materialList.value.filter(item => item.id !== row.id)
  } else {
    row.editing = false
  }
}

// 删除材料
const deleteMaterial = (row: Material) => {
  ElMessageBox.confirm(
    '确定要删除这个材料吗？删除后可能影响相关的报价数据',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    // 这里应该调用API删除数据
    await new Promise(resolve => setTimeout(resolve, 500))
    materialList.value = materialList.value.filter(item => item.id !== row.id)
    ElMessage.success('删除成功')
  }).catch(() => {})
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
</style> 