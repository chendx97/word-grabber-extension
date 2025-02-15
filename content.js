// visibility定时器
let timer = null;

const menuDom = document.createElement('div');
menuDom.classList.add('chendx-translate-menu');

// 卡片的箭头
const arrow = document.createElement('div');
arrow.classList.add('menu-arrow');
menuDom.appendChild(arrow);

// 创建卡片头部
const svgIcon = `<svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4936" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24"><path d="M828.8 494.506667L512 824.32 197.12 496.64a184.32 184.32 0 0 1-40.746667-115.413333 179.84 179.84 0 0 1 177.92-181.333334 176.64 176.64 0 0 1 148.053334 80.853334L512 326.186667l29.653333-45.44a176.64 176.64 0 0 1 148.053334-80.853334 179.84 179.84 0 0 1 177.92 181.333334 182.826667 182.826667 0 0 1-38.826667 113.28M689.706667 128A246.186667 246.186667 0 0 0 512 203.946667 246.186667 246.186667 0 0 0 334.293333 128 251.306667 251.306667 0 0 0 85.333333 381.226667a258.346667 258.346667 0 0 0 58.88 163.413333L461.866667 874.666667a69.12 69.12 0 0 0 100.266666 0l320-332.16A256 256 0 0 0 938.666667 381.226667 251.306667 251.306667 0 0 0 689.706667 128" fill="currentColor" p-id="4937"></path></svg>`;
const cardHeader = document.createElement('div');
const headerLeft = document.createElement('div');
const headerRight = document.createElement('div');
const collectBtn = document.createElement('div');
cardHeader.classList.add('card-header');
headerLeft.classList.add('word');
headerRight.classList.add('header-right');
collectBtn.classList.add('collect-btn');
collectBtn.textContent = 'Collect';
headerRight.innerHTML = svgIcon + collectBtn.outerHTML;
cardHeader.appendChild(headerLeft);
cardHeader.appendChild(headerRight);
menuDom.appendChild(cardHeader);

// 含义模块
const means = document.createElement('div');
means.classList.add('means');
menuDom.appendChild(means);

// 提示语模块
const tip = document.createElement('div');
tip.classList.add('tip');
menuDom.appendChild(tip);

document.documentElement.appendChild(menuDom);

menuDom.addEventListener('mouseup', (e) => {
  e.stopPropagation();
});
menuDom.addEventListener('mousedown', (e) => {
  e.stopPropagation();
});
document.addEventListener('mouseup', async function (e) {
  // 如果点击的是菜单内部，不做处理
  if (menuDom.contains(e.target)) {
    return;
  }

  // 如果定时器存在，清除定时器
  if (timer) {
    clearTimeout(timer);
  }

  const selection = document.getSelection();
  if (selection.toString().length > 0) {
    const word = selection.toString().trim();
    const wordDom = document.querySelector('.word');
    const headerRight = document.querySelector('.header-right');
    const rect = selection.getRangeAt(0).getBoundingClientRect();

    const meansDom = document.querySelector('.means');
    meansDom.innerHTML = '';

    if (isEnglishWord(word)) {
      const result = await translate(word);
      if (result && result?.means?.length) {
        tip.classList.add('hide');
        headerRight.classList.remove('hide');

        wordDom.textContent = result.key;

        // 含义模块
        for (let i = 0; i < result?.means?.length; i++) {
          const mean = document.createElement('div');
          mean.classList.add('mean-item');
          mean.textContent = `${result.means[i].part} ${result.means[i].means}`;
          meansDom.appendChild(mean);
        }
      } else {
        wordDom.textContent = selection.toString();
        showTip('暂无翻译结果');
      }
    } else {
      wordDom.textContent = selection.toString();
      showTip('请选择一个单词');
    }

    const xMid = (rect.left + rect.right) / 2;
    const menuWidth = menuDom.offsetWidth;
    arrow.style.left = (menuWidth / 2 - 8) + 'px';
    Object.assign(menuDom.style, {
      left: (xMid - menuWidth / 2) + 'px',
      top: (rect.bottom + 10) + 'px',
      visibility: 'visible',
      opacity: '1',
    });
  } else {
    menuDom.style.opacity = '0';
    timer = setTimeout(() => {
      menuDom.style.visibility = 'hidden';
    }, 200);
  }
});
headerRight.addEventListener('click', () => {
  console.log('收藏');
});

function isEnglishWord(word) {
  const englishWordPattern = /^[a-zA-Z]+(?:[-'][a-zA-Z]+)*$/;
  const singleLetterWords = new Set(['a', 'i', 'A', 'I']);
  if (word.length === 1 && !singleLetterWords.has(word)) {
    return false;
  }
  return englishWordPattern.test(word);
}

function showTip(str) {
  tip.textContent = str;
  tip.classList.remove('hide');
  headerRight.classList.add('hide');
}

async function translate(text) {
  try {
    const response = await fetch(`http://localhost:3000/api/translate?word=${text}`);
    const { result } = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}
