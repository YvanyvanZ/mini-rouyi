// miniprogram/pages/login_register/index.js

Page({
  data: {
    // 认证模式：login, register, forgot
    currentAuthMode: 'login',
    
    // 表单数据
    loginPhone: '',
    loginPassword: '',
    registerPhone: '',
    verificationCode: '',
    registerPassword: '',
    forgotPhone: '',
    forgotVerificationCode: '',
    newPassword: '',
    
    // UI状态
    isLoginPasswordVisible: false,
    isRegisterPasswordVisible: false,
    isNewPasswordVisible: false,
    isLoading: false,
    
    // 消息提示
    message: {
      type: null, // error, success
      text: ''
    },
    
    // 验证码倒计时
    registerCodeCountdown: 0,
    forgotCodeCountdown: 0
  },

  onLoad: function (options) {
    console.log('登录注册页面加载');
  },

  // 切换认证模式
  switchAuthMode: function (e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({
      currentAuthMode: mode,
      message: { type: null, text: '' }
    });
  },

  // 输入框变化
  onInput: function (e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    
    this.setData({
      [field]: value
    });
  },

  // 切换密码可见性
  togglePasswordVisibility: function (e) {
    const type = e.currentTarget.dataset.type;
    const fieldMap = {
      login: 'isLoginPasswordVisible',
      register: 'isRegisterPasswordVisible',
      new: 'isNewPasswordVisible'
    };
    
    this.setData({
      [fieldMap[type]]: !this.data[fieldMap[type]]
    });
  },

  // 显示消息
  showMessage: function (type, text) {
    this.setData({
      message: { type, text }
    });
    
    // 3秒后自动隐藏
    setTimeout(() => {
      this.setData({
        message: { type: null, text: '' }
      });
    }, 3000);
  },

  // 验证手机号格式
  validatePhoneNumber: function (phone) {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  },

  // 开始验证码倒计时
  startCodeCountdown: function (isForgot) {
    const duration = 60;
    const countdownField = isForgot ? 'forgotCodeCountdown' : 'registerCodeCountdown';
    
    this.setData({
      [countdownField]: duration
    });
    
    const timer = setInterval(() => {
      this.setData({
        [countdownField]: this.data[countdownField] - 1
      });
      
      if (this.data[countdownField] <= 0) {
        clearInterval(timer);
      }
    }, 1000);
  },

  // 获取验证码
  handleGetVerificationCode: function () {
    const phone = this.data.registerPhone;
    
    if (!phone) {
      this.showMessage('error', '请先输入手机号');
      return;
    }
    
    if (!this.validatePhoneNumber(phone)) {
      this.showMessage('error', '请输入正确的手机号');
      return;
    }
    
    // 模拟发送验证码
    this.showMessage('success', '验证码已发送');
    this.startCodeCountdown(false);
  },

  // 获取找回密码验证码
  handleGetForgotCode: function () {
    const phone = this.data.forgotPhone;
    
    if (!phone) {
      this.showMessage('error', '请先输入手机号');
      return;
    }
    
    if (!this.validatePhoneNumber(phone)) {
      this.showMessage('error', '请输入正确的手机号');
      return;
    }
    
    // 模拟发送验证码
    this.showMessage('success', '验证码已发送');
    this.startCodeCountdown(true);
  },

  // 微信获取手机号
  onGetPhoneNumber: function (e) {
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      console.log('获取手机号成功', e.detail);
      this.handleWechatLogin(e.detail);
    } else {
      this.showMessage('error', '微信登录失败');
    }
  },

  // 微信登录处理
  handleWechatLogin: async function (phoneData) {
    this.setData({ isLoading: true });
    
    try {
      // 模拟微信登录成功
      this.showMessage('success', '微信登录成功');
      
      // 跳转到工作台
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/index/index'
        });
      }, 1500);
      
    } catch (error) {
      console.error('微信登录错误:', error);
      this.showMessage('error', '登录失败，请重试');
    } finally {
      this.setData({ isLoading: false });
    }
  },

  // 手机号登录
  handleLoginSubmit: async function () {
    const { loginPhone, loginPassword } = this.data;
    
    if (!loginPhone || !loginPassword) {
      this.showMessage('error', '请填写完整的登录信息');
      return;
    }
    
    if (!this.validatePhoneNumber(loginPhone)) {
      this.showMessage('error', '请输入正确的手机号');
      return;
    }
    
    this.setData({ isLoading: true });
    
    try {
      // 模拟登录成功
      this.showMessage('success', '登录成功');
      
      // 跳转到工作台
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/index/index'
        });
      }, 1500);
      
    } catch (error) {
      console.error('登录错误:', error);
      this.showMessage('error', '登录失败，请重试');
    } finally {
      this.setData({ isLoading: false });
    }
  },

  // 注册提交
  handleRegisterSubmit: async function () {
    const { registerPhone, verificationCode, registerPassword } = this.data;
    
    if (!registerPhone || !verificationCode || !registerPassword) {
      this.showMessage('error', '请填写完整的注册信息');
      return;
    }
    
    if (!this.validatePhoneNumber(registerPhone)) {
      this.showMessage('error', '请输入正确的手机号');
      return;
    }
    
    if (verificationCode.length !== 6) {
      this.showMessage('error', '请输入6位验证码');
      return;
    }
    
    if (registerPassword.length < 6) {
      this.showMessage('error', '密码长度不能少于6位');
      return;
    }
    
    this.setData({ isLoading: true });
    
    try {
      // 模拟注册成功
      this.showMessage('success', '注册成功');
      
      // 跳转到工作台
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/index/index'
        });
      }, 1500);
      
    } catch (error) {
      console.error('注册错误:', error);
      this.showMessage('error', '注册失败，请重试');
    } finally {
      this.setData({ isLoading: false });
    }
  },

  // 重置密码提交
  handleForgotPasswordSubmit: async function () {
    const { forgotPhone, forgotVerificationCode, newPassword } = this.data;
    
    if (!forgotPhone || !forgotVerificationCode || !newPassword) {
      this.showMessage('error', '请填写完整的信息');
      return;
    }
    
    if (!this.validatePhoneNumber(forgotPhone)) {
      this.showMessage('error', '请输入正确的手机号');
      return;
    }
    
    if (forgotVerificationCode.length !== 6) {
      this.showMessage('error', '请输入6位验证码');
      return;
    }
    
    if (newPassword.length < 6) {
      this.showMessage('error', '新密码长度不能少于6位');
      return;
    }
    
    this.setData({ isLoading: true });
    
    try {
      // 模拟重置密码成功
      this.showMessage('success', '密码重置成功');
      
      setTimeout(() => {
        this.switchAuthMode({ currentTarget: { dataset: { mode: 'login' } } });
      }, 1500);
    } catch (error) {
      console.error('重置密码错误:', error);
      this.showMessage('error', '密码重置失败，请重试');
    } finally {
      this.setData({ isLoading: false });
    }
  }
});