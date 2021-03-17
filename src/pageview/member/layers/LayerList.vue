<!------------------------
 *@name Vue.js
 *@author Jo.gel
 *@date 2020/7/20 0020
 -------------------------->
<template>
  <div class="layer-List">
    <h2 class="h2">
      会员客群
    </h2>

    <!-- tabs -->
    <Tabs
      v-model="pageData.state"
      @on-click="tagChange"
    >
      <TabPane
        label="已上架"
        name="1"
      />
      <TabPane
        label="已下架"
        name="2"
      />
      <TabPane
        label="草稿箱"
        name="3"
      />
    </Tabs>


    <!-- query -->
    <div class="query-wrap">
      <QueryCom
        :prop-expand="propExpand"
        @onExpandFilter="onExpandFilter"
      >
        <div
          slot="query"
          class="clear"
        >
          <div
            class="left"
            style="float: left"
          >
            <Button
              v-if="__hasPower('createLayers')"
              type="primary"
              @click="$emit('whatComponent',{type:'LayerCreate'})"
            >
              创建客群
            </Button>
            <span class="create-time">创建时间：</span>
            <DatePicker
              class="w200"
              placeholder="开始时间 → 结束时间"
              transfer
              type="daterange"
              @on-change="onDateClick"
            />
          </div>

          <div
            class="right"
            style="float: right"
          >
            <Select
              v-model="pageData.inputName"
              class="button-gap"
              style="width: 100px"
            >
              <Option value="name">
                客群名称
              </Option>
              <Option value="keyword">
                关键词
              </Option>
              <Option value="modifierName">
                创建人
              </Option>
              <Option value="orgIdSearch">
                所属组织
              </Option>
              <Option value="id">
                客群ID
              </Option>
            </Select>

            <Select
              v-if="pageData.inputName === 'orgIdSearch'"
              v-model="pageData.orgIdSearch"
              class="large-select"
              filterable
              clearable
              :remote-method="getSourceOrg"
              @on-change="onSearch"
            >
              <Option
                v-for="(option, index) in sourceList"
                :key="index"
                class="large-select"
                :value="option.orgId"
              >
                {{ displayBelongOrg(option.name, option.belongOrg) }}
              </Option>
            </Select>
            <i-input
              v-else
              v-model.trim="pageData.keyWord"
              class="w300 input-dropdown-no-left fix-iview-icon"
              placeholder="请输入客群名称/ID"
              icon="ios-search"
              style="float: right;"
              clearable
              @on-enter="onSearch"
              @on-click="onSearch"
            />
          </div>
        </div>

        <div slot>
          <div style="border-bottom: 1px dotted #E2E2EA;padding: 8px 0;margin: 12px 0">
            是否收藏：
            <span
              :class="pageData.collectTypeArray.includes('1')?'span-a':'pointer'"
              @click="onQueryCollect('1')"
            >已收藏</span>
            <span
              style="margin-left: 10px;"
              :class="pageData.collectTypeArray.includes('2')?'span-a':'pointer'"
              @click="onQueryCollect('2')"
            >未收藏</span>
            <span
              style="margin-left: 10px;"
              :class="pageData.collectTypeArray.includes('')?'span-a':'pointer'"
              @click="onQueryCollect('')"
            >全部</span>
          </div>

          <div style="text-align: right">
            <Button
              type="primary"
              @click="onSearch"
            >
              查询
            </Button>
            <Button
              class="ml-10"
              @click="onResetFilter"
            >
              重置
            </Button>
          </div>
        </div>
      </QueryCom>
    </div>

    <!-- card -->

    <div class="card-table">
      <div style="border-radius: 16px;margin-top: 24px;">
        <Spin
          v-if="cardLoading"
          size="large"
          fix
        />
      </div>
      <LayerCard
        v-for="(item,index) in tableList"
        :key="index"
      >
        <div
          slot="body"
          class="card-body"
        >
          <div class="clear overflow">
            <h3
              style="float: left;max-width:100%;"
              class="overflow"
              :title="item.name"
            >
              {{ item.name }}
            </h3>

            <div style="float: right">
              <!-- star icon-->
              <Icon
                v-if="pageData.state!=='3'&&pageAction.includes('collectLayers')"
                class="pointer"
                :color="item.isCollected?'#FF4852':''"
                :type="item.isCollected?'ios-heart':'ios-heart-outline'"
                @click="onCollected(item)"
              />
            </div>
          </div>

          <Poptip
            trigger="hover"
            title="关键词"
            transfer
            :width="378"
            @on-popper-show="showIndex=index"
            @on-popper-hide="showIndex=-1"
          >
            <p
              :class="'keyword-text clamp-2 keyword-hover '+ (showIndex===index?'hover':'')"
              style="height: 60px;word-break: break-all;"
            >
              最关键词：{{ (item.keywords || []).join("，") }}
            </p>

            <div
              slot="content"
              style="max-height: 300px;overflow-y: auto"
            >
              <p
                v-for="(key,keyIndex) in item.keywords||[]"
                :key="keyIndex"
              >
                {{ key }}
              </p>
            </div>
            <p />
          </Poptip>

          <div class="line" />

          <h4>
            {{ $formatNumber(item.count, 0) }} 人
          </h4>

          <p class="p-text">
            ID: {{ item.id }}
          </p>
          <Tooltip
            placement="top"
            :content="displayBelongOrg(item.belongOrg, item.belongOrgStr)"
            max-width="250"
            :transfer="true"
          >
            <p class="p-text limit-address">
              所属组织：{{ displayBelongOrg(item.belongOrg, item.belongOrgStr) }}
            </p>
          </Tooltip>


          <p class="p-text">
            由 {{ item.creatorName }} 于 {{ $format(item.createTime) }} 创建
          </p>

          <div class="card-button">
            <div v-if="pageData.state!=='3' &&__hasPower('viewLayers')">
              <router-link :to="`/member/labelLayer/layers?id=${item.id}`">
                详情
              </router-link>
            </div>
            <!-- edit -->
            <div v-if="pageData.state==='3'&&__hasPower('editLayers')">
              <span
                class="span-a"
                @click="onEditLayer(item.id)"
              >编辑</span>
            </div>
            <div v-if="pageData.state!=='1'&&__hasPower('shelf')">
              <Poptip
                confirm
                title="是否确认上架？"
                @on-ok="onChangeUpDown('UP',item.id)"
              >
                <span class="span-a">上架</span>
              </Poptip>
            </div>

            <div v-if="pageData.state==='1'&&pageAction.includes('shelf')">
              <Poptip
                confirm
                title="下架将影响调用该客群的运营内容，您是否确认下架？"
                @on-ok="onChangeUpDown('DOWN',item.id)"
              >
                <span class="span-a">下架</span>
              </Poptip>
            </div>

            <div v-if="pageData.state!=='1'&&pageAction.includes('deleteLayers')">
              <!-- del -->
              <Poptip
                confirm
                title="删除后将无法恢复，确认要继续吗？"
                @on-ok="onDelete(item.id)"
              >
                <span class="span-a">删除</span>
              </Poptip>
            </div>
          </div>
        </div>
      </LayerCard>

      <div
        v-if="!tableList.length"
        class="card-no-data no-data"
      >
        <div>暂无数据</div>
      </div>
    </div>

    <div class="page">
      <Page
        class="pagebox"
        :total="pageData.count"
        :current="pageData.page"
        :page-size="pageData.size"
        show-elevator
        show-sizer
        show-total
        :page-size-opts="[8,16,24,32]"
        @on-change="onPageChange"
        @on-page-size-change="onPageSize"
      />
    </div>
  </div>
