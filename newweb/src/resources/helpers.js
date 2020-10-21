export const getSortedWords = (words, boolean = 1) => {
  const sorted = [];
  words.sort((a, b) => (a[0] !== b[0]) ? (a[0] < b[0]) ? ((-1) * boolean) : (1) * boolean : 0).forEach((i) => sorted.push(i));
  return sorted;
}

export const getSortedWordsByFreq = (words, boolean = 1) => {
  const sortedFreq = [];
  words.sort((a, b) => boolean ? (b[1] - a[1]) : (a[1] - b[1])).forEach((i) => sortedFreq.push(i));
  return sortedFreq;
};

export const _getWords = (result) => {
  return  Object.entries(result);
}

export const getText = (texts) => {
  let text = '';
  texts.forEach(i => text += i);
  return text;
}

export const getWords = (text) => {
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

  return _getWords(result);
}

export const getWord = (word, words) => {
  return words.find(w => w[0] === word);
}

