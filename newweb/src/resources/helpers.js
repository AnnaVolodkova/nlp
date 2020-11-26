import React from 'react';
import pos from 'pos';
import extract from'extract-lemmatized-nonstop-words';

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
  const arr = Object.entries(result).map(i => {
    const arr = new pos.Tagger().tag([i[0]]);
    const tag = arr[0][1];
    const words = extract(i[0], false);
    let lemma = words[0]?.lemma || i[0];
    const POS = words[0]?.pos || '';
    // вот тут неправильно вроде
    // if (result[lemma] && lemma!==i[0]) {
    //   const posLemma = extract(lemma, false)[0]?.pos;
    //   lemma += `_${posLemma}_${result[lemma]}`;
    // }
    const posLemma = new pos.Tagger().tag([i[0]])[0][1];
    lemma += `_${posLemma}`;
    return [...i, lemma, POS !== tag ? POS : '', tag];
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
  const [word, freq, lemma, ...rest] = arr;
  return rest;
}

export const updateLemmaTag = (word, tag) => {
  const lemma = word[2];
  const arr = lemma.split('_');
  return [word[0], word[1], arr[0] + `_${tag}`, ...getTags(word)];
}

export const addTag = (word, tag) => {
  return [...word, tag];
};

export const updateTag = (word, was, will) => {
  const tags = getTags(word);
  return [word[0], word[1], word[2], ...tags.map(t => t === was ? will : t)];
};

export const removeTag = (word, tag) => {
  return word.filter(i => i !== tag);
};

export const tags = {
  CD: {pos: 'Cardinal number', ex: 'one, two'},
  DT: {pos: 'Determiner', ex: 'the, some'},
  EX: {pos: 'Existential there', ex: 'there'},
  FW: {pos: 'Foreign Word', ex: 'mon dieu'},
  IN: {pos: 'Preposition', ex: 'of, in, by'},
  JJ: {pos: 'Adjective', ex: 'big'},
  JJR: {pos: 'Adj., comparative', ex: 'bigger'},
  JJS: {pos: 'Adj., superlative', ex: 'biggest'},
  LS: {pos: 'List item marker', ex: '1, One'},
  MD: {pos: 'Modal', ex: 'can, should'},
  NN: {pos: 'Noun, sing. or mass', ex: 'dog'},
  NNP: {pos: 'Proper noun, sing.', ex: 'Edinburgh'},
  NNPS: {pos: 'Proper noun, plural', ex: 'Smiths'},
  NNS: {pos: 'Noun, plural', ex: 'dogs'},
  POS: {pos: 'Possessive ending', ex: 's'},
  PDT: {pos: 'Predeterminer ', ex: 'all, both'},
  'PP\'': {pos: 'Possessive pronoun', ex: 'my,ones'},
  PRP: {pos: 'Personal pronoun', ex: 'I, you, she'},
  RB: {pos: 'Adverb', ex: 'quickly'},
  RBR: {pos: 'Adverb, comparative', ex: 'faster'},
  RBS: {pos: 'Adverb, superlative', ex: 'fastest'},
  RP: {pos: 'Particle', ex: 'up, off'},
  SYM: {pos: 'Symbol', ex: '+, %, &'},
  TO: {pos: '�to�', ex: 'to'},
  UH: {pos: 'Interjection', ex: 'oh, oops'},
  VB: {pos: 'verb, base form', ex: 'eat',},
  VBD: {pos: 'verb, past tense', ex: 'ate'},
  VBG: {pos: 'verb, gerund', ex: 'eating'},
  VBN: {pos: 'verb, past', ex: 'eaten'},
  VBP: {pos: 'Verb, present', ex: 'eat'},
  VBZ: {pos: 'Verb, present', ex: 'eats'},
  WDT: {pos: 'Wh - determiner', ex: ' which, that'},
  WP: {pos: 'Wh pronoun', ex: 'who, what'},
  'WP\'': {pos: 'Possessive-Wh', ex: 'whose'},
  WRB: {pos: 'Wh - adverb', ex: 'how, where'},
  OTHERS: {pos: 'Others', ex: '. , ) ('}
};
