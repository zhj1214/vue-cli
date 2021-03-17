<!------------------------
 *@name CouponModal
 *@author Sam
 *@date 2019/04/17
 *@desc 优惠券市场，包含搜索，列表和自定义传入操作
 *@param list  优惠券列表
 *@param total 优惠券总条数
 *@param noCYWX 是否过滤微信券
 *@getCouponList {search} 根据搜索条件返回优惠券列表
 *
 *@slot-button: 操作按钮
 *@slot-tabs:切换选项卡组
 *@slot-list:列表展示位
 -------------------------->

<template>
  <div>
    <Row
      style="padding-bottom:24px; border-bottom:solid 1px #E6EBF0;margin-bottom:20px;"
    >
      <i-col
        span="14"
        style="text-align:left;"
      >
        <!-- <Button type="primary" style="margin-right:28px;" @click="addCoup" v-show="operList.includes('create')">新增券</Button> -->
        <!-- 优惠券页面需显示新增券按钮 -->
        <slot name="button" />
        <!-- <span v-if="curOrg!=15" class="mr-10">{{curOrgName}}</span>
        <Select v-else v-show="!isCreateActivity" placeholder="全部来源" style="width:200px;margin-right:12px; "  v-model="search.couponOriginList" multiple :max-tag-count="2" @on-change="originChange">
          <Option v-for="(item, index) in originList" :key="index" :value="item.orgId">{{item.orgName}}</Option>
        </Select> -->
        <DatePicker
          v-show="!isCreateActivity"
          type="datetimerange"
          :value="[search.startTime, search.endTime]"
          placement="bottom-end"
          placeholder="开始时间 - 结束时间"
          style="width: 220px"
          @on-change="dateChange"
        />
      </i-col>
      <i-col
        span="8"
        :offset="isCreateActivity ? 16 : 2"
        style="text-align:right"
      >
        <div class="marketContent__selectAndInput">
          <Select
            v-model="search.keyType"
            style="width: 120px; flex: 0 0 auto"
          >
            <Option
              v-for="item in searchSelectTypelist"
              :key="item.id"
              :value="item.id"
            >
              {{ item.label }}
            </Option>
          </Select>
          <Input
            v-model="search.content"
            search
            placeholder="请输入查询条件"
          />
        </div>
        <!-- <Input
          suffix="ios-search"
          placeholder="名称 / 适用商品 / 优惠内容检索"
          style="width: 280px"
          v-model="search.content"
          @on-change="
            search.page = 1;
            search.size = size || 12;
          "
        /> -->
      </i-col>
    </Row>
    <!-- 优惠券页面需显示tabs切换 -->
    <slot name="type" />
    <!--显示选中的条目数-->
    <slot name="tips" />
    <Row
      v-if="!hideType"
      class="search-type-box"
    >
      <i-col
        span="2"
        class="type-title"
      >
        优惠券类型:
      </i-col>
      <i-col class="type-btn-box clearfix">
        <Checkbox
          :indeterminate="indeterminate"
          :value="checkAll"
          style="float:left"
          @click.prevent.native="handleCheckAll"
        >
          全选
        </Checkbox>
        <CheckboxGroup
          v-model="search.couponTypeList"
          style="float:left"
          @on-change="checkAllTypeChange"
        >
          <Checkbox
            v-for="(item, index) in cardTypeList"
            :key="index"
            :label="item.code"
          >
            {{ item.name }}
          </Checkbox>
        </CheckboxGroup>
      </i-col>
    </Row>
    <!-- 优惠券列表 -->
    <slot name="list" />
    <Page
      v-show="total > search.size"
      :total="total"
      :current="search.page"
      class-name="pagebox"
      :page-size="search.size"
      :page-size-opts="[9, 12, 24, 36, 48]"
      show-sizer
      show-total
      show-elevator
      @on-change="pageChange"
      @on-page-size-change="pageSizeChange"
    />
  </div>
</template>
<script>
import _ from "lodash";

