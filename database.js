var mysql = require('mysql');
var lib = require('./lib');
var crypto = require('crypto');

var con = mysql.createConnection({
    host: "35.196.95.74",
    user: "khanhnguyen",
    password: "khanhnguyen",
    database: "SoundDb"
  });
  
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

function AddLineToLastId(link, callback)
{
  var sql = "SELECT Id FROM SoundInfo ORDER BY id DESC LIMIT 1;";
  con.query(sql, function(err, results) {
    console.log('Result: ', results);
    if (results.length !==  1) {
        console.error('not found sound ', gameId);
        return callback('NO_GAME_HASH');
    }

    var lastId = results[0].Id;
    var updateQuery = "UPDATE SoundInfo SET Link = '" + link + "' WHERE Id = " + lastId;
    con.query(updateQuery);
  });
}

exports.UpdateLink = AddLineToLastId;

exports.updateDownLoad = function(url, callback)
{
    var sql = `SELECT Id, Link, KeySound, Direction FROM SoundInfo WHERE Link='${url}' ORDER BY id DESC LIMIT 1;`;
    con.query(sql, function(err, results) {
        // console.log('Result: ', results);
        if(err) {
            console.log(err);
            return callback(err);
        }
        if (results.length !==  1) {
            console.log('not found sound link:', url);
            return callback('NO_GAME_HASH');
        }
        var lastId = results[0].Id;
        var link = results[0].Link;
        var keySound = results[0].KeySound;
        var direction = results[0].Direction;
        var description = lib.removeUniCode(keySound);
        var hash = crypto.createHash('sha256').update(keySound).digest('hex');
        var fileName = description + '.mp3';
        var realPath =  direction + '/' + fileName;
        var updateQuery = `UPDATE SoundInfo SET FileName = '${fileName}' , RealPath = '${realPath}', Hash ='${hash}', Description = '${description}'  WHERE Id = ${lastId}`;
        con.query(updateQuery, function(nerr){
            if(nerr) console.log(nerr);
            console.log('Updated for: ', keySound);
            callback(null, { path: realPath, direction: direction, fileName: fileName, url: link});
        });
      });
};