<!--
  *@name ChoosedGoods    选择礼品或优惠券
  *@author Sam
  *@date 2019/12/11
  *@desc  选择积分礼品或优惠券
  *@param goods  选中的礼品或优惠券
  *@param goodsType 类型：礼品或优惠券，礼品-1，优惠券-2
  *
  *@function getGoods  present  选择礼品或优惠券方法回调
-->
<template>
  <div style="display: flex; align-items: center;">
    <div v-if="!$_.isEmpty(curGoods)" style="display: flex; align-items: center;">
      <div v-if="goodsType == 1" class="show_info">
        <div v-if="isMall" class="goods-box">
          <div>
            <Row style="display: flex; align-items: center;">
              <i-col span="6" style="display: flex;">
                <img
                  style="width: 58px; height: 58px;"
                  :src="curGoods.presentPictureUrl || curGoods.mainImgUrl || curGoods.imgUrl"
                />
              </i-col>
              <i-col class="goods-header">
                <h3>{{ curGoods.presentName || curGoods.name }}</h3>
                <p><label>商品货号：</label>{{ curGoods.presentIdentify || curGoods.id }}</p>
              </i-col>
            </Row>
            <p
              ><label>商品类目：</label
              >{{
                curGoods.goodsCategoryCompleteName ||
                curGoods.categoryCompleteName ||
                curGoods.goodsCategoryText ||
                '-'
              }}</p
            >
            <p><label>商品品牌：</label>{{ curGoods.goodsBrandText || '-' }}</p>
            <!-- <p><label>开票税率：</label>{{curGoods.goodsTaxText||'-'}}</p> -->
          </div>
          <Poptip
            confirm
            width="220"
            title="是否确认删除该商品？"
            @on-ok="
              () => {
                this.curGoods = {}
                this.$emit('removeGoods')
              }
            "
            @on-cancel="() => console.log('cancel')"
          >
            <a v-if="!isEdit"><Icon type="ios-trash" /></a>
          </Poptip>
        </div>
        <div v-else>
          <div class="show_top">
            <!--222-->
            <p>{{ curGoods }}</p>
            <span style="width: 20%;">
              <img
                style="width: 48px; height: 48px;"
                :src="curGoods.presentPictureUrl || curGoods.imgUrl"
                alt
              />
            </span>
            <div style="width: 80%;">
              <Row>
                <i-col span="20" style="font-size: 16px; font-weight: bold; text-align: left;">
                  {{ curGoods.presentName || curGoods.name }}
                </i-col>
              </Row>
              <Row v-if="goodsType == '1' && curGoods.worth">
                <i-col span="20" style="font-size: 12px; color: #9aa8b8; text-align: left;">
                  礼品价格
                </i-col>
              </Row>
              <Row v-else-if="goodsType == '2'">
                <i-col span="20" style="font-size: 12px; color: #9aa8b8; text-align: left;">
                  优惠内容
                </i-col>
              </Row>
              <Row v-if="goodsType == '2' && curGoods.worth">
                <i-col span="10" style="font-size: 24px; color: #3e4552; text-align: left;">
                  {{ curGoods.worth }}
                </i-col>
              </Row>
              <Row v-else-if="curGoods.worth">
                <i-col span="10" style="font-size: 24px; color: #3e4552; text-align: left;">
                  {{ '￥' + curGoods.worth }}
                </i-col>
              </Row>
              <Row>
                <i-col span="10" style="font-size: 12px; color: #9aa8b8; text-align: left;">
                  {{ 'ID：' + (curGoods.presentIdentify || curGoods.id) }}
                </i-col>
                <i-col
                  v-if="curGoods.availableNum"
                  span="12"
                  style="font-size: 12px; color: #9aa8b8; text-align: left;"
                >
                  {{ '库存：' + curGoods.availableNum }}
                </i-col>
              </Row>
              <Row v-if="goodsType == '1'">
                <i-col span="20" style="font-size: 12px; color: #9aa8b8; text-align: left;">
                  {{ '日期：' + $format(curGoods.createTime) }}
                </i-col>
              </Row>
              <Row v-if="goodsType == '2' && curGoods.createTime">
                <i-col span="20" style="font-size: 12px; color: #9aa8b8; text-align: left;">
                  {{
                    '日期：' +
                    $format(curGoods.createTime[0]) +
                    '-' +
                    $format(curGoods.createTime[1])
                  }}
                </i-col>
              </Row>
            </div>
          </div>
          <div v-if="!isEdit" class="show_bottom" @click="modifyType"> 变更{{ title }} </div>
        </div>
      </div>
      <div v-else>
        <CouponList
          :coupon-list="[curGoods]"
          :spin-show="false"
          :checked-ids="[]"
          origin="activity"
        >
          <!-- <template #editbottom="{item}">
				<div @click="modifyType" class="coup_tip">
				<a href="javascirpt:void(0);">变更优惠券</a>
				</div>
			</template> -->
        </CouponList>
      </div>
      <a v-if="isMall && !isEdit" class="ml-10" @click="modifyType"
        ><i class="icon iconfont iconAdd" style="position: relative; top: -2px;" />变更{{ title }}</a
      >
    </div>
    <div v-else>
      <a class="linBlock" @click="modifyType">
        <i class="icon iconfont iconAdd" style="position: relative; top: -2px;" />{{
          goodsType == 1 ? '添加' + title : '添加优惠券'
        }}
      </a>
    </div>
    <Modal
      v-model="modalVisible"
      class-name="modal-box"
      :scrollable="true"
      :closable="false"
      :mask-closable="false"
      :width="goodsType == 1 ? '57%' : '77%'"
      :footer-hide="true"
      :title="`选择${title}`"
    >
      <div v-if="goodsType == 1 && modalVisible">
        <!-- 商城商品 -->
        <ChooseMallGoods
          v-if="isMall"
          :present="curGoods"
          :select-skus="curSpecies"
          @cancelGoods="cancelPresent"
          @confirmGoods="confirmPresent"
        />
        <ChoosePresent
          v-else
          :present="curGoods"
          :url="presentUrl"
          :i-cols="presentCols"
          @cancelPresent="cancelPresent"
          @confirmPresent="confirmPresent"
        />
      </div>
      <ChooseCoupon
        v-else
        :present="curGoods"
        @cancelCoupon="cancelPresent"
        @confirmCoupon="confirmPresent"
      />
    </Modal>
  </div>
