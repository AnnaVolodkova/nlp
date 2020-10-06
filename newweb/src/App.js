import React, {useState, useEffect} from 'react';

import * as helpers from './resources/helpers';
import {getResult} from './resources/resources';

import './App.css';

function App() {
  const [result, setResult] = useState({});
  const [words, setWords] = useState([]);
  const [wordOrder, setWordOrder] = useState(1);
  const [freqOrder, setFreqOrder] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    setLoading(true);
    const fetchedResult = await getResult();
    setResult(fetchedResult.data);
    const words = helpers.getSortedWordsByFreq(fetchedResult.data, freqOrder);
    console.log(fetchedResult.data, words)
    setWords(words);
    setLoading(false);
  }, []);

  const sortByFreq =  () => {
    setFreqOrder(freqOrder === 1 ? 0 : 1);
    setWords(helpers.getSortedWordsByFreq(result, freqOrder));
  };

  const sortByWord =  () => {
    setWordOrder(wordOrder === 1 ? -1 : 1);
    setWords(helpers.getSortedWords(result, wordOrder));
  }

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {!loading &&
      <>
        <div>Unique words amount {words.length}</div>
        <ul className='words'>
          <div className='word'>
            <div className='sort' onClick={sortByWord}><b>Word</b></div>
            <div className='sort' onClick={sortByFreq}><b>Frequency</b></div>
          </div>
          {words.map(word => {
            return (
              <li className='word'>
                <div className='block'>{word.word}</div>
                <div className='block'>{word.freq}</div>
              </li>
            );
          })}
        </ul>
      </>
      }
    </>
  );
}

export default App;
