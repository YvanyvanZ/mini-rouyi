Page({
  data: {
    loadingMessage: '正在初始化',
    isNetworkError: false,
    version: '1.0.0'
  },

  onLoad: function(options) {
    console.log('🎯 闪屏页被调用，参数:', options);
    this.startLoadingProcess(options);
  },

  startLoadingProcess: function(options) {
    const loadingMessages = [
      '正在初始化',
      '连接能量网络',
      '加载共修数据', 
      '准备就绪'
    ];
    
    let messageIndex = 0;
    
    const updateLoadingText = () => {
      if (messageIndex < loadingMessages.length - 1) {
        messageIndex++;
        this.setData({
          loadingMessage: loadingMessages[messageIndex]
        });
        setTimeout(updateLoadingText, 800);
      } else {
        this.setData({
          loadingMessage: loadingMessages[messageIndex]
        });
        
        // 🎯 关键修改：判断跳转目标
        setTimeout(() => {
          // 如果有参数或者不是正常启动，跳转到星图大厅
          const shouldGoToStarHall = Object.keys(options).length > 0;
          
          if (shouldGoToStarHall) {
            console.log('跳转到星图大厅');
            wx.redirectTo({
              url: '/pages/index/index'
            });
          } else {
            console.log('正常启动，跳转到登录页');
            wx.redirectTo({
              url: '/pages/login_register/index'
            });
          }
        }, 1000);
      }
    };
    
    setTimeout(updateLoadingText, 1000);
  },

  showNetworkError: function() {
    this.setData({
      isNetworkError: true,
      loadingMessage: '网络连接异常'
    });
    
    setTimeout(() => {
      // 网络错误时跳转到登录页面
      wx.redirectTo({
        url: '/pages/login_register/index'
      });
    }, 2000);
  }
});