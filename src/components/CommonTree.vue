<!--
 *@name CommonTree    通用层级树
 *@author Sam
 *@date 2019/08/17
 *@desc  通用层级树：支持节点分页加载，节点搜索，节点回显
 *@param type  业务类型  1部门 2品类 3品牌
 *@param isEdit 是否为编辑态
 *@param checkedList 已选中节点 带的信息有{id,parentId,title}，内部会根据是否勾选配置 isAll 和 isIndeterminate 状态
 *@param orgId  组织ID
 *@param isQCYL 是否为全程医疗
 *
 *@function getCheckedNode  （type,list}  根据type类别将已选节点内容返回
-->
<template>
  <div>
    <div
      v-if="maxTreeLevel"
      style="position: relative; z-index: 99"
    >
      <section class="tree-section">
        <div
          v-for="(item, level) in maxTreeLevel"
          :key="level"
          class="tree-box"
        >
          <Input
            v-if="isEdit || noCreate"
            search
            clearable
            placeholder="编码或名称，回车搜索"
            @on-search="(value) => searchNode(value, level)"
            @on-clear="() => searchNode('', level)"
          />
          <div :style="{ overflow: 'hidden', overflowY: 'auto' }">
            <!-- 根级别层级显示全选操作-->
            <Checkbox
              v-if="
                !level && isEdit && nodeList.length && !searchSet[level + '']
              "
              style="margin-bottom: 10px; margin-left: 14px; text-indent: 4px"
              :indeterminate="checkAllIndeter"
              :value="checkAll"
              @on-change="handleCheckAll"
            >
              全选
            </Checkbox>
            <!-- 节点是否展示： -->
            <!-- 1.因为节点是平级，故根据showList判定隶属于某个父级下的子节点才显示，当然根节点（!citem.parent）默认都展示 -->
            <!-- 2.在条件1的基础上，根据searchSet判定节点是否匹配检索值，优先级最高 -->
            <virtual-list
              v-if="type == 3 && !searchSet[level + ''] && isEdit"
              :size="22"
              :remain="8"
              :tobottom="
                isEdit || checkAll || noCreate
                  ? $_.debounce(handleReachBottom.bind(null, level), 500)
                  : null
              "
            >
              <div
                v-for="citem in treeList.filter(
                  (fitem) => fitem.level == item - 1
                )"
                v-show="canShow(citem, level)"
                :key="citem.id"
                :class="[
                  { isActive: showList.includes(citem.id) },
                  'tree-item',
                ]"
              >
                <!-- 名称和编码均为可检索字段 -->
                <Checkbox
                  v-if="isEdit"
                  :value="
                    checkedNodes.includes(citem.id) || citem.isAll || checkAll
                  "
                  :indeterminate="
                    indeterminateArr.includes(citem.id) ||
                      (citem.isIndeterminate && !checkAll)
                  "
                  @on-change="(status) => changeCheck(status, citem)"
                />
                <div
                  :title="citem.title"
                  @click="clickNode(citem)"
                >
                  {{ citem.title }}
                  <p :style="{ float: type == 3 ? 'right' : 'none' }">
                    编码：{{ citem.code }}
                  </p>
                </div>
                <Icon
                  v-if="citem.hasChild"
                  type="ios-arrow-forward"
                />
              </div>
            </virtual-list>
            <Scroll
              v-else
              :on-reach-bottom="
                isEdit || checkAll || noCreate
                  ? handleReachBottom.bind(null, level)
                  : null
              "
              :height="isEdit ? 190 : 270"
              :distance-to-edge="0"
            >
              <div
                v-for="citem in treeList.filter(
                  (fitem) => fitem.level == item - 1
                )"
                v-show="canShow(citem, level)"
                :key="citem.id"
                :class="[
                  { isActive: showList.includes(citem.id) },
                  'tree-item',
                ]"
              >
                <!-- 名称和编码均为可检索字段 -->
                <Checkbox
                  v-if="isEdit"
                  :value="
                    checkedNodes.includes(citem.id) || citem.isAll || checkAll
                  "
                  :indeterminate="
                    indeterminateArr.includes(citem.id) ||
                      (citem.isIndeterminate && !checkAll)
                  "
                  @on-change="(status) => changeCheck(status, citem)"
                />
                <div
                  :title="citem.title"
                  @click="clickNode(citem)"
                >
                  {{ citem.title }}
                  <p :style="{ float: type == 3 ? 'right' : 'none' }">
                    编码：{{ citem.code }}
                  </p>
                </div>
                <Icon
                  v-if="citem.hasChild"
                  type="ios-arrow-forward"
                />
              </div>
            </Scroll>
            <Spin
              v-if="levelLoading[level] || loading"
              size="large"
              fix
            >
              <Icon
                type="ios-loading"
                size="18"
                class="demo-spin-icon-load"
              />
              <div>加载中。。。</div>
            </Spin>
          </div>
        </div>
      </section>
      <!-- <div>所有节点：</div>{{nodeList}} -->
      <!-- <div>半选节点：</div>{{indeterminateArr}}
      <div>展示的节点：</div>{{showList}}
      <div>选择的节点：</div>{{checkedNodes}} -->
    </div>
    <div
      v-else
      class="no-data"
      style="text-align: center"
    >
      暂无数据
    </div>
  </div>
