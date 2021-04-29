<!------------------------
 *@name Vue.js
 *@author Jo.gel
 *@date 2020/7/20 0020
 -------------------------->
<template>
  <div class="detailLayer">
    <h2 class="h2">
      <span @click="$emit('whatComponent', { type: 'LayerList' })"
        ><img :src="$backIcon" alt="←" />客群详情</span
      >
    </h2>
    <div class="detailLayer-page clear">
      <div class="left-block">
        <h2 class="clear">
          {{ layerDetail.name }}
          <i
            v-if="__hasPower('editLayers')"
            style="float: right; color: #d7d6d8; cursor: pointer;"
            class="icon iconfont iconSetting"
            @click="onOpenEditModal"
          />
        </h2>

        <p class="p-text">
          <strong style="font-weight: normal; color: #44444f; word-break: break-all;"
            >关键词：</strong
          >
          {{ (layerDetail.keywords || []).join('，') }}
        </p>

        <div class="layer-desc p-text line clear">
          <strong
            style="
              position: relative;
              top: 4px;
              display: block;
              float: left;
              font-weight: normal;
              color: #44444f;
            "
            >客群描述：</strong
          >

          <Poptip trigger="hover" title="客群描述" transfer :width="200">
            <p class="p-text clamp-2" style="word-break: break-all;">
              {{ layerDetail.introduce }}
            </p>

            <p
              slot="content"
              style="height: 200px; overflow-y: auto; word-break: break-all; white-space: initial;"
            >
              {{ layerDetail.introduce }}
            </p>
          </Poptip>
        </div>

        <div style="margin-top: 24px;">
          <h3>客群概览</h3>

          <WordCloud
            v-if="wordCloudData.length"
            style="height: 320px; min-height: 320px;"
            :data="wordCloudData"
            :word-padding="1"
            :rotate="{ from: 0, to: 0, numOfOrientation: 9 }"
            name-key="name"
            value-key="value"
            :font-size="[10, 38]"
            :color="cloudColors"
            :word-click="
              () => {
                return false
              }
            "
            :show-tooltip="false"
          />
          <h2 v-if="!wordCloudData.length" class="no-data" style=""> 暂无数据 </h2>
        </div>

        <div>
          <h3>标签设置</h3>
          <RoundRadio
            :data-list="labelTypeList"
            class="middle-block-narrow"
            :default-select="labelSettingType"
            @select="selectRadio"
          />
          <div class="tag-list">
            <Tooltip v-for="(l, key) in showLabelSetting" :key="key" placement="top">
              <div slot="content">
                <p>所属组织：{{ displayBelongOrg(l.belongOrg, l.belongOrgStr) }}</p>
                <p>标签ID：{{ l.id }}</p>
              </div>
              <Tag>{{ l.name }}</Tag>
            </Tooltip>
          </div>

          <p class="p-text text-center"> ID：{{ layerDetail.id }} </p>
          <p class="p-text text-center">
            由 {{ layerDetail.modifierName }} 于
            {{ $format(layerDetail.modifyTime) }}
            创建
          </p>
        </div>
      </div>
      <div class="right-block">
        <div class="right-top clear">
          <div class="row">
            <p class="p-text" style="margin-bottom: 4px;"> 客群状态 </p>
            <span class="item before-radius bg-blue">{{ upDownText }}</span>
            <span
              v-if="__hasPower('shelf')"
              class="span-a"
              style="padding-left: 12px; margin-left: 12px; border-left: 1px solid #e2e2ea;"
              @click="onChangeUpDown"
              >{{ upDownAction }}</span
            >
          </div>
          <div class="row">
            <p class="p-text" style="margin-bottom: 4px;"> 客群人数 </p>
            <span class="item">{{ $formatNumber(layerDetail.count || 0, 0) }}</span>
          </div>
          <div class="row">
            <p class="p-text" style="margin-bottom: 4px;"> 所属组织 </p>
            <span class="item">{{
              displayBelongOrg(layerDetail.belongOrg, layerDetail.belongOrgStr)
            }}</span>
          </div>
          <div v-if="__hasPower('collectLayers')" class="left-star">
            <Icon
              v-if="pageData.state !== '3'"
              style="font-size: 20px;"
              class="pointer"
              :color="layerDetail.isCollected ? '#FF4852' : ''"
              :type="layerDetail.isCollected ? 'ios-heart' : 'ios-heart-outline'"
              @click="onCollected"
            />
          </div>
        </div>
        <div class="right-bottom">
          <Tabs v-model="pageData.state">
            <TabPane label="客群会员" name="1" />
          </Tabs>

          <LayerMember v-if="id" :com-data="comData" />
        </div>
      </div>
    </div>

    <!-- 编辑modal-->
    <Modal
      v-model="editModalStatus"
      width="600"
      title="编辑客群信息"
      :mask-closable="false"
      @on-cancel="onCancelEdit"
      @on-visible-change="onVisibleChange"
    >
      <Form
        v-if="editModalStatus"
        ref="layerForm"
        onsubmit="return false"
        :model="layerDetail"
        :rules="layerRules"
        :label-width="150"
      >
        <FormItem label="客群名称：" prop="name">
          <i-input
            v-model="layerDetail.name"
            class="w300"
            placeholder="请输入客群名称"
            :maxlength="20"
            show-word-limit
          />
        </FormItem>
        <FormItem label="关键词：" prop="keywords">
          <Select
            ref="allowSelect"
            v-model="layerDetail.keywords"
            class="w300"
            :maxlength="20"
            multiple
            filterable
            allow-create
            placeholder="请输入关键词，不超过20个"
          />
        </FormItem>
        <FormItem label="客群描述：" prop="introduce">
          <i-input
            v-model="layerDetail.introduce"
            class="w300"
            type="textarea"
            :rows="4"
            :maxlength="800"
            show-word-limit
            placeholder="请输入客群内容"
          />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="onCancelEdit"> 取消 </Button>
        <Button type="primary" @click="onSubmitEdit"> 确定 </Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import LayerMember from './components/LayerMember'
  import { cloudColors } from '../memberTableCol'
  import WordCloud from 'vue-wordcloud'
  import mixinsGlobal from '../../../mixins/mixinsGlobal'

  import RoundRadio from '@/components/RoundRadio'

  export default {
    name: 'DetailLayer',
    components: {
      LayerMember,
      WordCloud,
      RoundRadio,
    },
    mixins: [mixinsGlobal],
    props: {
      comData: {
        type: Object,
        default() {
          return {
            id: '',
          }
        },
      },
    },
    data() {
      return {
        id: this.comData.id,
        layerDetail: {
          keywords: [],
          labels: [],
        },
        layerRules: {
          name: [{ required: true, message: '请输入客群名称', trigger: 'blur' }],
          keywords: [{ required: true, type: 'array', message: '请输入关键词', trigger: 'change' }],
          introduce: [{ required: true, message: '请输入客群描述', trigger: 'blur' }],
        },
        editModalStatus: false,
        cloudColors: cloudColors,
        wordCloudData: [],
        pageData: {
          page: 1,
          size: 10,
          count: 0,
          state: '1',
        },

        labelTypeList: [
          {
            label: '包含标签',
            value: 'contain',
          },
          {
            label: '剔除标签',
            value: 'remove',
          },
        ],
        labelSettingType: 'contain',
      }
    },
    computed: {
      upDownText() {
        return this.layerDetail.state === 2 ? '已下架' : '已上架'
      },
      upDownAction() {
        return this.layerDetail.state === 2 ? '上架' : '下架'
      },
      showLabelSetting() {
        if (this.labelSettingType === 'contain') {
          return this.layerDetail.labelInfos
        } else {
          return this.layerDetail.removeLabelInfos
        }
      },
    },
    created() {
      const { id } = this.$route.query
      if (id) this.id = id || ''
    },
    mounted() {
      this.getLayerDetail()
      this.getLayerCloud()
    },
    methods: {
      getLayerDetail() {
        this.$ajaxGet('/label-server/labelGroup/detail', { id: this.id }).then((res) => {
          if (res && res.code === 10000) {
            this.layerDetail = res.data || {}
          }
        })
      },
      getLayerCloud() {
        this.$ajaxGet('/label-server/labelGroup/hotLabels', { id: this.id }).then((res) => {
          if (res && res.code) {
            this.wordCloudData = res.data
          }
        })
      },
      onOpenEditModal() {
        this.editModalStatus = true
      },
      onVisibleChange(status) {
        setTimeout(() => {
          const { keywords } = this.layerDetail
          if (this.$refs['allowSelect'] && status) {
            this.$refs['allowSelect'].values = (keywords || []).map((item) => {
              return {
                value: item,
                tag: undefined,
                label: item,
              }
            })
          }
        }, 100)
      },
      onCancelEdit() {
        this.editModalStatus = false
        this.getLayerDetail()
      },
      onSubmitEdit() {
        this.$refs['layerForm'].validate((valid) => {
          if (valid) {
            const { id, name, keywords, introduce, labelIds } = this.layerDetail
            this.$ajaxPost('/label-server/labelGroup/update', {
              id,
              name,
              keywords,
              introduce,
              labelIds,
            }).then((res) => {
              if (res && res.code === 10000) {
                this.$Message.success(res.message || '操作成功')
                this.onCancelEdit()
              }
            })
          }
        })
      },
      onCollected() {
        const { id, isCollected } = this.layerDetail
        this.$ajaxPost('/label-server/labelGroup/collectOrUnCollect', {
          id,
          state: isCollected ? 'UNCOLLECT' : 'COLLECT',
        }).then((res) => {
          if (res && res.code === 10000) {
            this.$Message.success(res.message || '操作成功')
            this.getLayerDetail()
          }
        })
      },
      onChangeUpDown() {
        const state =
          this.layerDetail.state === 2 ? 'UP' : this.layerDetail.state === 1 ? 'DOWN' : ''
        const id = this.layerDetail.id
        if (!state) return
        this.$ajaxPost('/label-server/labelGroup/collectOrUnCollect', {
          id,
          state,
        }).then((res) => {
          if (res && res.code === 10000) {
            this.$Message.success(res.message || '操作成功')
            this.getLayerDetail()
          }
        })
      },
      displayBelongOrg(belong, parent) {
        let o = [belong, parent]
        let s = o.join('/')
        if (parent === '') {
          s = belong
        }
        return s
      },
      selectRadio(s) {
        this.labelSettingType = s
      },
    },
  }
