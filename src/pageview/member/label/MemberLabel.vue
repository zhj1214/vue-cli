<!--
@desc 会员标签
-->
<template>
  <div class="member-label">
    <component :is="currentComponent" :prop-data="propData" @whatComponent="whatComponent" />
  </div>
</template>

<script>
  import LabelList from './labelList/LabelList'
  import LabelEdit from './components/LabelEdit'
  import LabelDetail from './components/LabelDetail'

  export default {
    name: 'MemberLabel',
    components: {
      LabelList,
      LabelEdit,
      LabelDetail,
    },
    data() {
      return {
        propData: {
          pageType: '',
          labelType: 1,
          labelId: '',
          edit: false,
        },
      }
    },
    computed: {
      currentComponent() {
        return this.propData.pageType || 'LabelList'
      },
    },
    methods: {
      whatComponent(label) {
        const { type, labelType, labelId, edit } = label
        this.propData.pageType = type
        this.propData.labelType = labelType
        this.propData.labelId = labelId
        this.propData.edit = edit
      },
    },
  }
</script>
