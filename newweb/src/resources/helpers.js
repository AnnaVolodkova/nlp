import React from 'react';
import pos from 'pos';
import extract from 'extract-lemmatized-nonstop-words';
import simpleSearch from '@matthewlam.js/json-tf-idf';

export const tags = {
  CD: {pos: 'Cardinal number', ex: 'one, two', freq: 0},
  DT: {pos: 'Determiner', ex: 'the, some', freq: 0},
  EX: {pos: 'Existential there', ex: 'there', freq: 0},
  FW: {pos: 'Foreign Word', ex: 'mon dieu', freq: 0},
  IN: {pos: 'Preposition', ex: 'of, in, by', freq: 0},
  JJ: {pos: 'Adjective', ex: 'big', freq: 0},
  JJR: {pos: 'Adj., comparative', ex: 'bigger', freq: 0},
  JJS: {pos: 'Adj., superlative', ex: 'biggest', freq: 0},
  LS: {pos: 'List item marker', ex: '1, One', freq: 0},
  MD: {pos: 'Modal', ex: 'can, should', freq: 0},
  NN: {pos: 'Noun, sing. or mass', ex: 'dog', freq: 0},
  NNP: {pos: 'Proper noun, sing.', ex: 'Edinburgh', freq: 0},
  NNPS: {pos: 'Proper noun, plural', ex: 'Smiths', freq: 0},
  NNS: {pos: 'Noun, plural', ex: 'dogs', freq: 0},
  POS: {pos: 'Possessive ending', ex: 's', freq: 0},
  PDT: {pos: 'Predeterminer ', ex: 'all, both', freq: 0},
  'PP\'': {pos: 'Possessive pronoun', ex: 'my,ones', freq: 0},
  PRP: {pos: 'Personal pronoun', ex: 'I, you, she', freq: 0},
  RB: {pos: 'Adverb', ex: 'quickly', freq: 0},
  RBR: {pos: 'Adverb, comparative', ex: 'faster', freq: 0},
  RBS: {pos: 'Adverb, superlative', ex: 'fastest', freq: 0},
  RP: {pos: 'Particle', ex: 'up, off', freq: 0},
  SYM: {pos: 'Symbol', ex: '+, %, &', freq: 0},
  TO: {pos: '�to�', ex: 'to', freq: 0},
  UH: {pos: 'Interjection', ex: 'oh, oops', freq: 0},
  VB: {pos: 'verb, base form', ex: 'eat', freq: 0},
  VBD: {pos: 'verb, past tense', ex: 'ate', freq: 0},
  VBG: {pos: 'verb, gerund', ex: 'eating', freq: 0},
  VBN: {pos: 'verb, past', ex: 'eaten', freq: 0},
  VBP: {pos: 'Verb, present', ex: 'eat', freq: 0},
  VBZ: {pos: 'Verb, present', ex: 'eats', freq: 0},
  WDT: {pos: 'Wh - determiner', ex: ' which, that', freq: 0},
  WP: {pos: 'Wh pronoun', ex: 'who, what', freq: 0},
  'WP\'': {pos: 'Possessive-Wh', ex: 'whose', freq: 0},
  WRB: {pos: 'Wh - adverb', ex: 'how, where', freq: 0},
  OTHERS: {pos: 'Others', ex: '. , ) (', freq: 0}
};

const tagsArr = ['', ...Object.keys(tags)];

const AMOUNT_TAGS = 36;
export const matrix = [];
matrix[0] = tagsArr;
for (let i = 0; i <= AMOUNT_TAGS; i++) {
  if (i !== 0) matrix[i] = [];
  for (let j = 0; j <= AMOUNT_TAGS; j++) {
    if (j !== 0 && i !== 0) {
      matrix[i][j] = 0;
    }
    if (j === 0) matrix[i][j] = tagsArr[i];
  }
}

const getTextsObj = (texts) => {
  return texts.map((t, i) => ({ name: i, text: t }));
};

