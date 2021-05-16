// miniprogram/pages/home_center/common_panel/index.js.js
import { getDevFunctions, getDeviceDetails, deviceControl,getDeviceStatus } from '../../../utils/api/device-api'
import { reqTicket, getClientId } from '../../../utils/api/common-api'
import wxMqtt from '../../../utils/mqtt/wxMqtt'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: '18:00',
    kg_flag: false,
    count_value: 0,
    cur_current: 0,
    cur_voltage: 0,
    cur_power: 0,
    device_name: '普通的插头',
    devId: "327508562cf43233d0af",
    titleItem: {
      name: '普通的插头',
      value: '',
    },
    roDpList: {}, //只上报功能点
    rwDpList: {}, //可上报可下发功能点
    isRoDpListShow: false,
    isRwDpListShow: false,
    forest: '../../../image/forest@2x.png',
    baseUrl: 'plugin://tuya-ap-plugin/step1',
    logo: '../../../image/dancha.jpg',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { device_id } = options
    this.setData({ device_id })

    // mqtt消息监听
    wxMqtt.on('message', (topic, newVal) => {
      const { status } = newVal
      console.log(newVal)
      //  监听更新数据
      //  不能用newVal更新数据，因为不是每次全部数据都更新，如果没有更新会报错
      this.updateStatus(status)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: async function () {
    const { device_id } = this.data
    const [{ name, status, icon }, { functions = [] }] = await Promise.all([
      getDeviceDetails(device_id),
      getDevFunctions(device_id),
    ]);

    const { roDpList, rwDpList } = this.reducerDpList(status, functions)

    // 获取头部展示功能点信息
    let titleItem = {
      name: '',
      value: '',
    };
    if (Object.keys(roDpList).length > 0) {
      let keys = Object.keys(roDpList)[0];
      titleItem = roDpList[keys];
    } else {
      let keys = Object.keys(rwDpList)[0];
      titleItem = rwDpList[keys];
    }

    const roDpListLength = Object.keys(roDpList).length
    const isRoDpListShow = Object.keys(roDpList).length > 0
    const isRwDpListShow = Object.keys(rwDpList).length > 0

    this.setData({ titleItem, roDpList, rwDpList, device_name: name, isRoDpListShow, isRwDpListShow, roDpListLength, icon })
  },

  // 分离只上报功能点，可上报可下发功能点
  reducerDpList: function (status, functions) {
    // 处理功能点和状态的数据
    let roDpList = {};
    let rwDpList = {};
    if (status && status.length) {
      status.map((item) => {
        const { code, value } = item;
        let isExit = functions.find(element => element.code == code);
        if (isExit) {
          let rightvalue = value
          // 兼容初始拿到的布尔类型的值为字符串类型
          if (isExit.type === 'Boolean') {
            rightvalue = value == 'true'
          }

          rwDpList[code] = {
            code,
            value: rightvalue,
            type: isExit.type,
            values: isExit.values,
            name: isExit.name,
          };
        } else {
          roDpList[code] = {
            code,
            value,
            name: code,
          };
        }
      });
    }
    return { roDpList, rwDpList }
  },

  // sendDp: async function (e) {
  //   const { dpCode, value } = e.detail
  //   const { device_id } = this.data

  //   const { success } = await deviceControl(device_id, dpCode, value)
  // },
  sendDp: function (dpCode, value) {
    const { device_id } = this.data
    deviceControl(device_id, dpCode, value)
  },

  updateStatus: function (newStatus) {
    let { roDpList, rwDpList, titleItem } = this.data

    newStatus.forEach(item => {
      const { code, value } = item

      if (typeof roDpList[code] !== 'undefined') {
        roDpList[code]['value'] = value;
      } else if (rwDpList[code]) {
        rwDpList[code]['value'] = value;
      }
    })

    // 更新titleItem
    if (Object.keys(roDpList).length > 0) {
      let keys = Object.keys(roDpList)[0];
      titleItem = roDpList[keys];
    } else {
      let keys = Object.keys(rwDpList)[0];
      titleItem = rwDpList[keys];
    }

    this.setData({ titleItem, roDpList: { ...roDpList }, rwDpList: { ...rwDpList } })
  },

  jumpTodeviceEditPage: function () {
    console.log('jumpTodeviceEditPage')
    const { icon, device_id, device_name } = this.data
    wx.navigateTo({
      url: `/pages/home_center/device_manage/index?device_id=${device_id}&device_name=${device_name}&device_icon=${icon}`,
    })
  },

  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },

  // 用户自行编写代码
  gotoPluginpage: async function ({ currentTarget }) {
    const { dataset: { baseurl } } = currentTarget
    const [{ ticket }, clientId] = await Promise.all([reqTicket(), getClientId()])

    wx.navigateTo({
      url: `${baseurl}?ticket=${ticket}&clientId=${clientId}`,
    })
  },

  poetry: function () {
    // var that = this
    // console.log("this:",this)
    // console.log("that:",that)
    wx.navigateTo({
      url: "/pages/home_center/poetry/poetry",
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function (data) {
          console.log(data)
        },
        someEvent: function (data) {
          console.log(data)
        }
      },
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        //   console.log("this2:",this)  //未定义
        //  console.log("that2:",that)   //和上面一样
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test3' })
      }
    })
  },

  timing: function () {
    wx.navigateTo({
      url: "/pages/home_center/timing/timing",
    })
  },

  switch_change: function (e) {
    this.setData({ kg_flag: e.detail.value })
    // console.log(this.data.kg_flag)
    this.sendDp('switch', this.data.kg_flag)
  },

  countdown: function () {
    wx.navigateTo({
      url: "/pages/home_center/countdown/countdown",
    })
  },

  electricity_statistics: function () {
    // const that = this
    wx.navigateTo({
      url: "/pages/home_center/electricity_statistics/electricity_statistics",
      // success: function (res) {
      //   // 通过eventChannel向被打开页面传送数据
      //   res.eventChannel.emit('acceptDataFromOpenerPage', { data1: that.data.cur_current, data2: that.data.cur_power, data3: that.data.cur_voltage })
      //   // 这里因为是封包，所以要重新定义this
      // }
    })
  },

  // 下拉刷新信息
  onPullDownRefresh: function () {
    this.setData({
      kg_flag: this.data.rwDpList.switch.value
    })
    // const data = getDeviceStatus(this.data.devId)
    // console.log(data)
  },

})