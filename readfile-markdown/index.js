const fs = require('fs');
const path = require('path');
let str = ''
const folderPath = '../../FEE'; // 替换成需要读取的文件夹路径

function readMarkdownFiles(dirPath) {
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(err);
          return;
        }

        if (stats.isDirectory() && file !== 'node_modules') {
          readMarkdownFiles(filePath);
        } else if (stats.isFile() && path.extname(file).toLowerCase() === '.md') {
          const stream = fs.createReadStream(filePath);
          let firstLine = '';
          stream.on('data', chunk => {
            const firstNewLineIndex = chunk.indexOf('\n');
            if (firstNewLineIndex !== -1) {
              firstLine += chunk.slice(0, firstNewLineIndex);
              stream.close();
            } else {
              firstLine += chunk;
            }
          });
          stream.on('close', () => {
            let title = firstLine.replace(/#/g, '');
            let fileText = filePath.replace(/..\\..\\/, '')
            str += `[${title}](${fileText})` + '\r\n'

            fs.writeFile('./link.markdown', str, err => {
              if (err) {
                console.error(err)
                return
              }
              //文件写入成功。
            })
          });
        }
      });
    });
  });
}

readMarkdownFiles(folderPath);
