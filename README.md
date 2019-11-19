1.设计界面
2.搭建服务
3.设计路由
4.配置路由
5.设计用户数据模型


**path**
__dirname  动态获取  可以用来获取当前文件模块所属目录的绝对路径
__filename 动态获取 可以用来获取当前文件的绝对路径
两者都不受执行 node 命令所属路径影响的

在文件操作中,使用绝对路径是不靠谱的,在Node 中文件操作的路径被设计为相当于执行 node 命令所处的
路径
通过将相对路径改成绝对路径来解决这个问题
parse.join()  拼接路径


npm i express mongoose
npm i bootstrap@3.3.7 jquery
npm i art-template express-art-template

//post请求
npm install --save body-parser
// 配置 body-parser 中间件（插件，专门用来解析表单 POST 请求体）
//要放在挂载路由的前面
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())