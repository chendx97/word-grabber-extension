// 监听扩展安装和更新事件
chrome.runtime.onInstalled.addListener(() => {
  initWordList();
});

// 监听扩展启动事件
chrome.runtime.onStartup.addListener(() => {
  initWordList();
});

// 监听来自content.js的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // 更新单词列表
  if (request.type === 'WORD_GRABBER_UPDATE') {
    chrome.storage.local.set({ wordGrabberList: request.data });
    // 广播时传入当前标签页的ID
    broadcastWordListUpdate(request.data, sender.tab.id);
  }
});

// 广播单词列表更新
function broadcastWordListUpdate(wordList, excludeTabId) {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      // 排除当前标签页
      if (tab.id !== excludeTabId) {
        chrome.tabs.sendMessage(tab.id, {
          type: 'WORD_GRABBER_UPDATE',
          data: wordList
        });
      }
    });
  });
}

// 初始化时获取一次单词列表
async function initWordList() {
  try {
    const params = new URLSearchParams({
      userId: 'test',
    });
    const response = await fetch(`http://localhost:3000/api/word/list?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const { message, result } = await response.json();

    if (message === 'success') {
      // 存储到本地
      chrome.storage.local.set({ wordGrabberList: result });
      // 初始化时不需要排除任何标签页
      broadcastWordListUpdate(result);
    }
  } catch (error) {
    console.error('获取单词列表失败:', error);
  }
} 