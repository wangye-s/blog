let express = require('express');
let path = require('path');
// let template = require('art-template');
let router = require('./router.js')
let bodyParser = require("body-parser");
let session = require('express-session');

let app = express();

//公开指定路径

app.use('/public/', express.static(path.join(__dirname, '/public/')));
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')));

app.engine('html', require('express-art-template'));

// 配置 body-parser 中间件（插件，专门用来解析表单 POST 请求体）
//要放在挂载路由的前面
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//在Express 中默认不支持 Session 和 Coolie
//通过使用第三方包中间件实现: express-session 来解决
//npm install express-session
//配置session

//通过req.session 来访问和设置 session 成员
app.use(session({
  //配置加密字符串,它会在原有加密基础上拼接上这个字符串再去加密
  //增加安全性,防止客户端恶意伪造
  secret: 'itcast',
  resave: false,
  saveUninitialized: true
}))

//挂载路由
app.use(router)

//加载处理404页面的中间件
app.use(function (req, res) {
  res.render('./404.html')
})

//加载处理错误请求的中间件
app.use(function (err, req, res, next) {
  if (err) {
    res.status(500).json({
      err_code: 500,
      message: err.message
    })
  }
})

app.listen(3000,function () {
  console.log('Server is running');
})