const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const fs = require('fs');
const cors = require('@koa/cors');
const pos = require('pos');

const N = 6;

const getText = (fs, files) => {
  let text = '';
  files.forEach((file) => {
    text += fs.readFileSync(`${file}`).toString();
  });
  return text;
}
const writeToFile = (fs, what, where) => {
  fs.writeFileSync(`${where}`, JSON.stringify(what, null, 2));
}
const getWordsAndFreqObj = (text) => {
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
const start = (fs) => {
  const texts = [];
  for (let i = 1; i < N; i++) {
    texts.push(`texts/${i}.txt`);
  }
  const text = getText(fs, texts);
  const result = getWordsAndFreqObj(text);
  return result;
}

const app = new koa();
app.use(cors());
const router = new Router();

router
  .get('/result', (ctx) => {
    const result = start(fs);
    ctx.body = result;
  })
  .get('/texts', (ctx) => {
    const texts = [];
    for (let i = 1; i < N; i++) {
      texts.push(fs.readFileSync(`texts/${i}.txt`).toString());
    }
    ctx.body = {texts};
  })
  .get('/taggedTexts', (ctx) => {
    const taggedTexts = [];
    for (let i = 1; i < N; i++) {
      const words = new pos.Lexer().lex(fs.readFileSync(`texts/${i}.txt`).toString());
      const tags = new pos.Tagger()
        .tag(words)
        .map(tag => tag[0] + '|' + tag[1])
        .join(' ');
      taggedTexts.push(tags);
    }
    ctx.body = {taggedTexts};
  })


app.use(bodyParser());

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3012);

// const tags = new Tag(["who"])
//   .initial() // initial dictionary and pattern based tagging
//   .smooth() // further context based smoothing
//   .tags;
// ["DT","VBZ","PRP$","NN"]

// const words = new pos.Lexer().lex(fs.readFileSync(`texts/1.txt`).toString());
// const tags = new pos.Tagger()
//   .tag(words)
//   .map(tag => {
//     console.log('tag', tag);
//     return tag[0] + '/' + tag[1]
//   })
//   .join(' ');

// const smth = new pos.Tagger().tag(["hello"]);
// console.log(smth[0][1]);


