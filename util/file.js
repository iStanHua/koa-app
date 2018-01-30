let fs = require('fs')
let path = require('path')

function File() {
  this.promise = Promise.resolve()
}

File.read = function (filePath) {
  var file = new File()
  return file.read(filePath)
};

File.prototype.then = function (onFulfilled, onRejected) {
  this.promise = this.promise.then(onFulfilled, onRejected)
  return this
};
File.prototype['catch'] = function (onRejected) {
  this.promise = this.promise.catch(onRejected)
  return this
};
File.prototype.read = function (filePath) {
  return this.then(function () {
    return fs.readFileSync(filePath, 'utf-8')
  })
}
File.prototype.transform = function (fn) {
  return this.then(fn)
};
File.prototype.write = function (filePath) {
  return this.then(function (data) {
    return fs.writeFileSync(filePath, data)
  })
}

module.exports = File

// let File = require('./fs-promise-chain')
// let inputFilePath = 'input.txt',
//     outputFilePath = 'output.txt'
// File.read(inputFilePath)
//     .transform(function (content) {
//         return '>>' + content
//     })
//     .write(outputFilePath)