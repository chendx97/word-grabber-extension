console.log("popup.js loaded");

let loginCheckInterval;

// 检查登录状态
async function checkLoginStatus() {
  try {
    const userInfo = await chrome.storage.local.get(['userInfo']);
    if (userInfo && userInfo.userInfo) {
      showUserInfo(userInfo.userInfo);
    } else {
      await fetchQRCode();
    }
  } catch (error) {
    console.error('检查登录状态失败:', error);
    await fetchQRCode();
  }
}

// 显示用户信息
function showUserInfo(userInfo) {
  const qrcodeContainer = document.getElementById('qrcode-container');
  const loggedInContent = document.getElementById('logged-in-content');
  const avatar = document.getElementById('avatar');
  const username = document.getElementById('username');

  // 隐藏二维码，显示登录后的内容
  qrcodeContainer.style.display = 'none';
  loggedInContent.style.display = 'block';
  
  // 更新用户信息
  avatar.src = userInfo.avatar;
  username.textContent = userInfo.nickname;
}

// 获取二维码
async function fetchQRCode() {
  const qrcodeContainer = document.getElementById('qrcode-container');
  const loggedInContent = document.getElementById('logged-in-content');
  const avatar = document.getElementById('avatar');
  const username = document.getElementById('username');
  
  // 显示二维码，隐藏登录后的内容
  qrcodeContainer.style.display = 'flex';
  loggedInContent.style.display = 'none';
  
  // 设置默认用户信息
  avatar.src = 'icon.png';
  username.textContent = '未登录';
  qrcodeContainer.innerHTML = '';

  try {
    const response = await fetch('https://word.fyzzz.cn/api/user/qrcode');
    const { result } = await response.json();
    
    const qrCodeImg = document.createElement('img');
    qrCodeImg.id = 'qrcode-img';
    qrCodeImg.src = result.qrcode;
    qrcodeContainer.appendChild(qrCodeImg);

    // 轮询登录状态
    if (loginCheckInterval) {
      clearInterval(loginCheckInterval);
    }
    
    loginCheckInterval = setInterval(async () => {
      const res = await queryIsLogin(result.scene);
      console.log("isLogin", res.status);
      if (res.status === 'success') {
        console.log("登录成功", res);
        clearInterval(loginCheckInterval);
        
        // 保存用户信息
        await chrome.storage.local.set({ userInfo: res.userInfo });
        showUserInfo(res.userInfo);
      }
    }, 1000 * 5);
  } catch (error) {
    console.error('获取二维码失败:', error);
    qrcodeContainer.innerHTML = '获取二维码失败，请刷新重试';
  }
}

// 查询登录状态
async function queryIsLogin(scene) {
  const response = await fetch(`https://word.fyzzz.cn/api/user/isLogin?scene=${scene}`);
  const { result } = await response.json();
  return result;
}

// 初始化
document.addEventListener('DOMContentLoaded', checkLoginStatus);
