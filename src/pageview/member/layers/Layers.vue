<!------------------------
 *@name Vue.js
 *@author Jo.gel
 *@date 2020/7/20 0020
 -------------------------->
<template>
  <div class="layers">
    <component
      :is="currentComponent"
      :com-data="comData"
      @whatComponent="whatComponent"
    />
  </div>
</template>
<script>
import LayerList from "./LayerList";
import LayerCreate from "./LayerCreate";
import LayerDetail from "./LayerDetail";

export default {
    name: 'Layers',
    components: {
        LayerList, LayerCreate, LayerDetail
    },
    data() {
        return {
            comData: {
                pageType: "LayerList"
            }
        };
    },
    computed: {
        currentComponent() {
            return this.comData.pageType || "LayerList";
        }
    },
    watch: {
        $route(to) {
            const {id, edit} = to.query;
            if (id && !edit) this.comData.pageType = "LayerDetail";
            else if (edit) this.comData.pageType = "LayerCreate";
        }
    },
    created() {
        const {id, edit} = this.$route.query;
        if (id && !edit) this.comData.pageType = "LayerDetail";
        else if (edit) this.comData.pageType = "LayerCreate";

        // this.debugCreateLayer()
    },
    methods: {
        whatComponent(label) {
            const {type, edit, state, id} = label;
            this.comData.pageType = type;
            this.comData.edit = edit;
            this.comData.state = state;
            this.comData.id = id || this.$route.query.id || "";
            if (type === 'LayerList') {
                this.$router.push("/member/labelLayer/layers");
            }
        },
        debugCreateLayer() {
            this.comData.pageType = 'LayerCreate'
        }
    }
};
</script>
<style lang="scss" scoped>
.layers {
}
</style>
