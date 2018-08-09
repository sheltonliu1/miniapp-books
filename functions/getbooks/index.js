// 云函数入口函数
const app = require('tcb-admin-node');
app.init({
  env: 'aiot-07ba70'
});
const db = app.database();

exports.main = async (event, context) => {
  let res = await db.collection('books').where({
    _openid: event.userInfo.openId
  }).get();

  return { books: res.data };
}