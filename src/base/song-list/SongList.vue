<template>
    <div class="song-list">
        <ul>
            <li class="item" 
                v-for="(song,index) in songs"
                :key="index"
                @click="select(song,index)"
            >   
                <div class="rank" v-show="rank">
                    <span :class="getRankCls(index)">{{getRankText(index)}}</span>
                </div>
                <div class="content">
                    <h2 class="name">{{song.name}}</h2>
                    <p class="desc">{{getDesc(song)}}</p>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    name:'SongList',
    methods:{
        getDesc(song){
            return `${song.singer}▪${song.album}`
        },
        select(item,index){
            this.$emit('selectItem',item,index)
        },  
        getRankCls(index){
            if(index<=2){
                return `icon icon${index}`
            }else{
                return 'text'
            }
        },
        getRankText(index){
            if(index>2){
                return index+1
            }
        }
    },
    props:{
        songs:{
            type:Array,
            default:[]
        },
        rank:{
            type:Boolean,
            default:false
        }
    }
}
</script>
<style lang="stylus" scoped>
    @import "~common/stylus/mixin"
    .song-list
        .item
            display flex
            align-items: center
            box-sizing: border-box
            height: 64px
            font-size: $font-size-medium
            .rank
                flex 0 0 25px
                width 25px
                margin-right 30px
                text-align center
                .icon
                    display inline-block
                    width 25px
                    height 24px
                    background-size 25px 24px
                    &.icon0
                        bg-image('first')
                    &.icon1
                        bg-image('second')
                    &.icon2
                        bg-image('third')
                .text
                    color #edc871
                    font-size $font-size-large
            .content
                flex: 1
                line-height: 20px
                overflow: hidden
                .name
                    color $color-text
                    no-wrap()
                .desc
                    margin-top 4px
                    no-wrap()
                    color $color-text
</style>