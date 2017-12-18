var pool = require('./dao');
var utils = require('../utils/utils');

module.exports = {
	addBanner:function(title,content,type,url,pid,author,callback){
		var time = utils.getTime();
		var sql = 'INSERT INTO banner (title,content,type,url,pid,author,time) VALUES (?,?,?,?,?,?,?)';       
        pool.getConnection(function(err, connection) {
            connection.query(sql,[title,content,type,url,pid,author,time], function(err, result) {
            	callback(err, result)
                connection.release();
            });
        });
	},
    queryBanner:function(id,callback){
        var sql = 'SELECT * FROM banner WHERE id = ? AND del = 0 ORDER BY id DESC';
        pool.getConnection(function(err, connection) {
            connection.query(sql, [id],function(err, result) {
                callback(err, result)
                connection.release();
            });
        });
    },
	queryBanners:function(callback){
		var sql = 'SELECT * FROM banner WHERE del = 0 ORDER BY id DESC';
		pool.getConnection(function(err, connection) {
            connection.query(sql, function(err, result) {
            	callback(err, result)
                connection.release();
            });
        });
	},
    updateBanner:function(id,state,callback){
        var sql = 'UPDATE banner SET state = ? WHERE id = ? ';
        pool.getConnection(function(err, connection) {
            connection.query(sql, [state,id], function(err, result) {
                callback(err, result)
                connection.release();
            });
        });
    },
    upBanner:function(id,title,content,type,url,pid,author,callback){
        var time = utils.getTime();
        var sql = 'UPDATE banner SET title = ? , content = ? , type = ? , url = ? , pid = ? , author = ?, time = ? WHERE id = ? ';
        pool.getConnection(function(err, connection) {
            connection.query(sql,[title,content,type,url,pid,author,time,id], function(err, result) {
                callback(err, result)
                connection.release();
            });
        });
    },
    deleteBanner:function(id,callback){
        var sql = 'UPDATE banner SET del = 1 WHERE id = ? ';
        pool.getConnection(function(err, connection) {
            connection.query(sql, id, function(err, result) {
                callback(err, result)
                connection.release();
            });
        });
    },
}