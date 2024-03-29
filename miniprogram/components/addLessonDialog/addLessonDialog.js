import { genCardStyle } from '../../utils/schedule'
import Toast from '@vant/weapp/toast/toast'
const dayOfWeekNames = [
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六',
  '星期日'
]
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: true
    },
    lesson: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    id: '',
    confirmText: '新增',
    title: '新增自定义课程',
    //
    name: '',
    classroom: '',
    teacher_name: '',
    credit: '',
    dayOfWeek: '',
    timeRange: [],
    weekCount: app.globalData.lessons?.length,
    activeWeeks: [], //
    //
    isPickerShow: false,
    //
    showTime: '请选择上课时间'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    guid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8
          return v.toString(16)
        }
      )
    },
    submit() {
      const {
        name,
        classroom,
        teacher_name,
        credit,
        dayOfWeek,
        timeRange,
        activeWeeks
      } = this.data
      console.log(name, activeWeeks, timeRange)
      if (!name || !activeWeeks.length || !timeRange.length) {
        Toast.fail({
          message: '请确保已填写必选项',
          context: this
        })
        return
      }
      const rawInfo = {
        id: this.data.id || this.guid(),
        name,
        classroom,
        teacher_name,
        credit,
        dayOfWeek,
        timeRange,
        activeWeeks: this.data.activeWeeks.map((str) => parseInt(str)),
        time: `${this.data.timeRange[0]}-${this.data.timeRange[1]}节`,
        style: '',
        custom: this.data.confirmText === '新增' ? true : false
      }

      if (this.data.lesson.style) {
        //如果是已经存在style 就不重新生成颜色
        rawInfo.style = this.data.lesson.style
        const styled = rawInfo
      } else {
        const styled = genCardStyle(rawInfo, index, true)
      }

      const index = app.globalData.lessons.length

      this.saveCustomLesson(rawInfo, index)
      this.triggerEvent('done')
    },
    //选择上课周次
    onSelectWeek(e) {
      this.setData({
        activeWeeks: e.detail
      })
      console.log(this.data.activeWeeks)
    },
    // 选择时间
    onSlecetTime() {
      this.setData({
        isPickerShow: true
      })
    },
    onTimeRangeSelected(e) {
      console.log(e.detail)
      this.setData({ ...e.detail })
    },
    //上课周次
    addAllWeeks() {
      console.log(123)
      const arr = []
      for (let i = 0; i < this.data.weekCount; i++) {
        arr.push('' + (i + 1))
      }
      this.setData({
        activeWeeks: arr
      })
    },
    addOddWeeks() {
      const arr = []
      for (let i = 0; i < this.data.weekCount; i++) {
        if (i % 2 === 0) {
          arr.push('' + (i + 1))
        }
      }
      this.setData({
        activeWeeks: arr
      })
    },
    addEvenWeeks() {
      const arr = []
      for (let i = 0; i < this.data.weekCount; i++) {
        if (i % 2 !== 0) {
          arr.push('' + (i + 1))
        }
      }
      this.setData({
        activeWeeks: arr
      })
    },
    clearWeeks() {
      this.setData({
        activeWeeks: []
      })
    }, //
    saveCustomLesson(styled, index) {
      const lessons = app.globalData.lessons

      for (let i = 0; i < styled.activeWeeks.length; i++) {
        lessons[styled.activeWeeks[i] - 1].push(styled)
      }
      app.globalData.lessons = lessons
      wx.setStorageSync('lessons', lessons)
    },
    cancel() {
      this.setData({
        show: false
      })
    }
  },
  observers: {
    'dayOfWeek,timeRange': function (dayOfWeek, timeRange) {
      if (!timeRange.length) {
        return
      }
      this.setData({
        showTime: `${dayOfWeekNames[dayOfWeek - 1]},第${timeRange[0]}节到第${
          timeRange[1]
        }节`
      })
    },
    //如果是修改课程
    lesson: function (lesson) {
      if (lesson && lesson.name) {
        console.log(lesson)
        const { dayOfWeek, timeRange } = lesson
        this.setData({
          ...lesson,
          showTime: `${dayOfWeekNames[dayOfWeek - 1]},第${timeRange[0]}节到第${
            timeRange[1]
          }节`,
          title: '修改课程',
          confirmText: '修改',
          activeWeeks: lesson.activeWeeks.map(String)
        })
      }
    },
    //关闭后重置
    show: function (show) {
      console.log(show)
      if (show) {
        this.setData({
          weekCount: app.globalData.lessons?.length
        })
        return
      }
      this.setData({
        confirmText: '新增',
        title: '新增自定义课程',
        //
        name: '',
        classroom: '',
        teacher_name: '',
        credit: '',
        dayOfWeek: '',
        timeRange: [],
        activeWeeks: [], //
        weekCount: app.globalData.lessons.length,
        //
        isPickerShow: false,
        //
        showTime: '请选择上课时间'
      })
    }
  }
})
