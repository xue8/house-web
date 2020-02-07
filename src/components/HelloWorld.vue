<template>
  <div class="hello">
    <div style="margin-bottom: 20px" id="operation">
      <el-form :inline="true" class="demo-form-inline" :rules="rules">
        <el-form-item label="选择城市" id="city" prop="pca">
          <el-cascader :options="pcaData" :props="pcaProps" @change="search" clearable>
          </el-cascader>
        </el-form-item>
        <el-form-item label="关键字" id="keyword" prop="location">
          <el-input placeholder="区域/小区名/公交车站名" suffix-icon="el-icon-date" v-model="nearby.location"
            @blur="locationBlur">
          </el-input>
        </el-form-item>
        <br>
        <!-- <el-form-item label="查询类型">
          <el-select v-model="searchTypeValue" placeholder="请选择">
            <el-option v-for="item in searchType" :key="item.name" :label="item.name" :value="item.name">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="坐标类型" id="xy" prop="xy">
          <el-select v-model="coordTypeValue" placeholder="请选择">
            <el-option v-for="item in coordType" :key="item.name" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="范围" id="radius" prop="radius">
          <el-input placeholder="1000" prefix-icon="el-icon-search" v-model="nearby.radius">
          </el-input>
        </el-form-item>
      </el-form>
      <el-button type="success" @click="start" size="medium" icon="el-icon-search" id="start">开始</el-button>
      <el-button type="warning" @click="guide" size="medium" icon="el-icon-video-play">使用引导</el-button>
      <br>
      <br>
      <el-tag type="warning" style="height: 95px" class="tag-tip">最近在找房子，想租公司附近小区的房子，但是想要知道公司附近有哪些小区，
        通过百度地图一个一个找出来然后再根据小区去查找房源太麻烦了，另外还有就是因为公司附近的小区
        <br>
        房价太高（且房子面积小），所以我倾向于租公司大巴经过的公交车站附近小区的房子，所以也就需要
        搜索特定公车站附近的小区，然后再根据小区查询房子。<br>但是网上找了并没有这些工具，So 自己就开发
        了这个小工具，目前仅提供贝壳租房、自如的房源，且为实时爬虫，后面将增加豆瓣、安居客的房源。
      </el-tag>
      <br>
      <br>
      <el-tag class="tag-tip">关键字尽量使用街道名，比如想要搜索腾讯大厦的，则写腾讯大厦的街道号：深南大道10000号，提高精度。</el-tag>
    </div>

    <baidu-map class="bm-view" :center="nearby.centerAddr">
      <bm-local-search keyword="餐馆" :nearby="nearby" :auto-viewport="true" :panel="false"></bm-local-search>
      <bm-circle :center="nearby.center" :radius="nearby.radius"></bm-circle>
      <bm-view class="bm-view" id="allmap"></bm-view>
      <bm-walking :start="nearby.start" :end="nearby.end" :auto-viewport="true" :panel="false"></bm-walking>
      <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
    </baidu-map>

    <!-- <div id="allmap"></div> -->
    <div style="margin-top: 20px">
      <!-- 搜索结果列表 -->
      <div class="result-left">
        <el-table :data="searchResult" style="width: 100%" v-loading="searchTableLoading">
          <el-table-column prop="name" label="小区名">
          </el-table-column>
          <el-table-column prop="address" label="地址">
          </el-table-column>
          <el-table-column prop="detailInfo.distance" label="距离(米)">
          </el-table-column>
          <el-table-column label="房源" align="center" fixed="right" width="110px" class-name="house-btn">
            <template slot-scope="scope">
              <el-button type="primary" size="small" icon="el-icon-search" @click="house(scope.row)">贝壳找房</el-button>
              <el-button type="primary" size="small" icon="el-icon-search" @click="ziroomHouse(scope.row)" style="margin-top: 5px">自如
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page.sync="currentPage" :page-size="pageSize" layout="total, prev, pager, next"
            :total="totalCount">
          </el-pagination>
        </div>
      </div>
      <!-- 房源列表 -->
      <div class="result-right">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item label="价格区间" style="margin-bottom: 0px">
            <el-input size="small" placeholder="最低价" v-model="searchForm.gt" @change="searchFormSubmit">
            </el-input>
          </el-form-item>
          <el-form-item style="margin-bottom: 0px">
            <el-input size="small" placeholder="最高价" v-model="searchForm.lt" @change="searchFormSubmit">
            </el-input>
          </el-form-item>
          <el-form-item label="类型" style="margin-bottom: 0px">
            <el-select v-model="searchForm.type" placeholder="租赁方式" size="small" @change="searchFormSubmit">
              <el-option label="不限" value="2"></el-option>
              <el-option label="合租" value="1"></el-option>
              <el-option label="整租" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div style="max-height: 545px;overflow-y: auto;">
          <el-table :data="houseSearchResult" style="width: 100%" v-loading="houseTableLoading">
            <el-table-column label="名称">
              <template slot-scope="scope">
                <el-link type="primary" :href="scope.row.url" target="view_window">{{ scope.row.name }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="价钱">
            </el-table-column>
            <el-table-column prop="houseType" label="类型">
            </el-table-column>
            <el-table-column prop="area" label="面积">
            </el-table-column>
            <el-table-column prop="datetime" label="更新时间">
            </el-table-column>
          </el-table>
        </div>
        <div class="block">
          <el-pagination @size-change="houseHandleSizeChange" @current-change="houseHandleCurrentChange"
            :current-page.sync="houseCurrentPage" :page-size="housePageSize" layout="total, prev, pager, next"
            :total="houseTotalCount">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import pca from "../assets/data/pca.json"

  import Driver from "driver.js" // import driver.js
  import "driver.js/dist/driver.min.css" // import driver.js css
  import steps from "../assets/guide"

  export default {
    name: 'HelloWorld',
    props: {
      msg: String
    },
    data() {
      return {
        pcaData: [],
        pcaProps: {
          label: "name",
          checkStrictly: true,
          value: "name",
        },
        // 搜索，默认仅支持搜索小区
        searchTypeValue: "小区",
        searchType: [{
            name: "公交车站"
          },
          {
            name: "小区"
          },
        ],
        searchTableLoading: false,
        coordTypeValue: null,
        coordType: [{
            name: "GPS经纬度",
            code: 1,
          },
          {
            name: "国测局经纬度坐标",
            code: 2,
          },
          {
            name: "百度经纬度坐标",
            code: 3,
          }
        ],
        nearby: {
          center: {
            lng: 116.404,
            lat: 39.915
          },
          radius: null,
          address: "深圳市",
          city: null,
          location: null,
          start: null,
          end: null,
          centerAddr: "深圳市",
        },
        searchResult: [],
        // 分页信息
        pageSize: 10,
        totalCount: 0,
        currentPage: 1,
        // 房源列表
        houseSearchResult: [],
        housePageSize: 30,
        houseTotalCount: 0,
        houseCurrentPage: 1,
        currentRow: {},
        houseTableLoading: false,
        // map
        map: {},
        // 搜索表单
        searchForm: {
          // type: 0,
          // gt: 0,
          // lt: 2000,
        },
        // 当前房源类型
        currentType: 'beike',
        // 引导
        driver: null,
        // 匹配规则
        rules: {
          // pca: [{
          //   required: true,
          //   message: '请选择城市',
          //   trigger: 'blur'
          // }],
          // location: [{
          //   required: true,
          //   message: '请输入关键字',
          //   trigger: 'blur'
          // }],
          // xy: [{
          //   required: true,
          //   message: '请选择坐标类型',
          //   trigger: 'blur'
          // }],
          // radius: [{
          //   required: true,
          //   message: '请输入范围',
          //   trigger: 'blur'
          // }],
        },
      }
    },
    mounted() {
      this.map = new window.BMap.Map("allmap");
      this.pcaData = pca;

      this.driver = new Driver({
        opacity: 0.5, //透明度
        animate: true, //动画
        padding: 10, //边距
        allowClose: true, //点击覆盖是否应该关闭
        overlayClickNext: false, //单击覆盖是否应移动到下一步
        doneBtnText: "完成",
        closeBtnText: "关闭",
        nextBtnText: "下一步",
        prevBtnText: "上一步"
      })
      // this.driver = new Driver()
    },
    methods: {
      search(v) {
        this.nearby.address = "";
        v.forEach(element => {
          if (element == "市辖区" || element == '县') {
            return;
          } else {
            this.nearby.address += element;
          }
        });
        this.nearby.centerAddr = this.nearby.address;
        if (v.length == 3 && v[0].indexOf('市') != -1) {
          // 直辖市
          this.nearby.city = v[0];
          this.nearby.city = this.nearby.city.replace("市", "");
        } else if (v.length == 3) {
          this.nearby.city = v[1];
          this.nearby.city = this.nearby.city.replace("市", "");
        }
      },
      // 开始检索
      start() {
        if (this.nearby.location == null || this.nearby.location == ''
            || this.nearby.address == null || this.nearby.address == ''
            || this.coordTypeValue == null || this.coordTypeValue == ''
            || this.nearby.radius == null || this.nearby.radius == '') {
          this.$message.error({
            message: "输入信息不完整，请检查输入！",
            showClose: true
          });
          return;
        }
        this.searchTableLoading = true;
        this.map.centerAndZoom(new window.BMap.Point(116.404, 39.915), 11);
        // 创建地址解析器实例     
        var myGeo = new window.BMap.Geocoder();
        // 将地址解析结果显示在地图上，并调整地图视野    
        var _this = this;
        myGeo.getPoint(_this.nearby.address + _this.nearby.location, function (point) {
            if (point) {
              _this.nearby.center = {
                lng: point.lng,
                lat: point.lat,
              }
              var location = point.lat + ',' + point.lng;
              _this.$axios.get('http://127.0.0.1:8090/map/search' + '?query=' + _this.searchTypeValue +
                  '&location=' + location +
                  '&radius=' + _this.nearby.radius + '&pageNum=' + _this.currentPage + "&coordType=" + _this
                  .coordTypeValue)
                .then(response => {
                  if (response.data.code === 200) {
                    _this.searchResult = response.data.result;
                    _this.totalCount = response.data.totalCount;
                  } else {
                    this.$message.error({
                      message: response.data.message,
                      showClose: true
                    })
                  }
                  _this.searchTableLoading = false;
                }).catch(function (err) {
                  window.console.log(err);
                })
            }
          },
          _this.nearby.address);
      },
      // 贝壳搜索
      house(row) {
        this.nearby.start = this.nearby.location;
        this.nearby.end = row.name;
        // this.housePageSize = 33;
        this.currentType = 'beike';
        this.houseTableLoading = true;
        this.houseSearchResult = [];

        this.currentRow = row;
        var url = '?address=' + row.name + "&pageNum=" + this.houseCurrentPage + "&city=" + this.nearby.city;
        if (this.searchForm != null) {
          if (this.searchForm.type != null && this.searchForm.type != 2) {
            url += "&type=" + this.searchForm.type;
          }
          if (this.searchForm.gt != null) {
            url += "&gt=" + this.searchForm.gt;
          }
          if (this.searchForm.lt != null) {
            url += "&lt=" + this.searchForm.lt;
          }
        }
        this.$axios.get('http://127.0.0.1:8090/house/search' + url)
          .then(response => {
            if (response.data.code === 200) {
              this.houseSearchResult = response.data.result;
              this.houseTotalCount = response.data.totalCount;
            } else {
              this.$message.error({
                message: response.data.message,
                showClose: true
              })
            }
            this.houseTableLoading = false;
          }).catch(function (err) {
            window.console.log(err);
          })
      },
      // 自如搜索
      ziroomHouse(row) {
        // this.housePageSize = 30;
        this.currentType = 'ziroom';
        this.houseTableLoading = true;
        this.houseSearchResult = [];

        this.currentRow = row;
        var url = '?address=' + row.name + "&pageNum=" + this.houseCurrentPage + "&city=" + this.nearby.city;
        if (this.searchForm != null) {
          if (this.searchForm.type != null && this.searchForm.type != 2) {
            url += "&type=" + this.searchForm.type;
          }
          if (this.searchForm.gt != null) {
            url += "&gt=" + this.searchForm.gt;
          }
          if (this.searchForm.lt != null) {
            url += "&lt=" + this.searchForm.lt;
          }
        }
        this.$axios.get('http://127.0.0.1:8090/house/ziroomSearch' + url)
          .then(response => {
            if (response.data.code === 200) {
              this.houseSearchResult = response.data.result;
              this.houseTotalCount = response.data.totalCount;
            } else {
              this.$message.error({
                message: response.data.message,
                showClose: true
              })
            }
            this.houseTableLoading = false;
          }).catch(function (err) {
            window.console.log(err);
          })
      },
      guide() {
        this.driver.defineSteps(steps)
        this.driver.start()
      },
      searchFormSubmit() {
        if (this.currentType == 'beike') {
          this.house(this.currentRow);
        } else if (this.currentType == 'ziroom') {
          this.ziroomHouse(this.currentRow);
        }
      },
      locationBlur() {
        this.nearby.centerAddr = this.nearby.address + this.nearby.location;
      },
      // // 计算距离的过滤器
      // distance(a) {
      //   a = a.location;
      //   var b = this.address;
      //   var pointA = new window.BMap.Point(a.lng, a.lat); // 创建点坐标A
      //   var pointB = new window.BMap.Point(b.lng, b.lat); // 创建点坐标B
      //   return (this.map.getDistance(pointA, pointB)).toFixed(2) + ' 米'; //获取两点距离,保留小数点后两位
      // },
      // 改变当前页数
      handleCurrentChange: function (val) {
        if (val == null) {
          return;
        }
        this.currentPage = val;
        this.start();
      },
      // 改变每页条数大小
      handleSizeChange(val) {
        this.currentPage = 1;
        this.pageSize = val;
        this.start();
      },
      // 改变当前页数
      houseHandleCurrentChange: function (val) {
        if (val == null) {
          return;
        }
        this.houseCurrentPage = val;

        if (this.currentType == 'beike') {
          this.house(this.currentRow);
        } else if (this.currentType == 'ziroom') {
          this.ziroomHouse(this.currentRow);
        }
      },
      // 改变每页条数大小
      houseHandleSizeChange(val) {
        this.houseCurrentPage = 1;
        this.housePageSize = val;

        if (this.currentType == 'beike') {
          this.house(this.currentRow);
        } else if (this.currentType == 'ziroom') {
          this.ziroomHouse(this.currentRow);
        }
      },
    },
  }
</script>
<style scoped>
  .bm-view {
    width: 100%;
    height: 300px;
  }

  @media screen and (max-width: 500px) { 
    .result-left {
      width: 100%;
      /* float: left; */
    }

    .result-right {
      margin-top: 15px;
      width: 100%;
      /* float: right; */
    }
  } 

  @media screen and (min-width: 501px) { 
    .result-left {
      width: 52%;
      float: left;
    }

    .result-right {
      width: 45%;
      float: right;
    }
  } 

  
  .tag-tip {
    max-width:  100%;
    overflow-x: auto;
  }

</style>