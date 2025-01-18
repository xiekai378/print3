<template>
  <div class="quick-quote">
    <el-card class="quote-form">
      <template #header>
        <div class="card-header">
          <h2>快速报价</h2>
        </div>
      </template>

      <el-form 
        ref="formRef"
        :model="quoteForm"
        :rules="rules"
        label-width="120px"
        class="quote-form"
      >
        <!-- 基本信息 -->
        <el-divider>基本信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="客户名称" prop="customerName">
              <el-input v-model="quoteForm.customerName" placeholder="请输入客户名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="quoteForm.phone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 产品信息 -->
        <el-divider>产品信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="产品类型" prop="productType">
              <el-select v-model="quoteForm.productType" placeholder="请选择产品类型" @change="handleProductTypeChange">
                <el-option
                  v-for="item in productTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="印刷数量" prop="quantity">
              <el-input-number v-model="quoteForm.quantity" :min="1" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="成品尺寸" required>
              <el-row :gutter="10">
                <el-col :span="11">
                  <el-form-item prop="length">
                    <el-input-number v-model="quoteForm.length" :min="1" placeholder="长(mm)" />
                  </el-form-item>
                </el-col>
                <el-col :span="2" class="text-center">
                  <span>×</span>
                </el-col>
                <el-col :span="11">
                  <el-form-item prop="width">
                    <el-input-number v-model="quoteForm.width" :min="1" placeholder="宽(mm)" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="材质选择" prop="material">
              <el-select v-model="quoteForm.material" placeholder="请选择材质">
                <el-option
                  v-for="item in materials"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 工艺信息 -->
        <el-divider>工艺信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="印刷方式" prop="printMethod">
              <el-select v-model="quoteForm.printMethod" placeholder="请选择印刷方式">
                <el-option
                  v-for="item in printMethods"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="印刷颜色" prop="colors">
              <el-select v-model="quoteForm.colors" placeholder="请选择印刷颜色">
                <el-option label="单色" value="1" />
                <el-option label="双色" value="2" />
                <el-option label="四色" value="4" />
                <el-option label="专色" value="special" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="后道工艺" prop="postProcess">
              <el-checkbox-group v-model="quoteForm.postProcess">
                <el-checkbox label="覆膜" name="postProcess" />
                <el-checkbox label="烫金" name="postProcess" />
                <el-checkbox label="UV" name="postProcess" />
                <el-checkbox label="模切" name="postProcess" />
                <el-checkbox label="装订" name="postProcess" />
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 其他要求 -->
        <el-divider>其他要求</el-divider>
        <el-form-item label="备注说明" prop="remarks">
          <el-input
            v-model="quoteForm.remarks"
            type="textarea"
            :rows="3"
            placeholder="请输入其他特殊要求或说明"
          />
        </el-form-item>

        <!-- 报价结果 -->
        <el-divider>报价结果</el-divider>
        <div class="quote-result" v-if="quoteResult.total > 0">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="材料费用">{{ quoteResult.materialCost }}元</el-descriptions-item>
            <el-descriptions-item label="印刷费用">{{ quoteResult.printCost }}元</el-descriptions-item>
            <el-descriptions-item label="后道费用">{{ quoteResult.postProcessCost }}元</el-descriptions-item>
            <el-descriptions-item label="其他费用">{{ quoteResult.otherCost }}元</el-descriptions-item>
            <el-descriptions-item label="总计金额" :span="2">
              <span class="total-amount">{{ quoteResult.total }}元</span>
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 表单操作 -->
        <div class="form-actions">
          <el-button type="primary" @click="handleSubmit(formRef)">立即报价</el-button>
          <el-button @click="resetForm(formRef)">重置</el-button>
          <el-button type="success" :disabled="!quoteResult.total" @click="saveQuote">
            保存报价单
          </el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

// 表单引用
const formRef = ref<FormInstance>()

// 产品类型选项
const productTypes = [
  { label: '画册印刷', value: 'book' },
  { label: '包装印刷', value: 'package' },
  { label: '名片印刷', value: 'card' },
  { label: '海报印刷', value: 'poster' }
]

