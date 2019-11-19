let mongoose = require('mongoose');
let comment = require('./comment');
let Schema = mongoose.Schema;

//连接数据库
mongoose.connect('mongodb://localhost/blog', {useNewUrlParser: true });

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('success mongoose user')
})

//设计文档结构
let UserSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  myblog: {
    type: mongoose.Schema.ObjectId,
    ref: comment
  },
  created_time: {
    type: Date,
    default: Date.now
  },
  last_modified_time: {
    type: Date,
    default: Date.now
  },
  avatar: {
    type: String,
    default: '/public/img/avatar-default3.png'
  },
  bio: {
    type: String,
    default: ''
  },
  gender: {
    type: Number,
    // 1 男生
    // 0 女生
    // -1 保密
    enum: [-1, 0, 1],
    default: -1
  },
  birthday: {
    type: Date
  },
  status: {
    type: Number,
    // 0 没有权限限制
    // 1 不可以评论
    // 2 不可以登录
    enum: [0, 1, 2],
    default: 0
  }
});

//发布模型
module.exports = mongoose.model('User', UserSchema);
