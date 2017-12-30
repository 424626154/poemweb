var pool = require('./dao');
var utils = require('../utils/utils');

module.exports = {
	addPicture(image,img_w,img_h,callback){
		var time = utils.getTime();
		var sql = 'INSERT INTO admin_picture (image,img_w,img_h,time) VALUES (?,?,?,?)';               
		pool.getConnection(function(err, connection) {
            connection.query(sql,[image,img_w,img_h,time],function(err, result) {
            	callback(err, result)
                connection.release();
            });
        });
	},
	queryPictures(callback){
		var sql = 'SELECT * FROM admin_picture WHERE del = 0 ORDER BY id DESC';
        pool.getConnection(function(err, connection) {
            connection.query(sql, function(err, result) {
            	callback(err, result)
                connection.release();
            });
        });
	},
	deletePicture(id,callback){
		var sql = 'UPDATE admin_picture SET del = 1 WHERE id = ? ';
        pool.getConnection(function(err, connection) {
            connection.query(sql, id, function(err, result) {
                callback(err, result)
                connection.release();
            });
        });
	}
}