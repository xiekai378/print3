<template>
  <div class="order-create">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>新建订单</h2>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="orderForm"
        :rules="rules"
        label-width="120px"
        class="order-form"
      >
        <!-- 客户信息 -->
        <el-divider>客户信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="客户名称" prop="customerName">
              <el-select
                v-model="orderForm.customerName"
                filterable
                remote
                :remote-method="searchCustomers"
                placeholder="请输入客户名称搜索"
                @change="handleCustomerChange"
              >
                <el-option
                  v-for="item in customerOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="orderForm.phone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="收货地址" prop="address">
              <el-input v-model="orderForm.address" placeholder="请输入收货地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" prop="contact">
              <el-input v-model="orderForm.contact" placeholder="请输入联系人" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 产品信息 -->
        <el-divider>产品信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="产品类型" prop="productType">
              <el-select v-model="orderForm.productType" placeholder="请选择产品类型" @change="handleProductTypeChange">
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
            <el-form-item label="产品名称" prop="productName">
              <el-input v-model="orderForm.productName" placeholder="请输入产品名称" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="印刷数量" prop="quantity">
              <el-input-number v-model="orderForm.quantity" :min="1" @change="calculatePrice" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成品尺寸" required>
              <el-row :gutter="10">
                <el-col :span="11">
                  <el-form-item prop="length">
                    <el-input-number v-model="orderForm.length" :min="1" placeholder="长(mm)" @change="calculatePrice" />
                  </el-form-item>
                </el-col>
                <el-col :span="2" class="text-center">
                  <span>×</span>
                </el-col>
                <el-col :span="11">
                  <el-form-item prop="width">
                    <el-input-number v-model="orderForm.width" :min="1" placeholder="宽(mm)" @change="calculatePrice" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="材质选择" prop="material">
              <el-select v-model="orderForm.material" placeholder="请选择材质" @change="calculatePrice">
                <el-option
                  v-for="item in materials"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="印刷颜色" prop="colors">
              <el-select v-model="orderForm.colors" placeholder="请选择印刷颜色" @change="calculatePrice">
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
              <el-checkbox-group v-model="orderForm.postProcess" @change="calculatePrice">
                <el-checkbox label="覆膜" name="postProcess" />
                <el-checkbox label="烫金" name="postProcess" />
                <el-checkbox label="UV" name="postProcess" />
                <el-checkbox label="模切" name="postProcess" />
                <el-checkbox label="装订" name="postProcess" />
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 交付信息 -->
        <el-divider>交付信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="交付日期" prop="deliveryDate">
              <el-date-picker
                v-model="orderForm.deliveryDate"
                type="date"
                placeholder="请选择交付日期"
                :disabled-date="disabledDate"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="交付方式" prop="deliveryMethod">
              <el-select v-model="orderForm.deliveryMethod" placeholder="请选择交付方式">
                <el-option label="快递配送" value="express" />
                <el-option label="上门自提" value="self" />
                <el-option label="送货上门" value="delivery" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 其他信息 -->
        <el-divider>其他信息</el-divider>
        <el-form-item label="备注说明" prop="remarks">
          <el-input
            v-model="orderForm.remarks"
            type="textarea"
            :rows="3"
            placeholder="请输入其他特殊要求或说明"
          />
        </el-form-item>

        <!-- 报价信息 -->
        <el-divider>报价信息</el-divider>
        <div class="price-info">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="材料费用">{{ priceInfo.materialCost }}元</el-descriptions-item>
            <el-descriptions-item label="印刷费用">{{ priceInfo.printCost }}元</el-descriptions-item>
            <el-descriptions-item label="后道费用">{{ priceInfo.postProcessCost }}元</el-descriptions-item>
            <el-descriptions-item label="其他费用">{{ priceInfo.otherCost }}元</el-descriptions-item>
            <el-descriptions-item label="总计金额" :span="2">
              <span class="total-amount">{{ priceInfo.total }}元</span>
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 表单操作 -->
        <div class="form-actions">
          <el-button type="primary" @click="submitForm(formRef)">提交订单</el-button>
          <el-button @click="resetForm(formRef)">重置</el-button>
          <el-button type="warning" @click="saveDraft(formRef)">保存草稿</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()

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

// 客户选项
const customerOptions = ref([
  { label: '上海某某科技有限公司', value: '上海某某科技有限公司' },
  { label: '北京某某贸易有限公司', value: '北京某某贸易有限公司' },
  { label: '广州某某实业有限公司', value: '广州某某实业有限公司' }
])

