<!--
 * @Author: Sam
 * @Date: 2020-01-10 09:42:39
 * @LastEditTime: 2020-04-08 21:00:06
 * @Description: 通用库存变更 弹窗
 * @FilePath: \pi-web\src\components\IntegralCenter\AssembleManage\StoreChange.vue
 -->

<template>
  <div>
    <Form ref="formValidate" :model="storeInfor" :label-width="120" :rules="ruleValidate">
      <FormItem label="操作礼品：">
        <section v-if="goods" class="goods-item">
          <img :src="goods.pictureUrl" alt="商品图片" />
          <div>
            <h3 :title="goods.goodsName">
              {{ goods.goodsName }}
            </h3>
            <span
              >{{ goods.goodsType == 1 ? '礼品 ' : '优惠券 ' }}ID：{{ goods.goodsSourceId }}</span
            >
          </div>
        </section>
      </FormItem>
      <FormItem label="库存变更：" prop="addCount">
        <Select v-model="storeInfor.addType" class="select-box" style="width: 80px;">
          <Option :value="1"> 增加 </Option>
          <Option :value="2"> 减少 </Option>
        </Select>
        <InputNumber v-model="storeInfor.addCount" :min="1" :max="999999" /> 件
      </FormItem>
      <FormItem label="备注：">
        <Input v-model="storeInfor.reason" type="textarea" :rows="4" placeholder="请输入变更原因" />
      </FormItem>
      <FormItem class="store-btn-box">
        <Button style="margin-left: 8px;" @click="$emit('cancelStore')"> 取消 </Button>
        <Button type="primary" :loading="btnLoading" @click="confirmStore"> 提交 </Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
  export default {
    name: 'StoreManage',
    props: {
      goods: { type: Object, required: true },
      btnLoading: Boolean,
    },
    data() {
      return {
        storeInfor: {
          id: null,
          addCount: 1,
          addType: 1,
          reason: '',
        },
        ruleValidate: {
          addCount: [
            { required: true, message: '请输入库存变更值', trigger: 'change', type: 'number' },
          ],
        },
        curGoods: this.goods,
      }
    },
    destroyed() {
      this.storeInfor = Object.assign({}, this.storeInfor, {
        id: null,
        addCount: 0,
        addType: 1,
        reason: '',
      })
    },
    mounted() {
      this.$set(this.storeInfor, 'id', this.curGoods.id)
    },
    methods: {
      confirmStore() {
        this.$refs['formValidate'].validate((valid) => {
          if (valid) {
            this.$emit('confirm', this.storeInfor)
          } else {
            this.$Message.error('请检查表单信息')
          }
        })
      },
    },
  }
</script>
<style lang="scss">
  .select-box {
    .ivu-select-selection {
      background: #e1e6eb;
    }
  }
</style>
<style lang="scss" scoped>
  .goods-item {
    display: flex;
    width: 360px;
    height: 96px;
    padding: 24px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(225, 230, 235, 1);
    border-radius: 4px;
    align-items: center;

    img {
      width: 48px;
      height: 48px;
      margin-right: 16px;
    }

    div {
      h3 {
        width: 100%;
        overflow: hidden;
        font-family: PingFangSC-Medium, PingFang SC;
        font-size: 16px;
        font-weight: 500;
        font-weight: bold;
        color: rgba(62, 69, 82, 1);
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      span {
        font-family: PingFangSC-Regular, PingFang SC;
        font-size: 10px;
        font-weight: 400;
        color: rgba(154, 168, 184, 1);
      }
    }
  }

  .store-btn-box {
    padding-top: 24px;
    margin-bottom: 10px;
    text-align: right;
    border-top: solid 1px #e6ebf0;

    button {
      margin-left: 20px;
    }
  }
</style>
