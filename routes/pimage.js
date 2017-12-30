/**
 * 图片服务器
 */
var express = require('express');
var router = express.Router();
//fs读取和写入文件
var fs = require('fs');
var path = require('path'); 
var crypto = require('crypto');
var multiparty = require('multiparty');
var gm = require('gm').subClass({imageMagick: true});

router.get('/:fileName', function(req, res, next) {
	 // 实现文件下载 
	 var fileName = req.params.fileName;
	 console.log('fileName:'+fileName);
	 // console.log('----------------------------fileName:',fileName)
	 var file_path = path.join(__dirname, '../pictures/');
	 var filePath = path.join(file_path, fileName);
	 var stats = fs.statSync(filePath); 
	 if(stats.isFile()){
	  res.set({
	   'Content-Type': 'application/octet-stream',
	   'Content-Disposition': 'attachment; filename='+fileName,
	   'Content-Length': stats.size
	  });
	  fs.createReadStream(filePath).pipe(res);
	 } else {
	  res.end(404);
	 }
});
module.exports = router;