let express = require('express');
let mongoose = require('mongoose')
let User = require('./models/user');
let Topic = require('./models/topic');
let Comment = require('./models/comment')
let md5 = require('blueimp-md5')

let router = express.Router();

/*渲染主界面*/
router.get('/', function (req, res, next) {
  // console.log(req.session.user)

  res.render('index.html', {
    user: req.session.user
  });
});

/*渲染注册页面*/
router.get('/register', function (req, res, next) {
  res.render('register.html');
});

/*处理注册页面请求*/
router.post('/register', function (req, res, next) {
  //1.获取表单的数据
  //2.操作数据库
  //  判断邮箱和昵称是否存在
  //  若存在,提示用户已存在
  //  若不存在,则注册成功
  //3.发送响应
  let body = req.body;
  User.findOne({
    $or: [{
        email: body.email
    },
      {
        nickname: body.nickname
      }
    ]
  }, function (err, data) {
    if (err) {
      //服务器错误
      // Express 提供了一个响应方法：json
      // 该方法接收一个对象作为参数，它会自动帮你把对象转为字符串再发送给浏览器
      // return res.status(500).json({
      //   err_code: 500,
      //   message: 'Server err'
      // })
      next(err);
    }
    // console.log(data)
    if (data) {
      //用户已存在
      return res.status(200).json({
        err_code: 1,
        message: 'Email or nickname already exists'
      })
      return res.send('邮箱或用户名已存在,请重新输入');
    }

    //对密码使用md5重复加密
    body.password = md5(md5(body.password));

    //将注册信息存入数据库
    new User(body).save(function (err, user) {
      if (err){
        return res.status(500).json({
          err_code: 500,
          message: 'Server err'
        })
      }

      //注册成功,记录用户状态
      req.session.user = user

      res.status(200).json({
        err_code: 0,
        message: 'ok'
      })
    })
  })
})

/*渲染登陆页面*/
router.get('/login', function (req, res, next) {
  res.render('login.html');
});

/*处理登陆页面请求*/
router.post('/login', function (req, res, next) {
  //获取表单数据
  //操作数据库
  //服务端发送响应
  let body = req.body;
  User.findOne({
    email: body.email,
    password: md5(md5(body.password))
  }, function (err, user) {
    if (err) {
      next(err);
    }

    if (!user) {
      return  res.status(200).json({
        err_code: 1,
        message: 'Email or password is invalid'
      })
      return res.send('邮箱或密码错误,请重新输入');
    }

    //用户存在
    //若匹配,user就是查询到的用户对象,否则就是null
    req.session.user = user;
    res.status(200).json({
      err_code: 0,
      message: 'ok'
    })
  })
});

/*处理退出请求*/
router.get('/logout', function (req, res) {
  //清除登陆状态
  req.session.user = null;
  //重定向
  res.redirect('/login');
});

/*渲染设置页面*/
router.get('/settings/profile', function (req, res) {
  res.render('profile.html', {
    user: req.session.user
  });
})

/*处理基本信息设置页面*/
router.post('/profile', function (req, res, next) {
  let body = req.body;
  // console.log(body);
  body.email = (body.email).replace(/\s*/g,"");
  User.findOneAndUpdate({
    email: body.email
  }, {
    nickname: body.nickname,
    bio: body.bio,
    gender: body.gender,
    birthday: body.birthday
    }, { upsert: true },function (err, user) {
    if (err) {
      next(err);
    }
    if (user) {
      return res.status(200).json({
        err_code: 0,
        message: 'ok'
      })
    }
  })
})

/*渲染博客列表*/
router.get('/userPushInfo', (req, res, next) => {
  Topic.find({}, (err, data) => {
    if (err) {
      next(err);
    }

    res.status(200).json({
      err_code: 0,
      message: data,
      user: req.session.user
    })
  })
})

/*渲染博客信息界面*/
router.get('/show', function (req, res) {
  res.render('show.html', {
    user: req.session.user,
  })
})

/*处理评论*/
router.post('/comment', function (req, res, next) {
  let body = req.body;
  // console.log(body)
  new Comment(body).save(function (err, user) {
    if (err) {
      next(err)
    }
    req.session.user = user;
    res.status(200).json({
      err_code: 0,
      message: 'critic success'
    })
  })
})

/*渲染评论*/
router.get('/comment', function (req, res, next) {
  Comment.find({}, (err, data) => {
    if (err) {
      next(err);
    }

    res.status(200).json({
      err_code: 0,
      message: data,
      user: req.session.user
    })
  })
})


/*渲染发布主题页面*/
router.get('/publish', function (req, res) {
  res.render('./publish.html', {
    user: req.session.user
  });
})

/*处理发布主题页面*/
router.post('/publish', function (req, res, next) {
  let body = req.body;
  body.author = (body.author).replace(/\s*/g,"");
  new Topic(body).save(function (err, user) {
    if (err) {
      next(err);
    }
      req.session.user = user;

      return res.status(200).json({
        err_code: 0,
        message: 'ok'
      })
  })
})

/*渲染账户设置页面*/
router.get('/settings/admin', function (req, res) {
  res.render('admin.html', {
    user: req.session.user
  });
})

/*处理账户设置页面*/
router.post('/admin', function (req, res, next) {
  let body = req.body;
  body.email = (body.email).replace(/\s*/g,"");
  User.findOneAndUpdate({
    email: body.email
  },{
    password: md5(md5(body.password2))
  }, function (err, data) {
    if (err) {
      next(err);
    }
    // if (password === md5(md5(body.password))) {
    //   return res.status(200).json({
    //     err_code: 1,
    //     message: 'already exits'
    //   })
    // }
    if (data) {
      return  res.status(200).json({
        err_code: 0,
        message: 'ok'
      })
    }
  })
})

//导出路由
module.exports = router;
