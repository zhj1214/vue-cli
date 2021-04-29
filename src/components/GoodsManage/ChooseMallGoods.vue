<!--
 * @Description: 选择商城商品，分步
 * @Author: sam.xutao
 * @Date: 2020-03-26 09:50:05
 * @LastEditTime: 2020-04-13 13:31:48
 * @LastEditors: sam.xutao
 -->
<template>
  <div>
    <section v-if="isNext">
      <Row>
        <i-col span="6">
          <h3>选择规格</h3>
        </i-col>
        <i-col span="4" offset="10" style="text-align: right;">
          <a @click="resetGoods">重选商品</a>
        </i-col>
      </Row>
      <PowerTable
        :property-list="infor.specs"
        :skus="infor.skus"
        :max-height="300"
        :not-span="true"
        :title-cols="titleCol"
        style="margin-top: 10px;"
        :multiple-col="{ type: 'selection', width: 40, align: 'center' }"
        :selected="selectSpecs.map((item) => item.skuId)"
        @on-selectTable="selectChange"
      />
      <footer style="margin-top: 10px; text-align: right;">
        <Button class="mr-10" @click="cancelGoods"> 取消 </Button>
        <Button type="primary" :disabled="!selectSpecs.length" @click="confirmGoods"> 提交 </Button>
      </footer>
    </section>
    <section v-else>
      <Row style="margin-bottom: 24px;">
        <i-col span="16">
          <Cascader
            v-model="source"
            :data="departmentList"
            :disabled="departmentList.length === 0"
            trigger="hover"
            :change-on-select="true"
            :load-data="loadTreeData"
            :filterable="true"
            placeholder="请选择所属组织"
            style="display: inline-block; width: 140px; margin-right: 20px; text-align: left;"
            @on-change="organizChange"
          />
          <Select
            v-model="search.goodsBrandId"
            style="width: 140px;"
            :filterable="true"
            placeholder="请选择商品品牌"
            class="mr-10"
            clearable
            transfer
            @on-change="changeSearch"
          >
            <Option v-for="item in allBrandList" :key="item.id" :value="item.id">
              {{ item.name }}
            </Option>
          </Select>
          <Cascader
            v-model="search.goodsCategoryId"
            :data="categoryList"
            :change-on-select="true"
            :filterable="true"
            transfer
            style="display: inline-block; width: 140px;"
            placeholder="请选择商品类目"
            class="mr-10"
            @on-change="categorySearch"
          />
        </i-col>
        <i-col span="7" offset="1">
          <Input
            v-model="search.search"
            type="text"
            search
            placeholder="请输入商品名称、货号、条码"
            @on-change="changeSearch"
          />
        </i-col>
      </Row>
      <Table
        ref="currentRowTable"
        highlight-row
        :loading="loading"
        :columns="cols"
        :data="list"
        no-data-text="暂无数据"
        @on-row-click="handleSelect"
      />
      <Page
        :total="total"
        :current="search.page"
        :page-size="search.pageSize"
        show-elevator
        show-sizer
        size="small"
        show-total
        :page-size-opts="[5, 10, 20, 30, 40]"
        style="margin: 10px; text-align: right;"
        @on-change="onPageChange"
        @on-page-size-change="onPageSize"
      />
      <footer
        style="
          padding-top: 20px;
          margin-top: 24px;
          text-align: right;
          border-top: solid 1px #e6ebf0;
        "
      >
        <Button class="mr-10" @click="cancelGoods"> 取消 </Button>
        <Button
          v-if="isRequiredSku"
          type="primary"
          :disabled="$_.isEmpty(curGoods)"
          @click="nextStep"
        >
          下一步
        </Button>
        <Button
          v-if="!isRequiredSku"
          type="primary"
          :disabled="$_.isEmpty(curGoods)"
          @click="submitHandle"
        >
          提交
        </Button>
      </footer>
    </section>
  </div>
