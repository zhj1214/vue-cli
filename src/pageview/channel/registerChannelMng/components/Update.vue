<template>
  <Form ref="form" label-colon :label-width="150">
    <FormItem label="机构类型">
      {{ detail.type ? ENUM_TYPE[detail.type] : '--' }}
    </FormItem>
    <FormItem v-if="detail.type === 1" label="机构名称">
      {{ detail.orgName ? detail.orgName : '--' }}
    </FormItem>
    <FormItem
      v-else
      label="机构名称"
      prop="orgName"
      :rules="[
        {
          require: true,
          message: '请输入机构名称',
        },
      ]"
    >
      <i-input v-model="formData.orgName" placeholder="请输入机构名称" @on-blur="validateOrgName" />
    </FormItem>
    <FormItem label="注册渠道归属方">
      {{ detail.affiliationOrganizationName ? detail.affiliationOrganizationName : '--' }}
    </FormItem>
    <FormItem label="小程序注册二维码">
      <Table :columns="columns" :data="list">
        <template slot="code-img" slot-scope="{ row }">
          <img :src="row.qrCode" width="50px" height="50px" />
        </template>
        <template slot="action" slot-scope="{ row }">
          <a :href="row.qrCode" download="二维码" target="_blank"> 下载 </a>
        </template>
      </Table>
    </FormItem>

    <FormItem
      v-for="(item, index) in formData.linkList"
      :key="index"
      :prop="'linkList.' + index + '.linkName'"
    >
      <Row>
        <i-col span="18">
          <i-input v-model="item.linkName" type="text" placeholder="请输入...">
            <span slot="prepend">渠道名称</span>
          </i-input>
        </i-col>
        <i-col span="4" offset="1">
          <Button
            class="no-border"
            ghost
            type="primary"
            icon="ios-trash-outline"
            @click="handleRemove(index)"
          />
        </i-col>
      </Row>
    </FormItem>
    <FormItem>
      <Row>
        <i-col span="12">
          <Button
            class="no-border tl"
            ghost
            type="primary"
            icon="ios-add-circle-outline"
            @click="handleAdd"
          >
            添加
          </Button>
        </i-col>
      </Row>
    </FormItem>
  </Form>
</template>

<script>
  import { ENUM_TYPE, LINK } from '../common'

  export default {
    props: {
      row: {
        type: Object,
        default() {
          return {}
        },
      },
    },
    data() {
      return {
        ENUM_TYPE,
        formData: {
          orgName: '',
          linkList: [],
        },
        columns: [
          {
            title: '渠道名称',
            key: 'linkName',
          },
          {
            title: '二维码',
            key: 'link',
            slot: 'code-img',
          },
          // {
          //   title: '操作',
          //   slot: 'action',
          //   width: 150,
          //   align: 'center',
          // },
        ],
        list: [],
        detail: {},
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        if (!this.row.id) {
          this.$Message.error('缺少id')
          return
        }
        this.fetchDetail(this.row.id)
      },

      fetchDetail(id) {
        this.$ajaxGet('/member-server/api/channel/info', { channelId: id }).then((res) => {
          if (res && res.code === 10000) {
            this.detail = res.data || {}
            this.list = res.data.linkList ? res.data.linkList : []
            this.index = res.data.linkList.length
            if (res.data.type === 2) {
              this.formData.orgName = res.data.orgName
            }
          }
        })
      },
      handleSubmit(options = {}) {
        console.log(this.formData)
        this.$refs.form.validate(async (valid) => {
          console.log(valid)
          if (valid) {
            const params =
              this.detail.type === 1
                ? {
                    channelId: this.detail.id,
                    type: this.detail.type,
                    orgName: this.detail.orgName,
                    affiliationOrganizationId: this.detail.affiliationOrganizationId,
                    linkList: this.formData.linkList,
                    number: this.formData.linkList.length + this.list.length,
                  }
                : {
                    channelId: this.detail.id,
                    type: this.detail.type,
                    orgName: this.formData.orgName,
                    orgId: this.detail.orgId,
                    affiliationOrganizationId: this.detail.affiliationOrganizationId,
                    linkList: this.formData.linkList.map((it) => ({
                      ...it,
                      parameter: this.list[0].parameter,
                    })),
                    number: this.formData.linkList.length + this.list.length,
                  }
            console.log(params)
            if (this.detail.type === 2) {
              const isRepeat = await this.validatRepeat({
                channelId: this.detail.id,
                orgName: params.orgName,
              })
              if (isRepeat) {
                this.$Message.error('机构名称重复')
                options.complete && options.complete()
                return
              }
            }
            for (let i = 0; i < this.formData.linkList.length; i++) {
              if (!this.formData.linkList[i].linkName) {
                this.$Message.error('渠道名称不能为空')
                options.complete && options.complete()
                return
              }
            }

            const res = await this.$ajaxPost('/member-server/api/channel/insert', params)
            if (res && res.code === 10000) {
              this.$Message.success('编辑成功!')
              options.success && options.success()
              options.complete && options.complete()
            }
            options.complete && options.complete()
          } else {
            options.complete && options.complete()
            return
          }
        })
      },
      // 验证重复
      async validatRepeat(params) {
        const res = await this.$ajaxGet('/member-server/api/channel/check', params)
        if (res && res.code === 10000) {
          return res.data
        }
        return false
      },

      async validateOrgName() {
        if (!this.formData.orgName) return
        const isRepeat = await this.validatRepeat({
          channelId: this.detail.id,
          orgName: this.formData.orgName,
        })
        if (isRepeat) {
          this.$Message.error('机构名称重复')
          return
        }
      },

      handleAdd() {
        this.formData.linkList.push({
          linkName: `渠道${this.list.length + this.formData.linkList.length + 1}`,
          link: LINK,
        })
      },

      handleRemove(index) {
        this.formData.linkList.splice(index, 1)
      },
    },
  }
</script>

<style lang="scss" scoped></style>
