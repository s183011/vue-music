<template>
    <div class="singer" ref="singer">
        <list :data="singers" ref="list" @selectSinger="currentSinger"></list>
        <router-view></router-view>
    </div>
</template>
<script>
import {getSingerList} from 'api/singer.js'
import {ERR_OK} from 'api/config.js'
import Singer from 'common/js/singer.js'
import List from 'base/list/List'
import {mapMutations} from 'vuex'
import {playListMixin} from 'common/js/mixin'
const HOT_NAME='热门'
const HOT_LENGTH=10
export default {
    name:'Singer',
    mixins:[playListMixin],
    data(){
        return {
            singers:[]
        }
    },
    components:{
        List
    },
    created(){
        this._getSingers()
    },
    methods:{
        handlePlayList(playList){
            const bottom=playList.length>0?'60px':''
            this.$refs.singer.style.bottom=bottom
            this.$refs.list.refresh()
        },
        ...mapMutations({
            setSinger:'SET_SINGER'
        }),
        currentSinger(item){
            this.$router.push({
                path:`/singer/${item.id}`
            })
            this.setSinger(item)
        },
        _getSingers(){
            getSingerList().then((res)=>{
                this.singers=this._normalizeSinger(res.data.list)
            })
        },
        _normalizeSinger(list){
            let map={
                hot:{
                    title:HOT_NAME,
                    items:[]
                }
            }
            list.forEach((item,index)=>{
                if(index<HOT_LENGTH){
                    map.hot.items.push(new Singer({
                        id:item.Fsinger_mid,
                        name:item.Fsinger_name
                    }))
                }
                let key=item.Findex
                if(!map[key]){
                    map[key]={
                        title:key,
                        items:[]
                    }                    
                }
                map[key].items.push(new Singer({
                    id:item.Fsinger_mid,
                    name:item.Fsinger_name
                }))
            })
            let hot=[]
            let ret=[]
            for(let key in map){
                let val=map[key]
                if(val.title===HOT_NAME){
                    hot.push(val)
                }else{
                    ret.push(val)
                }
            }
            ret.shift()
            ret.sort((a,b)=>{
                return a.title.charCodeAt(0)-b.title.charCodeAt(0)
            })
            return hot.concat(ret)
        }
    }
}
</script>
<style lang="stylus" scoped>
    .singer
        position fixed
        top 88px
        left 0
        right 0
        bottom 0
        background $color-theme
</style>