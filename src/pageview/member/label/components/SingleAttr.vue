<template>
  <li class="single-attr">
    <span v-if="!isAttr" class="index">{{ rIndex + 1 }}</span>
    <!-- 行为规则 -->
    <i-select
      v-model="rule.eventType"
      label-in-value
      class="w150 a1"
      filterable
      @on-change="onChangeAttr"
    >
      <OptionGroup v-for="ops in filterAttrsList" :key="ops.code" :label="ops.value">
        <Option v-for="op in ops.children || []" :key="op.code" :value="op.code">
          {{ op.value }}
        </Option>
      </OptionGroup>
    </i-select>

    <!-- 逻辑操作符 -->
    <i-select
      v-if="ob"
      v-model="rule.operator"
      label-in-value
      class="w100 ml-10 a2"
      @on-change="onChangeLogic"
    >
      <Option v-for="op in ob.supportOperators || []" :key="op.code" :value="op.code">
        {{ op.value }}
      </Option>
    </i-select>

    <!-- 渲染组件 elementType=Input format=string-->
    <i-input
      v-if="ob.elementType === 'Input' && ob.format === 'string'"
      v-model="rule.value"
      placeholder="请输入"
      class="w100 ml-5 a3"
      :maxlength="20"
    />

    <!-- 渲染组件 elementType=Input format=int / float 且operator!==between-->
    <InputNumber
      v-if="
        rule.operator !== 'between' &&
        ob.elementType === 'Input' &&
        (ob.format === 'float' || ob.format === 'int')
      "
      v-model="rule.numberValue"
      class="w80 ml-5 a4"
      placeholder="值大于0"
      :precision="ob.format === 'float' ? undefined : 0"
      :min="0"
      :max="99999999"
      :maxlength="20"
    />

    <!-- 渲染组件 elementType=Select -->
    <i-select
      v-if="ob.elementType === 'Select' && (ob.supportValues || sceneList.length)"
      v-model="rule.value"
      class="ml-10 w150 a5 button-gap"
      label-in-value
      @on-change="onSelectLast"
    >
      <Option v-for="item in sceneList" :key="item.code" :value="item.code">
        {{ item.value }}
      </Option>
    </i-select>
    <span class="unit-style">{{ ob.unit }}</span>

    <!-- 渲染组件 elementType=DatePicker, format  between 是daterange，其他是date-->
    <DatePicker
      v-if="ob.elementType === 'DatePicker' && rule.operator !== 'between'"
      class="ml-5 w180 a6"
      :value="rule.value"
      placeholder="请选择日期"
      :type="rule.operator === 'between' ? 'daterange' : 'date'"
      :editable="false"
      :format="ob.format"
      @on-change="onDateSelect"
    />

    <!-- 渲染组件 区间时间域-->
    <DatePicker
      v-if="ob.elementType === 'DatePicker' && rule.operator === 'between'"
      class="ml-5 w200 a7"
      :value="rule.betweenValue"
      placeholder="请选择日期"
      type="daterange"
      :editable="false"
      :format="ob.format"
      @on-change="onDateSelect"
    />

    <!-- 渲染组件 当是区间的是 多加一个input 用至连接 -->
    <div
      v-if="
        rule.operator === 'between' &&
        ob.elementType === 'Input' &&
        (ob.format === 'float' || ob.format === 'int')
      "
      style="display: inline-block;"
    >
      <InputNumber
        v-model.number="rule.valueA"
        class="w80 ml-5 a8"
        :precision="ob.format === 'float' ? undefined : 0"
        :min="0"
        :max="99999999"
        :maxlength="20"
      />

      <span class="ml-5">至</span>
      <InputNumber
        v-model.number="rule.valueB"
        class="w80 ml-5 a9"
        :precision="ob.format === 'float' ? undefined : 0"
        :min="0"
        :max="99999999"
        :maxlength="20"
      />
    </div>

    <!-- 渲染组件 当是区间，且是select 时候，用至连接 多加一个select, 场景是区间月份-->
    <div
      v-if="rule.operator === 'between' && ob.elementType === 'Select'"
      style="display: inline-block;"
    >
      <span class="ml-5">至</span>
      <i-select
        v-if="ob.elementType === 'Select' && ob.supportValues"
        v-model="rule.valueC"
        class="ml-10 w150 a10"
        filterable
      >
        <Option v-for="item in sceneList" :key="item.code" :value="item.code">
          {{ item.value }}
        </Option>
      </i-select>
    </div>

    <!-- 渲染组件 产品类目 elementType=Select+Input, format-->
    <Cascader
      v-if="ob.elementType === 'Select+Input' && rule.eventType === 'goods_category'"
      v-model="rule.goods"
      style="display: inline-block;"
      class="ml-5 w200 a11"
      :data="goodsCategoryList"
      label-in-value
      @on-change="onChangeAddress"
    />

    <!-- 送货地址 -->
    <Cascader
      v-if="ob.elementType === 'Address' && ob.format === 'address'"
      v-model="rule.address"
      :placeholder="'请选择省 / 市' + (rule.eventType === 'province_type' ? '' : ' / 区')"
      :data="provinceCity"
      style="display: inline-block;"
      class="ml-5 w200 a12"
      @on-change="onChangeAddress"
    />
    <slot name="delete" />
  </li>