</script>
<style lang="scss" scoped>
  .detailLayer-page {
    border-radius: 16px;
  }

  .left-block {
    float: left;
    width: 360px;
    padding: 24px;
    background: #fff;
    border-radius: 16px;

    h2 {
      margin-bottom: 24px;
    }

    p {
      margin-bottom: 12px;

      strong {
        color: #44444f;
      }
    }

    .line {
      padding-bottom: 24px;
      border-bottom: 1px solid #e2e2ea;
    }

    .tag-list {
      max-height: 200px;
      padding-bottom: 24px;
      margin-top: 24px;
      margin-bottom: 24px;
      overflow-y: auto;
      border-bottom: 1px solid #e2e2ea;

      .label-tag {
        height: 22px;
        padding-right: 12px;
        padding-left: 12px;
        background: #f6f6f7;
        border: 1px solid #d5d5db;
        border-radius: 11px;
      }
    }
  }

  .right-block {
    margin-left: 384px;
  }

  .right-top,
  .right-bottom {
    padding: 24px;
    margin-bottom: 24px;
    background: #fff;
    border-radius: 16px;
  }

  .right-top {
    height: 90px;

    .row {
      float: left;
      min-width: 200px;

      span {
        color: #171725;
      }
    }

    .left-star {
      float: right;
      width: 38px;
      height: 38px;
      line-height: 38px;
      text-align: center;
      border: 1px solid #e2e2e9;
      border-radius: 8px;
    }
  }
</style>
