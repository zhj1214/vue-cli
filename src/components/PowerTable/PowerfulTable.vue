<!--
 * @Description: 自扩展列和自定义表头的表格组件
 * @Author: sam.xutao
 * @Date: 2020-03-17 19:33:54
 * @LastEditTime: 2020-04-13 13:40:30
 * @LastEditors: sam.xutao
 -->
<template>
  <div class="power-table">
    <!--  如果支持多选，关闭自定义表头 multipleCol为开启多选，noSpan为关闭跨行-->
    <Table
      :style="{
        minWidth: '200px',
        width: '100%',
        overflowX: 'hidden',
        overflowY: 'auto',
      }"
      :height="maxHeight"
      :columns="columns"
      :data="datas"
      border
      :span-method="!notSpan ? handleSpan : null"
      :show-header="!$_.isEmpty(multipleCol)"
      @on-selection-change="(selection) => $emit('on-selectTable', selection)"
    >
      <div v-if="$_.isEmpty(multipleCol)" slot="header">
        <!-- <SelfTitle :title="defaultCols">
          <span
            v-for="item in columns"
            :key="item.key"
            :style="{ flex: '0 0 ' + item.width + 'px' }"
          >
            <label
              ><i v-if="item.isRequired" style="color: #f05">* </i
              >{{ item.title }}</label
            >
            <Input
              type="text"
              size="small"
              v-if="item.isEdit && item.type == 'text'"
              @on-change="
                (e) => titleChange(e.target.value, item.key, item.onlyNum)
              "
              :maxlength="item.maxlength"
            />
            <InputNumber
              size="small"
              v-if="item.isEdit && item.type == 'number'"
              :value="item.value * 1 || null"
              style="width: 100%"
              @on-change="(value) => titleChange(value, item.key)"
              :max="item.max"
              :min="0"
            />
          </span>
        </SelfTitle> -->
        <SelfTitle :title="defaultCols">
          <span
            v-for="item in columns"
            :key="item.key"
            :style="{ flex: '0 0 ' + item.width + 'px' }"
          >
            <label style="line-height: 1;"
              ><i v-if="item.isRequired" style="color: #f05;">* </i>{{ item.title }}</label
            >
            <div v-if="!item.dMkey">
              <Input
                v-if="item.isEdit && item.type == 'text'"
                type="text"
                size="small"
                :maxlength="item.maxlength"
                @on-change="(e) => titleChange(e.target.value, item.key, item.onlyNum)"
              />
              <InputNumber
                v-if="item.isEdit && item.type == 'number'"
                size="small"
                :readonly="item.isreadonly ? true : false"
                :value="item.value * 1 || null"
                style="width: 100%;"
                :max="item.max"
                :min="0"
                @on-change="(value) => titleChange(value, item.key)"
              />
            </div>
            <div
              v-if="item.dMkey"
              style="
                position: relative;
                left: -60px;
                display: flex;
                min-width: 75%;
                flex-direction: row;
              "
            >
              <!-- 表头一列要展示多个字段key传入数组[ke1,key2] -->
              <InputNumber
                v-if="item.isEdit && item.type == 'number'"
                size="small"
                :readonly="item.isreadonly ? true : false"
                :value="item.value * 1 || null"
                style="position: relative; top: 12px; width: 48%;"
                :max="item.max"
                :min="0"
                @on-change="(value) => titleChange(value, item.dMkey[0])"
              />
              <p v-if="item.isEdit" style="display: inline-block; margin: 0 5px;">+</p>
              <InputNumber
                v-if="item.isEdit && item.type == 'number'"
                size="small"
                :readonly="item.isreadonly ? true : false"
                :value="item.value * 1 || null"
                style="position: relative; top: 12px; width: 48%;"
                :max="item.max"
                :min="0"
                @on-change="(value) => titleChange(value, item.dMkey[1])"
              />
            </div>
          </span>
        </SelfTitle>
      </div>
    </Table>
  </div>
