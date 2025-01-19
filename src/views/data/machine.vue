<template>
  <div class="machine">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>机器管理</h3>
          <el-button type="primary" @click="showAddDialog">新增机器</el-button>
        </div>
      </template>

      <!-- 机器列表 -->
      <el-table :data="machineList" style="width: 100%">
        <el-table-column prop="name" label="机器名称" />
        <el-table-column prop="type" label="机器类型">
          <template #default="{ row }">
            {{ getMachineTypeName(row.type) }}
          </template>
        </el-table-column>
        <el-table-column prop="model" label="型号" />
        <el-table-column prop="size" label="最大加工尺寸" />
        <el-table-column prop="speed" label="生产速度" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'">
              {{ row.status === 'active' ? '在用' : '停用' }}
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
        :title="isEdit ? '编辑机器' : '新增机器'"
        width="50%"
      >
        <el-form :model="machineForm" label-width="120px">
          <el-form-item label="机器名称">
            <el-input v-model="machineForm.name" placeholder="请输入机器名称" />
          </el-form-item>

          <el-form-item label="机器类型">
            <el-select v-model="machineForm.type" placeholder="请选择机器类型">
              <el-option label="印刷机" value="printing" />
              <el-option label="覆膜机" value="laminating" />
              <el-option label="模切机" value="cutting" />
              <el-option label="烫金机" value="gilding" />
              <el-option label="丝印机" value="screen" />
            </el-select>
          </el-form-item>

          <el-form-item label="型号">
            <el-input v-model="machineForm.model" placeholder="请输入型号" />
          </el-form-item>

          <el-form-item label="最大加工尺寸">
            <el-input v-model="machineForm.size" placeholder="请输入最大加工尺寸" />
          </el-form-item>

          <el-form-item label="生产速度">
            <el-input v-model="machineForm.speed" placeholder="请输入生产速度" />
          </el-form-item>

          <el-form-item label="参数配置">
            <el-card class="param-card">
              <div v-for="(param, index) in machineForm.params" :key="index" class="param-item">
                <el-row :gutter="10">
                  <el-col :span="8">
                    <el-form-item :label="'参数名称' + (index + 1)">
                      <el-input v-model="param.name" placeholder="请输入参数名称" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="'参数值' + (index + 1)">
                      <el-input v-model="param.value" placeholder="请输入参数值" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item :label="'单位' + (index + 1)">
                      <el-input v-model="param.unit" placeholder="单位" />
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
              v-model="machineForm.description"
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
  name: 'MachineManagement'
})

// 定义接口
interface MachineParam {
  name: string
  value: string
  unit: string
}

interface Machine {
  id: number
  name: string
  type: string
  model: string
  size: string
  speed: string
  status: 'active' | 'inactive'
  params: MachineParam[]
  description: string
}

// 机器列表数据
const machineList = ref<Machine[]>([
  {
    id: 1,
    name: '海德堡印刷机',
    type: 'printing',
    model: 'CD102-4',
    size: '720×1020mm',
    speed: '13000张/小时',
    status: 'active',
    params: [
      {
        name: '色数',
        value: '4',
        unit: '色'
      },
      {
        name: '最小纸张尺寸',
        value: '360×520',
        unit: 'mm'
      }
    ],
    description: '四色印刷机'
  }
])

// 弹窗控制
const dialogVisible = ref(false)
const isEdit = ref(false)

// 表单数据
const machineForm = reactive<Machine>({
  id: 0,
  name: '',
  type: '',
  model: '',
  size: '',
  speed: '',
  status: 'active',
  params: [],
  description: ''
})

// 获取机器类型名称
const getMachineTypeName = (type: string) => {
  const typeMap: Record<string, string> = {
    printing: '印刷机',
    laminating: '覆膜机',
    cutting: '模切机',
    gilding: '烫金机',
    screen: '丝印机'
  }
  return typeMap[type] || type
}

// 添加参数
const addParam = () => {
  machineForm.params.push({
    name: '',
    value: '',
    unit: ''
  })
}

// 删除参数
const removeParam = (index: number) => {
  machineForm.params.splice(index, 1)
}

// 显示新增弹窗
const showAddDialog = () => {
  isEdit.value = false
  Object.assign(machineForm, {
    id: 0,
    name: '',
    type: '',
    model: '',
    size: '',
    speed: '',
    status: 'active',
    params: [],
    description: ''
  })
  dialogVisible.value = true
}

// 显示编辑弹窗
const handleEdit = (row: Machine) => {
  isEdit.value = true
  Object.assign(machineForm, row)
  dialogVisible.value = true
}

// 切换状态
const handleToggleStatus = (row: Machine) => {
  const action = row.status === 'active' ? '停用' : '启用'
  ElMessageBox.confirm(
    `确定要${action}该机器吗？`,
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

// 删除机器
const handleDelete = (row: Machine) => {
  ElMessageBox.confirm(
    '确定要删除该机器吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 调用删除API
    const index = machineList.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      machineList.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  }).catch(() => {
    // 取消删除
  })
}

// 提交表单
const handleSubmit = () => {
  if (!machineForm.name || !machineForm.type || !machineForm.model) {
    ElMessage.warning('请填写完整信息')
    return
  }

  if (isEdit.value) {
    // 编辑模式
    const index = machineList.value.findIndex(item => item.id === machineForm.id)
    if (index > -1) {
      machineList.value[index] = { ...machineForm }
      ElMessage.success('修改成功')
    }
  } else {
    // 新增模式
    const newMachine: Machine = {
      ...machineForm,
      id: Date.now()
    }
    machineList.value.push(newMachine)
    ElMessage.success('添加成功')
  }

  dialogVisible.value = false
}
</script>

<style scoped>
.machine {
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
