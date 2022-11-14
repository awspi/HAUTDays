## 更新日志

### alpha

- 初版发布
- Alpha ver.|1.0.2|fix:修复当课表中存在只有一周的课的情况,无法获取课表
- Alpha ver.|1.0.3|fix:修复登录页面切换密码是否可见
- Alpha ver.|1.0.4|feat:增加自定义课程、修改课程功能 ||fix:当课程周数不连续时,无法获取
- Alpha ver.|1.1.0|feat:增加首页页面,完成布局,今日课表模块 ||fix:获取本周数与实际差 8 小时
- Alpha ver.|1.2.0|feat:增加成绩分析页面
- Alpha ver.|1.3.0|feat:增加校园导航、考试安排页面;完善成绩分析、profile 页面
- Alpha ver.|1.3.1|fix:修复成绩分析统计补考前的成绩;优化成绩分析页文本显示效果
- Alpha ver.|1.4.0|feat: 增加自定义背景,调整背景高斯模糊,格子透明度功能 (本地) (base64 可能存在性能问题)
- Alpha ver.|1.4.1|fix: 优化首页今日课程加载时间短暂白屏
- Alpha ver.|1.4.2|fix: 格子透明度调整为仅背景透明
- Alpha ver.|1.4.3|fix: 校准课程表页面课程格子的对齐
- Alpha ver.|1.4.4|perf: 给调整背景 blur 和格子透明度的 slider 设置节流||fix:添加自定义课程颜色失效
- Alpha ver.|1.4.5|style: 使用 prettier 格式化代码
- Alpha ver.|1.4.6|refactor: 使用微信小程序分包;替换自定义构建后的 echarts.js
- Alpha ver.|1.5.0|refactor: 使用 **uniCloud** 代替 微信云开发
- Alpha ver.|1.5.1|refactor: 改用新的 open-type 获取用户头像
- Alpha ver.|1.5.2|fix: 课程表页面修改背景 blur 时不能实时预览
- Alpha ver.|1.6.0|refactor: 统一界面 UI;feat:可自定义自定义背景、背景色、主题色,字体颜色

## 提示

- 获取到的课程会备份到小程序的数据库中,以后每次显示的都是备份的课表,所以当原课表更新时,需要手动的重新获取一次
- 自定义的课表只会保存到备份数据库中,不会影响原课表,如果重新导入课表,**不会消失**
- 自定义课表只会保留一学期

## TODO

- 重合课程提示
- 页面代码抽离组件
- lesson 字段