</template>
<script>
  import TableFlexInfo from '../FlexInfor'
  import PowerTable from '@/components/PowerTable/PowerfulTable' // 维度表格
  import { mapActions } from 'vuex'
  import DepartmentMixins from '@/pageview/onlinemall/components/departmentMixins'
  export default {
    name: 'ChooseMallgoods',
    components: { PowerTable },
    mixins: [DepartmentMixins],
    props: {
      present: Object,
      selectSkus: Array,
      isRequiredSku: {
        type: Boolean,
        required: false,
        default: true,
      },
    },
    data() {
      return {
        categoryList: [],
        source: [],
        cols: [
          {
            title: '状态',
            align: 'center',
            width: '80px',
            render: (h, params) => {
              let curId = this.curGoods ? this.curGoods['id'] : ''
              let parId = params.row['id']
              return h(
                'Radio',
                {
                  props: {
                    value: curId === parId,
                  },
                },
                ''
              )
            },
          },
          {
            title: '商品信息',
            key: 'info',
            render: (h, params) => {
              return h(TableFlexInfo, {
                props: {
                  name: params.row.name,
                  id: params.row.id,
                  url: params.row.imgUrl || this.$defaultImg,
                },
              })
            },
          },
          { title: '商品类目', key: 'categoryCompleteName' },
          {
            title: '商品品牌',
            key: 'goodsBrandText',
            render: (h, params) => {
              return (
                <div>
                  {params.row.goodsBrandText}（{params.row.brandId}）
                </div>
              )
            },
          },
          {
            title: '所属组织',
            width: 200,
            key: 'orgCompleteName',
            render: (h, params) => {
              const orgCompleteName = params.row.orgCompleteName
              return (
                <div>
                  <Tooltip placement='top' max-width='300'>
                    <div slot='content' style='height: auto;' class='toolContent'>
                      <p style='text-align:center'>{params.row.orgName}</p>
                      <p style='font-size:12px;r'>{orgCompleteName || '--'}</p>
                    </div>
                    <div>
                      <p style='text-align:left;font-size:15px;cursor: pointer;display: -webkit-box;-webkit-line-clamp: 1;-webkit-box-orient: vertical;text-overflow: ellipsis;overflow: hidden;'>
                        {params.row.orgName}
                      </p>
                      <p style='font-size:12px;cursor: pointer;display: -webkit-box;-webkit-line-clamp: 1;-webkit-box-orient: vertical;text-overflow: ellipsis;overflow: hidden;'>
                        {orgCompleteName || '--'}
                      </p>
                    </div>
                  </Tooltip>
                </div>
              )
            },
          },
          // {title:'创建时间',key:"time",render:(h,params)=>{
          //   return <p>{this.$format(params.row.createTime,"YYYY-MM-DD HH:mm:ss")}</p>
          // }},
        ],
        list: [],
        loading: false,
        titleCol: [
          // {key:'skuCode',type:'number',title:'SKU编码'},
          // {key:'roughWeight',type:'number',title:'毛重'},
          // {key:'purchasePrice',type:'number',title:'采购价'}
          { key: 'roughWeight', type: 'number', title: '毛重' },
          { key: 'originalPrice', type: 'number', title: '原价' },
          { key: 'purchasePrice', type: 'number', title: '采购价' },
          // {key:'barCode',type:'number',title:'条码'}
        ],
        isNext: false,
        search: {
          page: 1,
          pageSize: 5,
          search: '',
          goodsBrandId: '',
          goodsCategoryId: [],
        },
        infor: {
          specs: [],
          skus: [],
        },
        total: 0,
        allBrandList: [],
        goodsTypeList: [],
        curGoods: this.present,
        selectSpecs: this.selectSkus || [],
      }
    },
    mounted() {
      this.loadGoodsList() // 拉取商品列表
      this.getAllBrands() // 拉取所有品牌列表
      this.loadCategoryData()
    },
    methods: {
      ...mapActions('commModule', ['loadAllBrands']),
      // 组织删选变化
      organizChange(value, selectData) {
        this.source = value
        if (selectData && selectData.length) {
          this.checkedOrgId = selectData[selectData.length - 1].orgId
        } else {
          this.checkedOrgId = localStorage.getItem('orgId')
        }
        this.search.page = 1
        this.search.size = 5
        this.loadGoodsList()
      },
      resetGoods() {
        this.isNext = false
      },
      selectChange(selections) {
        console.log('selections', selections)
        this.selectSpecs = selections.map((item) => {
          item = { ...item, skuId: item.skuId }
          return item
        })
      },
      nextStep() {
        this.isNext = true
        this.loadGoodsSpecies()
      },
      //点击礼品取消
      cancelGoods() {
        this.curGoods = null
        this.$emit('cancelGoods')
      },
      submitHandle() {
        this.$emit('confirmGoods', this.curGoods, this.selectSpecs)
        this.curGoods = null
      },
      // 确认添加商品
      confirmGoods() {
        if (!this.selectSpecs.length) {
          this.$Message.error('请选择要添加的规格!')
          return false
        } else {
          this.$emit('confirmGoods', this.curGoods, this.selectSpecs)
          this.curGoods = null
        }
      },
      // 拉取全部商品品牌列表
      async getAllBrands() {
        const { data } = await this.loadAllBrands()
        if (data && data.brandInfoPageData) {
          this.allBrandList = data.brandInfoPageData.list || []
        }
      },
      // 根据商品id查询商品规格信息
      async loadGoodsSpecies() {
        const { data } = await this.$ajaxPost('/goods-plus-server/v2/api/goods/spu/detail', {
          id: this.curGoods.id,
          loadSku: 'true',
          loadBase: 'true',
          loadCategory: true,
          loadBrand: true,
        })
        if (data) {
          this.infor.specs =
            data.specList.map((item) => {
              return {
                specName: item.mainName,
                specId: item.mainId,
                specContents: item.detailList.map((ele) => {
                  return {
                    specContent: ele.detailName,
                    specContentId: ele.detailId,
                  }
                }),
              }
            }) || []
          this.infor.skus = data.skuList.map((item) => {
            return {
              skuId: item.id,
              codeBar: item.codeBar || '',
              roughWeight: item.roughWeight || 0,
              purchasePrice: item.purchasePrice || 0,
              originalPrice: item.originalPrice || 0,
              specContentIds: item.specs.map((spec) => {
                return spec.specDetailId
              }),
            }
          })
        }
      },

      // 选择礼品添加项
      handleSelect(currentRow) {
        this.curGoods = currentRow
      },

      changeSearch(keys, item) {
        if (item) {
          this.search.goodsCategoryId = keys || []
        }
        this.search.page = 1
        this.search.size = 10
        this.loadGoodsList()
      },
      // 页数改变重新搜索
      onPageChange(page) {
        this.search.page = page
        this.loadGoodsList()
      },
      // 页码改变重新搜索
      onPageSize(size) {
        this.search.pageSize = size
        this.loadGoodsList()
      },
      // 拉取商品列表
      async loadGoodsList() {
        this.loading = true
        let iCategory = this.search.goodsCategoryId
        let obj = {
          loadCategory: true,
          loadBrand: true,
          brandId: this.search.goodsBrandId,
          categoryId: iCategory[iCategory.length - 1],
          search: this.search.search,
          pageNum: this.search.page,
          pageSize: this.search.pageSize,
          source: this.checkedOrgId,
          loadCategoryPath: true,
        }
        const { data } = await this.$ajaxPost('/goods-plus-server/v2/api/goods/spu/list', obj)
        this.loading = false
        if (data) {
          this.list = data.pageData.list || []
          this.total = data.pageData.count
        }
      },
      async loadCategoryData() {
        const { code, data } = await this.$ajaxPost(
          '/goods-plus-server/v2/api/goods/category/list',
          {
            parentId: '',
            type: '1',
            needSpuCount: 'true',
            needTreeRel: 'true',
            showIndex: false,
            source: '',
          }
        )
        if (code == 10000 && data.categoryInfoList && data.categoryInfoList.length) {
          this.categoryList = this.mapList(data.categoryInfoList)
        }
      },
      mapList(list) {
        if (!list) return
        let arr = list.map((item) => {
          return {
            ...item,
            value: item.id,
            label: item.name,
            children: [],
          }
        })
        arr &&
          arr.forEach((item) => {
            arr &&
              arr.forEach((c) => {
                if (c.parentId === item.id) {
                  if (!item.children) {
                    item.children = []
                  }
                  if (!item.children.some((d) => d.id === c.id)) item.children.push(c)
                }
              })
          })
        return arr && arr.filter((item) => item.level === 1)
      },
      categorySearch(value) {
        this.search.goodsCategoryId = value
        this.search.page = 1
        this.search.pageSize = 10
        this.loadGoodsList()
      },
    },
  }
</script>
