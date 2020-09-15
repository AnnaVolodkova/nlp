const fs = require('fs');
const split = require('split-string-words');
const splitToWords = require('split-to-words');


let text = fs.readFileSync('./text1').toString();
text += fs.readFileSync('./text2').toString();
text += fs.readFileSync('./text3').toString();
text += fs.readFileSync('./text4').toString();

const arr = splitToWords(text);

const result = {};

arr.forEach((item) => {
  const world = item.toLowerCase();
  result[world] = result[world] + 1 || 1;
})

console.log(arr.length);

Object.keys(result).sort().forEach((i) => console.log(i, result[i]));




