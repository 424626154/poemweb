var pool = require('./dao');
var utils = require('../utils/utils');

module.exports = {
	addMaterial(title,content,cover,profile,author,callback){
		var time = utils.getTime();
		var sql = 'INSERT INTO material (title,content,cover,profile,author,time) VALUES (?,?,?,?,?,?)';               
		pool.getConnection(function(err, connection) {
            connection.query(sql,[title,content,cover,profile,author,time],function(err, result) {
            	callback(err, result)
                connection.release();
            });
        });
	},
	upMaterial(id,title,content,cover,profile,author,callback){
		var time = utils.getTime();
        var sql = 'UPDATE material SET title = ? , content = ? , cover = ? , profile = ? , author = ?, time = ? WHERE id = ? ';
        pool.getConnection(function(err, connection) {
            connection.query(sql,[title,content,cover,profile,author,time,id], function(err, result) {
                callback(err, result)
                connection.release();
            });
        });
	},
	queryMaterial(id,callback){
		var sql = 'SELECT * FROM material WHERE id = ? AND del = 0 ORDER BY id DESC';
        pool.getConnection(function(err, connection) {
            connection.query(sql,id,function(err, result) {
            	callback(err, result)
                connection.release();
            });
        });
	},
	queryMaterials(callback){
		var sql = 'SELECT * FROM material WHERE del = 0 ORDER BY id DESC';
        pool.getConnection(function(err, connection) {
            connection.query(sql, function(err, result) {
            	callback(err, result)
                connection.release();
            });
        });
	},
    updateMaterial:function(id,state,callback){
        var sql = 'UPDATE material SET state = ? WHERE id = ? ';
        pool.getConnection(function(err, connection) {
            connection.query(sql, [state,id], function(err, result) {
                callback(err, result)
                connection.release();
            });
        });
    },
    deleteMaterial:function(id,callback){
        var sql = 'UPDATE material SET del = 1 WHERE id = ? ';
        pool.getConnection(function(err, connection) {
            connection.query(sql, id, function(err, result) {
                callback(err, result)
                connection.release();
            });
        });
    }
}