export const getQueryTexts = (query, texts) => {
  // console.log('texts', getTextsObj(texts));
  // console.log('res', simpleSearch(query, getTextsObj(texts)));
  console.log(simpleSearch(query, getTextsObj(texts)).map(i => i.name));
  return simpleSearch(query, getTextsObj(texts)).map(i => i.name);
};

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

export const getSortedWordsByTags = (words, boolean = 1) => {
  const sortedTags = [];

  words.sort((a, b) => (a[a.length - 1] !== b[b.length - 1]) ? (a[a.length - 1] < b[b.length - 1]) ? ((-1) * boolean) : (1) * boolean : 0).forEach((i) => sortedTags.push(i));
  return sortedTags;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export const _getWords = (result) => {
  const arr = Object.entries(result).map(i => {
    const arr = new pos.Tagger().tag([i[0]]);
    const tag = arr[0][1];

    if (tags[tag]) {
      tags[tag].freq += i[1];
    } else {
      tags['OTHERS'].freq += i[1];
    }

    const words = extract(i[0], false);
    let lemma = words[0]?.lemma || i[0];
    const POS = words[0]?.pos || '';

    const posLemma = new pos.Tagger().tag([i[0]])[0][1];
    lemma += `_${posLemma}`;

    let random = getRandomInt(i[1])
    const newTag = `${tag}_${random}`;
    const newPos = `${POS}_${i[1] - random}`;

    return [...i, lemma, (POS && POS !== tag) ? newPos : '', (POS && POS !== tag) ? newTag : `${tag}_${i[1]}`];
  });

  return arr;
}

export const getText = (texts) => {
  let text = '';
  texts.forEach(i => text += i);
  return text;
}

export const getWords = (text) => {
  const arr = text.replace(/[\n\r]/g, ' ').split(' ');

  const result = {};
  let a = '';
  let b = '';

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
    if (word) {
      result[word] = result[word] + 1 || 1;
      const arr = new pos.Tagger().tag([word]);
      const tag = arr[0][1];
      if (!a) {
        a = tag;
      } else if (!b) {
        b = tag;
        const i = tagsArr.findIndex(tag => tag === a);
        const j = tagsArr.findIndex(tag => tag === b);
        if (i !== -1 && j !== -1) {
          matrix[i][j] += 1;
        }
      } else {
        a = b;
        b = tag;

        const i = tagsArr.findIndex(tag => tag === a);
        const j = tagsArr.findIndex(tag => tag === b);
        if (i !== -1 && j !== -1) {
          matrix[i][j] += 1;
        }
      }
    }
  })

  return _getWords(result);
}

export const getWord = (word, words) => {
  return words.find(w => w[0] === word);
}

export const findWordInTexts = (word, texts) => {
  let textNumbers = [];
  texts.forEach((text, index) => {
    getWords(text).forEach(w => {
      if (w[0] === word) textNumbers.push(index);
    })
  })
  return textNumbers;
}

export const getStringFromArr = (arr) => {
  let str = '';
  arr.forEach(i => Number.isInteger(i) ? str += (++i + ' ') : str += (i + ' '));
  return str;
}

export const getHighlightWord = (word) => {
  const letters = word.split('');
  letters.push(' ');
  letters.unshift(' ');
  return letters.join('');
}

export const getTags = (arr) => {
  if (arr.length <= 3) {
    return [];
  } else {
    const [word, freq, lemma, ...rest] = arr;
    return rest;
  }
}

export const updateLemmaTag = (word, tag) => {
  const lemma = word[2];
  const arr = lemma.split('_');
  return [word[0], word[1], arr[0] + `_${tag}`, ...getTags(word)];
}

export const addTag = (word, tag) => {
  if (word.length === 2) {
    const words = extract(word[0], false);
    let lemma = words[0]?.lemma || word[0];
    return [...word, lemma, tag];
  }
  return [...word, tag];
};

export const updateTag = (word, was, will) => {
  const tags = getTags(word);
  return [word[0], word[1], word[2], ...tags.map(t => t === was ? will : t)];
};

export const removeTag = (word, tag) => {
  return word.filter(i => i !== tag);
};


