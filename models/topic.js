let mongoose = require('mongoose');
let comment = require('./comment');
let Schema = mongoose.Schema;

//连接数据库
mongoose.connect('mongodb://localhost/blog', {useNewUrlParser: true });

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('success mongoose topic')
})

//设计文档结构
let TopicSchema = new Schema({
  author: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  article: {
    type: String,
    required: true
  },
  content:{
    type: mongoose.Schema.ObjectId,
    ref: comment
  },
  show_time: {
    type: Date,
    default: Date.now
  },
  modified_time: {
    type: Date,
    default: Date.now
  },
  support: {
    type: Number,
    default: 0
  },
  tread: {
    type: Number,
    default: 0
  },
  view: {
    type: Number,
    default: 0
  }
});

//发布模型
module.exports = mongoose.model('Topic', TopicSchema);