</template>
<script>
  import CouponList from '@/components/Coupon/ViewCouponList'
  import ChoosePresent from './ChoosePresent'
  import ChooseCoupon from './ChooseCoupon'
  import ChooseMallGoods from './ChooseMallGoods'

  // import { log } from "@/utils/tools";

  export default {
    name: 'GoodsPanel',
    components: {
      ChoosePresent,
      ChooseCoupon,
      CouponList,
      ChooseMallGoods,
    },
    props: {
      goods: { type: [Object], required: true },
      isMall: Boolean, // 是否新增商城商品
      mallSpecies: { type: Array, default: () => [] }, // 商城商品对应规格
      goodsType: { type: [String, Number], required: true },
      title: { type: String, default: '拼团商品' },
      presentUrl: { type: String, default: '/mall-server/mall/present/list' }, //如果要拉取其他商品列表，可定义 api 接口
      presentCols: { type: Array, default: () => [] }, // 可自定义表格 title信息
      isEdit: [Number, String], // 是否为编辑，编辑不能更换商品类型和变更商品
    },
    data() {
      return {
        curGoods: this.goods,
        modalVisible: false,
        curSpecies: this.mallSpecies,
      }
    },
    watch: {
      goods(nval) {
        this.curGoods = nval
      },
    },
    created() {
      // this.showCoupon()
    },
    methods: {
      modifyType() {
        this.modalVisible = true
      },
      cancelPresent() {
        this.modalVisible = false
      },
      confirmPresent(present, species) {
        this.modalVisible = false
        this.curGoods = present
        this.curSpecies = species || [] // 如果是商城商品，会有规格值
        console.log('curGoods', this.curGoods)
        console.log('curSpecies', this.curSpecies)
        this.$emit('getGoods', present, species)
      },
      showCoupon() {
        this.modalVisible = true
      },
    },
  }
</script>
<style lang="scss">
  // .modal-box{z-index: 99999 !important;}
  .show_info {
    display: flex;
    width: 358px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(225, 230, 235, 1);
    border-radius: 4px;
    flex-direction: column;
    justify-content: flex-start;

    .show_top {
      display: flex;
      width: 100%;
      height: 100%;
      padding: 20px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(225, 230, 235, 1);
      border-radius: 4px;
      justify-content: space-around;
    }

    .show_bottom {
      line-height: 40px;
      color: #3d71ff;
      text-align: center;
      cursor: pointer;
      background: rgba(247, 249, 250, 1);
      border: 1px solid rgba(225, 230, 235, 1);
      border-radius: 0 0 2px 2px;
    }

    .goods-box {
      position: relative;
      padding: 14px 16px;

      .goods-header {
        h3 {
          font-family: PingFangSC-Medium, PingFang SC;
          font-size: 16px;
          font-weight: 600;
          color: rgba(62, 69, 82, 1);
        }
      }

      .ivu-poptip-confirm {
        position: absolute;
        top: 10px;
        right: 10px;

        i {
          font-size: 20px;
        }
      }

      p {
        font-family: PingFangSC-Regular, PingFang SC;
        font-size: 12px;
        font-weight: 400;
        color: rgba(62, 69, 82, 1);
      }

      p label {
        font-family: PingFangSC-Regular, PingFang SC;
        font-size: 10px;
        font-weight: 400;
        color: rgba(154, 168, 184, 1);
      }
    }
  }
</style>

<style lang="scss">
  .btn-box {
    height: 60px;
    margin-top: 10px;
    line-height: 60px;
    text-align: right;
    border-top: 1px solid #e8eaec;

    button {
      margin-left: 20px;
    }
  }
</style>
