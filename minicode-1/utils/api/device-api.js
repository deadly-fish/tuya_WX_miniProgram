import request from '../request'
// request 做了自动向params中添加uid的操作，因此可以不带入uid

// 获取mqtt配置
export const getMqttconfig = () => {
  return request({
    name: 'ty-service',
    data: {
      action: 'device.openHubConfig',
      params: {
        link_id: Math.random()
          .toString(10)
          .substring(2, 11),
        link_type: 'websocket'
      }
    }
  })
}

// 获取设备列表 
export const getDeviceList = () => {
  return request({
    name: 'ty-service',
    data: {
      action: 'device.getDeviceList',
      params: {}
    }
  })
}

// 获取设备最新状态
export const getDeviceStatus = (device_id) => {
  return request({
    name: 'ty-service',
    data: {
      action: 'device.status',
      params: {
        device_id
      }
    }
  })
}

// 获取设备指令集
export const getDeviceSpecifications = (device_id) => {
  return request({
    name: 'ty-service',
    data: {
      action: 'device.specifications',
      params: {
        device_id
      }
    }
  })
}

// 获取设备指令集(带中文dp名称)
export const getDevFunctions = (device_id) => {
  return request({
    name: 'ty-service',
    data: {
      action: 'device.functions',
      params: {
        device_id
      }
    }
  })
}

// 获取设备指令集(带中文dp名称)
export const getDeviceDetails = (device_id) => {
  return request({
    name: 'ty-service',
    data: {
      action: 'device.details',
      params: {
        device_id
      }
    }
  })
}


// 指令下发
export const deviceControl = (device_id, code, value) => {
  return request({
    name: 'ty-service',
    data: {
      action: 'device.control',
      params: {
        device_id,
        commands: [
          {
            code,
            value
          }
        ]
      }
    }
  })
}

// 获取 ticket
export const reqTicket = () =>
  request({
    name: 'ty-service',
    data: {
      action: 'system.userTicket',
      params: {}
    }
  });

// 获取电量统计
export const getElectricity = (device_id, code) => {
  return request({
    name: 'ty-service',
    data: {
      action: 'statistics.total',
      params: {
        device_id,
        code
      }
    },
  })
}

// 获取设备支持统计类型
export const getType = (device_id) => {
  return request({
    name: 'ty-service',
    data: {
      action: 'statistics.allType',
      params: {
        device_id,
      }
    },
  })
}

//  获得小时统计电量
export const getElectricity_hour = ( start_hour, end_hour) => {
  return request({
    name: 'ty-service',
    data: {
      action: 'statistics.hours',
      params: {
        device_id: "327508562cf43233d0af",
        code: 'add_ele',
        start_hour,
        end_hour
      }
    }
  })
}

// 获得按天统计电量
export const getElectricity_day = (start_day,end_day) => {
  return request({
    name: 'ty-service',
    data: {
      "action": "statistics.days",
      "params": {
        "device_id": "327508562cf43233d0af",
        "code": "add_ele",
        "start_day": start_day,
        "end_day": end_day,
      }
    },
  })
}

// 获得按月统计电量(这里只获取当前月)
export const getElectricity_month = (start_month,end_month) => {
  return request({
    name: 'ty-service',
    data:{
      "action": "statistics.months",
      "params": {
        "device_id":"327508562cf43233d0af",
        "code":"add_ele",
        "start_month":start_month,
        "end_month":end_month
      }
    }
  })
}

// 定时功能API
export const Timing = (loop_id, set_time) => {
  return request({
    name: 'ty-service',
    data: {
      action: "timer.add",
      params: {
        device_id: "327508562cf43233d0af",
        loops: loop_id,   //设定定时在周几
        category: "test",
        timezone_id: "Asia/Shanghai",
        time_zone: "+08:00",
        instruct: [
          {
            functions: [
              {
                code: "switch",
                value: true
              }
            ],
            // date: "20210516",    //利用周期做定时不需要
            time: set_time
          }
        ]
      }
    }
  })
}

//查询定时任务API
export const inquire_Timing = () => {
  return request({
    name: 'ty-service',
    data: {
      action: "timer.list",
      params: {
        device_id: "327508562cf43233d0af"
      }
    },
  })
}

//清空设备所有定时任务
export const clear_Timing = () => {
  return request({
    name: 'ty-service',
    data: {
      action: "timer.delete",
      params: {
        device_id: "327508562cf43233d0af"
      }
    },
  })
}
