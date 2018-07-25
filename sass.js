const sass  = require('node-sass'),
      fs    = require('fs');

var sassRegExp = new RegExp('^[^\\_].+\\.(sass|scss)');

var refineSassFiles = path => {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if(err) reject(err);
      var fileList = files.filter(file => {
        return fs.statSync(`${path}/${file}`).isFile() && sassRegExp.test(file);
      });
      resolve(fileList);
    });
  });
}

var renderSass  = file => {
  sass.render({
    file: file,
    outputStyle: "compressed",
    outputFile: file.replace(/\.(sass|scss)/, '.css')
  }, (err, result) => {
    if(err) throw err;
    fs.writeFile(file.replace(/\.(sass|scss)/, '.css'), result.css, err => {
      if(err) throw err;
    });
  });
}

module.exports = async (path) => {
  var pathStats = fs.statSync(path);
  if(pathStats.isDirectory()) {
    var sassList  = await refineSassFiles(path);
    for(let sassFile of sassList) {
      renderSass(`${path}/${sassFile}`);
    }
  } else if(pathStats.isFile()) {
    if(path.match(sassRegExp)) {
      renderSass(path);
    } else {
      throw new Error();
    }
  } else {
    throw new Error();
  }
}
