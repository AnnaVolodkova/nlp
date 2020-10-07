import React, {useState, useEffect} from 'react';

import * as helpers from './resources/helpers';
import {getResult, getTexts} from './resources/resources';

import './App.css';

function App() {
  const [result, setResult] = useState({});
  const [words, setWords] = useState([]);

  const [wordOrder, setWordOrder] = useState(1);
  const [freqOrder, setFreqOrder] = useState(1);

  const [loading, setLoading] = useState(false);

  const [text, setText] = useState('');
  const [selectedText, setSelectedText]= useState(0);


  useEffect(async () => {
    setLoading(true);
    const fetchedResult = await getResult();
    setResult(fetchedResult.data);
    const words = helpers.getSortedWordsByFreq(fetchedResult.data, freqOrder);
    setWords(words);

    const texts = await getTexts();
    setText(texts.data[selectedText]);
    setLoading(false);
  }, []);


  const sortByFreq = () => {
    setFreqOrder(freqOrder === 1 ? 0 : 1);
    setWords(helpers.getSortedWordsByFreq(result, freqOrder));
  };

  const sortByWord = () => {
    setWordOrder(wordOrder === 1 ? -1 : 1);
    setWords(helpers.getSortedWords(result, wordOrder));
  }

  const onSave = async () => {
    setLoading(true);
    const fetchedResult = helpers.getWordsAndFreqObj(text);
    setResult(fetchedResult);
    const words = helpers.getSortedWordsByFreq(fetchedResult, freqOrder);
    setWords(words);
    setLoading(false);
  }

  const onText = (val) => () => {
    setSelectedText(--val);
  }

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {!loading &&
      <div className='container'>
        <div className='column'>
          <button onClick={onText(1)} className='text'>1</button>
          <button onClick={onText(2)} className='text'>2</button>
          <button onClick={onText(3)} className='text'>3</button>
          <button onClick={onText(4)} className='text'>4</button>
          <button onClick={onText(5)} className='text'>5</button>
          <button onClick={onSave} className='save'>Save</button>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className='textarea'
          />
        </div>
        <div>
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
        </div>
      </div>
      }
    </>
  );
}

export default App;
