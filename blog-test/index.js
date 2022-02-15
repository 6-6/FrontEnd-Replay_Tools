const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
// 当收到用户的请求之后
// 在public下去读这个文件
//  读到：返回
//  读不到：返回404

const http = require('http')
const path = require('path')
const fs = require('fs')

// 放一个对象，其中保存所有的 后缀名与content-type的一一对应关系 策略模式
const mapExtToContentType = {
  '.html': 'text/html;charset=utf8',
  '.jpg': 'image/jpg',
  '.css': 'text/css;charset=utf8',
  '.js': 'application/javascript',
  '.ico': 'image/ico'
}

const serverHandle = (req, res) => {
  //设置返回格式JSON
  res.setHeader('Content-type', 'application/json')

  //获取path
  const url = req.url
  req.path = url.split('?')[0]

    // 获取后缀名
    const ext = path.extname(url)

    // 1. 拼接地址
    const filePath = path.join(__dirname, '../../JavaScript', url)
    // 2. 读资源文件
    try{
      console.log(ext);
      if(ext){
        const content = fs.readFileSync(filePath)
        console.log(content)
    
        // 根据不同的后缀名，补充不同的content-type
        // .html ---> text/html;charset=utf8
        // .jpg ---> image/jpg
        
        if(mapExtToContentType[ext]) {
          res.setHeader('content-type', mapExtToContentType[ext])
        }

         // mapExtToContentType[ext] && res.setHeader('content-type', mapExtToContentType[ext])
      
        res.end(content)
    
      }
      else{
        //处理blog路由
        const blogData = handleBlogRouter(req, res)
        if(blogData){
          res.end(JSON.stringify(blogData))
          return
        }

        //处理user路由
        const userData = handleUserRouter(req, res)
        if(userData){
          res.end(JSON.stringify(userData))
          return
        }

      }


    } catch (err) {
      console.log(err)
      res.statusCode = 404
      res.end('404')
    }


  // //未命中路由，返回404
  // res.writeHead(404, {'Content-type': 'text/plain'})
  // res.write('404 Not Found\n')
  // res.end()
}

module.exports = serverHandle