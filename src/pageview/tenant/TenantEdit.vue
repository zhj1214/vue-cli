<!--
@desc 编辑+创建商户
-->
<template>
  <div class="tenant-edit">
    <h2 v-show="!isUpdate" class="h2">
      <span @click="goTenantPage"><img :src="$backIcon" alt="" />创建商户</span>
    </h2>
    <div class="tenant-content">
      <div class="form-body">
        <div class="avatar-item">
          <Upload
            v-show="!tenantData.logo"
            :action="$upload"
            class="upload-class"
            :show-upload-list="false"
            name="file"
            :format="['jpg', 'jpeg', 'png', 'JPEG', 'JPG', 'PNG']"
            :max-size="1024"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :on-success="handleSuccess"
            :headers="headers"
            :on-error="handlerError"
          >
            <div class="upload-button">
              <Icon
                type="ios-log-out"
                size="18"
                color="#fff"
                class="pointer"
                style="font-weight: bold; transform: rotate(-90deg);"
              />
            </div>
          </Upload>
          <div v-show="tenantData.logo" class="image-position">
            <img :src="tenantData.logo || defaultAvatar" alt="avatar" />
            <div class="demo-upload-list-cover">
              <Icon type="ios-trash-outline" size="24" @click.native="handleRemove" />
            </div>
          </div>
        </div>

        <Form ref="formTenant" :model="tenantData" :rules="tenantValid">
          <FormItem label="商户类型" prop="storeType">
            <i-select
              v-model="tenantData.storeType"
              :disabled="$route.name === 'tenant-detail'"
              placeholder="请选择商户类型"
            >
              <Option value="Personal"> 个人商户 </Option>
              <Option value="Chain"> 连锁店 </Option>
            </i-select>
          </FormItem>
          <FormItem label="商户名称" prop="name">
            <i-input v-model.trim="tenantData.name" placeholder="请输入商户名称" :maxlength="30" />
          </FormItem>
          <FormItem label="商户行业" prop="industryId">
            <i-select v-model="tenantData.industryId" placeholder="请选择商户行业">
              <Option v-for="item in industryList" :key="item.id" :value="item.id">
                {{ item.name }}
              </Option>
            </i-select>
          </FormItem>
          <FormItem label="商户地址" prop="addressList">
            <Cascader
              v-model="tenantData.addressList"
              placeholder="请选择省 / 市 / 区"
              :data="cascadeCitys"
            />
          </FormItem>
          <FormItem>
            <div class="address-detail">
              <i-input
                v-model="tenantData.address.addressDetail"
                :maxlength="50"
                class="pr-80"
                placeholder="请填写具体地址"
                @on-change="onSearchMap"
              />
              <span class="address-span is-active" @click="onReSearch">搜索地图</span>
              <div class="address-map">
                <BMap
                  ref="bMap"
                  :geo-location="provinceCityArea"
                  :address="tenantData.address.addressDetail"
                  map-height="300px"
                  map-width="388px"
                  @getPointAddress="getPointAddress"
                  @reportError="getMapError"
                />
              </div>
            </div>
          </FormItem>

          <Button v-if="!isUpdate" size="large" long type="primary" @click="onCreateUpdateTenant">
            创建
          </Button>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
  import defaultAvatar from '../../assets/images/default-avatar.png'
  import mixinsUpload from '../../mixins/mixinsUpload'
  import BMap from '../../components/BMap'
  import { mapGetters } from 'vuex'

  export default {
    name: 'BusinessesEdit',
    components: {
      BMap,
    },
    mixins: [mixinsUpload],
    data() {
      const checkAddress = (rule, value, callback) => {
        if (!this.tenantData.addressList) callback('请选择商户地址')
        else if (this.tenantData.addressList && !this.tenantData.addressList.length) {
          callback('请选择商户地址')
        } else callback()
      }
      return {
        defaultAvatar,
        headers: {
          token: localStorage.getItem('token'),
        },
        mapErrorMessage: '',
        tenantData: {
          storeType: '',
          name: '',
          industryId: '',
          logo: '',
          addressList: [],
          address: {
            province: '',
            city: '',
            area: '',
            addressDetail: '',
            lng: '',
            lat: '',
          },
        },
        tenantValid: {
          storeType: [{ required: true, message: '请选择商户类型', trigger: 'change' }],
          name: [{ required: true, message: '请输入商户名称', trigger: 'change' }],
          industryId: [
            { required: true, type: 'number', message: '请选择商户行业', trigger: 'change' },
          ],
          addressList: [{ required: true, validator: checkAddress, trigger: 'change' }],
        },
        industryList: [],
      }
    },
    computed: {
      ...mapGetters(['cascadeCitys']),
      isUpdate() {
        return this.$route.name === 'tenant-detail'
      },
      provinceCityArea() {
        return this.tenantData.addressList.join('')
      },
    },
    created() {
      this.getIndustryList()
      if (this.isUpdate) this.getTenant()
      this.$store.dispatch('getAreaCityInfor')
    },
    methods: {
      /**
       * @desc 选取地图出区域错误回调
       * @pointObj {point:[],message:""}
       * */
      getMapError(pointObj) {
        const { message } = pointObj
        this.mapErrorMessage = message
      },
      getPointAddress(address, point) {
        this.tenantData.address.addressDetail = address
        const { lng, lat } = point
        this.tenantData.address.lng = lng
        this.tenantData.address.lat = lat
        this.mapErrorMessage = ''
      },
      onSearchMap() {
        this.tenantData.address.lng = null
        this.tenantData.address.lat = null
      },
      onReSearch() {
        this.$refs['bMap'].drawWithAddress()
      },
      goTenantPage() {
        this.$router.replace('/tenant/list')
      },
      handleSuccess(res) {
        if (res && res.code === 10000) {
          this.$Message.success(res.message)
          this.$set(this.tenantData, 'logo', res.data)
        }
      },
      handleRemove() {
        this.$set(this.tenantData, 'logo', '')
      },
      getIndustryList() {
        this.$ajaxGet('/user-server/platform/industry/listSimple').then((res) => {
          if (res && res.code === 10000) {
            this.industryList = res.data || []
          }
        })
      },
      getTenant() {
        const tenantId = this.$route.query.tenantId
        if (!tenantId) {
          return
        }
        this.$ajaxGet('/user-server/platform/store/update/detail', { id: tenantId }).then((res) => {
          if (res && res.code === 10000) {
            const json = res.data || {}
            let addressList = [json.address.province, json.address.city, json.address.area].filter(
              (item) => item
            )
            this.tenantData = { ...json, addressList }
          }
        })
      },
      onCreateUpdateTenant() {
        this.$refs['formTenant'].validate((valid) => {
          if (valid) this.createUpdateTenant()
        })
      },
      createUpdateTenant() {
        if (this.mapErrorMessage || !this.tenantData.address.lng) {
          this.$Message.error(this.mapErrorMessage || '请重新选择搜索定位')
          return
        }
        const { addressList, ...other } = this.tenantData
        const createData = { ...other }
        createData.address.province = addressList[0] ? addressList[0] : ''
        createData.address.city = addressList[1] ? addressList[1] : ''
        createData.address.area = addressList[2] ? addressList[2] : ''
        let url = '/user-server/platform/store/create'
        if (this.isUpdate) {
          url = '/user-server/platform/store/update'
        }
        this.$ajaxPost(url, createData).then((res) => {
          if (res && res.code === 10000) {
            this.$Message.success(res.message || '操作成功')
            localStorage.setItem('storeLogo', this.tenantData.logo)
            if (this.isUpdate) {
              this.$emit('onCloseModal')
            } else {
              // 如果是创建
              this.finishCreate(res.data)
            }
          }
        })
      },
      // 完成创建之后跳转到后台
      finishCreate(orgId) {
        this.$ajaxGet('/user-server/auth/switchOrg?orgId=' + orgId || '').then((res) => {
          if (res && res.code === 10000) {
            const { orgName, orgId, departmentId } = res.data.userInfo || {}
            localStorage.setItem('orgName', orgName)
            localStorage.setItem('orgId', orgId)
            localStorage.setItem('departmentId', departmentId)
            localStorage.setItem('storeLogo', res.data.logo || '')
            localStorage.setItem('originOrgId', res.data.originOrgId || '')
            localStorage.setItem('isSubStore', res.data.isSubStore || false) // 是否为门店
            localStorage.setItem('isChain', res.data.isChain || false) // 是否为连锁店
            localStorage.setItem('isPersonal', res.data.isPersonal || false) // 是否为个体
            this.$router.push('/welcome')
          }
        })
      },
    },
  }
</script>

<style scoped lang="scss">
  .tenant-edit {
    width: 1128px;
    height: 100%;
    margin: 0 auto;
  }

  .tenant-content {
    padding: 40px 0;
    background: #fff;
    border-radius: 20px;
  }

  .form-body {
    width: 380px;
    margin: 0 auto;
    background: #fff;
  }

  .address-detail {
    position: relative;

    .address-span {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 2;
      cursor: pointer;
    }

    .address-map {
      margin-top: 24px;
    }
  }

  .image-position {
    position: relative;
    width: 72px;
    height: 72px;
    line-height: 72px;
    text-align: center;
    background: rgba(0, 0, 0, 0.2);

    img {
      width: 100%;
      height: 100%;
      background-size: 100%;
      border-radius: 50%;
    }

    &:hover .demo-upload-list-cover {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      color: #fff;
      background: rgba(0, 0, 0, 0.18);
    }
  }
</style>
