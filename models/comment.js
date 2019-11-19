let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//连接数据库
mongoose.connect('mongodb://localhost/blog', {useNewUrlParser: true });

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('success mongoose comment')
})

//设计文档结构
let ComtSchema = new Schema({
  critic: {
    type: String,
  },
  content: {
    type: String,
    required: true
  },
  cri_time: {
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
  }
  }
)

//发布模型
module.exports = mongoose.model('Comment', ComtSchema);