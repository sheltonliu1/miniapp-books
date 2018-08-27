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
  },
  changeCover: function () {
    let that = this;
    wx.chooseImage({
      success: chooseResult => {
        // 将图片上传至云文件存储空间
        wx.cloud.uploadFile({
          // 指定上传到的云路径
          cloudPath: 'covers/' + app.globalData.userInfo._openid + '/' + (new Date()).getTime()+ '.png',
          // 指定要上传的文件的小程序临时文件路径
          filePath: chooseResult.tempFilePaths[0],
          // 成功回调
          success: res => {
            console.log(res.fileID)
            db.collection('books').doc(this.data.book._id).update({
              data:{cover: res.fileID, smallcover: res.fileID},
              success: res=>{
                this.data.book.cover = res.fileID;
                that.setData({book: this.data.book})
              }
            })
          },
        })
      },
    })
  }
})