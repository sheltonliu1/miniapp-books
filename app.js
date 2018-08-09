//app.js
App({
  onLaunch: function () {
    wx.cloud.init({
      env: 'aiot-07ba70'
    });
    this.globalData.db = wx.cloud.database({ env: 'aiot-07ba70' });
  },
  globalData: {
    userInfo: {},
    labels: [],
    db: null
  }
})