<template>
  <div class="tenant-list">
    <h2 class="h2">
      {{ $route.meta.title }}
    </h2>
    <div class="tenant-card">
      <div class="card-list create-card" @click="onPlusBusinesses">
        <div class="plus" />
        <strong>创建商户</strong>
      </div>
      <div
        v-for="item in businessesList"
        :key="item.id"
        :class="['card-list list', item.expireTime ? 'is-run' : 'is-overdue']"
        @click.stop="onGoPage(item, 'admin')"
      >
        <div class="card-header">
          <strong>{{ item.name }}</strong>
          <img
            v-if="item.versionType === 'Official'"
            src="../../assets/images/tenant/icon-release-x2.png"
            alt=""
          />
          <img v-else src="../../assets/images/tenant/icon-trial.png" alt="" />
          <div class="tenant-logo">
            <img v-if="item.logo" :src="item.logo" alt="" style="border-radius: 50%;" />
            <img
              v-else
              src="../../assets/images/tenant/icon-tenant-logo.png"
              style="border-radius: 50%;"
              alt=""
            />
          </div>
        </div>
        <p style="color: #44444f;">
          {{ item.industryName }}
        </p>
        <div class="card-footer">
          <p>创建时间：{{ $format(item.createTime, 'YYYY-MM-DD') }}</p>
          <p>{{
            item.expireTime ? '过期时间：' + $format(item.expireTime, 'YYYY-MM-DD') : '已过期'
          }}</p>
          <div class="actions">
            <Button
              v-if="item.isCreator"
              type="default"
              class="see-detail"
              @click.stop="onGoPage(item, 'tenant')"
            >
              详情
            </Button>

            <div style="display: inline-block;">
              <Poptip trigger="hover" content="content" width="300">
                <Button
                  v-if="
                    (!item.expireTime || (item.expireTime && item.versionType === 'Official')) &&
                    item.isCreator
                  "
                  type="primary"
                  @click.stop="onUpgrade"
                >
                  续费
                </Button>
                <div slot="content" class="man-phone women-phone">
                  <img src="../../assets/images/tenant/icon-consult.png" alt="" />
                  <p>想咨询续费事宜</p>
                  <p>欢迎拨打热线</p>
                  <p class="is-strong">
                    {{ contactPhone }}
                  </p>
                </div>
              </Poptip>
            </div>

            <div style="display: inline-block;">
              <Poptip trigger="hover" content="content" width="300">
                <Button
                  v-if="item.expireTime && item.versionType === 'Trial' && item.isCreator"
                  type="primary"
                  @click.stop="onUpgrade"
                >
                  升级
                </Button>
                <div slot="content" class="man-phone women-phone">
                  <img src="../../assets/images/tenant/icon-consult.png" alt="" />
                  <p>想咨询升级事宜</p>
                  <p>欢迎拨打热线</p>
                  <p class="is-strong">
                    {{ contactPhone }}
                  </p>
                </div>
              </Poptip>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="contact-button">
      <Poptip content="content" width="300">
        <Button size="large" type="primary">
          <img
            style="vertical-align: middle;"
            src="../../assets/images/tenant/icon-consult.png"
            alt=""
          />
          产品咨询
        </Button>
        <div slot="content" class="man-phone">
          <img src="../../assets/images/tenant/icon-consult.png" alt="" />
          <p>想了解更多内容</p>
          <p>欢迎拨打热线</p>
          <p class="is-strong">
            {{ contactPhone }}
          </p>
        </div>
      </Poptip>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'BusinessesList',
    data() {
      return {
        businessesList: [],
        isShowContact: false,
        contactPhone: '0571-84837872',
      }
    },
    created() {
      this.getBusinessesList()
      this.getCurrentRealUser()
    },
    methods: {
      // 空事件
      onUpgrade() {},
      onGoPage(item, page) {
        localStorage.setItem('creatorPhone', item.creatorPhone)
        this.$ajaxGet(
          '/user-server/auth/switchOrg?orgId=' + (item.subOrgId || item.orgId || '')
        ).then((res) => {
          if (res && res.code === 10000) {
            const { orgName, orgId, departmentId } = res.data.userInfo || {}
            localStorage.setItem('orgName', orgName)
            localStorage.setItem('orgId', orgId)
            localStorage.setItem('departmentId', departmentId)
            localStorage.setItem('originOrgId', res.data.originOrgId || '')
            localStorage.setItem('storeLogo', res.data.logo || '')
            localStorage.setItem('isSubStore', res.data.isSubStore || false) // 是否为门店
            localStorage.setItem('isChain', res.data.isChain || false) // 是否为连锁店
            localStorage.setItem('isPersonal', res.data.isPersonal || false) // 是否为个体
            if (page === 'admin') {
              location.href = '/welcome'
            } else
              this.$router.push(
                '/tenant/detail?tenantId=' + (item.id || '') + '&orgId=' + item.orgId
              )
          }
        })
      },
      onPlusBusinesses() {
        this.$router.push('/tenant/create')
      },
      getBusinessesList() {
        this.$ajaxGet('/user-server/platform/store/list').then((res) => {
          if (res && res.code === 10000) {
            this.businessesList = res.data || []
          }
        })
      },
      getCurrentRealUser() {
        const id = localStorage.getItem('realUserId')
        if (!id) {
          return
        }
        this.$ajaxGet('/user-server/platform/employee/detail', { id }).then((res) => {
          if (res && res.code === 10000) {
            localStorage.setItem('name', res.data.name)
            this.$store.dispatch('setUsername')
          }
        })
      },
    },
  }