// 材质选项
const materials = [
  { label: '铜版纸157g', value: 'art_paper_157' },
  { label: '铜版纸200g', value: 'art_paper_200' },
  { label: '铜版纸250g', value: 'art_paper_250' },
  { label: '双铜纸300g', value: 'double_paper_300' }
]

// 印刷方式
const printMethods = [
  { label: '胶印', value: 'offset' },
  { label: '数码印刷', value: 'digital' },
  { label: '丝网印刷', value: 'screen' }
]

// 表单数据
const quoteForm = reactive({
  customerName: '',
  phone: '',
  productType: '',
  quantity: 100,
  length: 210,
  width: 285,
  material: '',
  printMethod: '',
  colors: '',
  postProcess: [],
  remarks: ''
})

// 表单验证规则
const rules = reactive<FormRules>({
  customerName: [
    { required: true, message: '请输入客户名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  productType: [
    { required: true, message: '请选择产品类型', trigger: 'change' }
  ],
  quantity: [
    { required: true, message: '请输入印刷数量', trigger: 'blur' }
  ],
  length: [
    { required: true, message: '请输入成品长度', trigger: 'blur' }
  ],
  width: [
    { required: true, message: '请输入成品宽度', trigger: 'blur' }
  ],
  material: [
    { required: true, message: '请选择材质', trigger: 'change' }
  ],
  printMethod: [
    { required: true, message: '请选择印刷方式', trigger: 'change' }
  ],
  colors: [
    { required: true, message: '请选择印刷颜色', trigger: 'change' }
  ]
})

// 报价结果
const quoteResult = reactive({
  materialCost: 0,
  printCost: 0,
  postProcessCost: 0,
  otherCost: 0,
  total: 0
})

// 处理产品类型变化
const handleProductTypeChange = (value: string) => {
  // 根据产品类型预设一些默认值
  switch (value) {
    case 'book':
      quoteForm.length = 210
      quoteForm.width = 285
      break
    case 'card':
      quoteForm.length = 90
      quoteForm.width = 54
      break
    // 其他产品类型的默认值...
  }
}

// 计算报价
const calculateQuote = () => {
  // 这里是示例的计算逻辑，实际应该根据具体的报价规则来计算
  const basePrice = 100 // 基础价格
  const quantityFactor = quoteForm.quantity / 100 // 数量因素
  const sizeFactor = (quoteForm.length * quoteForm.width) / 10000 // 尺寸因素
  const colorFactor = Number(quoteForm.colors) * 50 // 颜色因素
  const postProcessFactor = quoteForm.postProcess.length * 30 // 后道工艺因素

  quoteResult.materialCost = Math.round(basePrice * sizeFactor)
  quoteResult.printCost = Math.round(colorFactor * quantityFactor)
  quoteResult.postProcessCost = Math.round(postProcessFactor * sizeFactor)
  quoteResult.otherCost = Math.round(basePrice * 0.1)
  quoteResult.total = Math.round(
    quoteResult.materialCost +
    quoteResult.printCost +
    quoteResult.postProcessCost +
    quoteResult.otherCost
  )
}

// 提交表单
const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  
  await formEl.validate((valid) => {
    if (valid) {
      calculateQuote()
      ElMessage.success('报价计算完成')
    }
  })
}

// 重置表单
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  Object.assign(quoteResult, {
    materialCost: 0,
    printCost: 0,
    postProcessCost: 0,
    otherCost: 0,
    total: 0
  })
}

// 保存报价单
const saveQuote = () => {
  // 这里应该调用API保存报价单
  ElMessage.success('报价单已保存')
}
</script>

<style scoped>
.quick-quote {
  padding: 20px;
}

.quote-form {
  max-width: 1200px;
  margin: 0 auto;
}

.text-center {
  text-align: center;
  line-height: 32px;
}

.quote-result {
  margin: 20px 0;
}

.total-amount {
  font-size: 20px;
  color: #f56c6c;
  font-weight: bold;
}

.form-actions {
  margin-top: 20px;
  text-align: center;
}

:deep(.el-divider__text) {
  font-size: 16px;
  font-weight: bold;
  color: #409eff;
}
</style> 