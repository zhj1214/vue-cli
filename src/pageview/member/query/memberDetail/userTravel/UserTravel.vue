<template>
  <div>
    <div class="search-block big-block-narrow">
      <DatePicker
        type="daterange"
        placement="bottom-end"
        class="component-narrow w280"
        placeholder="开始时间 → 结束时间"
        :confirm="true"
        format="yyyy-MM-dd"
        :value="[searchData.startTime, searchData.endTime]"
        @on-change="handleTimePiker"
      />

      <Cascader
        class="w220"
        :data="userTravelAction"
        placeholder="请选择动作类型"
        trigger="hover"
        @on-change="selectActions"
      />
    </div>

    <Table
      class="middle-block-narrow"
      :columns="userTravelCol"
      :data="listData"
      :loading="loading"
    />

    <Page
      class="middle-block-narrow"
      :total="pageData.count"
      :current="pageData.page"
      :page-size="pageData.size"
      show-elevator
      show-total
      @on-change="onPageChange"
      @on-page-size-change="onPageSize"
    />
  </div>
</template>

<script>
    import { log } from "@/utils/tools";
    import {actionList} from "./actionList";
    import {userTravelCol} from "./userTravelCol";
    import {userTravelAction} from "./userTravelAction";

    export default {
        name: "UserTravel",
        props: {
            memberId: String,
        },
        data() {
            return {
                searchData: {
                    memberId: this.memberId,
                    startTime: '',
                    endTime: '',
                    operParentType: '',
                    operType: '',
                },

                loading: false,
                userTravelCol: userTravelCol.call(this),
                userTravelAction: userTravelAction,
                listData: [],

                pageData: {
                    count: 0,
                    page: 1,
                    size: 10,
                },
                actionList: actionList,
            }
        },
        created() {
            this.getUserTravelList()
        },
        methods: {
            getUserTravelList() {
                this.loading = true
                let data = {
                    ...this.searchData,
                    ...this.pageData,
                }

                let { startTime, endTime } = data
                if (startTime.length <= 16 && startTime.length > 0) {
                    data.startTime = `${startTime}:00`
                    data.endTime = `${endTime}:00`
                }

                let server = '/member-server'
                let url = server + '/member/operLog/list'
                this.$ajaxPost(url, data)
                    .then(res=>{
                        this.loading = false
                        if(res&&res.code === 10000){
                            let { total, list } = res.data
                            this.listData = list || [];
                            this.pageData.count = total
                        }
                    })
                    .catch(err=>{
                        log(err);
                    })
            },
            handleTimePiker(val){
                let startDate = val[0]
                let endDate = val[1]
                if (startDate) {
                    startDate = startDate + " 00:00:00"
                    endDate = endDate + " 23:59:59"
                }

                Object.assign( this.searchData, {
                    startTime: startDate,
                    endTime: endDate,
                })
                this.getUserTravelList()
            },

            selectActions(value) {
                let emptyValue = value.length === 0
                if (emptyValue) {
                    value = ['', '']
                }
                let [parentType, subType] = value
                Object.assign(this.searchData, {
                    operParentType: parentType,
                    operType: subType,
                })
                this.getUserTravelList()
            },
            onPageChange(page) {
                this.pageData.page = page
                this.$nextTick(() => {
                    this.getUserTravelList();
                });
            },
            onPageSize(size) {
                this.pageData.size = size;
                this.getUserTravelList();
            },
        }
    }
</script>

<style lang="scss" scoped>

    .search-block {
        display: flex;
        justify-content: space-between;
    }



    .middle-block-narrow {
        margin-top: 20px;
    }


    .big-block-narrow {
        margin-top: 24px;
    }
</style>