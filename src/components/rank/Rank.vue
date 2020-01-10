<template>
    <div class="rank" ref="rank">
        <scroll class="toplist" ref="scroll">
            <ul>
                <li class="item"
                    v-for="(item,index) in topList"
                    :key="index"
                    @click="select(item)"
                >
                    <div class="icon">
                        <img :src="item.picUrl" height="100" width="100">
                    </div>
                    <ul class="songlist">
                        <li class="song" v-for="(song,index) in item.songList" :key="index">
                            <span>{{index+1}}</span>
                            <span>{{song.songname}}-{{song.singername}}</span>
                        </li>
                    </ul>
                </li>
            </ul>
        </scroll>
        <router-view></router-view>
    </div>
</template>
<script>
import {getTopList} from 'api/rank'
import {playListMixin} from 'common/js/mixin'
import Scroll from 'base/scroll/Scroll'
import {mapMutations} from 'vuex'
export default {
    name:'Rank',
    data(){
        return {
            topList:[]
        }
    },
    mixins:[playListMixin],
    components:{
        Scroll
    },
    created(){
        this._getTopList()
    },
    methods:{
        ...mapMutations({
            setRankDisc:'SET_RANK_DISC'
        }),
        select(item){
            this.$router.push({
                path:`/rank/${item.id}`
            })
            this.setRankDisc(item)
        },
        _getTopList(){
            getTopList().then((res)=>{
                this.topList=res.data.topList
            })
        },
        handlePlayList(list){
            const bottom=list.length>0?'60px':''
            this.$refs.rank.style.bottom=bottom
            this.$refs.scroll.refresh()
        }
    }
}
</script>
<style lang="stylus" scoped>
    @import "~common/stylus/mixin"
    .rank
        position fixed
        top 88px
        width 100%
        bottom 0
        background $color-theme
        .toplist
            height 100%
            overflow hidden
            .item
                display flex
                margin 0 20px
                padding-top 20px
                height 100px
                &:last-child 
                    padding-bottom 20px
                .icon
                    flex 0 0 100px
                    width 100px
                    height 100px
                .songlist
                    flex 1
                    display flex
                    flex-direction column
                    justify-content center
                    padding 0 20px
                    height 100px
                    overflow hidden
                    background $color-theme-d
                    color $color-text
                    font-size 12px
                    .song
                        no-wrap()
                        line-height 26px
</style>