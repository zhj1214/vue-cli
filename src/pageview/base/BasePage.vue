<!--
 * @Description: 从baseTable抽离出来的分页，为了配合table的slot使用
 * @Author: sam.xutao
 * @Date: 2020-03-16 10:19:40
 * @LastEditTime: 2021-01-29 16:54:39
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="base-table">
    <div class="page-row mt-10">
      <!--
			total数据总数
			page-size:每页条数
			current:当前页码
			-->
      <Page
        v-if="!noPage"
        class="pagebox"
        :total="pageData.count"
        :current="pageData.page"
        :page-size="pageData.pageSize||pageData.size||10"
        show-elevator
        show-sizer
        show-total
        :page-size-opts="pageList||[10,20,30,40]"
        :placement="placement"
        @on-change="(page)=>$emit('on-pageChange',page)"
        @on-page-size-change="(size)=>$emit('on-pageSize',size)"
      />
    </div>
  </div>
</template>

<script>
	export default {
		name: "BaseTable",
		props:{
			noPage:{
				type:Boolean,
				default:false
			},
			placement:{
				type:String,
				default:'bottom'
			},
			pageData:{
				type:Object,
				default:()=>{
					return {}
				}
			},
			pageList:Array
		}
	};
</script>

<style scoped lang="scss">
.page-row{
		text-align: right;
}
</style>
