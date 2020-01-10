<template>
    <div class="search-list" v-show="searches.length">
        <ul>
            <li @click="select(item)" class="search-item" v-for="(item,index) in searches" :key="index">
                <span class="text">{{item}}</span>
                <span class="icon" @click.stop="deleteOne(item)">
                    <i class="icon-delete"></i>
                </span>
            </li>
        </ul>
    </div>
</template>
<script>
export default{
    name:'SearchList',
    props:{
        searches:{
            type:Array,
            default:[]
        }
    },
    methods:{
        select(item){
            this.$emit('addItem',item)
        },
        deleteOne(item){
            this.$emit('deleteItem',item)
        }
    }
}
</script>
<style lang="stylus" scoped>
    @import "~common/stylus/mixin"
    .search-list
        .search-item
            display: flex
            align-items: center
            height: 40px
            overflow: hidden
        .text
            flex: 1
            color: $color-text
        .icon
            extend-click()
            .icon-delete
                font-size: $font-size-small
                color: $color-text
</style>