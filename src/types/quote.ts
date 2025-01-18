// 报价记录类型
export interface QuoteRecord {
  id: string
  date: string
  customerName: string
  productType: string
  productName: string
  quantity: number
  amount: number
  status: '草稿' | '待确认' | '已确认' | '已取消'
}

// 报价表单类型
export interface QuoteForm {
  customerName: string
  phone: string
  productType: string
  quantity: number
  length: number
  width: number
  material: string
  printMethod: string
  colors: string
  postProcess: string[]
  remarks: string
}

// 报价结果类型
export interface QuoteResult {
  materialCost: number
  printCost: number
  postProcessCost: number
  otherCost: number
  total: number
}

// 报价详情类型
export interface QuoteDetail extends QuoteRecord {
  phone: string
  length: number
  width: number
  material: string
  printMethod: string
  colors: string
  postProcess: string[]
  remarks: string
  materialCost: number
  printCost: number
  postProcessCost: number
  otherCost: number
  createTime: string
  updateTime: string
  operator: string
} 