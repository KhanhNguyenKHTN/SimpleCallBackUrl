var https = require('https');
var fs = require('fs');

exports.downloadAudio = function(dir, fileName, url)
{
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    var path = dir + '/' + fileName;
    var file = fs.createWriteStream(path);
    https.get(url, function(response) {
        response.pipe(file);
    });
}

exports.removeUniCode = function RemoveUniCode(target) {
    var temp = target.replace(' ','');
    var data = {
      a: 'ạảãàáâậầấẩẫăắằặẳẵ',
      o: 'óòọõỏôộổỗồốơờớợởỡ',
      e: 'éèẻẹẽêếềệểễ',
      u: 'úùụủũưựữửừứ',
      i: 'íìịỉĩ',
      y: 'ýỳỷỵỹ',
      d: 'đ',
      A: 'ẠẢÃÀÁÂẬẦẤẨẪĂẮẰẶẲẴ',
      O: 'ÓÒỌÕỎÔỘỔỖỒỐƠỜỚỢỞỠ',
      E: 'ÉÈẺẸẼÊẾỀỆỂỄ',
      U: 'ÚÙỤỦŨƯỰỮỬỪỨ',
      I: 'ÍÌỊỈĨ',
      Y: 'ÝỲỶỴỸ',
      D: 'Đ'
    }
    Object.keys(data).map(function(key){
      var rep = Array.from(data[key]);
      rep.forEach(element => {
        temp = temp.replace(element, key);
      });
    });
 
    // target.replace('.','');
    // target.replace('_','');
    // target.replace('-','');
    // target.replace(':','');
    return temp;
  };