</template>
<script>
import QueryCom from "../../../components/QueryCom";
import LayerCard from "./components/LayerCard";
import mixinsGlobal from "../../../mixins/mixinsGlobal";
import {log} from "@/utils/tools";
import {displayBelongOrg} from "@/pageview/member/memberTool";

export default {
    name: 'LayerList',
    components: {
        QueryCom, LayerCard
    },
    mixins: [mixinsGlobal],
    props: {
        comData: Object
    },
    data() {
        return {
            propExpand: {
                isExpand: false
            },
            cardLoading: false,
            showIndex: -1,
            pageData: {
                page: 1,
                size: 8,
                count: 0,
                state: this.comData.state || "1",

                keyWord: "",
                inputName: "name",
                collectTypeArray: [],// 1 已收藏 2 未收藏
                beginTime: "",
                endTime: "",
            },
            tableList: [],

            sourceList: [],
        };
    },
    created() {
        this.getSourceOrg()
    },
    mounted() {
        this.getLayerList();
    },
    methods: {
        displayBelongOrg(...p) {
            return displayBelongOrg(...p)
        },
        onChangeUpDown(state, id) {
            this.$ajaxPost("/label-server/labelGroup/collectOrUnCollect", {
                id,
                state
            })
                .then(res => {
                    if (res && res.code === 10000) {
                        this.$Message.success(res.message || "操作成功");
                        this.onSearch();
                    }
                });
        },
        onEditLayer(id) {
            this.$router.push({
                path: "/member/labelLayer/layers",
                query: {
                    id,
                    type: "LayerCreate",
                    edit: true
                }
            });
        },
        onDelete(id) {
            this.$ajaxPost("/label-server/labelGroup/delete", {
                id
            })
                .then(res => {
                    if (res && res.code === 10000) {
                        this.$Message.success(res.message || "操作成功");
                        this.onSearch();
                    }
                });
        },
        onCollected(item) {
            this.$ajaxPost("/label-server/labelGroup/collectOrUnCollect", {
                id: item.id,
                state: item.isCollected ? "UNCOLLECT" : "COLLECT"
            })
                .then(res => {
                    if (res && res.code === 10000) {
                        this.$Message.success(res.message || "操作成功");
                        // 2020-10-19 收藏成功后不用重新调整页码拉取数据
                        this.getLayerList();
                    }
                });
        },
        tagChange() {
            this.onSearch();
        },
        onPageChange(page) {
            this.pageData.page = page;
            this.$nextTick(() => {
                this.getLayerList();
            });
        },
        onPageSize(size) {
            this.pageData.size = size;
            this.onSearch();
        },
        onResetFilter() {
            this.pageData.collectTypeArray = []
            this.onSearch()
        },
        onExpandFilter() {
            this.propExpand.isExpand = !this.propExpand.isExpand;
        },
        onDateClick(date) {
            this.pageData.beginTime = date[0];
            this.pageData.endTime = date[1];
            this.onSearch();
        },
        getLayerList() {
            const data = JSON.parse(JSON.stringify(this.pageData));
            if (data.collectTypeArray && data.collectTypeArray.length === 2 || !data.collectTypeArray.length) {
                data.collectType = "";
            } else data.collectType = data.collectTypeArray.join(",");
            delete data.collectTypeArray;
            delete data.inputName;
            delete data.keyWord;
            switch (this.pageData.inputName) {
                case "id":
                    data.id = this.pageData.keyWord;
                    break;
                case "name":
                    data.name = this.pageData.keyWord;
                    break;
                case "keyword":
                    data.keyWord = this.pageData.keyWord;
                    break;
                case "modifierName":
                    data.modifierName = this.pageData.keyWord;
                    break;
            }

            this.cardLoading = true;
            this.$ajaxGet("/label-server/labelGroup/list", {
                ...data
            })
                .then(res => {
                    if (res && res.code === 10000) {
                        this.tableList = res.data.list || [];
                        this.pageData.count = res.data.count || 0;
                    }
                    this.cardLoading = false;
                });

            // this.tableList = [
            //     {
            //         "id": "667788",
            //         "name": "客群001",
            //         "count": 99,
            //         "keywords": [
            //             "d",
            //             "哈哈哈"
            //         ],
            //
            //         "modifierName": "admin",
            //         "modifyTime": 1556013977000,
            //         "isCollected": true,
            //         "state": 1,
            //         belongOrgStr: '烦劳开孔淡粉、为二老森扥老将森老恐龙蛋烦劳撒旦法来看森扥老将森来看孙大夫看牢从解放路空单父老伽罗诶卷老'
            //     }
            // ]
        },
        onSearch() {
            this.pageData.page = 1;
            this.$nextTick(() => {
                this.getLayerList();
            });

        },

        onQueryCollect(type) {
            this.pageData.collectTypeArray = [type]
        },
        getSourceOrg(query = '') {
            let server = '/user-server'
            let url = server + '/platform/department/pageDepartment'

            let data = {
                searchType: 'name',
                searchContent: query,
            }

            this.$ajaxPost(url, data)
                .then(res => {
                    if (res.code === 10000) {
                        this.sourceList = res.data !== undefined ? res.data.list : []
                    }

                })
                .catch(err => {
                    log(err);
                });
        },
    }
};
</script>
<style lang="scss" scoped>
.query-wrap {
    padding: 24px;
    border-radius: 16px;
    background: #fff;
}

