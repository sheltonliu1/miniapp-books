// pages/book/book.js
var util = require('../../utils/util.js')
var app = getApp();
const db = app.globalData.db;

Page({
  data: {
    book: {},
    tab: 1,
    isEdit: false,
    thoughts: ''
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
      if(res.data.length) {
        that.setData({
          book: res.data[0]
        })
      }
    })
  },

  chooseTab: function (e) {
    this.setData({ tab: e.currentTarget.dataset.id })
  },

  editThoughts: function () {
    this.setData({isEdit: true})
  },
  cancelEditThoughts: function () {
    this.setData({isEdit: false})
  },
  inputThoughts: function (e) {
    this.setData({thoughts: e.detail.value})
  },

  saveThoughts: function () {
    let that = this;
    db.collection('books').doc(this.data.book._id).update({
      data:{thoughts: this.data.thoughts},
      success: res=>{
        this.data.book.thoughts = this.data.thoughts;
        that.setData({book: this.data.book, isEdit: false})
      }
    })
  }
})