// 订单表单
const orderForm = reactive({
  customerName: '',
  phone: '',
  address: '',
  contact: '',
  productType: '',
  productName: '',
  quantity: 100,
  length: 210,
  width: 285,
  material: '',
  colors: '',
  postProcess: [],
  deliveryDate: '',
  deliveryMethod: '',
  remarks: ''
})

// 价格信息
const priceInfo = reactive({
  materialCost: 0,
  printCost: 0,
  postProcessCost: 0,
  otherCost: 0,
  total: 0
})

// 表单验证规则
const rules = reactive<FormRules>({
  customerName: [
    { required: true, message: '请选择客户名称', trigger: 'change' }
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '请输入收货地址', trigger: 'blur' }
  ],
  contact: [
    { required: true, message: '请输入联系人', trigger: 'blur' }
  ],
  productType: [
    { required: true, message: '请选择产品类型', trigger: 'change' }
  ],
  productName: [
    { required: true, message: '请输入产品名称', trigger: 'blur' }
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
  colors: [
    { required: true, message: '请选择印刷颜色', trigger: 'change' }
  ],
  deliveryDate: [
    { required: true, message: '请选择交付日期', trigger: 'change' }
  ],
  deliveryMethod: [
    { required: true, message: '请选择交付方式', trigger: 'change' }
  ]
})

// 搜索客户
const searchCustomers = (query: string) => {
  if (query) {
    // 这里应该调用API搜索客户
    // 模拟搜索结果
    const results = customerOptions.value.filter(item => 
      item.label.toLowerCase().includes(query.toLowerCase())
    )
    customerOptions.value = results
  } else {
    customerOptions.value = [
      { label: '上海某某科技有限公司', value: '上海某某科技有限公司' },
      { label: '北京某某贸易有限公司', value: '北京某某贸易有限公司' },
      { label: '广州某某实业有限公司', value: '广州某某实业有限公司' }
    ]
  }
}

// 处理客户选择变化
const handleCustomerChange = (value: string) => {
  // 这里应该调用API获取客户详细信息
  // 模拟客户信息
  const customerInfo = {
    phone: '13800138000',
    address: '上海市浦东新区某某路88号',
    contact: '张三'
  }
  Object.assign(orderForm, customerInfo)
}

// 处理产品类型变化
const handleProductTypeChange = (value: string) => {
  // 根据产品类型预设一些默认值
  switch (value) {
    case 'book':
      orderForm.length = 210
      orderForm.width = 285
      break
    case 'card':
      orderForm.length = 90
      orderForm.width = 54
      break
    // 其他产品类型的默认值...
  }
  calculatePrice()
}

// 计算价格
const calculatePrice = () => {
  const { quantity, length, width, colors, postProcess } = orderForm
  
  // 这里是示例的计算逻辑，实际应该根据具体的报价规则来计算
  const basePrice = 100 // 基础价格
  const area = length * width / 10000 // 面积因素
  const quantityFactor = quantity / 100 // 数量因素
  const colorFactor = Number(colors) * 50 // 颜色因素
  const postProcessFactor = postProcess.length * 30 // 后道工艺因素

  priceInfo.materialCost = Math.round(basePrice * area)
  priceInfo.printCost = Math.round(colorFactor * quantityFactor)
  priceInfo.postProcessCost = Math.round(postProcessFactor * area)
  priceInfo.otherCost = Math.round(basePrice * 0.1)
  priceInfo.total = Math.round(
    priceInfo.materialCost +
    priceInfo.printCost +
    priceInfo.postProcessCost +
    priceInfo.otherCost
  )
}

// 禁用的日期
const disabledDate = (time: Date) => {
  return time.getTime() < Date.now() - 8.64e7 // 不能选择今天之前的日期
}

// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  
  await formEl.validate((valid) => {
    if (valid) {
      // 这里应该调用API提交订单
      ElMessage.success('订单提交成功')
      router.push('/order-customer/orders')
    }
  })
}

// 重置表单
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  Object.assign(priceInfo, {
    materialCost: 0,
    printCost: 0,
    postProcessCost: 0,
    otherCost: 0,
    total: 0
  })
}

// 保存草稿
const saveDraft = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  // 这里应该调用API保存草稿
  ElMessage.success('草稿保存成功')
}
</script>

<style scoped>
.order-create {
  padding: 20px;
}

.order-form {
  max-width: 1200px;
  margin: 0 auto;
}

.text-center {
  text-align: center;
  line-height: 32px;
}

.price-info {
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