// pages/home_center/electricity_statistics/electricity_statistics.js
const charts = require('../../../utils/wx_chart/wxcharts'); // 引入wx-charts.js文件
import {
  getDeviceDetails, deviceControl, getElectricity, getElectricity_hour,
  getElectricity_day, getElectricity_month
} from '../../../utils/api/device-api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    cur_current: 0,
    cur_voltage: 0,
    cur_power: 0,
    total_all: 0,
    total_month: 0,
    row_key: [],
    column_value: [],
    imglist: ['../../../image/icon/dianliu.png',
      '../../../image/icon/dianya.png',
      '../../../image/icon/gonglv.png',
      '../../../image/icon/月用电量查询.png',
      '../../../image/icon/累计发电量.png',],
    devId: "327508562cf43233d0af",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    //日期运算
    var date = new Date()
    var or_year = date.getFullYear()  //获得原始数据
    var or_month = date.getMonth() + 1
    var or_day = date.getDate()
    var or_hour = date.getHours()
    console.log("now time:", or_year, or_month, or_day)   //打印当前日期
    var start_day, end_day;  // 电量统计的开始日期和结束日期
    var month = or_month < 10 ? "0" + or_month : or_month; //格式化日期
    var start_month = String(or_year) + String(month)
    var day = or_day < 10 ? "0" + or_day : or_day;
    end_day = String(or_year) + String(month) + String(day)  //结束日期的格式化日期
    day = or_day < 7 ? or_day + 24 : or_day - 6;
    month = or_day < 7 ? "0" + (month - 1) : month;
    start_day = String(or_year) + String(month) + String(day)  //开始日期的格式化日期，这里逻辑还有点问题，会出现不存在的日期，但无伤大雅

    const detail = await getDeviceDetails(this.data.devId)
    console.log("detail:", detail)   //打印设备状态
    const eleRes = await getElectricity(this.data.devId, 'add_ele')
    console.log("eleRes:", eleRes)   //打印设备总功耗
    const info_Electricity_hours = await getElectricity_hour(end_day + "00", end_day + String(or_hour))  //从该天0点到当前小时
    console.log("info_Electricity_hours:", info_Electricity_hours.hours)   //打印设备功耗信息按小时
    // const info_Electricity_day = await getElectricity_day(start_day,end_day)
    const info_Electricity_day = await getElectricity_day(start_day, end_day)
    console.log("sss", start_day, end_day)
    console.log("info_Electricity_day:", info_Electricity_day.days) //打印设备功耗信息按天
    const info_Electricity_month = await getElectricity_month(start_month, start_month)
    console.log("info_Electricity_month:", info_Electricity_month.months) //打印设备功耗信息按天

    this.setData({
      total_all: eleRes.total,
      total_month: info_Electricity_month.months[start_month],
      cur_current: detail.status[2].value,
      cur_voltage: detail.status[4].value / 10,
      cur_power: detail.status[3].value/10,        //这里显示的不是直接的功率，我算了一下，转换的
    })

    for (var key in info_Electricity_day.days)     //分离键值对，画图
    {
      this.data.row_key.push(key)
      this.data.column_value.push(info_Electricity_day.days[key])  //使用push方法向列表添加元素
    }
    console.log("key-value:", this.data.row_key, this.data.column_value)

    var chart_1 = new charts({
      canvasId: 'lineCanvas-1',
      type: 'line',
      // categories: [],
      categories: this.data.row_key,
      series: [{
        name: '7日统计',
        color: 'red', // 配色，不传入则使用系统默认配色方案
        background: 'blue',
        // data: [],
        data: this.data.column_value,
        format: function (val) {
          return val.toFixed(2);
        }
      }],
      dataLabel: false,
      yAxis: {
        max: 0.5,
        min: 0, // Y轴起始值,
        disableGrid: true
      },
      extra: {
        lineStyle: 'curve' // (仅对line, area图表有效) 可选值：curve曲线，straight直线 (默认)
      },
      dataPointShape: true,
      width: 320,
      height: 275
    });

    // this.data.row_key.splice(0,this.data.row_key.length)    //清空列表
    // this.data.column_value.splice(0,this.data.column_value.length)
    this.setData({ row_key: [], column_value: [] })  //清空列表
    for (var key in info_Electricity_hours.hours)     //分离键值对，画图
    {
      this.data.row_key.push(key)
      this.data.column_value.push(info_Electricity_hours.hours[key])  //使用push方法向列表添加元素
    }
    console.log("key-value:", this.data.row_key, this.data.column_value)

    var chart_2 = new charts({
      canvasId: 'lineCanvas-2',
      type: 'line',
      categories: this.data.row_key,
      series: [{
        name: '0点~目前统计',
        color: 'red', // 配色，不传入则使用系统默认配色方案
        background: 'blue',
        data: this.data.column_value,
        format: function (val) {
          return val.toFixed(2);
        }
      }],
      dataLabel: false,
      yAxis: {
        max: 0.5,
        min: 0, // Y轴起始值,
        disableGrid: true
      },
      extra: {
        lineStyle: 'curve' // (仅对line, area图表有效) 可选值：curve曲线，straight直线 (默认)
      },
      dataPointShape: true,
      width: 320,
      height: 275
    });

    console.log("chart_data:", chart_1.opts.series, chart_2.opts.series)


    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    // const that = this //this指向
    // const eventChannel = this.getOpenerEventChannel()
    // eventChannel.on('acceptDataFromOpenerPage', function (data) {
    //   that.setData({ cur_current: data.data1, cur_voltage: data.data3, cur_power: data.data2 })
    // console.log(data)
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: async function () {
    const detail = await getDeviceDetails(this.data.devId)
    this.setData({
      cur_current: detail.status[2].value,
      cur_voltage: detail.status[4].value / 10,
      cur_power: detail.status[3].value/10,        //这里显示的不是直接的功率，我算了一下，转换的
    })
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
  onPullDownRefresh: async function () {
    const detail = await getDeviceDetails(this.data.devId)
    this.setData({
      cur_current: detail.status[2].value,
      cur_voltage: detail.status[4].value / 10,
      cur_power: detail.status[3].value/10,        //这里显示的不是直接的功率，我算了一下，转换的
    })
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

  switchNav: function (e) {
    var page = this;
    if (this.data.currentTab == e.target.dataset.current) {
      return false;
    }
    else {
      page.setData({ currentTab: e.target.dataset.current });
    }
  },
})