const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const fs = require('fs');
const cors = require('@koa/cors');

const getText = (fs, files) => {
  let text='';
  files.forEach((file) => {
    text+=fs.readFileSync(`${file}`).toString();
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
  const text = getText(fs, ['texts/1.txt', 'texts/2.txt', 'texts/3.txt', 'texts/4.txt', 'texts/5.txt']);
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
    const texts = [fs.readFileSync('texts/1.txt').toString(), fs.readFileSync('texts/2.txt').toString(), fs.readFileSync('texts/3.txt').toString(), fs.readFileSync('texts/4.txt').toString(), fs.readFileSync('texts/5.txt').toString()]
    ctx.body = texts;
  })


app.use(bodyParser());

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);