export default {
  props: {
    // list:{type:Array,required:true},    //优惠券列表
    total: { type: Number, required: true }, //优惠券总量
    isCreateActivity: { type: Boolean }, //识别是否为活动里使用，如果是不用展示优惠券来源和时间选择器条件
    size: { type: Number },
    hideType: { type: String }, // 是否显示优惠券类型
    noCYWX: { type: Boolean }, // 是否包含微信原生券，true为不包含，不传或false则包含
  },
  data: function() {
    return {
      searchSelectTypelist: [
        {
          id: 1,
          label: "券名称",
        },
        {
          id: 2,
          label: "券ID",
        },
        {
          id: 3,
          label: "适用商品名称",
        },
        {
          id: 4,
          label: "适用商品编号",
        },
      ],
      search: {
        content: "", //优惠券名称/适用商品/优惠内容
        startTime: "",
        endTime: "",
        type: 2, // 优惠券状态 1-待上架（草稿） 2-已上架 3-已过期
        couponTypeList: [], //优惠券类型 1-满减券 2-折扣券 3-体验券 全部类型不传值
        size: this.size || 12,
        page: 1,
        orgId: localStorage.originOrgId
      },
      indeterminate: false,
      checkAll: true,
      cardTypeList: [],
      curOrg: localStorage.orgId,
    };
  },
  computed: {
    curOrgName() {
      let iOrg = this.originList.filter(
        (item) => item.orgId == localStorage.orgId
      );
      return iOrg && iOrg.length ? iOrg[0].orgName : "";
    },
  },
  watch: {
    search: {
      handler: _.debounce(function(newVal) {
        let iSearch = JSON.parse(JSON.stringify(newVal));
        this.$emit("getCouponList", iSearch);
      }, 500),
      deep: true,
    },
  },
  mounted() {
    !this.hideType && this.getTypeList();
  },
  methods: {
    pageChange(page) {
      this.search = Object.assign({}, this.search, { page });
    },
    pageSizeChange(size) {
      this.search = Object.assign({}, this.search, { size });
    },
    originChange() {
      this.search = Object.assign({}, this.search, {
        page: 1,
        size: this.size || 12,
      });
    },
    handleCheckAll() {
      if (this.indeterminate) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }
      this.indeterminate = false;

      if (this.checkAll) {
        this.search.couponTypeList = [];
        this.cardTypeList.map((item) =>
          this.search.couponTypeList.push(item.code)
        );
      } else {
        this.search.couponTypeList = [];
      }
    },
    checkAllTypeChange(data) {
      if (data.length === 3) {
        this.indeterminate = false;
        this.checkAll = true;
      } else if (data.length > 0) {
        this.indeterminate = true;
        this.checkAll = false;
      } else {
        this.indeterminate = false;
        this.checkAll = false;
      }
    },
    //获取优惠券类型
    getTypeList() {
      this.$ajaxGet("/coupon-server/api/coupon/type/first/list", {
        orgId: localStorage.orgId,
        type: 1,
      })
        .then((res) => {
          if (res && res.code === 10000)
            this.cardTypeList = this.cardTypeList.concat(res.data || []);
          if (this.noCYWX) {
            this.cardTypeList = this.cardTypeList.filter(
              (item) => item.code !== "CYWQ"
            );
          }
          this.cardTypeList.map((item) =>
            this.search.couponTypeList.push(item.code)
          );
        })
        .catch();
    },
    //切换优惠券类型
    typeBtnClick(id) {
      this.search = Object.assign({}, this.search, { couponType: id * 1 });
    },
    //时间选择器改变触发获取列表
    dateChange(val) {
      this.search = Object.assign({}, this.search, {
        startTime: val[0],
        page: 1,
        size: this.size || 12,
        endTime: val[1],
      });
    },
  },
};
</script>
<style lang="scss">
.marketContent__selectAndInput {
  .ivu-select-selection {
    border-radius: 8px 0 0 8px;
    text-align: center;
  }
  .ivu-select-dropdown-list {
    text-align: center;
  }
  .ivu-input {
    border-radius: 0 8px 8px 0;
  }
}
</style>
<style lang="scss" scoped>
.marketContent__selectAndInput {
  width: 320px;
  height: auto;
  display: flex;
  align-items: center;
}
.search-type-box {
  margin: 24px auto;
  text-align: left;
  height: 30px;
  line-height: 30px;
  .type-title {
    font-size: 14px;
    color: #3e4552;
    font-family: PingFangSC-Regular;
  }
  button {
    width: 58px;
    margin-right: 12px;
    height: 22px;
    border-radius: 4px;
  }
}
</style>
