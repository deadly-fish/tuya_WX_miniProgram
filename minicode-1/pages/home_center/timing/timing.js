// pages/home_center/timing/timing.js

import { Timing, inquire_Timing,clear_Timing } from '../../../utils/api/device-api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: "08:00",
    array: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日',],
    index: 0,
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

  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },

  bindPickerChange: function (e) {
    this.setData({ index: e.detail.value })
  },

  open_timing: async function () {
    var loop_id = ''
    switch (this.data.array[this.data.index]) {
      case "星期一": loop_id = "0100000"; break;
      case "星期二": loop_id = "0010000"; break;
      case "星期三": loop_id = "0001000"; break;
      case "星期四": loop_id = "0000100"; break;
      case "星期五": loop_id = "0000010"; break;
      case "星期六": loop_id = "0000001"; break;
      case "星期日": loop_id = "1000000"; break;
      default: break;
    }
    const t = await Timing(loop_id, this.data.time)
    console.log("Timing of set",this.data.time,loop_id)
    wx.showToast({
      title: '定时设置成功',
    })
    console.log("info:", t)
  },

  inquire_timing: async function () {
    const time_info = await inquire_Timing()
    console.log(time_info)
    wx.showToast({
      title: String(time_info[0].groups.length),  //展示定时任务个数
      image: '../../../image/icon/定时.png'
    })
    // console.log(time_info[0].groups[0].timers[0].loops,time_info[0].groups[0].timers[0].time)
    // 提示信息待开发，可以跳转一个页面，详细描述出来
  },


  clear_timing:async function () {
    const cls = await clear_Timing()
    console.log(cls)
    wx.showToast({
      title: '清除完成',
    })
  }
})