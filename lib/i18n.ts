// ================= i18n多语言实现 =================
// 简易i18n实现，支持多语言切换
export const locales = {
  zh: {
    post: '帖子',
    mission: '任务',
    title: '标题',
    content: '内容',
    submit: '发布',
    cancel: '取消',
    preview: '实时预览',
    closePreview: '关闭预览',
    emoji: '表情',
    uploadImage: '上传图片',
    reward: '奖励 (声望)',
    type: '类型',
    login: '登录',
    register: '注册',
    password: '密码',
    confirmPassword: '确认密码',
    email: '邮箱',
    language: '语言',
    aiSuggest: 'AI推荐',
    aiSummary: 'AI摘要'
  },
  en: {
    post: 'Post',
    mission: 'Mission',
    title: 'Title',
    content: 'Content',
    submit: 'Submit',
    cancel: 'Cancel',
    preview: 'Preview',
    closePreview: 'Close Preview',
    emoji: 'Emoji',
    uploadImage: 'Upload Image',
    reward: 'Reward (Reputation)',
    type: 'Type',
    login: 'Login',
    register: 'Register',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    email: 'Email',
    language: 'Language',
    aiSuggest: 'AI Suggest',
    aiSummary: 'AI Summary'
  }
};


/**
 * 获取多语言文本
 * @param key 词条key
 * @param lang 语言（zh/en）
 */
export function t(key: string, lang: 'zh'|'en' = 'zh') {
  return locales[lang][key] || key;
}
