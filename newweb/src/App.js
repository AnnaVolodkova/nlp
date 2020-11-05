import React, {useState, useEffect} from 'react';

import * as helpers from './resources/helpers';

import {getResult, getTexts, getTaggedTexts} from './resources/resources';

import {HighlightWithinTextarea} from 'react-highlight-within-textarea'

import ModalWindow from './modal';

import './App.css';

function App() {
  const [words, setWords] = useState([]);

  const [wordOrder, setWordOrder] = useState(1);
  const [freqOrder, setFreqOrder] = useState(1);

  const [loading, setLoading] = useState(false);

  const [text, setText] = useState('');
  const [taggedText, setTaggedText] = useState('');
  const [texts, setTexts] = useState([]);
  const [taggedTexts, setTaggedTexts] = useState([]);
  const [selectedText, setSelectedText] = useState(0);

  const [popup, setPopup] = useState('');

  const [notes, setNotes] = useState([]);
  const [error, setError] = useState('');

  const [selectedWord, setSelectedWord] = useState('');
  const [newWord, setNewWord] = useState('')
  const [oldWord, setOldWord] = useState('');

  const [word, setWord] = useState([]);
  const [tag, setTag] = useState('');

  const hello = (e) => {
    e.preventDefault();
    setSelectedWord(window.getSelection().toString());
    setPopup('contextmenu');
    setOldWord('');
    setWord(helpers.getWord(window.getSelection().toString().toLowerCase(), words));
  };

  useEffect(() => {
    document.addEventListener("contextmenu", hello);
    return () => {
      document.removeEventListener("contextmenu", hello);
    };
  });

  useEffect(async () => {
    setLoading(true);
    const fetchedResult = await getResult();
    setWords(helpers.getSortedWordsByFreq(helpers._getWords(fetchedResult.data), freqOrder));

    const data = await getTexts();
    setTexts(data.data.texts);
    setText(data.data.texts[0]);
    // console.log('data.data.texts', typeof data.data.texts, data.data)

    const data1 = await getTaggedTexts();
    setTaggedTexts(data1.data.taggedTexts);
    // console.log(data1);

    setLoading(false);
  }, []);

  const onAddTag = () => {
    if (word.includes(tag)) {
      setError('This tag has already exist.');
    } else {
      setWords(words.map(w => w[0] === word[0] ? helpers.addTag(w, tag) : w));
      onClose();
    }
  };
  const onUpdateTag = () => {
    if (word.includes(newWord)) {
      setError('This tag has already exist.');
    } else {
      setWords(words.map(w => w[0] === word[0] ? helpers.updateTag(w, oldWord, newWord) : w));
      onClose();
    }
  }
  const onRemoveTag = () => {
    if (!word.includes(tag)) {
      setError('This tag is not found.');
    } else {
      setWords(words.map(w => w[0] === word[0] ? helpers.removeTag(w, tag) : w));
      onClose();
    }
  }

  const sortByFreq = () => {
    setWords(helpers.getSortedWordsByFreq(words, freqOrder));
    setFreqOrder(freqOrder === 1 ? 0 : 1);
  };
  const sortByWord = () => {
    setWords(helpers.getSortedWords(words, wordOrder));
    setWordOrder(wordOrder === 1 ? -1 : 1);
  }

  const onSave = () => {
    setTexts(texts.map((item, index) => index === selectedText ? text : item));
  }
  const onSaveTaggedText = () => {
    console.log(selectedText);
    setTaggedTexts(taggedTexts.map((item, index) => index === selectedText ? taggedText : item));
  };
  const onReload = async () => {
    setWords(helpers.getWords(helpers.getText(texts)));
  }
  const onCancelF = async () => {
    setNotes([]);
    setOldWord('');
  }
  const onTextChange = (e) => {
    if (e.target.value >= 0) {
      setSelectedText(e.target.value - 1);
      setText(texts[e.target.value - 1]);
    }
  }
  const openTaggedText = () => {
    console.log('selectedText, taggedText', selectedText, taggedTexts)
    setTaggedText(taggedTexts[selectedText]);
  };

  const addWord = () => {
    if (selectedWord && words.some(w => w[0] === selectedWord)) {
      setError('This word has already exist.');
    } else {
      setWords([...words, [selectedWord, 0]]);
      onClose();
    }
  }
  const deleteWord = () => {
    setWords(words.filter(i => i[0] !== selectedWord));
    onClose();
  }
  const updateWord = (was, will) => {
    const oldWord = helpers.getWord(was, words);
    const newWords = words.filter(i => i[0] !== was);
    const newWord = helpers.getWord(will, words);
    if (newWord) {
      const buf = newWords.filter(i => i[0] !== will);
      buf.push([will, oldWord[1] + newWord[1]]);
      setWords(buf);
    } else {
      setWords([...newWords, [will, oldWord[1]]]);
      const textNumbers = helpers.findWordInTexts(was, texts);
      setNotes(textNumbers);
      if (textNumbers.length > 0) {
        setSelectedText(textNumbers[0]);
        setOldWord(was);
      }
    }
    onClose();
  }

  const onClose = () => {
    setSelectedWord('');
    setNewWord('')
    setError('');
    setPopup('');
    setWord([]);
    setTag('');
  }
  const onAdd = () => {
    setPopup('add');
  };
  const onEdit = () => {
    setPopup('edit');
  };
  const onDelete = () => {
    setPopup('delete');
  };
  const showInfo = () => {
    setPopup('info');
  }

  if (loading) return <div>Loading...</div>;

  const test = false;

  if (test) return <div>Hello</div>;

  return (
    <>
      {!loading &&
      <div className='container'>
        <div className='column'>
          <button className="save" onClick={openTaggedText}>Show tagged text</button>
          <textarea
            id="1"
            value={taggedText || ''}
            onChange={(e) => setTaggedText(e.target.value)}
            className='textarea'
          />
          <button onClick={onSaveTaggedText} className='save'>Save</button>
        </div>
        <div className='column'>
          {notes.length > 0 && <div className="div">You can fix word in texts {helpers.getStringFromArr(notes)}</div>}
          <div className="div">There are {texts.length} texts. Please enter text number</div>
          <input
            value={selectedText + 1 || ''}
            onChange={onTextChange}
          />
          {notes.length > 0 && <button onClick={onCancelF} className='save'>Cancel</button>}
          <HighlightWithinTextarea
            id="textarea"
            value={text || ''}
            highlight={helpers.getHighlightWord(oldWord)}
            onChange={(e) => setText(e.target.value)}
            className='textarea'
          />
          <button onClick={onSave} className='save'>Save</button>
        </div>
        <div className='column'>
          <button onClick={onReload} className='save'>Reload</button>
          <button className="save" onClick={onAdd}>Add word</button>
          <ul className='words'>
            <div className='word'>
              <div className='sort' onClick={sortByWord}><b>Word</b></div>
              <div className='sort' onClick={sortByFreq}><b>Frequency</b></div>
              <div className='sort' onClick={showInfo}><b>Tags</b></div>
              <div className='block'><b>Edit</b></div>
              <div className='block'><b>Delete</b></div>
            </div>
            {words.map(word => {
              return (
                <li className='word'>
                  <div className='block'>{word[0]}</div>
                  <div className='block'>{word[1]}</div>
                  <div className='block'>{helpers.getStringFromArr(helpers.getTags(word))}</div>
                  <div className='block_icon' onClick={() => {
                    onEdit();
                    setSelectedWord(word[0]);
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd"
                            d="M19.7401 6.33966C20.0867 6.68628 20.0867 7.24621 19.7401 7.59282L18.1136 9.21927L14.7807 5.88639L16.4072 4.25995C16.5732 4.09353 16.7987 4 17.0338 4C17.2689 4 17.4943 4.09353 17.6603 4.25995L19.7401 6.33966ZM4 19.5556V16.8538C4 16.7293 4.04444 16.6227 4.13331 16.5338L13.8298 6.83736L17.1626 10.1702L7.4573 19.8667C7.37731 19.9556 7.26177 20 7.14623 20H4.44438C4.19553 20 4 19.8045 4 19.5556Z"
                            fill="#ADD8E6"/>
                    </svg>
                  </div>
                  <div className='block_icon' onClick={() => {
                    onDelete();
                    setSelectedWord(word[0]);
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd"
                            d="M14.6136 4.21265H18.4C19.2823 4.21265 20 4.96144 20 5.88191V7.03183C20 7.33935 19.7615 7.58823 19.4667 7.58823H4.53332C4.23856 7.58823 4 7.33939 4 7.03183V5.88191C4 4.96144 4.71773 4.21265 5.60001 4.21265H9.38657C9.49007 3.6767 9.74274 3.1716 10.124 2.78438C11.0959 1.74218 12.8938 1.73128 13.8865 2.79524C14.2599 3.17431 14.5106 3.6773 14.6136 4.21265ZM10.8781 3.57115C10.7005 3.75153 10.5704 3.98061 10.4912 4.21263H13.5094C13.4313 3.98221 13.3036 3.7559 13.1323 3.58201C12.524 2.93104 11.4656 2.9419 10.8781 3.57115Z"
                            fill="#98A1AC"/>
                      <path fillRule="evenodd" clipRule="evenodd"
                            d="M5.93592 19.4711L5.06689 8.70581H18.9336L18.065 19.464C17.9833 20.3427 17.2831 20.9999 16.4363 20.9999H7.56415C6.7174 20.9999 6.01719 20.3427 5.93592 19.4711ZM8.73825 17.62C9.0387 17.62 9.28186 17.3709 9.28186 17.0629V10.3773C9.28186 10.0693 9.0387 9.82013 8.73825 9.82013C8.43779 9.82013 8.19463 10.0693 8.19463 10.3773V17.0629C8.19463 17.3708 8.43779 17.62 8.73825 17.62ZM12.5437 17.0629C12.5437 17.3709 12.3005 17.62 12.0001 17.62C11.6996 17.62 11.4565 17.3708 11.4565 17.0629V10.3773C11.4565 10.0693 11.6996 9.82013 12.0001 9.82013C12.3006 9.82013 12.5437 10.0693 12.5437 10.3773V17.0629ZM15.262 17.62C15.5625 17.62 15.8056 17.3709 15.8056 17.0629V10.3773C15.8056 10.0693 15.5625 9.82013 15.262 9.82013C14.9616 9.82013 14.7184 10.0693 14.7184 10.3773V17.0629C14.7184 17.3708 14.9615 17.62 15.262 17.62Z"
                            fill="#98A1AC"/>
                      <path fillRule="evenodd" clipRule="evenodd"
                            d="M14.6136 4.21265H18.4C19.2823 4.21265 20 4.96144 20 5.88191V7.03183C20 7.33935 19.7615 7.58823 19.4667 7.58823H4.53332C4.23856 7.58823 4 7.33939 4 7.03183V5.88191C4 4.96144 4.71773 4.21265 5.60001 4.21265H9.38657C9.49007 3.6767 9.74274 3.1716 10.124 2.78438C11.0959 1.74218 12.8938 1.73128 13.8865 2.79524C14.2599 3.17431 14.5106 3.6773 14.6136 4.21265ZM10.8781 3.57115C10.7005 3.75153 10.5704 3.98061 10.4912 4.21263H13.5094C13.4313 3.98221 13.3036 3.7559 13.1323 3.58201C12.524 2.93104 11.4656 2.9419 10.8781 3.57115Z"
                            fill="#98A1AC"/>
                      <path fillRule="evenodd" clipRule="evenodd"
                            d="M5.93592 19.4711L5.06689 8.70581H18.9336L18.065 19.464C17.9833 20.3427 17.2831 20.9999 16.4363 20.9999H7.56415C6.7174 20.9999 6.01719 20.3427 5.93592 19.4711ZM8.73825 17.62C9.0387 17.62 9.28186 17.3709 9.28186 17.0629V10.3773C9.28186 10.0693 9.0387 9.82013 8.73825 9.82013C8.43779 9.82013 8.19463 10.0693 8.19463 10.3773V17.0629C8.19463 17.3708 8.43779 17.62 8.73825 17.62ZM12.5437 17.0629C12.5437 17.3709 12.3005 17.62 12.0001 17.62C11.6996 17.62 11.4565 17.3708 11.4565 17.0629V10.3773C11.4565 10.0693 11.6996 9.82013 12.0001 9.82013C12.3006 9.82013 12.5437 10.0693 12.5437 10.3773V17.0629ZM15.262 17.62C15.5625 17.62 15.8056 17.3709 15.8056 17.0629V10.3773C15.8056 10.0693 15.5625 9.82013 15.262 9.82013C14.9616 9.82013 14.7184 10.0693 14.7184 10.3773V17.0629C14.7184 17.3708 14.9615 17.62 15.262 17.62Z"
                            fill="#98A1AC"/>
                    </svg>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        {popup === 'add' && (
          <ModalWindow
            title="Add word"
            isOpen
            onRequestClose={onClose}
            className="modal"
          >
            <input
              value={selectedWord || ''}
              onChange={(e) => setSelectedWord(e.target.value)}
              className="marginBottom"
            />
            <div className="error">{error}</div>
            <button className='save' onClick={addWord}>Add word</button>
          </ModalWindow>
        )
        }
        {popup === 'edit' && (
          <ModalWindow
            title="Edit"
            isOpen
            onRequestClose={onClose}
            className="modal"
          >
            <div className="marginBottom">Edit word</div>
            <input
              value={selectedWord || ''}
              onChange={() => null}
              className="marginBottom"
              disabled
            />
            <input
              value={newWord || ''}
              onChange={(e) => setNewWord(e.target.value)}
              className="marginBottom"
            />
            <button className='save' onClick={() => updateWord(selectedWord, newWord)}>Edit</button>
          </ModalWindow>
        )
        }
        {popup === 'delete' && (
          <ModalWindow
            title="Delete"
            isOpen
            onRequestClose={onClose}
            className="modal"
          >
            <div className="marginBottom">Are you sure?</div>
            <button className='save' onClick={deleteWord}>Delete</button>
          </ModalWindow>
        )
        }
        {popup === 'contextmenu' && (
          <ModalWindow
            title="Handle tags"
            isOpen
            onRequestClose={onClose}
            className="modal"
          >
            <div className="marginBottom">Word is <b>{selectedWord.toLowerCase()}</b></div>
            {helpers.getTags(word).length > 1 &&
            <div className="marginBottom">Tags are {helpers.getStringFromArr(helpers.getTags(word))}</div>}
            {helpers.getTags(word).length === 1 &&
            <div className="marginBottom">Tag is {helpers.getStringFromArr(helpers.getTags(word))}</div>}
            <div className="marginBottom">
              <input
                value={tag || ''}
                onChange={(e) => setTag(e.target.value)}
                className="marginBottom"
              />
              <div className="error">{error}</div>
              <button className='save' onClick={onAddTag}>Add tag</button>
            </div>
            <div className="marginBottom">
              <input
                value={oldWord || ''}
                onChange={(e) => setOldWord(e.target.value)}
                className="marginRightBottom"
              />
              <input
                value={newWord || ''}
                onChange={(e) => setNewWord(e.target.value)}
                className="marginBottom"
              />
              <button className='save' onClick={onUpdateTag}>Edit tag</button>
            </div>
            <div className="marginBottom">
              <input
                value={tag || ''}
                onChange={(e) => setTag(e.target.value)}
                className="marginBottom"
              />
              <div className="error">{error}</div>
              <button className='save' onClick={onRemoveTag}>Remove tag</button>
            </div>
          </ModalWindow>
        )
        }
      </div>
      }
      {popup === 'info' && (
        <ModalWindow
          title="Tag info"
          isOpen
          onRequestClose={onClose}
          className="modal"
        >
          <pre>
            <div>CD Cardinal number          one,two</div>
            <div>DT Determiner               the,some</div>
            <div>EX Existential there        there</div>
            <div>FW Foreign Word             mon dieu</div>
            <div>IN Preposition              of,in,by</div>
            <div>JJ Adjective                big</div>
            <div>JJR Adj., comparative       bigger</div>
            <div>JJS Adj., superlative       biggest</div>
            <div>LS List item marker         1,One</div>
            <div>MD Modal                    can,should</div>
            <div>NN Noun, sing. or mass      dog</div>
            <div>NNP Proper noun, sing.      Edinburgh</div>
            <div>NNPS Proper noun, plural    Smiths</div>
            <div>NNS Noun, plural            dogs</div>
            <div>POS Possessive ending       's</div>
            <div>PDT Predeterminer           all, both</div>
            <div>PP' Possessive pronoun      my,one's</div>
            <div>PRP Personal pronoun         I,you,she</div>
            <div>RB Adverb                   quickly</div>
            <div>RBR Adverb, comparative     faster</div>
            <div>RBS Adverb, superlative     fastest</div>
            <div>RP Particle                 up,off</div>
            <div>SYM Symbol                  +,%,&</div>
            <div>TO �to�                     to</div>
            <div>UH Interjection             oh, oops</div>
            <div>VB verb, base form          eat</div>
            <div>VBD verb, past tense        ate</div>
            <div>VBG verb, gerund            eating</div>
            <div>VBN verb, past part         eaten</div>
            <div>VBP Verb, present           eat</div>
            <div>VBZ Verb, present           eats</div>
            <div>WDT Wh-determiner           which,that</div>
            <div>WP Wh pronoun               who,what</div>
            <div>WP' Possessive-Wh           whose</div>
            <div>WRB Wh-adverb               how,where</div>
            <div>, Comma                     ,</div>
            <div>. Sent-final punct          . ! ?</div>
            <div>: Mid-sent punct.           : ; '</div>
            <div>$ Dollar sign               $</div>
            <div># Pound sign                #</div>
            <div>" quote                     "</div>
            <div>( Left paren                (</div>
            <div>) Right paren               )</div>
          </pre>
        </ModalWindow>
      )
      }
    </>
  );
}

export default App;
