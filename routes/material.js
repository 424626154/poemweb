/**
 * 素材
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path'); 
var crypto = require('crypto');
var gm = require('gm').subClass({imageMagick: true});
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var materialDao = require('../dao/materialDao');
var pictureDao = require('../dao/pictureDao');
var logger = require('../utils/log4jsutil').logger(__dirname+'/report.js');

router.get('/', function(req, res, next) {
	var user = req.cookies.user;
	if(!user){
	  res.redirect("/login");
	  return ;
	}
	var op = req.query.op;
	console.log(op)
	if(op == 'state1'){
		var id = req.query.id;
		materialDao.updateMaterial(id,1,function(err,result){
			if(err){

			}else{

			}
			res.redirect("/material");
		});
		return;
	}else if(op == 'state0'){
		var id = req.query.id;
		materialDao.updateMaterial(id,0,function(err,result){
			if(err){

			}else{

			}
			res.redirect("/material");
		});
		return;
	}else if(op == 'del'){
		var id = req.query.id;
		materialDao.deleteMaterial(id,function(err,result){
			if(err){

			}else{

			}
			res.redirect("/material");
		});
		return;
	}

	materialDao.queryMaterials(function(err,result){
		if(err){
		 	res.render('materials', { user: user,err:err,objs:[]});
		}else{
		   res.render('materials', { user: user,err:'',objs:result});
		}
	});
});

router.get('/content', function(req, res, next) {
	var id = req.query.id;
	materialDao.queryMaterial(id,function(err,result){
		if(err){
		 	res.render('material_content', {obj:null,err:err});
		}else{
		   // res.render('material_content', {obj:result[0],err:null});
		   res.send(result[0].content);
		}
	});
});

router.get('/addmaterial', function(req, res, next) {
	var user = req.cookies.user;
	if(!user){
	  res.redirect("/login");
	  return ;
	}
	res.render('material_addmaterial', { user: user,err:null});
});

router.post('/addmaterial', multipartMiddleware,function(req, res, next) {
	var user = req.cookies.user;
	if(!user){
	  res.redirect("/login");
	  return ;
	}
	var body = req.body;
	var title = body.title;
	var cover = body.cover;
	var profile = body.profile;
	var author = body.profile;
  	var content = body.content;
  	console.log(body)
  	if(!title||!content){
  		res.render('material_addmaterial', { user: user,err:'参数错误'});
  	}else{
  		materialDao.addMaterial(title,content,cover,profile,author,function(err,result){
  		if(err){
  			res.render('material_addmaterial', { user: user,err:err});
  		}else{
  			res.redirect('/material')
  		}
  	});
  	}
});

/**
 * 修改素材
 */
router.get('/upmaterial', function(req, res, next) {
	var user = req.cookies.user;
	if(!user){
	  res.redirect("/login");
	  return ;
	}
	var id = req.query.id;
	  if(id){
	      materialDao.queryMaterial(id,function(err,result){
	        if(err){
	          res.render('material_upmaterial', { user: user,err:err,obj:null});
	        }else{
	          if(result.length > 0){
	            res.render('material_upmaterial', { user: user,err:null,obj:result[0]});
	          }else{
	            res.render('material_upmaterial', { user: user,err:'ID错误',obj:null});
	          }
	        }
	      })
	  }else{
	      res.render('upbanner', { user: user,err:'参数错误',obj:null});
	  }

});

router.post('/upmaterial', multipartMiddleware,function(req, res, next) {
	var user = req.cookies.user;
	if(!user){
	  res.redirect("/login");
	  return ;
	}
	var body = req.body;
	var id = body.id;
	var title = body.title;
	var cover = body.cover;
	var profile = body.profile;
	var author = body.profile;
  	var content = body.content;
  	console.log(body)
  	if(!id||!title||!content){
  		console.log('------upMaterial err')
  		res.render('material_upmaterial', { user: user,obj:null,err:'参数错误'});
  	}else{
  		console.log('------upMaterial')
  		materialDao.upMaterial(id,title,content,cover,profile,author,function(err,result){
	  		console.log(err)
	  		if(err){
	  			res.render('material_upmaterial', { user: user,err:err});
	  		}else{
	  			res.redirect('/material')
	  		}
	  	});
  	}
});

/**
 * 图片素材
 */
router.get('/picture', function(req, res, next) {
	var user = req.cookies.user;
	if(!user){
	  res.redirect("/login");
	  return ;
	}
	var op = req.query.op;
	console.log(op)
	if(op == 'del'){
		var id = req.query.id;
		pictureDao.deletePicture(id,function(err,result){
			if(err){

			}else{

			}
			res.redirect("/material/picture");
		});
		return
	}
	pictureDao.queryPictures(function(err,result){
		if(err){
		 	res.render('material_picture', { user: user,err:err,objs:[]});
		}else{
			console.log(result)
		   res.render('material_picture', { user: user,err:'',objs:result});
		}
	});
});
/**
 * 上传图片素材
 */
router.post('/picture', multipartMiddleware,function(req, res, next) {
	var user = req.cookies.user;
	if(!user){
	  res.redirect("/login");
	  return ;
	}
	var file_path = path.join(__dirname, '../pictures/');
	var inputFile = req.files.file;
    var file_name = Date.now()+'_'+inputFile.originalFilename;
    var file_md5_name = crypto.createHash('md5').update(file_name).digest('hex');
    var uploadedPath = inputFile.path;
    var dstPath = file_path + file_md5_name;
    var bigPath = file_path + file_md5_name+'_big';
    fs.rename(uploadedPath, bigPath, function(err) {
        if(err){
            res.render('material_picture', { user: user,err:err,objs:[]});
        } else {
              console.log('------压缩图片')
              gm(bigPath)
                      .size(function (err, size) {
                        console.log('---获取图片尺寸')
                        console.log(size)
                        if (err){
                            res.render('material_picture', { user: user,err:err,objs:[]});
                        }else{
                          let zoom = 8;
                          let width = size.width/zoom;
                          let height = size.height/zoom;
                          console.log('---压缩图片尺寸')
                          console.log('-----width:',width)
                          console.log('-----height:',height)
                          gm(bigPath)
                          .resize(width, height)
                          .noProfile()
                          .write(dstPath, function (err) {
                            if (err){
                                // resError(res,err);
                                res.render('material_picture', { user: user,err:err,objs:[]});
                            }else{
                                // resSuccess(res,{name:file_md5_name});
                                console.log('-----addPicture')
                                pictureDao.addPicture(file_md5_name,size.width,size.height,function(err,result){
                                	console.log(err)
                                	if(err){
                                		res.render('material_picture', { user: user,err:err,objs:[]});
                                	}else{
                                		res.redirect('/material/picture');
                                	}
                                })
                            }
                          });
                        }
             });
        }
    });
});


module.exports = router;