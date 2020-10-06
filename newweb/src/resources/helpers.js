export const getSortedWords = (result, boolean = 1) => {
  const sorted = [];
  Object.keys(result).sort((a, b) => (a !== b) ? (a < b) ? ((-1) * boolean) : (1) * boolean : 0).forEach((i) => sorted.push({
    word: i,
    freq: result[i]
  }));
  console.log('sorted', boolean, sorted);
  return sorted;
}

export const getSortedWordsByFreq = (result, boolean = 1) => {
  const sortedFreq = [];
  Object.entries(result).sort((a, b) => boolean ? (b[1] - a[1]) : (a[1] - b[1])).forEach((i) => sortedFreq.push({
    word: i[0],
    freq: i[1]
  }));
  console.log('sortedFreq', boolean, sortedFreq);
  return sortedFreq;
};
