<template>
    <div class="search">
        <div class="search-box-wrapper">
            <search-box ref="box" @query="onChangeQuery"></search-box>
        </div>
        <div class="shortcut-wrapper" v-show="!query">
            <scroll ref="scroll" class="shortcut" :data="newSearch">
                <div>
                    <div class="hot-key">
                        <h1 class="title">热门搜索</h1>
                        <ul>
                            <li class="item" @click="addQuery(item.k)" v-for="(item,index) in hotKey" :key="index">
                                <span>{{item.k}}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="search-history" v-show="searchHistory.length">
                        <h1 class="title">
                            <span class="text">搜索历史</span>
                            <span class="clear" @click="clearSearch">
                                <i class="icon-clear"></i>
                            </span>
                        </h1>
                        <search-list @addItem="addQuery" :searches="searchHistory" @deleteItem="deleteCurrent"></search-list>
                    </div>
                </div>
            </scroll>
        </div>
        <div class="search-result" ref="searchresult" v-show="query">
            <suggest :query="query" @select="pushHistoryList"></suggest>
        </div>
        <confirm ref="confirm" @clear="clearSearchHistory"></confirm>
        <router-view></router-view>
    </div>
</template>
<script>
import SearchBox from 'base/search-box/Box'
import {getHotKey} from 'api/search'
import Suggest from 'components/suggest/Suggest'
import {playListMixin} from 'common/js/mixin'
import {mapActions,mapGetters,mapMutations} from 'vuex'
import SearchList from 'base/search-list/SearchList'
import Confirm from 'base/confirm/Confirm'
import Scroll from 'base/scroll/Scroll'
export default {
    name:'Search',
    components:{
        SearchBox,
        Suggest,
        SearchList,
        Confirm,
        Scroll
    },
    mixins:[playListMixin],    
    data(){
        return{
            hotKey:[],
            query:''
        }
    },
    computed:{
        ...mapGetters([
            'searchHistory'
        ]),
        newSearch(){
            return this.hotKey.concat(this.searchHistory)
        }
    },
    created(){  
        this._getHotKey()
    },
    watch:{
        query(newQuery){
            
        }
    },
    methods:{
        clearSearch(){
            this.$refs.confirm.show()
        },
        deleteCurrent(item){
            this.deleteSearchHistory(item)
        },
        pushHistoryList(){
            this.saveSearchHistory(this.query)
        },
        ...mapActions([
            'saveSearchHistory',
            'deleteSearchHistory',
            'clearSearchHistory'
        ]),
        handlePlayList(playList){
            const bottom=playList.length>0?'60px':''
            this.$refs.searchresult.style.bottom=bottom
        },
        onChangeQuery(query){
            this.query=query
        },
        addQuery(query){
            this.$refs.box.setQuery(query)
        },
        _getHotKey(){
            getHotKey().then((res)=>{
                this.hotKey=res.data.hotkey.slice(0,10)
            })
        }
    }
}
</script>
<style lang="stylus" scoped>
    .search
        position fixed
        top 88px
        left 0
        right 0
        bottom 0
        background $color-theme
        .search-box-wrapper
            margin 20px
        .shortcut-wrapper
            position fixed
            top 178px
            bottom 0 
            width 100%
            .shortcut
                height 100%
                overflow hidden
                .hot-key
                    margin 0 20px 20px
                    .title
                        color $color-text
                        font-size 14px
                        margin-bottom 20px
                    .item
                        display inline-block
                        padding 5px 10px
                        margin 0 20px 10px 0
                        border-radius 6px
                        background $color-text
                        font-size 14px
                .search-history
                    position: relative
                    margin: 0 20px
                    .title
                        display: flex
                        align-items: center
                        height: 40px
                        font-size: $font-size-medium
                        color: $color-text
                        .text
                            flex: 1
                        .clear
                            extend-click()
                        .icon-clear
                            font-size: $font-size-medium
                            color: $color-text
        .search-result
            position fixed
            bottom 0 
            top 178px
            width 100%
</style>