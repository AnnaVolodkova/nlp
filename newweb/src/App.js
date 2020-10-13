import React, {useState, useEffect} from 'react';

import * as helpers from './resources/helpers';
import {getResult, getTexts} from './resources/resources';

import EditIcon from './icons/edit.svg';

import './App.css';

function App() {
  const [result, setResult] = useState({});
  const [words, setWords] = useState([]);

  const [wordOrder, setWordOrder] = useState(1);
  const [freqOrder, setFreqOrder] = useState(1);

  const [loading, setLoading] = useState(false);

  const [text, setText] = useState('');
  const [texts, setTexts] = useState([]);
  const [selectedText, setSelectedText]= useState(0);


  useEffect(async () => {
    setLoading(true);
    const fetchedResult = await getResult();
    setResult(fetchedResult.data);
    setWords(helpers.getSortedWordsByFreq(fetchedResult.data, freqOrder));

    const texts = await getTexts();
    setTexts(texts.data);
    setText(texts.data[0]);
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
    setTexts(texts.map((item, index) => index===selectedText ? text : item));
    const fetchedResult = helpers.getWordsAndFreqObj(helpers.getText(texts));
    setResult(fetchedResult);
    setWords(helpers.getSortedWordsByFreq(fetchedResult, freqOrder));
    setLoading(false);
  }

  const onTextChange = (e) => {
    if (e.target.value >= 0) {
      setSelectedText(e.target.value - 1);
      setText(texts[e.target.value - 1]);
    }
  }

  const onEdit = () => {
    alert('EDIT')

  };

  const onDelete = () => {

  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {!loading &&
      <div className='container'>
        <div className='column'>
          <input
            value={selectedText + 1 || ''}
            onChange={onTextChange}
          />
          <button onClick={onSave} className='save'>Save</button>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className='textarea'
          />
        </div>
        <div className='column'>
          <div>Unique words amount {words.length}</div>
          <ul className='words'>
            <div className='word'>
              <div className='sort' onClick={sortByWord}><b>Word</b></div>
              <div className='sort' onClick={sortByFreq}><b>Frequency</b></div>
              <div className='block'><b>Edit</b></div>
              <div className='block'><b>Delete</b></div>
            </div>
            {words.map(word => {
              return (
                <li className='word'>
                  <div className='block'>{word.word}</div>
                  <div className='block'>{word.freq}</div>
                  <div className='block_icon' onClick={onEdit}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M19.7401 6.33966C20.0867 6.68628 20.0867 7.24621 19.7401 7.59282L18.1136 9.21927L14.7807 5.88639L16.4072 4.25995C16.5732 4.09353 16.7987 4 17.0338 4C17.2689 4 17.4943 4.09353 17.6603 4.25995L19.7401 6.33966ZM4 19.5556V16.8538C4 16.7293 4.04444 16.6227 4.13331 16.5338L13.8298 6.83736L17.1626 10.1702L7.4573 19.8667C7.37731 19.9556 7.26177 20 7.14623 20H4.44438C4.19553 20 4 19.8045 4 19.5556Z" fill="#03b6fc"/>
                    </svg>
                  </div>
                  <div className='block_icon' onClick={onDelete}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M14.6136 4.21265H18.4C19.2823 4.21265 20 4.96144 20 5.88191V7.03183C20 7.33935 19.7615 7.58823 19.4667 7.58823H4.53332C4.23856 7.58823 4 7.33939 4 7.03183V5.88191C4 4.96144 4.71773 4.21265 5.60001 4.21265H9.38657C9.49007 3.6767 9.74274 3.1716 10.124 2.78438C11.0959 1.74218 12.8938 1.73128 13.8865 2.79524C14.2599 3.17431 14.5106 3.6773 14.6136 4.21265ZM10.8781 3.57115C10.7005 3.75153 10.5704 3.98061 10.4912 4.21263H13.5094C13.4313 3.98221 13.3036 3.7559 13.1323 3.58201C12.524 2.93104 11.4656 2.9419 10.8781 3.57115Z" fill="#98A1AC"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M5.93592 19.4711L5.06689 8.70581H18.9336L18.065 19.464C17.9833 20.3427 17.2831 20.9999 16.4363 20.9999H7.56415C6.7174 20.9999 6.01719 20.3427 5.93592 19.4711ZM8.73825 17.62C9.0387 17.62 9.28186 17.3709 9.28186 17.0629V10.3773C9.28186 10.0693 9.0387 9.82013 8.73825 9.82013C8.43779 9.82013 8.19463 10.0693 8.19463 10.3773V17.0629C8.19463 17.3708 8.43779 17.62 8.73825 17.62ZM12.5437 17.0629C12.5437 17.3709 12.3005 17.62 12.0001 17.62C11.6996 17.62 11.4565 17.3708 11.4565 17.0629V10.3773C11.4565 10.0693 11.6996 9.82013 12.0001 9.82013C12.3006 9.82013 12.5437 10.0693 12.5437 10.3773V17.0629ZM15.262 17.62C15.5625 17.62 15.8056 17.3709 15.8056 17.0629V10.3773C15.8056 10.0693 15.5625 9.82013 15.262 9.82013C14.9616 9.82013 14.7184 10.0693 14.7184 10.3773V17.0629C14.7184 17.3708 14.9615 17.62 15.262 17.62Z" fill="#98A1AC"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M14.6136 4.21265H18.4C19.2823 4.21265 20 4.96144 20 5.88191V7.03183C20 7.33935 19.7615 7.58823 19.4667 7.58823H4.53332C4.23856 7.58823 4 7.33939 4 7.03183V5.88191C4 4.96144 4.71773 4.21265 5.60001 4.21265H9.38657C9.49007 3.6767 9.74274 3.1716 10.124 2.78438C11.0959 1.74218 12.8938 1.73128 13.8865 2.79524C14.2599 3.17431 14.5106 3.6773 14.6136 4.21265ZM10.8781 3.57115C10.7005 3.75153 10.5704 3.98061 10.4912 4.21263H13.5094C13.4313 3.98221 13.3036 3.7559 13.1323 3.58201C12.524 2.93104 11.4656 2.9419 10.8781 3.57115Z" fill="#98A1AC"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M5.93592 19.4711L5.06689 8.70581H18.9336L18.065 19.464C17.9833 20.3427 17.2831 20.9999 16.4363 20.9999H7.56415C6.7174 20.9999 6.01719 20.3427 5.93592 19.4711ZM8.73825 17.62C9.0387 17.62 9.28186 17.3709 9.28186 17.0629V10.3773C9.28186 10.0693 9.0387 9.82013 8.73825 9.82013C8.43779 9.82013 8.19463 10.0693 8.19463 10.3773V17.0629C8.19463 17.3708 8.43779 17.62 8.73825 17.62ZM12.5437 17.0629C12.5437 17.3709 12.3005 17.62 12.0001 17.62C11.6996 17.62 11.4565 17.3708 11.4565 17.0629V10.3773C11.4565 10.0693 11.6996 9.82013 12.0001 9.82013C12.3006 9.82013 12.5437 10.0693 12.5437 10.3773V17.0629ZM15.262 17.62C15.5625 17.62 15.8056 17.3709 15.8056 17.0629V10.3773C15.8056 10.0693 15.5625 9.82013 15.262 9.82013C14.9616 9.82013 14.7184 10.0693 14.7184 10.3773V17.0629C14.7184 17.3708 14.9615 17.62 15.262 17.62Z" fill="#98A1AC"/>
                    </svg>
                  </div>
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