.card-table {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;

    .card-no-data {
        border-radius: 16px;
        background: #fff;
    }

    .card-button {
        //position: absolute;
        //bottom: 0;
        display: flex;
        text-align: center;
        border-radius: 16px;
        line-height: 38px;
        height: 38px;
        background: #FAFAFB;

        > div {
            flex: 1;
            display: inline-block;

            a, span {
                margin: 0 12px;
            }
        }

    }
}

.limit-address {
    text-overflow:ellipsis;
    width:250px;
    overflow:hidden;
    white-space:nowrap;
}

.card-body {
    position: relative;
    //height: 300px;
    //display: flex;
    //align-items: baseline;
    .line {
        margin: 16px 0;
        border-bottom: 1px solid #E2E2E9;
    }

    h3 {
        font-size: 18px;
        margin-bottom: 12px;
    }

    h4 {
        font-size: 16px;
        margin-bottom: 12px;
    }

    .card-button {
        margin-top: 24px;
    }

    .keyword-hover {
        border-radius: 8px;
        padding: 5px 8px;

    }

    .hover {
        color: #92929D;
        background: #F3EFF5;
    }

}
//
.keyword-text {
    font-size: 12px;
    font-family: SFUIDisplay-Light, SFUIDisplay;
    font-weight: 300;
    color: #92929D;
}

.create-time {
    margin-left: 20px;
    height: 24px;
    font-size: 14px;
    font-family: SFUIDisplay-Light, SFUIDisplay;
    font-weight: 300;
    color: #171725;
    line-height: 24px;

}

.large-select {
    width: 410px !important;
}

</style>
