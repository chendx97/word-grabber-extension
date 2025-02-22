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

let selectWord, translateRes, paraphrase;
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
        // 收藏icon
        if (wordList.some(item => item.word === word)) {
          headerRight.innerHTML = IconCollected + collectBtn.outerHTML;
        } else {
          headerRight.innerHTML = IconCollect + collectBtn.outerHTML;
        }

        tip.classList.add('hide');
        headerRight.classList.remove('hide');

        selectWord = result.key;
        translateRes = result.means;
        paraphrase = result.paraphrase;
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
      hideCard();
      return;
    }

    const xMid = (rect.left + rect.right) / 2;
    const menuWidth = menuDom.offsetWidth;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // 计算左侧位置，确保不超出视口
    let leftPos = xMid - menuWidth / 2;
    // 如果太靠右，左移
    if (leftPos + menuWidth > viewportWidth - 20) {
      leftPos = viewportWidth - menuWidth - 20;
    }
    // 如果太靠左，右移
    if (leftPos < 20) {
      leftPos = 20;
    }

    // 计算箭头位置，箭头应该对准选中文本的中心
    const arrowLeftPos = Math.max(8, Math.min(menuWidth - 16, xMid - leftPos - 8));
    arrow.style.left = arrowLeftPos + 'px';

    // 计算顶部位置
    let topPos = rect.bottom + 10;
    const menuHeight = menuDom.offsetHeight;

    // 如果底部超出视口，显示在选中文本上方
    if (topPos + menuHeight > viewportHeight - 20) {
      topPos = rect.top - menuHeight - 10;
      // 移动箭头到底部
      arrow.style.top = 'auto';
      arrow.style.bottom = '-8px';
      arrow.style.borderWidth = '8px 8px 0 8px';
      arrow.style.borderColor = '#ffffff transparent transparent transparent';
    } else {
      // 恢复箭头到顶部的默认样式
      arrow.style.top = '-8px';
      arrow.style.bottom = 'auto';
      arrow.style.borderWidth = '0 8px 8px 8px';
      arrow.style.borderColor = 'transparent transparent #ffffff transparent';
    }

    Object.assign(menuDom.style, {
      left: leftPos + 'px',
      top: topPos + 'px',
      visibility: 'visible',
      opacity: '1',
    });
  } else {
    hideCard();
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
function hideCard() {
  menuDom.style.opacity = '0';
  timer = setTimeout(() => {
    menuDom.style.visibility = 'hidden';
  }, 200);
}
async function translate(text) {
  try {
    const response = await fetch(`https://word.fyzzz.cn/api/translate?word=${text}`);
    const { result } = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// 收藏/取消收藏功能
let wordList = [];
// 初始化时从storage获取单词列表
chrome.storage.local.get(['wordGrabberList'], (result) => {
  wordList = result.wordGrabberList || [];
});

// 监听来自background的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'WORD_GRABBER_UPDATE') {
    wordList = message.data;
  }
});
headerRight.addEventListener('click', async () => {
  const isCollected = wordList.some(item => item.word === selectWord);
  if (isCollected) {
    cancelCollect(selectWord);
  } else {
    collect(selectWord, translateRes, paraphrase);
  }
});
async function collect(word, cn, paraphrase) {
  try {
    const response = await fetch('https://word.fyzzz.cn/api/word/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        word,
        cn,
        paraphrase,
        user: 'osWEf5SU7AwjgT1qJP6qwZdG7pJA',
      }),
    });
    const { message } = await response.json();
    if (message === 'success') {
      headerRight.firstElementChild.outerHTML = IconCollected;
      wordList.push({ word, cn });
      chrome.runtime.sendMessage({
        type: 'WORD_GRABBER_UPDATE',
        data: wordList,
      });
    }
  } catch (error) {
    console.error(error);
  }
}
async function cancelCollect(word) {
  try {
    const response = await fetch('https://word.fyzzz.cn/api/word/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        word,
        user: 'osWEf5SU7AwjgT1qJP6qwZdG7pJA',
      }),
    });
    const { message } = await response.json();
    if (message === 'success') {
      headerRight.firstElementChild.outerHTML = IconCollect;
      wordList = wordList.filter(item => item.word !== word);
      chrome.runtime.sendMessage({
        type: 'WORD_GRABBER_UPDATE',
        data: wordList,
      });
    }
  } catch (error) {
    console.error(error);
  }
}
