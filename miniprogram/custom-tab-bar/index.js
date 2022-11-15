Component({
  data: {
    selected: 0,
    color: '#7A7E83',
    selectedColor: '#3cc51f',
    list: [
      {
        pagePath: '/pages/home/home',
        iconPath: '../assets/tabBar/home.png',
        selectedIconPath: '../assets/tabBar/home.png'
      },
      {
        pagePath: '/pages/schedule/schedule',
        iconPath: '../assets/tabBar/schedule.png',
        selectedIconPath: '../assets/tabBar/schedule.png'
      },
      {
        pagePath: '/pages/profile/profile',
        iconPath: '../assets/tabBar/me.png',
        selectedIconPath: '../assets/tabBar/me.png'
      }
    ]
  },
  attached() {},
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      console.log(url)
      wx.switchTab({
        url
      })
      this.setData({
        selected: data.index
      })
    }
  }
})
