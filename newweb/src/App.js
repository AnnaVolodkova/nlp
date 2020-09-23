import React, { useState, useEffect } from 'react';

import { getAll } from './resources/resources';

import './App.css';

const getSortedWords = (result, boolean = 1) => {
  const sorted = [];
  Object.keys(result).sort(() => boolean).forEach((i) => sorted.push({word: i, freq: result[i]}));
  return sorted;
}
const getSortedWordsByFreq = (result, boolean = 1) => {
  const sortedFreq = [];
  Object.entries(result).sort((a, b) => boolean ? (b[1] - a[1]) : (a[1] - b[1])).forEach((i) => sortedFreq.push({
    word: i[0],
    freq: i[1]
  }));
  return sortedFreq;
}

function App() {
  const [sortedWordsFreq, setSortedWordsFreq] = useState([]);
  const [sortedWords, setSortedWords] = useState([]);

  useEffect(async () => {
    const result = await getAll();
    console.log('result', result.data);
    setSortedWordsFreq(getSortedWordsByFreq(result.data));
    setSortedWords(getSortedWords(result.data));
  }, []);

  return (
    <>
      <div>Hello</div>
      <ul>
        {sortedWordsFreq.length &&
          sortedWordsFreq.map((i) => {
            return (<li>{i}</li>);
          })
        }
      </ul>
    </>
  );
}

export default App;