</script>

<style scoped lang="scss">
  .tenant-list {
    position: relative;
    width: 1180px;
    min-height: 600px;
    margin: 0 auto;
    background: #fafafb;
  }

  .tenant-card {
    margin-top: 30px;

    &::after {
      display: block;
      clear: both;
      content: '';
    }

    .create-card {
      text-align: center;
      border: 2px dotted #e2e2ea;

      .plus {
        width: 64px;
        height: 64px;
        margin: 0 auto;
        background: url('../../assets/images/tenant/plus.png');
      }

      strong {
        display: block;
        margin: 12px auto 0;
        font-size: 18px;
        color: #756cea;
      }
    }

    .card-list {
      position: relative;
      float: left;
      width: 360px;
      height: 168px;
      padding: 24px;
      margin-bottom: 24px;
      margin-left: 24px;
      cursor: pointer;

      /* overflow: hidden; */
      background: #fff;
      border-radius: 8px;

      &:hover {
        box-shadow: 7px 10px 13px rgba(63, 81, 181, 0.2);
      }
    }

    .list {
      border-top: 2px solid #e2e2ea;
      border-right: 2px solid #e2e2ea;
      border-bottom: 2px solid #e2e2ea;
    }

    .card-header {
      position: relative;
      height: 48px;
      overflow: hidden;

      strong {
        position: relative;
        font-size: 16px;
        vertical-align: middle;

        &::before {
          position: absolute;
          bottom: -12px;
          left: 0;
          display: block;
          width: 16px;
          height: 2px;
          background: #756cea;
          border-radius: 1px;
          content: '';
        }
      }

      .tenant-logo {
        position: absolute;
        top: 0;
        right: 0;
        width: 48px;
        height: 48px;

        img {
          width: 48px;
          height: 48px;
        }
      }

      img {
        width: 24px;
        height: 24px;
        vertical-align: middle;
      }
    }

    .card-footer {
      position: relative;
      margin-top: 16px;

      p {
        color: #92929d;
      }

      .actions {
        position: absolute;
        right: 0;
        bottom: 10px;
        z-index: 10;
      }

      .see-detail {
        display: inline-block;
        margin-right: 12px;
        vertical-align: middle;
        cursor: pointer;
      }
    }

    .is-run::before {
      position: absolute;
      top: 0;
      left: -1px;
      display: block;
      width: 4px;
      height: 100%;
      background: #756cea;
      border-bottom-left-radius: 8px;
      border-top-left-radius: 8px;
      content: '';
    }

    .is-overdue::before {
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      width: 4px;
      height: 100%;
      background: #d5d5dc;
      border-bottom-left-radius: 8px;
      border-top-left-radius: 8px;
      content: '';
    }
  }

  .contact-button {
    position: fixed;
    right: 100px;
    bottom: 48px;
  }

  .man-phone {
    width: 200px;
    height: 108px;
    padding-left: 100px;
    background: url('../../assets/images/tenant/man-contact.png');
  }

  .women-phone {
    background: url('../../assets/images/tenant/women-contact.png');
  }

  p {
    color: #666;
  }

  .is-strong {
    font-size: 18px;
    font-weight: bold;
    color: #171725;
    border-bottom: 2px solid #ffc542;
  }
</style>
