// 云函数入口函数
const app = require('tcb-admin-node');
app.init({
  env: 'aiot-07ba70'
});
const db = app.database();

exports.main = async (event, context) => {
  let openId = event.userInfo.openId;

  let res = await db.collection('users').where({
    openId: openId
  }).get();

  let user = null;
  if (!res.data.length) {
    user = {
      openId: openId,
      nickName: '',
      avatar: '',
      labels: ''
    };
    await db.collection('users').add(user);
  } else {
    user = res.data[0]
  }
  
  return { user: user};
}