</template>
<script>
  import SelfTitle from './PowerfulTitle'
  export default {
    name: 'PowerfulTable',
    components: { SelfTitle },
    props: {
      addSpec: {
        type: Boolean,
        default: () => false,
      },
      notSpan: Boolean,
      isEllipsis: {
        Boolean,
        default: () => false,
      },
      filterSkus: Array, //过滤显示sku
      selected: { type: Array, default: () => [] }, //勾选回显
      // 规格数据
      propertyList: {
        type: Array,
        default: () => {
          return [
            // {specName:'版本',specId:'0002',specContents:[{specContent:"国行",specContentId:2001},{specContent:'美版',specContentId:234342},{specContent:'日版',specContentId:345345}]},
            // {"specName":"内存","specId":'0003',"specContents":[{"specContent":"128g","specContentId":3001},{"specContent":"256g","specContentId":342342},{"specContent":"64g","specContentId":3423},{"specContent":"512g","specContentId":24234}]},
          ]
        },
      },
      // 除规格数据外的表头数据
      titleCols: {
        type: Array,
        default: () => {
          return []
        },
      },
      skus: {
        type: Array,
        default: () => {
          return []
        },
      },
      multipleCol: Object,
      maxHeight: Number, //表格最大可视高度
    },
    data() {
      return {
        columns: [],
        defaultCols: this.titleCols,
        datas: [],
        list: [],
        count: 0,
        matchName: ['aname', 'bname', 'cname'], // 表投诉匹配key值
        dimension: [],
      }
    },
    watch: {
      // 返回构建好的数据
      datas(nval) {
        this.$emit('getAllRowData', nval)
      },
      propertyList() {
        this.initData()
      },
      // 根据过滤数据重绘表格
      filterSkus() {
        this.initData()
      },
    },
    mounted() {
      this.initData()
    },
    methods: {
      initData() {
        this.columns = []
        this.dimension = []
        // 1. 根据度量值构造表格行数，n*m
        let iList = this.propertyList.slice()
        // 根据维度数据构建表头
        iList.map((item, index) => {
          this.dimension.push(item.specContents.length)
          this.columns.push({ title: item.specName, key: this.matchName[index] })
        })
        this.list = iList
        // 根据维度和度量计算表格总条数，用于跨行计算
        this.counts = this.dimension.reduce((total, item) => total * item, 1)
        // 构建表头
        this.columns = this.columns.concat(this.defaultCols)
        // 如果有多选,则配置表头
        if (this.multipleCol) {
          this.columns.unshift(this.multipleCol)
        }
        // 2.根据维度和度量构建表格
        this.initTable(iList, this.skus)
      },
      // 表头可编辑状态下，将编辑值和对应表头返回
      titleChange(val, key, onlyNum) {
        let iList = this.datas.slice()
        if (onlyNum) {
          let actVal = val.match(/[0-9]+/g)
          val = actVal ? actVal.join('') : ''
        }
        // console.time("title change")
        for (var i = 0, len = iList.length; i < len; i++) {
          iList[i][key] = val
        }
        this.$emit('changeTitleValue', key, val)
        this.datas = iList
      },
      // 根据表格渲染定义跨行规则
      handleSpan(row) {
        //{ row, column, rowIndex, columnIndex }
        const { columnIndex } = row
        if (this.dimension[columnIndex]) {
          if (columnIndex == 0) {
            // 根据列号获取跨行数据
            let data1 = this.divideDimension(columnIndex)
            let number1 = data1.number,
              divide1 = data1.divide
            // 跨行渲染条件封装成字符串后通过eval执行
            let cond1 = this.evalDimension(number1, 'divide1')
            // console.log(columnIndex,'divide:',divide1)
            if (eval(cond1) && columnIndex === 0) {
              return [divide1, 1]
            } else if (columnIndex === 0) {
              return [0, 0]
            }
          } else if (columnIndex == 1) {
            let data2 = this.divideDimension(columnIndex)
            let number2 = data2.number,
              divide2 = data2.divide
            let cond2 = this.evalDimension(number2, 'divide2')
            // console.log(columnIndex,'divide:',divide2)
            if (eval(cond2) && columnIndex === 1) {
              return [divide2, 1]
            } else if (columnIndex === 1) {
              return [0, 0]
            }
          }
        }
      },
      // 根据维度计算划分值
      divideDimension(col) {
        var number = this.dimension.reduce((total, num, index) => {
          if (index <= col) {
            return total * num
          } else {
            return total
          }
        })
        return { number, divide: this.counts / number }
      },
      // 根据维度占比和划分值构建条件数据
      evalDimension(number, divideName) {
        let cond = ''
        for (var i = 0; i < number; i++) {
          cond += `row.rowIndex === ${divideName} *${i},`
        }
        // console.log(cond.split(',').filter(item=>item).join("||"))
        return cond
          .split(',')
          .filter((item) => item)
          .join('||')
      },
      // 根据纬度值封装基本表格数据，计算完成之后拼接 sku 数据成为带有 sku和具体字段信息的表格数据 TODO:需提取递归构造方法
      initTable(list, skus) {
        var curList = []
        for (var i = 0; i < list.length; i++) {
          // 构建id值用于匹配具体的 sku 项
          var aItem = { ...list[i], aname: list[i].specName, id: [] }
          if (list.length == 1) {
            list[i].specContents.map((pitem) => {
              aItem = {
                ...aItem,
                aname: pitem.specContent,
                id: [pitem.specContentId],
              }
              curList.push(aItem)
            })
          } else {
            var index = i
            list[i].specContents.map((pitem) => {
              aItem = {
                ...aItem,
                aname: pitem.specContent,
                id: [].concat(pitem.specContentId),
              }
              for (var i = index + 1; i < list.length; i++) {
                aItem = { ...aItem, ...list[i], bname: list[i].specName }
                if (list.length == 2) {
                  var mIds = aItem.id // 用于记录前两级id值
                  list[i].specContents.map((pitem) => {
                    aItem = {
                      ...aItem,
                      bname: pitem.specContent,
                      id: mIds.concat(pitem.specContentId),
                    }
                    curList.push(aItem)
                  })
                } else {
                  var flag = i
                  var tIds = aItem.id // 用于记录前两级id值
                  list[i].specContents.map((pitem) => {
                    aItem = {
                      ...aItem,
                      bname: pitem.specContent,
                      id: tIds.concat(pitem.specContentId),
                    }
                    for (var i = flag + 1; i < list.length; i++) {
                      aItem = { ...aItem, ...list[i], cname: list[i].specName }
                      if (list.length == 3) {
                        let curIds = aItem.id // 用于记录前三级id值
                        list[i].specContents.map((pitem) => {
                          aItem = {
                            ...aItem,
                            cname: pitem.specContent,
                            id: curIds.concat(pitem.specContentId),
                          }
                          curList.push(aItem)
                        })
                      }
                    }
                  })
                }
              }
            })
            // this.loopTable(aItem,i,list,curList)
          }
        }
        // curList = curList.map((item) => {
        //   let cId = item.id.join(","),
        //     curItem = JSON.parse(JSON.stringify(item));
        //   let cSku = skus.filter(
        //     (sitem) =>
        //       sitem.specContentIds && sitem.specContentIds.join(",") === cId
        //   );
        //   if (cSku && cSku.length) {
        //     curItem = { ...item, ...cSku[0] };
        //     if (curItem.skuId) {
        //       curItem = { ...curItem, skuId: curItem.skuId };
        //     }
        //   }
        //   // 如果是多选，且有选中的，则匹配显示
        //   if (
        //     this.selected.includes(curItem.skuId) ||
        //     this.selected.includes(curItem.skuId * 1)
        //   ) {
        //     curItem._checked = true;
        //   }
        //   return curItem;
        // });
        // 根据前面封装好的数据标记的id数组，去sku 里匹配具体的条目
        let arr = []
        curList.forEach((item) => {
          let cId = item.id.sort().join(','),
            curItem = JSON.parse(JSON.stringify(item))
          let cSku = skus.filter(
            (sitem) => sitem.specContentIds && sitem.specContentIds.sort().join(',') === cId
          )

          if (cSku && cSku.length) {
            curItem = { ...item, ...cSku[0] }
            if (curItem.skuId) {
              curItem = { ...curItem, skuId: curItem.skuId }
            }
            if (!this.addSpec) {
              // 如果是多选，且有选中的，则匹配显示
              if (
                this.selected.includes(curItem.skuId) ||
                this.selected.includes(curItem.skuId * 1)
              ) {
                curItem._checked = true
              }
              arr.push(curItem)
            }
          }
          // 如果是多选，且有选中的，则匹配显示
          if (this.addSpec) {
            if (
              this.selected.includes(curItem.skuId) ||
              this.selected.includes(curItem.skuId * 1)
            ) {
              curItem._checked = true
            }
            arr.push(curItem)
          }
        })
        curList = arr
        // filterSkus为要显示的条目，用于过滤curList
        if (this.filterSkus && this.filterSkus.length) {
          let filters = []
          filters = this.filterSkus.map((item) => item.skuId * 1)
          this.datas = curList.filter((item) => {
            if (filters.includes(item.skuId * 1)) {
              return item
            }
          })
        } else {
          this.datas = curList
        }
      },
      // TODO:递归构造表格数据方法，待完善
      loopTable(prevItem, index, list, curList) {
        var flag = index
        list[index].property.map((pitem) => {
          prevItem = { ...prevItem, aname: pitem.name }
          for (var i = flag + 1; i < list.length; i++) {
            prevItem = { ...prevItem, ...list[i], bname: list[i].name }
            if (list.length == flag + 2) {
              list[i].property.map((pitem) => {
                prevItem = { ...prevItem, cname: pitem.name }
                curList.push(prevItem)
              })
            } else {
              this.loopTable(prevItem, i, list, curList)
            }
          }
        })
      },
    },
  }
</script>
<style lang="scss">
  .power-table {
    width: 100%;

    .ivu-table-cell {
      overflow: inherit !important;
    }
  }
</style>
