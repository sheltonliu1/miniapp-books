// pages/setting/setting.js
var util = require('../../utils/util.js')
var app = getApp();
const db = app.globalData.db;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    labels: [],
    labelVaild: false,
    newLabel: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({labels: app.globalData.labels})
  },

  addLabel: function(e) {
    this.data.labels.push(this.data.newLabel)
    this.setData({
      labels: this.data.labels,
      newLabel: '',
      labelValid: false
    })
  },
  inputLabel: function(e) {
    let content = e.detail.value;
    if (!content || this.data.labels.indexOf(content) > -1 || content == "全部" || content.length > 7) {
      this.setData({
        labelVaild: false
      })
      return
    }
    this.setData({
      newLabel: content,
      labelVaild: true
    })
  },
  removeLabel: function(e) {
    let index = e.currentTarget.dataset.id;
    this.data.labels.splice(index, 1)
    this.setData({
      labels: this.data.labels
    })
  },
  saveLabel: function() {
    let labelStr = this.data.labels.join(',')
    let that = this;
    let userId = app.globalData.userInfo._id;
    db.collection('users').doc(userId).update({
      data: {labels: labelStr}
    }).then(res => {
      app.globalData.labels = this.data.labels;
    })
    
  }
})