<template>
  <Form label-colon :label-width="150">
    <FormItem label="机构类型">
      {{ detail.type ? ENUM_TYPE[detail.type] : '--' }}
    </FormItem>
    <FormItem label="机构名称">
      {{ detail.orgName ? detail.orgName : '--' }}
    </FormItem>
    <FormItem v-if="detail.type === 2" label="机构编号">
      {{ detail.orgId ? detail.orgId : '--' }}
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
          <a
            :href="'/member-server/api/channel/export?url=' + row.qrCode"
            download="二维码"
            target="_blank"
          >
            下载
          </a>
        </template>
      </Table>
    </FormItem>
  </Form>
</template>

<script>
  import { ENUM_TYPE } from '../common'

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
          {
            title: '操作',
            slot: 'action',
            width: 150,
            align: 'center',
          },
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
          }
        })
      },
    },
  }
</script>

<style lang="scss" scoped></style>
