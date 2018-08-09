// pages/book/book.js
var util = require('../../utils/util.js')
var app = getApp();
const db = app.globalData.db;

Page({
  data: {
    book: {},
    tab: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this
    db.collection('books').where({
      isbn: options.isbn
    }).get().then(res => {
      console.log(res)
      if(res.data.length) {
        that.setData({
          book: res.data[0]
        })
      }
    })
  },

  chooseTab: function (e) {
    this.setData({ tab: e.currentTarget.dataset.id })
  }
})