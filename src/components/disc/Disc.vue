<template>
    <transition name="slide" appear>
        <music-list class="disc" :title="title" :bgImage="bgImage" :songs="songs"></music-list>
    </transition>    
</template>
<script>
import {mapGetters} from 'vuex'
import axios from 'axios'
import MusicList from 'components/music-list/MusicList'
import Song from 'common/js/song'
export default{
    name:'Disc',
    data(){
        return {
            songs:[]
        }
    },
    components:{
        MusicList
    },
    computed:{
        ...mapGetters([
            'disc'
        ]),
        title(){
            return this.disc.name
        },
        bgImage(){
            return this.disc.imgUrl
        }
    },
    created(){
       this._getSongs()
    },
    methods:{
        _getSongs(){
            // console.log(Boolean(this.disc.id)) this.disc始终为true,而this.disc.id在刷新当前页面为false
            if(!this.disc.id){
                this.$router.push('/recommend')
                return
            }
            axios({
                url:`http://musicapi.xiecheng.live/playlist/detail?id=${this.disc.id}`
            }).then((res)=>{
                const data=res.data.playlist.tracks
                data.forEach((item,index)=>{
                     this.songs.push(new Song({
                         id:item.id,
                         name:item.name,
                         image:item.al.picUrl,
                         singer:this.processSinger(item.ar),
                         album:item.al.name,
                         duration:this.processDt(item.dt)
                     }))
                })
                this.songs.forEach((item)=>{
                    axios({
                        url:`http://localhost:3000/song/url?id=${item.id}`
                    }).then((res)=>{
                        item.url=res.data.data[0].url
                    })   
                })
                this.songs.forEach((item)=>{
                    axios({
                        url:`http://musicapi.xiecheng.live/lyric?id=${item.id}`
                    }).then((res)=>{
                        if(res.data.nolyric){
                            return
                        }
                        item.cloudLyric=res.data.lrc.lyric
                    })   
                })
            })
        },
        processSinger(singer){
            const ret=[]
            singer.forEach((item)=>{
                ret.push(item.name)
            })
            return ret.join('/')
        },
        processDt(dt){
            let arr=dt.toString().split('')
            let arrDel=dt.toString().slice(-3).split('')
            arrDel.forEach((item)=>{
                let index=arr.indexOf(item)
                arr.splice(index,1)
            })
            return arr.join('')
        }
    }
}
</script>
<style lang="stylus" scoped>
    @import "~common/stylus/mixin"
    .disc>>>.title
        font-size 16px
        no-wrap()
    .disc>>>.back
        left 0
    .disc>>>.icon-back
        padding 10px 0 0 5px !important
    .slide-enter-active,.slide-leave-active
        transition all .3s
    .slide-enter,.slide-leave-to
        transform translate3d(100%,0,0)    
</style>  