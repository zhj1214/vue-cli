<!------------------------
 *desc Create and Edit layer page
 *@author Jo.gel
 *@date 2020/7/20 0020
 -------------------------->
<template>
  <div class="createLayer">
    <h2 class="h2">
      <span @click="$emit('whatComponent', { type: 'LayerList' })">
        <img :src="$backIcon" alt="←" />{{ $route.query.id ? '编辑' : '新增' }}客群</span
      >
    </h2>
    <div class="create-page">
      <h4>筛选标签组成客群</h4>
      <Form ref="layerForm" :model="layerForm" :rules="layerValid" :label-width="100">
        <FormItem label="标签设置：" prop="labelIds">
          <div class="label-setting">
            <div class="header">
              <h4>包含以下标签</h4>
            </div>
            <div>
              <span v-for="(item, index) in selection" :key="item.id" class="selected-span ml-10"
                >{{ item.name }}
                <i
                  class="icon iconfont iconClose"
                  style="position: relative; top: -2px;"
                  @click="deleteSelectedLabel(index, 'contain')"
                />
              </span>
            </div>
            <div class="clear" style="padding: 24px;">
              <span style="float: left;" class="span-a" @click="onAddLabelBtn">
                <i class="icon iconfont iconAdd" />
                <span>添加包含标签</span></span
              >
              <span
                v-if="selection.length"
                style="float: right;"
                class="span-a"
                @click="onResetFilter"
                >重置筛选项
              </span>
            </div>

            <div>
              <div class="header">
                <h4>剔除以下标签</h4>
              </div>
              <div>
                <span v-for="(item, index) in remove" :key="item.id" class="selected-span ml-10"
                  >{{ item.name }}
                  <i
                    class="icon iconfont iconClose"
                    style="position: relative; top: -2px;"
                    @click="deleteSelectedLabel(index, 'remove')"
                  />
                </span>
              </div>
              <div class="clear" style="padding: 24px;">
                <span style="float: left;" class="span-a" @click="onRemoveLabelBtn">
                  <i class="icon iconfont iconAdd" />
                  <span>添加剔除标签</span></span
                >
                <span
                  v-if="remove.length"
                  style="float: right;"
                  class="span-a"
                  @click="onResetRemoveFilter"
                  >重置筛选项
                </span>
              </div>

              <div v-if="isDisplayTable">
                <BaseTable
                  :list="tableList"
                  :col="labelLayerPeopleCol"
                  :page-data="pageData"
                  @on-pageSize="onPageSize"
                  @on-pageChange="onPageChange"
                />
              </div>
              <div v-if="selection.length" class="header">
                <p class="text-center">
                  <span @click="onClickExpand">
                    <span class="span-a">{{ isDisplayTable ? '收起' : '查看' }}筛选用户列表</span>
                    <i
                      style="vertical-align: bottom;"
                      :class="isDisplayTable ? 'iconDropdownUnfold' : 'iconTreeFold'"
                      class="span-a icon iconfont"
                    />
                  </span>
                </p>
              </div>
            </div>
          </div>
        </FormItem>
        <h4 class="block-title"> 客群信息 </h4>
        <FormItem label="客群名称：" prop="name">
          <i-input
            v-model="layerForm.name"
            class="w300"
            :maxlength="20"
            show-word-limit
            placeholder="请输入客群名称"
          />
        </FormItem>
        <FormItem label="关键词：" prop="keywords">
          <Select
            ref="allowSelect"
            v-model="layerForm.keywords"
            class="w300 self-select"
            :maxlength="20"
            multiple
            filterable
            allow-create
            :value="layerForm.keywords"
            placeholder="请输入关键词，不超过20个"
          />
        </FormItem>
        <FormItem label="客群描述：" prop="introduce">
          <i-input
            v-model="layerForm.introduce"
            class="w300"
            type="textarea"
            :rows="4"
            :maxlength="800"
            show-word-limit
            placeholder="请输入客群内容"
          />
        </FormItem>
      </Form>
      <div class="footer-btn">
        <Button @click="onCancelSubmitLayer"> 取消 </Button>
        <Button class="ml-10" type="primary" @click="onSubmitLayer"> 提交 </Button>
      </div>
      <!-- Modal -->

      <div v-if="selectLabelModalStatus">
        <Modal
          v-model="selectLabelModalStatus"
          title="选择包含标签"
          width="900"
          :mask-closable="false"
          onsubmit="return false;"
          @on-cancel="cancelSelectLabel"
        >
          <div>
            <div class="clear" style="line-height: 32px;">
              <span>请选在要<span class="span-a">包含</span>的标签</span>
              <i-input
                v-model.trim="labelPageData.name"
                class="w300 input-dropdown-no-left fix-iview-icon"
                placeholder="请输入标签名"
                icon="ios-search"
                style="float: right;"
                clearable
                @on-enter="onSearchLabel"
                @on-click="onSearchLabel"
              >
                <Select slot="prepend" v-model="labelPageData.inputName" style="width: 100px;">
                  <Option value="id"> 标签编号 </Option>
                  <Option value="name"> 标签名称 </Option>
                </Select>
              </i-input>
            </div>
            <div v-show="selectionTemp.length" class="delete-alert clear" style="margin-top: 24px;">
              <Icon color="#756CEA" type="ios-alert-outline" />
              当前页已选择 {{ selectionTemp.length }}项
              <span class="pointer is-active" style="float: right;" @click="onClearSelect"
                >清空</span
              >
            </div>
            <BaseTable
              ref="labelTable"
              style="margin-top: 24px;"
              :list="labelList"
              :col="labelCol"
              :loading="loading"
              :page-data="labelPageData"
              @on-selectTable="onSelectTable"
              @on-pageSize="onLabelPageSize"
              @on-pageChange="onLabelPageChange"
              @on-selectAll="onSelectAll"
              @on-selectAllCancel="onSelectAllCancel"
              @on-selectCancel="onSelectCancel"
            />
          </div>
          <div slot="footer">
            <Button @click="cancelSelectLabel"> 取消 </Button>
            <Button type="primary" @click="onSelectLabel"> 提交 </Button>
          </div>
        </Modal>
      </div>
      <div v-if="removeLabelPop">
        <Modal
          v-model="removeLabelPop"
          title="选择剔除标签"
          width="900"
          :mask-closable="false"
          onsubmit="return false;"
          @on-cancel="cancelRemoveLabel"
        >
          <div>
            <div class="clear" style="line-height: 32px;">
              <span>请选在要<span class="span-a">剔除</span>的标签</span>
              <i-input
                v-model.trim="labelPageData.name"
                class="w300 input-dropdown-no-left fix-iview-icon"
                placeholder="请输入标签名"
                icon="ios-search"
                style="float: right;"
                clearable
                @on-enter="onSearchLabel"
                @on-click="onSearchLabel"
              >
                <Select slot="prepend" v-model="labelPageData.inputName" style="width: 100px;">
                  <Option value="id"> 标签编号 </Option>
                  <Option value="name"> 标签名称 </Option>
                </Select>
              </i-input>
            </div>
            <div v-show="removeTemp.length" class="delete-alert clear" style="margin-top: 24px;">
              <Icon color="#756CEA" type="ios-alert-outline" />
              当前页已选择 {{ removeTemp.length }}项
              <span class="pointer is-active" style="float: right;" @click="onClearSelect"
                >清空</span
              >
            </div>
            <BaseTable
              ref="labelTable"
              style="margin-top: 24px;"
              :list="labelList"
              :col="labelCol"
              :loading="loading"
              :page-data="labelPageData"
              @on-selectTable="onSelectTable"
              @on-pageSize="onLabelPageSize"
              @on-pageChange="onLabelPageChange"
              @on-selectAll="onSelectAll"
              @on-selectAllCancel="onSelectAllCancel"
              @on-selectCancel="onSelectCancel"
            />
          </div>
          <div slot="footer">
            <Button @click="cancelRemoveLabel"> 取消 </Button>
            <Button type="primary" @click="confirmRemoveLabel"> 提交 </Button>
          </div>
        </Modal>
      </div>
    </div>
  </div>
