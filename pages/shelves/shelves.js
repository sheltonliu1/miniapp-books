// pages/shelves/shelves.js
var util = require('../../utils/util.js');
var app = getApp();
const db = app.globalData.db;
const user = app.globalData.userInfo;

Page({
  data: {
    allBooks: [],
    bookList: [],
    label: '全部',
    labels: []
  },
  //事件处理函数
  toDetailsTap: function (e) {
    wx.navigateTo({
      url: "/pages/book/book?isbn=" + e.currentTarget.dataset.isbn
    })
  },

  chooseLabel: function (e) {
    let newLabel = e.currentTarget.dataset.label
    if (newLabel == "全部") {
      this.setData({
        label: newLabel,
        bookList: this.data.allBooks
      })
    } else {
      let newbooks = this.data.allBooks.filter(
        item => item.labels.indexOf(newLabel) > -1
      )
      this.setData({
        label: newLabel,
        bookList: newbooks
      })
    }
  },

  onLoad: function () {
    let that = this;
    if (!user._id) {
      db.collection('users').get().then(res => {
        if (res.data.length) {
          app.globalData.userInfo = res.data[0];
          if (res.data[0].labels) {
            app.globalData.labels = res.data[0].labels.split(',');
            that.setData({labels: app.globalData.labels});
          }
          console.log(app.globalData)
        } else {
          let newUser = { avatar: '', nickName: '', labels: '' }
          db.collection('users').add({ data: newUser }).then(res => {
            newUser._id = res._id;
            app.globalData.userInfo = newUser;
            console.log(app.globalData)
          })
        }
      })
    }

    this.getBooks();
  },

  onShow: function () {
    console.log('show')
    this.setData({ labels: app.globalData.labels })
  },

  getBooks: function () {
    let that = this;
    db.collection('books').get().then(res => {
      that.setData({
        allBooks: res.data,
        bookList: res.data
      })
    })
  },

  addBook: function() {
    let that = this;
    wx.scanCode({
      success: (res) => {
        console.log(res)
        if ((this.data.allBooks.filter(book => book.isbn == res.result)).length) {
          console.log('书籍已存在')
          return;
        }
        wx.showLoading({
          title: '添加中',
          mask: true
        })
        wx.request({
          url: 'https://ultimathule.cn/v2/book/isbn/'+res.result,
          header: {
            'content-type': 'application/text'
          },
          success: (info) => {
            console.log(info);
            if (info.data.isbn13) {
              let book = {
                "author": info.data.author.toString(),
                "cover": info.data.image,
                "smallcover": info.data.images.small,
                "labels": '',
                "name": info.data.title,
                "myscore": -1,
                "doubanscore": info.data.rating.average,
                "summary": info.data.summary,
                "thoughts": '',
                "isbn": info.data.isbn13,
                "createdAt": (new Date()).getTime(),
                "updatedAt": (new Date()).getTime()
              }
              console.log(book)
              db.collection('books').add({ data: book }).then(res => {
                that.data.allBooks.push(book);
                that.setData({
                  allBooks: this.data.allBooks,
                  bookList: this.data.allBooks
                });
                wx.hideLoading();
              }).catch(err => {
                console.log(err.errCode, err.errMsg)
              })
            } else {

            }
          }
        })
      }
    })
  }
})
