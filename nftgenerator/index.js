const { readFileSync, writeFileSync, readdirSync, rmSync, existsSync, mkdirSync } = require('fs');
const sharp = require('sharp');

const template = `
  <svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- base1 -->
    <!-- base2 -->
    <!-- left -->
    <!-- right -->
    <!-- bottom -->
    <!-- top -->
  </svg>
`

const takenNames = {};
const takenSigils= {};
let idx = 300;

function randInt(max) {
  return Math.floor(Math.random() * ( max + 1));
}

function randElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomName() {
  const adjectives = 'transcendental immanent sacred profane blasphemeous devil retrogade lucky demonic angelic chaotic schizo fatal domesticated exalted angty blissful happy'.split(' ')
  const names = 'pluto neptune uranus saturn jupiter mars moon earth venus mercury sun universe stars zodiac orion taurus pisces aquarius aries gemini scorpio capricorn leo libra'.split(' ')

  const randAdj = randElement(adjectives);
  const randName = randElement(names);
  const name = `${randAdj}-${randName}`;

  if (takenNames[name] || !name) {
    return getRandomName();
  } else {
    takenNames[name] = name;
    return name;
  }
}

function getLayer(name, skip=0.0) {
  const svg = readFileSync(`./layers/${name}.svg`, 'utf-8');
  const re = /(?<=\<svg\s*[^>]*>)([\s\S]*?)(?=\<\/svg\>)/g
  const layer = svg.match(re)[0];
  return Math.random() > skip ? layer : '';
}

function determineAppearence(layer){
  const decider = Math.random() * 10;

  if (decider % 2 == 0){
    return layer
  }
}

async function svgToPng(name) {
  const src = `./out/${name}.svg`
  const dest = `./out/${name}.png`;

  const img = await sharp(src);
  const resized = await img.resize(1024);
  await resized.toFile(dest);
}

function createImage(idx){
  const base1 = randInt(0) +1
  const base2 = randInt(0) + 1
  const top = randInt(3) + 1
  const  bottom = randInt(2) + 1
  const right = randInt(2) + 1
  const left = randInt(2) + 1
  const rightUp = randInt(2) + 1
  const leftDown = randInt(2) + 1
  const special = randInt(2) + 1

  const sigil = [base1, determineAppearence(base2), top, bottom, right, left, determineAppearence(special) ]

  if(sigil[takenSigils]){
    createImage();
  } else {
    const name = getRandomName();
    console.log(name);
    sigil[takenSigils] = sigil;

    const final = template
      .replace('<!-- base1 -->', getLayer(`base${1}`))
      .replace('<!-- base2 -->', getLayer(`base${2}`))
      .replace('<!-- top -->', getLayer(`top${top}`))
      .replace('<!-- bottom -->', getLayer(`bottom${bottom}`))
      .replace('<!-- left -->', getLayer(`left${left}`))
      .replace('<!-- right -->', getLayer(`right${right}`))
      .replace('<!-- special -->', getLayer(`special${special}`))

    const meta = {
      name,
      description: `A sigil of ${name.split('-').join(' ')}`,
      image: `${idx}.png`,
      attributes: [
        {
          sigil: '',
          rarirty: 0.5
        }
      ]
    }
    writeFileSync(`./out/${idx}.json`, JSON.stringify(meta));
    writeFileSync(`./out/${idx}.svg`, final);
    svgToPng(idx);
  }
}

if(!existsSync('./out')){
  mkdirSync('./out');
}

readdirSync('./out').forEach(f => rmSync(`.out/${f}`))

do {
  createImage(idx);
  idx--;
} while (idx >= 0);