</template>
<script>
  import BaseTable from '../../base/BaseTable'
  import { labelCol, labelLayerPeopleCol } from '../memberTableCol'
  import { differenceBy, uniqBy } from 'lodash'
  import { log } from '@/utils/tools'

  export default {
    name: 'CreateLayer',
    components: {
      BaseTable,
    },
    data() {
      return {
        isDisplayTable: false,
        selectLabelModalStatus: false,
        loading: false,
        layerForm: {
          name: '',
          keywords: [],
          labelIds: [],
          introduce: '',
          removeLabelIds: [],
        },

        layerValid: {
          name: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
          keywords: [
            {
              required: true,
              type: 'array',
              message: '关键词个数不超过20个，总长度不超过400',
              trigger: 'change',
            },
          ],
          introduce: [{ required: true, message: '请输入客群描述', trigger: 'change' }],
          labelIds: [{ required: true, type: 'array', message: '请选择标签', trigger: 'change' }],
        },

        // 包含标签 contain 剔除 remove
        modalType: 'contain',

        selectionOrigin: [], // 打开modal之前，copy 一个副本给selectionOring
        selection: [], // 记录以前的数据，所有勾选的数据
        selectionTemp: [], // 记录当前所选，无实际意义

        labelList: [],
        labelGroupList: [],
        tableList: [],
        labelLayerPeopleCol: labelLayerPeopleCol.call(this),
        // 标签用户
        pageData: {
          page: 1,
          size: 10,
          count: 0,
        },
        // 包含标签的table
        labelPageData: {
          page: 1,
          size: 10,
          count: 0,
          name: '',
          inputName: 'name',
        },

        removeLabelPop: false,
        removeOrigin: [],
        remove: [],
        removeTemp: [],
      }
    },
    computed: {
      labelCol() {
        return labelCol.call(this) || []
      },
      ids() {
        return this.selection.map((item) => item.id)
      },
    },
    created() {
      const { id, edit } = this.$route.query
      if (id && edit) this.getLayerDetail(id)

      // this.getLabelList()
    },
    methods: {
      getLayerDetail(id) {
        this.$ajaxGet('/label-server/labelGroup/detail', { id }).then((res) => {
          if (res && res.code === 10000) {
            const { name, introduce, keywords, id, labelIds, labels } = res.data || {}
            this.layerForm.name = name
            this.layerForm.introduce = introduce
            this.layerForm.keywords = keywords
            this.layerForm.labelIds = labelIds
            this.layerForm.id = id
            if (this.$refs['allowSelect']) {
              this.$refs['allowSelect'].values = keywords.map((item) => {
                return {
                  value: item,
                  tag: undefined,
                  label: item,
                }
              })
            }
            // set label
            const tempSelection = []
            if (labelIds.length && labelIds.length === labels.length) {
              labelIds.map((item, index) => {
                tempSelection.push({
                  id: item,
                  name: labels[index] || '',
                })
              })
            }
            this.selection = tempSelection
            this.remove = res.data.removeLabelInfos || []
          }
        })
      },
      onCancelSubmitLayer() {
        this.$emit('whatComponent', { type: 'LayerList' })
      },
      formatLayerData() {
        let data = {
          ...this.layerForm,
        }
        console.table(this.selection)
        data.labelIds = this.selection.map((item) => item.id)

        return data
      },
      onSubmitLayer() {
        this.$refs['layerForm'].validate((valid) => {
          if (valid) {
            if (!this.selection.length) {
              this.$Message.error('您还有未填写内容，提交失败')
              return
            }
            // 校验关键词长度
            if (this.layerForm.keywords.length > 20) {
              this.$Message.error('提交失败，请检查关键词（总个数不超过20个，总长度不超过400字符）')
              return
            }
            let hasTooLongWord = false
            for (let item of this.layerForm.keywords) {
              if (item.length > 20) {
                hasTooLongWord = true
                break
              }
            }
            // 校验单个关键词长度
            if (hasTooLongWord) {
              this.$Message.error('提交失败，请检查关键词（单个关键词字符长度不得超过20个）')
              return
            }

            // eslint-disable-next-line no-unused-vars
            let url = '/label-server/labelGroup/create'
            const { id, edit } = this.$route.query
            if (id && edit) url = '/label-server/labelGroup/update'
            let data = this.formatLayerData()
            log('submit', data)
            this.$ajaxPost(url, data).then((res) => {
              if (res && res.code === 10000) {
                this.$Message.success(res.message || '操作成功')
                this.$emit('whatComponent', { type: 'LayerList', state: '3' })
              }
            })
          }
        })
      },
      filterLabelGroup(list) {
        const [labelGroupTypeId] = list
        this.labelPageData.labelGroupTypeId = labelGroupTypeId
        this.onSearchLabel()
      },
      filterBaseType(list) {
        const [labelBaseTypeId] = list
        this.labelPageData.labelBaseTypeId = labelBaseTypeId
        this.onSearchLabel()
      },
      // 获取标签分组
      getLabelGroupList() {
        this.$ajaxGet('/label-server/labelType/listSimple', { type: 1 }).then((res) => {
          if (res && res.code === 10000) {
            let labelGroupList = (res.data || []).map((item) => {
              return { label: item.value, value: item.code }
            })
            labelGroupList.push({ label: '未分类', value: 0 })
            this.labelGroupList = labelGroupList
          }
        })
      },
      // keywords 重新赋值给table
      onAddLabelBtn() {
        this.selectLabelModalStatus = true
        this.getLabelGroupList()
        this.onSearchLabel()
        this.selectionOrigin = JSON.parse(JSON.stringify(this.selection))
        log('this.selectionOrigin', this.selectionOrigin)

        this.modalType = 'contain'
      },
      // 重置筛选项
      onResetFilter() {
        this.selection = []
        this.selectionTemp = []
        this.selectionOrigin = []
      },
      onResetRemoveFilter() {
        this.remove = []
        this.removeTemp = []
        this.removeOrigin = []
      },
      // 清空当前页
      onClearSelect() {
        this.onSelectAllCancel()
        this.selectionTemp = []
        this.getLabelList()
      },
      // type contain remove
      deleteSelectedLabel(index, type) {
        if (type === 'contain') {
          this.selection.splice(index, 1)
          log('delete this.selection', this.selection)
          console.table(this.selection)
        }
        if (type === 'remove') {
          this.remove.splice(index, 1)
        }
      },
      onSearchLabel() {
        this.labelPageData.page = 1
        this.$nextTick(() => {
          this.getLabelList()
        })
      },
      onClickExpand() {
        this.isDisplayTable = !this.isDisplayTable
        if (!this.isDisplayTable) {
          return
        }
        this.getLabelCrowdList()
      },
      onPageSize(size) {
        this.pageData.size = size
        this.onSearchLabelCrowdList()
      },
      onPageChange(page) {
        this.pageData.page = page
        this.$nextTick(() => {
          this.getLabelCrowdList()
        })
      },

      onSearchLabelCrowdList() {
        this.pageData.page = 1
        this.$nextTick(() => {
          this.getLabelCrowdList()
        })
      },
      /**
       * 全选交互, 翻页记忆
       * */
      onSelectAll(all) {
        if (this.modalType === 'contain') {
          if (!this.selection.length) {
            this.selection = all.map((item) => {
              item._checked = true
              return item
            })
          } else {
            const selectionHistory = JSON.parse(JSON.stringify(this.selection))
            this.selection = uniqBy(selectionHistory.concat(all), 'id').map((item) => {
              item._checked = true
              return item
            })
          }
        }

        if (this.modalType === 'remove') {
          if (!this.remove.length) {
            this.remove = all.map((item) => {
              item._checked = true
              return item
            })
          } else {
            const selectionHistory = JSON.parse(JSON.stringify(this.remove))
            this.remove = uniqBy(selectionHistory.concat(all), 'id').map((item) => {
              item._checked = true
              return item
            })
          }
        }
      },
      /**
       * 取消全选，翻译记忆
       * feature 支持跨页取消全选
       * @bug: 多次点击全选和取消全选按钮，后再次勾选无法选中
       * */
      onSelectAllCancel() {
        const cancelData = this.$refs['labelTable'].$refs['ivu-table'].data || []
        const selectionHistory = JSON.parse(JSON.stringify(this.selection))
        this.selection = differenceBy(selectionHistory, cancelData, 'id')

        const cancelDataRemove = this.$refs['labelTable'].$refs['ivu-table'].data || []
        const removeHistory = JSON.parse(JSON.stringify(this.selection))
        this.remove = differenceBy(removeHistory, cancelDataRemove, 'id')
      },
      /**
       * 单选
       * */
      onSelectTable(selection) {
        log('onSelectTable', selection)
        log('this.modalType', this.modalType)
        if (this.modalType === 'contain') {
          const selectionHistory = JSON.parse(JSON.stringify(this.selection))
          this.selection = (uniqBy(selectionHistory.concat(selection), 'id') || []).map((item) => {
            item._checked = true
            return item
          })
        }

        if (this.modalType === 'remove') {
          const removeHistory = JSON.parse(JSON.stringify(this.remove))
          this.remove = (uniqBy(removeHistory.concat(selection), 'id') || []).map((item) => {
            item._checked = true
            return item
          })
          log('this.remove')
        }
      },
      /**
       * 单取消勾选项目
       * */
      onSelectCancel(selection, row) {
        log('onSelectCancel, selection', selection)
        this.selection = this.selection.filter((item) => {
          if (item.id !== row.id) {
            return item
          }
        })

        this.remove = this.remove.filter((item) => {
          if (item.id !== row.id) {
            return item
          }
        })
      },
      /**
       * 取消按钮 不做任何事，并且清空selectCurrent
       * */
      cancelSelectLabel() {
        this.selectLabelModalStatus = false
        this.selection = JSON.parse(JSON.stringify(this.selectionOrigin)) //取消则复原
        this.selectionTemp = []
      },
      // 保存勾选的标签
      onSelectLabel() {
        log('this.selection', this.selection)
        this.selectLabelModalStatus = false
        this.layerForm.labelIds = this.selection.map((item) => item.id)
        this.selectionTemp = []
        this.getLabelCrowdList()
      },
      /**
       * 翻页记忆
       * */
      onLabelPageChange(page) {
        this.labelPageData.page = page
        this.$nextTick(() => {
          this.getLabelList()
        })
      },
      onLabelPageSize(size) {
        this.labelPageData.size = size
        this.onSearchLabel()
      },
      // 记录当前所选的个数，无实际用途
      onSelectTableTemp(selection) {
        log('onSelectTableTemp', selection)
        this.selectionTemp = selection
        this.selection = selection
        this.removeTemp = selection
        this.remove = selection
      },
      // 获取标签
      getLabelList() {
        this.loading = true
        const data = JSON.parse(JSON.stringify(this.labelPageData))
        delete data.name
        delete data.inputName
        if (this.labelPageData.inputName === 'id') {
          data.id = this.labelPageData.name
        } else if (this.labelPageData.inputName === 'name') {
          data.name = this.labelPageData.name
        }
        this.$ajaxGet('/label-server/label/list', {
          ...data,
        }).then((res) => {
          if (res && res.code === 10000) {
            let list = res.data.list || []
            const checkedList = []
            for (let item of list) {
              // 包含标签
              if (this.modalType === 'contain') {
                if (this.ids.includes(item.id)) {
                  item._checked = true
                }
              }
              // 剔除标签
              if (this.modalType === 'remove') {
                if (this.layerForm.removeLabelIds.includes(item.id)) {
                  item._checked = true
                }
              }

              checkedList.push(item)
            }
            this.labelList = checkedList
            this.labelPageData.count = res.data.count || 0
          }
          this.loading = false
        })
      },
      // 获取标签人群
      getLabelCrowdList() {
        const ids = this.ids.join(',')
        if (!ids.length) return
        this.$ajaxPost('/label-server/label/members', {
          ids,
          ...this.pageData,
          removeLabelIds: this.remove.map((item) => item.id),
        }).then((res) => {
          if (res && res.code === 10000) {
            this.tableList = res.data.list || []
            this.pageData.count = res.data.count || 0
          }
        })
      },
      cancelRemoveLabel() {
        this.removeLabelPop = false
        this.remove = JSON.parse(JSON.stringify(this.removeOrigin)) //取消则复原
        this.removeTemp = []
      },
      confirmRemoveLabel() {
        this.removeLabelPop = false
        this.layerForm.removeLabelIds = this.remove.map((item) => item.id)
        this.removeTemp = []
        this.getLabelCrowdList()
      },
      // keywords 重新赋值给table
      onRemoveLabelBtn() {
        this.removeLabelPop = true
        this.getLabelGroupList()
        this.onSearchLabel()
        this.removeOrigin = JSON.parse(JSON.stringify(this.remove))

        this.modalType = 'remove'
      },
    },
  }
</script>
<style lang="scss" scoped>
  .create-page {
    padding: 24px;
    background: #fff;
    border-radius: 8px;

    > h4 {
      padding: 8px 16px;
      margin-bottom: 24px;
      background: #fafafb;
      border-radius: 8px;
    }
  }

  .block-title {
    padding: 8px 16px;
    margin-bottom: 24px;
    background: #fafafb;
    border-radius: 8px;
  }

  .label-setting {
    padding: 24px;
    margin: 24px 0;
    border: 1px solid #e2e2e9;
    border-radius: 8px;

    .selected-span {
      display: inline-block;
      height: 24px;
      padding: 0 8px;
      line-height: 24px;
      background: #f6f6f7;
      border: 1px solid #d5d5db;
      border-radius: 12px;

      i {
        vertical-align: middle;
        cursor: pointer;
      }
    }

    .header {
      height: 56px;
      padding: 0 24px;
      margin: 24px 0;
      line-height: 56px;
      background: #fafafb;
      border-radius: 8px;
    }
  }

  .footer-btn {
    padding-top: 24px;
    text-align: right;
    border-top: 1px solid #ddd;
  }
</style>
