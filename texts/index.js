const fs = require('fs');

const getText = (fs, files) => {
  let text='';
  files.forEach((file) => {
    text+=fs.readFileSync(`${file}`).toString();
  });
  return text;
}

const writeToFile = (fs, what, where) => {
  fs.writeFileSync(`${where}`, JSON.stringify(what, null, 2));
}

const getWordsAndFreqObj = (text) => {
  const arr = text.replace(/[\n\r]/g, " ").split(' ');

  const result = {};

  arr.forEach((item) => {
    const letters = item.split('');
    let start = 0, end = 0;

    for (let i = 0; i < letters.length; i++) {
      if ('A' <= letters[i] && letters[i] <= 'Z' || 'a' <= letters[i] && letters[i] <= 'z')
        break;
      start++;
    }
    for (let i = letters.length; i > 0; i--) {
      if ('A' <= letters[i] && letters[i] <= 'Z' || 'a' <= letters[i] && letters[i] <= 'z')
        break;
      end++;
    }
    const word = letters.join('').substr(start, letters.length - start - end + 1).toLowerCase().trim();
    if (word)
      result[word] = result[word] + 1 || 1;
  })

  return result;
}

const getSortedWords = (result,boolean = 1) => {
  const sorted = [];
  Object.keys(result).sort(() => boolean).forEach((i) => sorted.push({word: i, freq: result[i]}));
  return sorted;
}

const getSortedWordsByFreq = (result, boolean = 1) => {
  const sortedFreq = [];
  Object.entries(result).sort((a, b) => boolean ? (b[1] - a[1]) : (a[1] - b[1])).forEach((i) => sortedFreq.push({word: i[0], freq: i[1]}) );
  return sortedFreq;
}

const text = getText(fs, ['./text1.txt']);
const result = getWordsAndFreqObj(text);
const sortedFreq = getSortedWordsByFreq(result);
writeToFile(fs, sortedFreq, './result.txt');
