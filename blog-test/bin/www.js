const http = require('http')

const PORT = 8000
const listenCallBack = ()=>{
  console.log('监听端口8000已启动');
}
const serverHandle = require('../index')

const server = http.createServer(serverHandle)
server.listen(PORT, listenCallBack)