// pages/home_center/countdown/countdown.js

import { getDevFunctions, getDeviceDetails, deviceControl } from '../../../utils/api/device-api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    count_value: 0,
    devId: "327508562cf43233d0af"

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //用户自定义代码
  sendDp: function (dpCode, value) {
    deviceControl(this.data.devId, dpCode, value)
  },

  count_operation: function (e) {
    this.setData({ count_value: e.detail.value }) //事件触发更新定时值
    console.log(this.data.count_value, typeof (this.data.count_value))
    var re = /\d+:\d+:\d+/  //正则表达式检测输入合法性
    if (re.test(this.data.count_value)) {
      var send_data = this.time_to_sec(this.data.count_value)
      console.log(send_data)
      // this.sendDp("countdown_1",3)   //该DP点需要int型
      this.sendDp("countdown_1",parseInt(send_data))  //下发DP点
      wx.showToast({
        title: '倒计时设置成功',
      })
    }
    else{
      console.log("输入不合法")
      wx.showToast({
        title: '输入不合法',
        image: '../../../image/icon/错误.png'
      })
    }
  },

  time_to_sec: function (time) {  //00：00：00标准格式转为秒
    var s = '';

    var hour = time.split(':')[0];
    var min = time.split(':')[1];
    var sec = time.split(':')[2];

    s = Number(hour * 3600) + Number(min * 60) + Number(sec);

    return s;
  }
})