export const getSortedWords = (result, boolean = 1) => {
  const sorted = [];
  Object.keys(result).sort((a, b) => (a !== b) ? (a < b) ? ((-1) * boolean) : (1) * boolean : 0).forEach((i) => sorted.push({
    word: i,
    freq: result[i]
  }));
  return sorted;
}

export const getSortedWordsByFreq = (result, boolean = 1) => {
  const sortedFreq = [];
  Object.entries(result).sort((a, b) => boolean ? (b[1] - a[1]) : (a[1] - b[1])).forEach((i) => sortedFreq.push({
    word: i[0],
    freq: i[1]
  }));
  return sortedFreq;
};

export const getText = (texts) => {
  let text = '';
  texts.forEach(i => text += i);
  return text;
}

export const getWordsAndFreqObj = (text) => {
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