</template>

<script>
  import { log } from '@/utils/tools'
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: 'SingleAttr',
    props: {
      rule: Object,
      rIndex: Number,
      // true 用户属性，其他是点击小图标出现
      isAttr: Boolean,
      filterAttrsList: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        levelList: [],
        goodsCategoryList: [], //商品品类
        ob: {},
        orgId: localStorage.getItem('orgId'),

        orgList: [],
      }
    },
    watch: {
      ob(updateValue) {
        log('watch, ob', updateValue)
      },
    },
    computed: {
      ...mapGetters(['cascadeCitys']),
      // select根据不同的场景返回列表
      sceneList() {
        let { eventType } = this.rule
        // 会员等级下覆盖supportValues
        if (eventType === 'vip_level') {
          return this.levelList
        }

        // 登录组织、最近登录组织筛选
        let loginOrg =
          eventType === 'last_login_org' ||
          eventType === 'login_org' ||
          eventType === 'integral_belong_org'
        if (loginOrg) {
          return this.orgList
        }

        return this.ob.supportValues || []
      },
      // 省市区
      provinceCity() {
        const cascadeCitys = JSON.parse(JSON.stringify(this.cascadeCitys))
        const data = []
        for (let province of cascadeCitys) {
          for (let city of province.children) {
            delete city.children
          }
          data.push(province)
        }
        if (this.rule.eventType === 'province_city') return data //省市
        return this.cascadeCitys //省市区
      },
    },
    mounted() {
      this.$nextTick(() => {
        // 拉取默认值
        this.getAttrsChild(this.rule.eventType)
      })
      log('---IN SingleAtt')
      log('ob', this.ob)
      log('this, rule', this.rule)
    },
    methods: {
      ...mapActions(['getMemberLevelListSelect']),

      onDateSelect(value) {
        log('onDateSelect value', value)
        let isBetween = this.rule.operator === 'between'
        if (isBetween) {
          let [valueA, valueB] = value
          this.$set(this.rule, 'valueA', valueA)
          this.$set(this.rule, 'valueB', valueB)
          log('this.rule', this.rule)
        } else {
          this.$set(this.rule, 'value', value)
        }
      },
      async onChangeAttr(labelValue) {
        log('onChangeAttr, labelValue', labelValue)
        let { value, label } = labelValue
        this.$set(this.rule, 'eventTypeName', label.replace(/[(\n)|(\t)]/g, ''))
        this.getAttrsChild(value)

        // 登录组织、最近登录组织筛选
        let loginOrg = value === 'last_login_org' || value === 'login_org'
        // 拉取会员等级
        if (value === 'vip_level') {
          const levelList = (await this.getMemberLevelListSelect(this.orgId)).map((item) => ({
            value: item.label,
            code: item.value,
          }))
          this.levelList = levelList
          // 会员等级设置第一项
          if (levelList.length) {
            const firstItem = levelList[0]
            this.$set(this.rule, 'value', firstItem.code)
          }
        } else if (loginOrg) {
          this.getOrgList()
        } else if (value === 'goods_category') {
          this.getCategoryList()
        } else if (value === 'integral_belong_org') {
          this.getPointOrg()
        }
      },
      getPointOrg() {
        let server = '/user-server'
        let url = server + '/internal/organization/getOrganizationPageListByType'
        let data = {
          type: 'Market',
        }

        this.$ajaxGet(url, data)
          .then((res) => {
            if (res && res.code === 10000) {
              let { list } = res.data
              log('in getPointOrg', res.data)
              this.orgList = list.map((i) => {
                return {
                  code: i.orgId,
                  value: i.orgName,
                }
              })
              log('this.orgList', this.orgList)
            }
          })
          .catch((err) => {
            log(err)
          })
      },
      getOrgList() {
        let server = '/user-server'
        let url = server + '/platform/department/pageDepartment'
        let data = {
          type: '5',
        }

        this.$ajaxPost(url, data)
          .then((res) => {
            if (res && res.code === 10000) {
              let { list } = res.data
              this.orgList = list.map((i) => {
                return {
                  code: i.orgId,
                  value: i.name,
                }
              })
            }
          })
          .catch((err) => {
            log(err)
          })
      },
      // 拉取商品列表
      getCategoryList(name = '') {
        this.$ajaxGet('/goods-server/api/remote/goods/getCategoryByName', {
          orgId: this.orgId,
          name,
        }).then((res) => {
          if (res && res.code === 10000) {
            const data = res.data || []
            this.goodsCategoryList = data
            const setValue = []
            const setLabel = []
            if (data && data[0]) {
              setValue.push(data[0].value)
              setLabel.push(data[0].label)
              if (data[0].children && data[0].children[0]) {
                setValue.push(data[0].children[0].value)
                setLabel.push(data[0].children[0].label)
                if (data[0].children[0].children && data[0].children[0].children[0]) {
                  setValue.push(data[0].children[0].children[0].value)
                  setLabel.push(data[0].children[0].children[0].label)
                  if (
                    data[0].children[0].children[0].children &&
                    data[0].children[0].children[0].children[0]
                  ) {
                    setValue.push(data[0].children[0].children[0].children[0].value)
                    setLabel.push(data[0].children[0].children[0].children[0].label)
                  }
                }
              }
            }

            this.$set(this.rule, 'goods', setValue)
            this.$set(this.rule, 'value', setValue.join(','))
            this.$set(this.rule, 'goodsName', setLabel.join(','))
          }
        })
      },
      // 地址+商品
      onChangeAddress(address, goodsLabel) {
        if (goodsLabel) {
          const goodsName = goodsLabel.map((item) => item.label)
          this.$set(this.rule, 'goodsName', goodsName.join(','))
        }
        this.$set(this.rule, 'value', address.join(','))
      },

      onChangeLogic(labelObj) {
        const { label, value } = JSON.parse(JSON.stringify(labelObj || {}))
        this.$set(this.rule, 'operatorName', label.replace(/[(\n)|(\t)]/g, ''))
        if (value === 'between') {
          this.$set(this.rule, 'value', '')
          if (this.ob.elementType !== 'Select') {
            this.$set(this.rule, 'valueA', 1)
            this.$set(this.rule, 'valueB', 1)
          } else {
            delete this.rule.valueA
            delete this.rule.valueB
          }
        } else {
          this.$set(this.rule, 'valueA', 0)
          this.$set(this.rule, 'valueB', 0)
        }
      },
      // 最后一个框是select
      onSelectLast(valueLabel) {
        log('onSelectLast', valueLabel)
        const { label } = JSON.parse(JSON.stringify(valueLabel || {}))
        this.$set(this.rule, 'goodsName', label.replace(/[(\n)|(\t)]/g, ''))
      },
      // 获取详细属性值
      getAttrsChild(code) {
        log('getAttrsChild, code', code)
        if (!code) return
        this.$ajaxGet('/label-server/label/attrFieldDetail', { code }).then((res) => {
          if (res && res.code === 10000) {
            this.ob = res.data || {}
            // 设置最后一个select的默认值
            const ob = res.data || {}
            if (ob.elementType === 'Select' && ob.supportValues && ob.supportValues) {
              const valueOneItem = ob.supportValues[0]
              this.$set(this.rule, 'value', valueOneItem.code)
              this.$set(this.rule, 'goodsName', valueOneItem.value)
            }
            // 设置最后一个string input的默认值
            else if (ob.elementType === 'Input' && ob.format === 'string') {
              this.$set(this.rule, 'value', '')
              this.$set(this.rule, 'goodsName', '')
            } else if (ob.elementType === 'DatePicker') {
              switch (ob.format) {
                // 月-日
                case 'MM-dd':
                  this.$set(this.rule, 'value', this.$format(new Date(), 'MM-DD'))
                  break
                // 年月日
                case 'yyyy-MM-dd':
                  this.$set(this.rule, 'value', this.$format(new Date(), 'YYYY-MM-DD'))
                  break
                case 'yyyy-MM-dd HH:mm:ss':
                  this.$set(this.rule, 'value', this.$format(new Date()))
                  break
                default:
              }
            } // 特殊处理：送货地址-省市区
            else if (ob.code === 'delivery_address_province_city') {
              this.$set(this.rule, 'value', '北京市,北京市,东城区')
              this.$set(this.rule, 'address', ['北京市', '北京市', '东城区'])
            } // 特殊处理：送货地址-省市
            else if (ob.code === 'province_city') {
              this.$set(this.rule, 'value', '北京市,北京市')
              this.$set(this.rule, 'address', ['北京市', '北京市'])
            } else if (ob.code !== 'goods_category') {
              this.$set(this.rule, 'value', '')
              this.$set(this.rule, 'address', [])
            } else {
              this.$set(this.rule, 'goodsName', '')
            }

            // 设置最后一个inputNumber的默认值
            if (ob.elementType === 'Input' && (ob.format === 'int' || ob.format === 'float')) {
              this.$set(this.rule, 'numberValue', 1)
            } else this.$set(this.rule, 'numberValue', 0)

            // 设置第一个逻辑操作符
            if (ob.supportOperators && ob.supportOperators.length) {
              const logicOne = ob.supportOperators[0]
              log('logicOne', logicOne)
              this.$set(this.rule, 'operator', logicOne.code)
              // this.$set(this.rule, "operator", this.rule.operator);
              this.$set(this.rule, 'operatorName', logicOne.value)
            }
          }
        })
      },
    },
  }
</script>

<style scoped lang="scss">
  .index {
    display: inline-block;
    width: 24px;
    height: 24px;
    margin-right: 8px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    background: #756cea;
    border-radius: 8px;
  }

  .unit-style {
    margin-left: 8px;
    line-height: 30px;
  }
</style>
