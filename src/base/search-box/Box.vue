<template>
    <div class="search-box">
        <i class="icon-search"></i>
        <input class="box" v-model="query" :placeholder="placeholder"/>
        <i class="icon-dismiss" v-show="query" @click="clear"></i>
    </div>
</template>
<script>
export default {
    name:'Search',
    props:{
        placeholder:{
            type:String,
            default:'搜索歌曲、歌手'
        }
    },
    methods:{
        clear(){
            this.query=''
        },
        setQuery(query){
            this.query=query
        }
    },
    created(){
        let timer
        this.$watch('query',(newQuery)=>{
            if(timer){
                clearTimeout(timer)
            }
            timer=setTimeout(()=>{
                // console.log(111)
                this.$emit('query',newQuery)
            },200)
        })
    },
    data(){
        return{
            query:''
        }
    }
}
</script>
<style lang="stylus" scoped>
    .search-box
        display flex
        align-items center
        box-sizing border-box
        width 100%
        padding 0 6px
        height 40px
        background white
        border-radius 6px
        .icon-search
            font-size 24px
            color #222
        .box
            flex 1
            margin 0 5px
            line-height 18px
            font-size 14px
        .icon-dismiss
            font-size 16px
            color #222
</style>