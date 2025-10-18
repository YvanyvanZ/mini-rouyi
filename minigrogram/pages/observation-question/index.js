Page({
  data: {
    observationText: ''
  },

  onInputChange(e) {
    this.setData({
      observationText: e.detail.value
    });
  },

  onSubmit() {
    const { observationText } = this.data;
    
    if (!observationText.trim()) {
      wx.showToast({
        title: '请输入观察内容',
        icon: 'none'
      });
      return;
    }

    // 保存到本地存储
    wx.setStorageSync('today_observation', observationText);
    
    wx.showToast({
      title: '观察记录已保存',
      icon: 'success',
      duration: 2000,
      success: () => {
        setTimeout(() => {
          wx.navigateBack();
        }, 2000);
      }
    });
  },

  onLoad() {
    // 加载之前保存的记录
    const savedObservation = wx.getStorageSync('today_observation');
    if (savedObservation) {
      this.setData({
        observationText: savedObservation
      });
    }
  }
});