</template>
<script>
import _ from "lodash";
import virtualList from "vue-virtual-scroll-list";
export default {
  name: "CommTree",
  components: { "virtual-list": virtualList },
  props: {
    type: { required: true, type: [String, Number] }, // 业务id （部门，品类或品牌）
    isEdit: { required: true, type: Boolean }, // 是否为编辑态，编辑态才能复选，但不影响检索，触底搜索分页
    checkedList: { type: Array }, // 选中的节点
    orgId: { required: true, type: [String, Number] }, // 组织id
    isQCYL: { required: true, type: Boolean }, // 判定是否为全程医疗，全程医疗拉取数据需传 level，level为1，2或者3
    hasCheckAll: { required: true, type: Boolean }, // 是否全选
    noCreate: Boolean, // 不根据已选节点获取树结构数据
    noCreateNodes: Array, // 不根据已选节点获取树结构数据,则外部传入带结构节点数据
  },
  data() {
    return {
      maxTreeLevel: 0,
      showList: [], // 激活展示的节点
      checked: false,
      checkAll: this.hasCheckAll || false,
      checkAllFlag: false,
      nodeList: [],
      checkedNodes: [], // 选中的节点
      searchSet: {}, // 记录每一层级搜索信息
      indeterminateArr: [], // 记录半选节点
      pageObj: {}, // 记录节点分页信息
      hasRender: false,

      hasLoadAll: false,
      rootCount: 0,
      loading: false,
      levelLoading: [false, false, false],
      API: {
        pageList:
          "/setting-server/internal/setting/goodsClassification/pageList",
      },
    };
  },
  computed: {
    rootPage() {
      return Math.ceil(this.rootCount / 200);
    },
    // 全选按钮的半选状态
    checkAllIndeter() {
      if (!this.isEdit) return false;
      let flag = 0,
        indeter = 0;
      let curRoot = this.treeList.filter((item) => {
        if (!item.parentId) {
          if (this.checkedNodes.includes(item.id)) flag++;
          if (this.indeterminateArr.includes(item.id)) indeter++;
          return item;
        }
      });
      // 有一个根节点是选中的，且不是全部勾选，则返回半选,或者有一个根节点是半选的
      if ((flag && curRoot.length != flag) || indeter) {
        // this.checkAll = false;
        return true;
      } else {
        return false;
      }
    },
    // 层级树
    treeList() {
      let iList = this.uniqueArr(this.flatTree(this.nodeList, 0), "id"); //this.nodeList||
      // console.time("===tree load===")
      iList.map((item) => {
        item.id = this.isQCYL
          ? item.id.toString().match("_")
            ? item.id
            : item.parentId + "_" + item.id
          : item.id;

        if (this.isEdit) {
          // console.time("===tree item load==="+item.id)
          const { indeterminate, all } = this.renderNodeState(
            item.id,
            iList,
            item
          );
          item.isIndeterminate = indeterminate; // 根据子节点数据判定当前节点是否半选
          console.log(
            item.name,
            indeterminate,
            this.checkedNodes.includes(item.id),
            all
          );
          item.isAll = indeterminate
            ? false
            : this.checkedNodes.includes(item.id) || all; // 根据子节点数据判定当前节点是否全选
          // console.timeEnd("===tree item load==="+item.id)
        }
        return item;
      });
      // console.timeEnd("===tree load===")
      return this.uniqueArr(iList, "id");
    },
  },
  watch: {
    checkedNodes(nval) {
      let allTempList = this.uniqueArr(
        this.treeList.concat(this.checkedList),
        "id"
      );
      // let rootNode  = allTempList.filter(item=>!item.parentId||item.parentId=='0'),rootCheckCount = 0;

      let allCheckedNodes = allTempList.filter((item) => {
        // 如果父级勾选了，则子级不用返回
        if (nval.includes(item.id) && !nval.includes(item.parentId)) {
          // rootCheckCount ++;
          return item;
        }
        // 如果节点为半选，且它不在已选节点里，也要返回
        if (
          (item.isIndeterminate || this.indeterminateArr.includes(item.id)) &&
          !nval.includes(item.id)
        ) {
          return item;
        }
      });

      let curAll = JSON.parse(JSON.stringify(allCheckedNodes)).map((item) => {
        item.isAll = item.isAll ? 1 : 0; // 全选处理成数字标识
        item.id =
          (this.isQCYL
            ? item.id.toString().split("_")[
                item.id.toString().split("_").length - 1
              ]
            : item.id) * 1;
        item.parentId =
          (this.isQCYL
            ? item.parentId.toString().split("_")[
                item.parentId.toString().split("_").length - 1
              ]
            : item.parentId) * 1;
        return item;
      });
      console.info("===all checked node===", curAll, nval);
      // 如果全选是勾选状态，则已选节点可不传
      this.$emit(
        "getCheckedNode",
        this.type,
        this.checkAll ? [] : this.uniqueArr(curAll, "id"),
        this.checkAll
      );
    },
    checkedList(nval) {
      this.renderUpdate(nval);
    },
  },
  mounted() {
    // 编辑状态下拉取层级树，非编辑状态下直接根据已选节点回显树
    if (this.isEdit) {
      this.getTreeData({
        organizationId: this.orgId,
        type: this.type,
        page: 1,
        size: 100,
        parentId: null,
        level: this.isQCYL ? 1 : null,
      }).then((res) => {
        if (res && res.list) {
          this.nodeList = res.list.map((item) => {
            return {
              ...item,
              level: this.isQCYL
                ? item.level
                  ? item.level - 1
                  : 0
                : item.level,
            };
          });
          this.rootCount = res.count;
          if (this.hasCheckAll) {
            this.nodeList.map((item) => {
              this.checkedNodes.push(
                this.isQCYL
                  ? item.id.toString().match("_")
                    ? item.id
                    : this.renderQCYLnode(
                        item.id,
                        item.parentId,
                        this.checkedList
                      )
                  : item.id
              );
            });
          }
        }
      });
    } else {
      if (this.noCreate) {
        this.nodeList = this.noCreateNodes;
      }
      // 根据已选节点显示树
      if (this.checkedList && this.checkedList.length && !this.noCreate) {
        this.renderShowTree();
      }
      if (this.hasCheckAll) {
        this.getTreeData({
          organizationId: this.orgId,
          type: this.type,
          page: 1,
          size: 100,
          parentId: null,
          level: this.isQCYL ? 1 : null,
        }).then((res) => {
          if (res && res.list) {
            this.rootCount = res.count;
            this.nodeList = res.list.map((item) => {
              return {
                ...item,
                level: this.isQCYL ? item.level - 1 : item.level,
              };
            });
          }
        });
      }
    }
    // 获取当前类别下最大树层级
    this.getTreeLevel();
  },
  updated() {
    let nval = this.checkedList;
    this.renderUpdate(nval);
    if (this.checkAllIndeter) {
      this.checkAll = false;
    }
  },
  methods: {
    // 回显节点过来
    renderUpdate(nval) {
      let tempChecked = JSON.parse(JSON.stringify(this.checkedNodes)),
        tempIndeter = JSON.parse(JSON.stringify(this.indeterminateArr));
      if (!this.hasRender) {
        this.hasRender = true;
        // this.checkAll = this.hasCheckAll;
        // this.nodeList = nval;
        nval.map((item) => {
          if (item.isAll) {
            tempChecked.push(
              this.isQCYL
                ? this.renderQCYLnode(item.id, item.parentId, nval)
                : item.id
            );
            this.checkedNodes = [...new Set(tempChecked)];
          } else {
            !this.checkAll &&
              tempIndeter.push(
                this.isQCYL
                  ? this.renderQCYLnode(item.id, item.parentId, nval)
                  : item.id
              );
            this.indeterminateArr = [...new Set(tempIndeter)];
            // 避免子级数据优先于父级加载完成
            setTimeout(
              () =>
                this.loadChildNodes(
                  this.isQCYL
                    ? this.renderQCYLnode(item.id, item.parentId, nval)
                    : item.id,
                  item.level || 0
                ),
              200
            );
          }
        });
        // 如果非编辑状态且全选则正常拉取数据
        if (this.hasCheckAll) {
          this.getTreeData({
            organizationId: this.orgId,
            type: this.type,
            page: 1,
            size: 100,
            parentId: null,
            level: this.isQCYL ? 1 : null,
          }).then((res) => {
            if (res && res.list)
              this.nodeList = this.uniqueArr([...nval, ...res.list], "id");
          });
        }
        this.$emit("getCheckedNode", this.type, nval, this.hasCheckAll);
      }
    },
    // 节点是否显示
    canShow(citem, level) {
      if (this.isEdit) {
        return (
          (!this.searchSet[level + ""] ||
            (this.searchSet[level + ""] &&
              (citem.title + citem.code).match(this.searchSet[level + ""]))) &&
          (this.showList.includes(citem.parentId) || !citem.parentId)
        );
      } else {
        let curChecked = [];
        this.checkedList.map((item) => curChecked.push(item.id));
        return (
          (this.showList.includes(citem.parentId) &&
            this.checkedNodes.includes(citem.id)) ||
          !citem.parentId ||
          (this.checkAll && this.showList.includes(citem.parentId)) ||
          (curChecked.includes(citem.id) &&
            this.showList.includes(citem.parentId))
        );
      }
    },
    // 判定当前节点祖父节点是否为勾选
    hasSuperChecked(node) {
      let pnode = this.nodeList.filter((item) => item.id == node.parentId);
      if (!node.parentId || node.parentId == "0") {
        return this.checkedNodes.includes(node.id);
      }
      if (pnode && pnode.length) {
        return this.hasSuperChecked(pnode[0], this.nodeList);
      }
    },
    // 针对全程医疗构建 id
    renderQCYLnode(id, pid, list) {
      let pnode = list.filter((item) => item.id == pid);
      if (!pid || pid == "0") {
        return pid + "_" + id;
      }
      if (pnode && pnode.length) {
        return (
          this.renderQCYLnode(pnode[0].id, pnode[0].parentId, list) + "_" + id
        );
      }
    },
    // 根据特定标识做数组去重
    uniqueArr(list, flag) {
      let iObj = {},
        actList = [];
      for (var i = 0; i < list.length; i++) {
        if (!iObj[list[i][flag]]) {
          iObj[list[i][flag]] = 1;
          actList.push(list[i]);
        }
      }
      return actList;
    },
    // 根据类别获取最大 level 层级
    async getTreeLevel() {
      const { data } = await this.$ajaxPost(
        "/setting-server/internal/setting/getMaxLevel",
        {
          organizationId: this.orgId,
          type: this.type,
        }
      );
      this.maxTreeLevel = data || 0;
    },
    // 根据已选节点回显树
    async renderShowTree() {
      const { data } = await this.$ajaxPost(
        "/setting-server/internal/setting/createTree",
        {
          treeNodeList: this.checkedList.map((item) => {
            item.level = this.isQCYL ? item.level + 1 : item.level;
            return item;
          }),
        }
      );
      if (data) {
        this.nodeList = data.map((item) => {
          return { ...item, level: this.isQCYL ? item.level - 1 : item.level };
        });
      }
    },
    renderNodeState(id, list, node) {
      // 20190906 4000+节点时，每个节点平均处理耗时由 5.58ms 优化为 0.005ms 左右

      let isIndeterminate = false,
        isAll = false;
      let flag = 0,
        indeter = 0;

      // 根据当前节点获取对应子节点
      let allChild = node && node.hasChild ? this.getAllChild(id, list) : []; //list.filter(item=>item.parentId==id);
      allChild.map((item) => {
        if (this.checkedNodes.includes(item.id)) {
          flag += 1;
        }
        if (this.indeterminateArr.includes(item.id)) {
          indeter += 1;
        }
      });
      // 当前节点是否全选取决于对应节点子节点全部选中
      isAll = flag && flag == allChild.length;
      // 至少有一个子节点被选中则为半选  或者 至少有一个半选的子节点
      isIndeterminate = (flag && flag != allChild.length) || indeter > 0;
      if (isAll && !this.checkedNodes.includes(id)) {
        this.checkedNodes.push(id);
        if (this.indeterminateArr.includes(id)) {
          this.indeterminateArr.splice(this.indeterminateArr.indexOf(id), 1);
        }
      }
      if (isIndeterminate && !this.checkedNodes.includes(id)) {
        this.indeterminateArr = [...new Set(this.indeterminateArr.concat(id))];
      }
      if (!flag) {
        isAll = false;
        isIndeterminate = false;
        // if(this.indeterminateArr.includes(id)){
        //   this.indeterminateArr.splice(this.indeterminateArr.indexOf(id),1)
        // }
      }
      return {
        indeterminate: isIndeterminate,
        all: isAll,
      };
    },
    // 根据点击节点记录对应要显示的层级节点id列表，并拉取对应子节点数据
    clickNode(node) {
      console.info(this.renderParent(node.id));
      // 记录要显示的层级
      if (!this.showList.includes(node.id))
        this.showList = [...new Set(this.renderParent(node.id))];

      // 如果当前点击节点有子节点，则拉取子节点数据
      if (this.isEdit || (!this.isEdit && node.isAll) || this.checkAll) {
        node.hasChild && this.loadChildNodes(node.id, node.level);
      } else if (!this.isEdit && node.hasChild) {
        this.loadChildNodes(node.id, node.level);
      }
    },
    // 获取所有层级父节点
    renderParent(id) {
      let pList = [];
      this.treeList.map((item) => {
        if (item.id == id) {
          pList.push(id);
          if (item.parentId) {
            pList = pList.concat(this.renderParent(item.parentId));
          }
        }
      });
      return pList;
    },
    /**
     * 节点勾选
     * status:勾选状态 false/true
     * node:操作的节点 根据 status 响应设置对应子节点勾选状态 */
    changeCheck(status, node) {
      let curId = node.id,
        curNode = this.nodeList.filter((item) => item.id == curId);
      // 获取与当前点击节点相关的子节点
      var allChild =
          curNode.length && curNode[0].hasChild
            ? this.getAllChild(curId, this.treeList)
            : [],
        tempChecked = JSON.parse(JSON.stringify(this.checkedNodes));
      if (!status && this.hasRender) {
        this.checkAll = false;
      }
      // console.info(allChild,'==all child==');
      // 父节点勾选，则子节点选中
      this.indeterminateArr.includes(curId) &&
        this.indeterminateArr.splice(this.indeterminateArr.indexOf(curId), 1);
      if (status) {
        allChild.map((item) => {
          tempChecked.push(item.id);
        });
        tempChecked.push(curId);
        this.checkedNodes = [...new Set(tempChecked)];
      } else {
        this.checkAllFlag = false;
        if (tempChecked.includes(curId)) {
          tempChecked.splice(tempChecked.indexOf(curId), 1);
        }
        // 父节点取消勾选，则子节点取消选中
        allChild.map((item) => {
          if (tempChecked.indexOf(item.id) > -1)
            tempChecked.splice(tempChecked.indexOf(item.id), 1);
        });
        if (tempChecked.indexOf(curId) > -1)
          tempChecked.splice(tempChecked.indexOf(curId), 1);
        console.log("所有父节点：", this.getAllParent(this.treeList, node.id));
        let AllParent = this.getAllParent(this.treeList, node.id);
        AllParent.map((item) => {
          // 如果父节点的父级节点是已选中，也应移除
          if (tempChecked.includes(item.id)) {
            tempChecked.splice(tempChecked.indexOf(item.id), 1);
          }
        });
        this.checkedNodes = [...new Set(tempChecked)];
      }
    },
    // 根据节点获取所有层级子节点
    getAllChild(id, list) {
      var allList = [],
        haschildArr = [];
      list.map((item) => {
        // let cid = this.isQCYL?id.toString().split("_")[item.level]:id;
        if (item.parentId == id && !haschildArr.includes(item.id)) {
          haschildArr.push(item.id);
          allList.push(item);
          if (item.children) {
            allList = allList.concat(this.getAllChild(item.id, item.children));
          }
        }
      });
      return allList;
    },
    getAllParent(list, id) {
      var temp = [];
      var forFn = function (arr, id) {
        for (var i = 0; i < arr.length; i++) {
          var item = arr[i];
          if (item.id === id) {
            temp.push(item);
            forFn(list, item.parentId);
            break;
          } else {
            if (item.children) {
              forFn(item.children, id);
            }
          }
        }
      };
      forFn(list, id);
      return temp.splice(1);
    },
    // 扁平化树结构，并为每层树设置level
    flatTree(nodes, flag) {
      let cList = [];
      nodes.map((item) => {
        item.level = item.level || flag; // 节点已有level则使用自身level
        if (item.children) {
          cList.push(item);
          cList = cList.concat(this.flatTree(item.children, flag + 1));
        } else {
          cList.push(item);
        }
      });
      return cList;
    },
    // 点击全选按钮动态更新根节点选中状态
    handleCheckAll(status) {
      // 获取所有根节点
      // let rootParent = this.treeList.filter(item=>!item.parent);
      this.checkAllFlag = status;
      this.checkAll = status;
      if (status) {
        // 点击全选加载出所有一级节点数据  0903
        if (!this.hasLoadAll) {
          this.loading = true;
          let iPage = 1,
            loadList = [],
            tempList = [];
          while (iPage < this.rootPage || iPage == this.rootPage) {
            loadList.push(
              this.getTreeData({
                organizationId: this.orgId,
                type: this.type,
                page: iPage,
                size: 200,
                parentId: null,
                level: this.isQCYL ? 1 : null,
              })
            );
            iPage++;
          }
          Promise.all(loadList)
            .then((arr) => {
              this.hasLoadAll = true;
              this.loading = false;
              if (arr && arr.length) {
                arr.map((item) => {
                  tempList = tempList.concat(...item.list);
                });
                this.nodeList = this.uniqueArr(
                  [...this.nodeList, ...tempList],
                  "id"
                );
                // 全选后把对应所有字节点都记录为已勾选
                tempList.map((item) => {
                  let curId = this.isQCYL
                    ? item.id.toString().match("_")
                      ? item.id
                      : this.renderQCYLnode(
                          item.id,
                          item.parentId,
                          this.checkedList
                        )
                    : item.id;
                  if (!this.checkedNodes.includes(curId))
                    this.checkedNodes.push(curId);
                });
              }
            })
            .catch(() => {
              this.loading = false;
            });
        }
        // == 0903 ==

        this.indeterminateArr = [];
        this.checkedNodes = this.treeList.map((item) => item.id);
      } else {
        this.checkedNodes = [];
      }
    },
    // 根据父级id获取其对应子节点树
    async countChilds(id) {
      let curItem = this.treeList.filter((item) => item.id == id),
        curLevel = curItem && curItem.length ? curItem[0].level + 2 : 1;
      let actID =
        this.isQCYL && id ? id.split("_")[id.split("_").length - 1] : id;
      const { data } = await this.$ajaxPost(this.API.pageList, {
        organizationId: this.orgId,
        type: this.type,
        page: 1,
        size: 100,
        parentId: actID,
        level: this.isQCYL ? curLevel : null,
      });
      return data && data.count;
    },
    // 滚动加载对应level下的子节点数据
    async handleReachBottom(level) {
      // 根据level从showList里获取其父级id,
      let levelParentId = null,
        tempShow = JSON.parse(JSON.stringify(this.showList));
      levelParentId = level > 0 ? tempShow.reverse()[level - 1] : null;
      let actParent =
        this.isQCYL && levelParentId
          ? levelParentId.split("_")[levelParentId.split("_").length - 1]
          : levelParentId;

      // 记录当前级别下已有节点数
      let parentNode = this.treeList.filter((item) => {
          if (!levelParentId) {
            return !levelParentId;
          } else {
            return item.parentId == levelParentId;
          }
        }),
        curParentNodeCount = parentNode.length;
      const step = 100;
      return new Promise(async (resolve) => {
        let curCount = 0,
          curSize = 0;
        if (this.pageObj[levelParentId + ""]) {
          curCount = this.pageObj[levelParentId + ""].count;
          curSize = this.pageObj[levelParentId + ""].size;
          if (curCount > curSize) {
            let pageList = [];
            this.pageObj[levelParentId + ""].size = curSize + 100;
            const { data } = await this.$ajaxPost(this.API.pageList, {
              organizationId: this.orgId,
              type: this.type,
              page: (curSize + 100) / 100,
              size: 100,
              parentId: actParent,
              level: this.isQCYL ? level + 1 : null,
            });
            if (data && data.list) {
              data.list.map((item) => {
                let iNode = {
                  ...item,
                  level: level,
                  parentId: this.isQCYL ? levelParentId : actParent,
                };
                pageList.push(iNode);
              });
              let tempChecked = [];
              //如果父级为勾选，则子级全部勾选
              pageList.map((item) => {
                let actId = this.isQCYL
                  ? item.id.toString().match("_")
                    ? item.id
                    : item.parentId + "_" + item.id
                  : item.id;
                if (
                  this.checkedNodes.includes(
                    this.isQCYL ? levelParentId : actParent
                  ) ||
                  this.checkAll
                ) {
                  tempChecked.push(actId);
                }
              });
              this.checkedNodes = [
                ...new Set(this.checkedNodes.concat(tempChecked)),
              ];
              this.nodeList = this.uniqueArr(
                [...this.nodeList, ...pageList],
                "id"
              );
              console.log(pageList, "==pagelist==", this.nodeList);
            }
          }
          resolve();
        } else {
          this.countChilds(levelParentId).then(async (count) => {
            this.pageObj[levelParentId + ""] = {
              count: count,
              size: 100 + step,
            };
            // 如果当前还有分页数据，则拉取
            if (count - curParentNodeCount > 0) {
              let pageList = [];
              const { data } = await this.$ajaxPost(this.API.pageList, {
                organizationId: this.orgId,
                type: this.type,
                page: 2,
                size: 100,
                parentId: actParent,
                level: this.isQCYL ? level + 1 : null,
              });
              if (data && data.list) {
                data.list.map((item) => {
                  let iNode = {
                    ...item,
                    level: level,
                    parentId: this.isQCYL ? levelParentId : actParent,
                  };
                  pageList.push(iNode);
                });
                let tempChecked = [];
                //如果父级为勾选，则子级全部勾选
                pageList.map((item) => {
                  let actId = this.isQCYL
                    ? item.id.toString().match("_")
                      ? item.id
                      : item.parentId + "_" + item.id
                    : item.id;
                  if (
                    this.checkedNodes.includes(
                      this.isQCYL ? levelParentId : actParent
                    ) ||
                    this.checkAll
                  ) {
                    tempChecked.push(actId);
                  }
                });
                this.checkedNodes = [
                  ...new Set(this.checkedNodes.concat(tempChecked)),
                ];

                this.nodeList = this.uniqueArr(
                  [...this.nodeList, ...pageList],
                  "id"
                );
                console.log(pageList, "==pagelist==", this.nodeList);
                resolve();
              }
            } else {
              setTimeout(() => this.$Message.success("加载完毕"), 500);
              resolve();
            }
          });
        }
      });
    },
    // 根据父节点id获取子节点数据，并配置层级
    async loadChildNodes(id, level) {
      let childList = [];
      let curId =
        this.isQCYL && id ? id.split("_")[id.split("_").length - 1] : id;

      this.levelLoading[level] = true;
      const { data } = await this.$ajaxPost(this.API.pageList, {
        organizationId: this.orgId,
        type: this.type,
        page: 1,
        size: 100,
        parentId: curId,
        level: this.isQCYL ? level + 2 : null,
      });
      this.$set(this.levelLoading, level, false);
      if (data && data.list) {
        data.list.map((item) => {
          let iNode = {
            ...item,
            name: item.title,
            level: level + 1,
            parentId: this.isQCYL ? id : curId,
          }; // 全程医疗的时候将整理过的父级id作为标识
          childList.push(iNode);
        });
        let curParentIndex = -1,
          curParentNode = this.treeList.filter((item, index) => {
            let parentId = this.isQCYL
              ? item.id.toString().split("_")[
                  item.id.toString().split("_").length - 1
                ]
              : item.id;
            if (parentId == curId) {
              curParentIndex = index;
              return item;
            }
          });
        this.renderPageNode(curId, this.nodeList, childList);
        console.log(curParentNode, "==parent node==");

        let curList = JSON.parse(JSON.stringify(this.nodeList)),
          tempChecked = [];
        //如果父级为勾选，则子级全部勾选
        childList.map((item) => {
          let actId = this.isQCYL
            ? item.id.toString().match("_")
              ? item.id
              : item.parentId + "_" + item.id
            : item.id;
          if (this.checkedNodes.includes(id)) {
            tempChecked.push(actId);
          }
        });
        this.checkedNodes = [...new Set(this.checkedNodes.concat(tempChecked))];
        if (curParentIndex > -1) {
          curList.splice(curParentIndex, 1, {
            ...curParentNode[0],
            children: childList,
            total: data.count,
          });
        }
        console.log("==curList==", [...childList, ...curList]);
        this.nodeList = this.uniqueArr([...childList, ...curList], "id");
      }
      return data;
    },
    /**
     * 根据检索内容搜索每个层级节点
     * search:检索内容
     * level:将检索的节点放置到哪个层级下 */
    searchNode: _.debounce(async function (search, level) {
      // 根据level从showList里获取起父级id,
      let levelParentId = null,
        tempShow = JSON.parse(JSON.stringify(this.showList));
      levelParentId = level > 0 ? tempShow.reverse()[level - 1] : null;
      let actParent =
        this.isQCYL && levelParentId
          ? levelParentId.split("_")[levelParentId.split("_").length - 1]
          : levelParentId;

      console.info("search level parent:", levelParentId);
      // 根据对应层级设置检索内容
      this.$set(this.searchSet, level, search);

      let searchList = [];
      const { data } = await this.$ajaxPost(this.API.pageList, {
        organizationId: this.orgId,
        type: this.type,
        page: 1,
        size: 100,
        parentId: actParent,
        title: search,
        level: this.isQCYL ? level + 1 : null,
      });
      // 根据搜索内容检索节点
      if (search && data && data.list) {
        searchList = data.list.map((item) => {
          return {
            ...item,
            level,
            parentId: this.isQCYL ? levelParentId : actParent,
          };
        });
        let tempChecked = [];
        //如果父级为勾选，则子级全部勾选
        searchList.map((item) => {
          let actId = this.isQCYL
            ? item.id.toString().match("_")
              ? item.id
              : item.parentId + "_" + item.id
            : item.id;
          if (
            this.checkedNodes.includes(
              this.isQCYL ? levelParentId : actParent
            ) ||
            this.checkAll
          ) {
            tempChecked.push(actId);
          }
        });
        this.checkedNodes = [...new Set(this.checkedNodes.concat(tempChecked))];
        this.nodeList = this.uniqueArr([...this.nodeList, ...searchList], "id");
      }
    }, 500),
    // 获取树数据
    async getTreeData(params) {
      const { data } = await this.$ajaxPost(this.API.pageList, params);

      return data;
    },
    /**
     * 根据分页数据添加给具体节点
     * id: 需要添加分页数据的节点id
     * tree: 树结构数据
     * nodes：要添加的节点数据 */
    renderPageNode(id, tree, nodes) {
      let iNodes = tree.filter((item) => {
        let parentId = this.isQCYL
          ? item.id.toString().split("_")[
              item.id.toString().split("_").length - 1
            ]
          : item.id;
        if (parentId == id) {
          item.children = nodes;
          return item;
        }
        if (item.children) {
          return this.renderPageNode(id, item.children, nodes);
        }
      });
      return iNodes;
    },
  },
};
</script>
<style lang="scss" scoped>
.tree-box {
  padding: 20px 12px 0 0;
  height: 100%;
  min-height: 150px;
  flex: 1;
  min-width: 160px;
  .tree-item {
    border-left: solid 2px #fff;
    padding: 5px 0 5px 20px;
    display: flex;
    &:hover {
      cursor: pointer;
      background: rgba(61, 113, 255, 0.04);
    }
    div {
      flex: 1;
      display: inline-block;
      max-width: 80%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      p {
        color: #b5bbca;
        font-size: 12px;
      }
    }
    i {
      margin: auto;
      font-size: 16px;
      color: rgba(154, 168, 184, 1);
    }
  }
  .isActive {
    background: rgba(61, 113, 255, 0.04);
    border-left: solid 2px rgba(61, 113, 255, 1);
  }
  > .ivu-input-wrapper {
    margin-bottom: 16px;
  }
}
.tree-section {
  display: flex;
  * {
    box-sizing: border-box;
  }
  border: 1px solid rgba(225, 230, 235, 1);
  background: #fff;
  height: 300px;
  > div.tree-box + .tree-box {
    border-left: 1px solid rgba(225, 230, 235, 1);
  }
}
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
<style lang="scss">
.tree-box .ivu-input-wrapper {
  width: 92%;
  margin-left: 6%;
  input,
  .ivu-input-icon {
    height: 38px;
    line-height: 38px;
  }
  .ivu-input-icon:before {
    font-size: 22px;
  }
}
</style>
