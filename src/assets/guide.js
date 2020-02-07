const steps = [
    {
      element: "#operation", //绑定元素,不要用class,id具有唯一性,比较好
      popover: {
        title: "操作区域", //标题
        //内容
        description: "通过关键字（公司名、公车站名）查询关键字附近的小区，再根据小区名查找房源信息，现支持贝壳找房、自如两家房源，后期将对豆瓣、安居客等网站提供支持。",
        position: "bottom" //显示位置
      }
    },
    {
      element: "#city",
      popover: {
        title: "选择城市",
        description: "选择需要租房的城市和市区。",
        position: "bottom"
      },
      padding: 5
    },
    {
      element: "#keyword",
      popover: {
        title: "关键字",
        description: "输入街道名、公式地址、公交车站名等，搜索关键字附近的小区，建议使用街道名来搜素，提高准确度。",
        position: "bottom"
      }
    },
    {
      element: "#xy",
      popover: {
        title: "坐标类型",
        description: "选择坐标类型，不同的类型根据关键字解析出的经纬度有区别，搜索结果也有区别。",
        position: "bottom"
      }
    },
    {
      element: "#radius",
      popover: {
        title: "范围大小",
        description: "搜索关键字圆形区域内的小区，指定圆形半径，单位为米。",
        position: "bottom"
      }
    },
    {
      element: "#start",
      popover: {
        title: "开始搜索",
        description: "搜索符合条件的小区。",
        position: "bottom"
      }
    },
    {
      element: ".result-left",
      popover: {
        title: "小区列表",
        description: "小区列表",
        position: "bottom"
      }
    },
    {
      element: ".house-btn",
      popover: {
        title: "房源",
        description: "点击按钮，列出房源信息。",
        position: "bottom"
      }
    },
    {
      element: ".result-right",
      popover: {
        title: "房源列表",
        description: "房源列表。",
        position: "bottom"
      }
    },
  ]
   
  export default steps