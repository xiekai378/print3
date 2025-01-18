import { createI18n } from 'vue-i18n'
import zh from './zh'

const i18n = createI18n({
  legacy: false, // 使用组合式API
  locale: 'zh', // 设置语言
  fallbackLocale: 'zh', // 设置备用语言
  messages: {
    zh
  }
})

export default i18n 