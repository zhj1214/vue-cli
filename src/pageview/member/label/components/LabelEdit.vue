<template>
  <div class="label-edit">
    <h2 class="h2">
      <span @click="goLabelList"><img :src="$backIcon" alt="←" />新建标签</span>
    </h2>

    <div class="label-content">
      <!-- 规则有steps-->
      <div v-if="propData.labelType === 1" class="steps-wrap">
        <Steps :current="currentStep">
          <Step title="基础信息设置" />
          <Step title="标签规则设置" />
        </Steps>
      </div>

      <!--Base -->
      <div v-if="currentStep === 0" style="margin-top: 24px;">
        <Form
          ref="labelData"
          :model="labelData"
          :rules="labelRules"
          :label-width="150"
          onsubmit="return false;"
        >
          <FormItem label="标签规则：">
            <p style="color: #171725;">
              {{ propData.labelType === 1 ? '规则标签' : '手动标签' }}
            </p>
          </FormItem>
          <FormItem label="标签名称：" prop="name">
            <i-input
              v-model="labelData.name"
              :maxlength="20"
              class="w250"
              show-word-limit
              placeholder="请输入标签名称"
              @on-change="validateName"
            />
          </FormItem>
          <FormItem label="标签分组：" prop="labelGroupTypeId">
            <div class="group-container">
              <i-select
                v-model="labelData.labelGroupTypeId"
                class="button-gap w250"
                placeholder="请选择标签分组"
                @on-open-change="refreshGroup"
              >
                <Option v-for="item in labelGroupList" :key="item.code" :value="item.code">
                  {{ item.value }}
                </Option>
              </i-select>
              <div class="group-text action-text" @click="jumpGroup">
                <i class="icon iconfont iconSetting" title="返回" />标签分组
              </div>
            </div>
          </FormItem>
          <FormItem v-if="propData.labelType === 1" label="重算周期：">
            <p>自动更新（每日凌晨更新）</p>
          </FormItem>
          <FormItem label="备注：">
            <i-input
              v-model="labelData.remark"
              class="w250"
              type="textarea"
              :rows="4"
              :maxlength="800"
              show-word-limit
              placeholder="请输入备注内容"
            />
          </FormItem>
        </Form>
      </div>

      <!--Rule-->
      <div v-if="currentStep === 1" class="">
        <RuleLabel :all="labelData.rules" />
      </div>

      <div class="text-right">
        <Button @click="onCancelCreateLabel"> 取消 </Button>
        <Button
          v-if="propData.labelType === 1 && currentStep === 0"
          class="ml-10"
          type="primary"
          @click="onNextSteps"
        >
          下一步
        </Button>
        <Button
          v-if="propData.labelType === 1 && currentStep === 1"
          class="ml-10"
          @click="onLastSteps"
        >
          上一步
        </Button>
        <Button
          v-if="propData.labelType === 2 || currentStep === 1"
          class="ml-10"
          :disabled="commitLoading"
          :loading="commitLoading"
          type="primary"
          @click="onCreateLabel"
        >
          提交
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
  import { log } from '@/utils/tools'
  import RuleLabel from './RuleLabel'
  import { defaultLabel } from '../../memberTableCol'
  import { isNoValueLevel } from '@/utils/tools'

  export default {
    name: 'LabelEdit',
    components: {
      RuleLabel,
    },
    props: {
      propData: Object,
    },
    data() {
      return {
        currentStep: 0,
        commitLoading: false,
        labelData: {
          labelBaseTypeId: this.propData.labelType,
          ...defaultLabel,
        },
        labelRules: {
          name: [
            {
              required: true,
              message: '请输入标签名称',
              trigger: 'blur',
            },
          ],
          labelGroupTypeId: [
            {
              required: true,
              message: '请选择标签分组',
              trigger: 'change',
            },
          ],
        },
        labelGroupList: [],
      }
    },
    created() {
      this.getLabelGroupList()
      log('---IN LabelEdit')
      // this.debugLabelRule()
    },
    mounted() {
      this.labelData = JSON.parse(
        JSON.stringify({
          labelBaseTypeId: this.propData.labelType,
          ...defaultLabel,
        })
      )
      // this.debugTwoLevel()
    },
    methods: {
      getLabelGroupList() {
        this.$ajaxGet('/label-server/labelType/listSimple').then((res) => {
          if (res && res.code === 10000) {
            this.labelGroupList = res.data || []
          }
        })
      },
      refreshGroup(status) {
        if (status) {
          this.getLabelGroupList()
        }
      },
      validateName() {
        let data = {
          labelName: this.labelData.name,
        }
        let url = '/label-server/label/checkLabelNameExist'
        this.$ajaxGet(url, data)
          .then((res) => {
            if (res && res.code === 10000) {
              let dup = res.data || false
              if (dup) {
                this.$Message.error('该标签名称已存在')
                this.labelData.name = ''
              }
            }
          })
          .catch((err) => {
            log(err)
          })
      },
      goLabelList() {
        this.$emit('whatComponent', { type: 'LabelList' })
      },
      debugSubmitLabel() {
        let flag = localStorage.debugLabel === 'debug'
        if (!flag) {
          return
        }
        Object.assign(this.labelData, {
          labelBaseTypeId: 1,
          labelGroupTypeId: '79',
          name: '年轻人',
          remark: '有房有车',
        })
      },
      /**
       * 创建标签
       * labelBaseTypeId=1 规则标签
       * labelBaseTypeId=2 手动标签
       * */
      onCreateLabel() {
        // this.debugSubmitLabel()

        const { name, labelGroupTypeId, remark, labelBaseTypeId } = this.labelData
        log('this.labelData', this.labelData)
        let postData = {}
        postData = { name, labelGroupTypeId, remark, labelBaseTypeId }
        if (labelBaseTypeId === 1) {
          postData.rules = this.labelData.rules || {}
          postData.updatePeriod = 1 // 重算周期
          const rules = this.labelData.rules || {}
          const subRules = rules.subRules || []
          log('subRules', subRules)
          // 校验标签规则
          if (isNoValueLevel(subRules)) {
            this.$Message.error('提交失败，请检查是否存在未填写内容或数值为0的内容')
            return false
          }
        }

        this.commitLoading = true
        this.$ajaxPost('/label-server/label/create', postData).then((res) => {
          if (res && res.code === 10000) {
            this.$Message.success(
              labelBaseTypeId === 2
                ? '成功'
                : '保存成功，计算结果更新将有几分钟延迟，请稍后刷新查看'
            )
            this.$emit('whatComponent', { type: 'LabelList' })
          }
          this.commitLoading = false
        })
      },
      onCancelCreateLabel() {
        this.$emit('whatComponent', { type: 'LabelList' })
      },
      onLastSteps() {
        this.currentStep = 0
      },
      onNextSteps() {
        this.$refs['labelData'].validate((valid) => {
          if (valid) this.currentStep = 1
        })
      },
      jumpGroup() {
        let url = '/member/labelLayer/labelGroup'
        window.open(url, '_blank')
      },
      debugLabelRule() {
        log('labelData.rules', this.labelData.rules)
        let flag = localStorage.debugLabel === 'debug'
        if (!flag) {
          return
        }
        // 手动标签
        // this.currentStep = 0
        // 规则标签
        this.currentStep = 1
      },
      /**
       * 调试 ABC 层级
       */
      debugTwoLevel() {
        this.labelData = {
          name: '2323',
          labelGroupTypeId: '1',
          remark: '',
          rules: {
            subRules: [
              {
                actionAttr: '1',
                eventType: 'register_success',
                operator: 'gt',
                value: '',
                valueA: 0,
                valueB: 0,
                numberValue: 1,
                totalType: ['101'],
                timeArea: {
                  type: 'static',
                  beginTime: '2021-01-29',
                  endTime: '2021-01-29',
                },
                attrsRule: {
                  logic: 'all',
                  children: [],
                },
              },
              {
                actionAttr: '1',
                eventType: 'register_success',
                operator: 'gt',
                value: '',
                valueA: 0,
                valueB: 0,
                numberValue: 1,
                totalType: ['101'],
                timeArea: {
                  type: 'static',
                  beginTime: '2021-01-29',
                  endTime: '2021-01-29',
                },
                attrsRule: {
                  logic: 'all',
                  children: [],
                },
              },
            ],
          },
        }
      },
    },
  }
</script>

<style scoped lang="scss">
  .label-content {
    padding: 24px;
    background: #fff;
    border-radius: 16px;
  }

  .steps-wrap {
    width: 400px;
    margin: 0 auto;
  }

  .group-container {
    display: flex;
    justify-content: flex-start;

    .group-text {
      width: 80px;
    }
  }
</style>
