const IconCollect = `<svg t="1739607583417" class="icon" viewBox="0 0 1026 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15869" width="24" height="24"><path d="M736.834783 44.521739c-89.043478 0-169.182609 44.521739-224.834783 115.756522C458.573913 89.043478 376.208696 44.521739 287.165217 44.521739 129.113043 44.521739 0 182.53913 0 353.947826c0 102.4 46.747826 173.634783 84.591304 231.513044 106.852174 164.730435 378.434783 371.756522 389.565218 380.660869 11.130435 8.904348 24.486957 13.356522 37.843478 13.356522 13.356522 0 26.713043-4.452174 37.843478-13.356522 11.130435-8.904348 282.713043-215.930435 391.791305-382.886956 37.843478-57.878261 84.591304-129.113043 84.591304-231.513044C1024 182.53913 894.886957 44.521739 736.834783 44.521739z m129.113043 538.713044c-100.173913 138.017391-311.652174 293.843478-322.782609 302.747826-8.904348 6.678261-22.26087 11.130435-33.391304 11.130434s-22.26087-4.452174-33.391304-11.130434S258.226087 719.026087 153.6 578.782609C120.208696 527.582609 66.782609 463.026087 66.782609 371.756522 71.234783 218.156522 158.052174 111.304348 300.521739 111.304348c77.913043 0 164.730435 73.46087 211.478261 138.017391C560.973913 184.765217 645.565217 111.304348 723.478261 111.304348 865.947826 111.304348 957.217391 218.156522 957.217391 371.756522c2.226087 89.043478-57.878261 160.278261-91.269565 211.478261z m0 0" fill="#999999" p-id="15870"></path></svg>`;
const IconCollected = `<svg t="1739607655108" class="icon" viewBox="0 0 1026 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16025" width="24" height="24"><path d="M736.834783 44.521739c-89.043478 0-169.182609 44.521739-224.834783 115.756522C458.573913 89.043478 376.208696 44.521739 287.165217 44.521739 129.113043 44.521739 0 182.53913 0 353.947826c0 102.4 46.747826 173.634783 84.591304 231.513044 106.852174 164.730435 378.434783 371.756522 389.565218 380.660869 11.130435 8.904348 24.486957 13.356522 37.843478 13.356522 13.356522 0 26.713043-4.452174 37.843478-13.356522 11.130435-8.904348 282.713043-215.930435 391.791305-382.886956 37.843478-57.878261 84.591304-129.113043 84.591304-231.513044C1024 182.53913 894.886957 44.521739 736.834783 44.521739z m0 0" fill="#B53031" p-id="16026"></path></svg>`;

// visibility定时器
let timer = null;

const menuDom = document.createElement('div');
menuDom.classList.add('chendx-translate-menu');

// 卡片的箭头
const arrow = document.createElement('div');
arrow.classList.add('menu-arrow');
menuDom.appendChild(arrow);

// 创建卡片头部
const cardHeader = document.createElement('div');
const headerLeft = document.createElement('div');
const headerRight = document.createElement('div');
const collectBtn = document.createElement('div');
cardHeader.classList.add('card-header');
headerLeft.classList.add('word');
headerRight.classList.add('header-right');
collectBtn.classList.add('collect-btn');
collectBtn.textContent = 'Collect';
headerRight.innerHTML = IconCollect + collectBtn.outerHTML;
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

let selectWord, translateRes;
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

        selectWord = result.key;
        translateRes = result.means;
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

headerRight.addEventListener('click', async () => {
  const res = await collect(selectWord, translateRes);
  if (res) {
    headerRight.firstElementChild.outerHTML = IconCollected;
  } else {
    console.log('收藏失败');
  }
});
async function collect(word, cn) {
  try {
    const response = await fetch('http://localhost:3000/api/word/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        word,
        cn,
        userId: 'test',
      }),
    });
    const { message } = await response.json();
    return message === 'success';
  } catch (error) {
    console.error(error);
    return false;
  }
}
