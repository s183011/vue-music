<template>
    <scroll 
        :listenScroll="listenScroll" 
        :probeType="probeType"
        @scroll="scroll" 
        class="listview" 
        ref="listView"
    >
        <ul>
            <li 
            class="list-group" 
            ref="listGroup"
            v-for="(group,index) in data"
            :key="index"
            >
                <h2 class="list-group-title">{{group.title}}</h2>
                <ul>
                    <li 
                    class="list-group-item" 
                    v-for="(item,index) in group.items"
                    :key="index"
                    @click="select(item)"
                    >
                        <img :src="item.avatar" class="avatar" alt="">
                        <span class="name">{{item.name}}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="list-shortcut"
            v-if="alphabetList.length"
            @touchstart="handleTouchStart"
            @touchmove.stop.prevent="handleTouchMove"
        >
            <ul>
                <li 
                v-for="(item,index) in alphabetList"
                :key="index"
                class="item"
                :data-index="index"
                :class="{current:currentIndex===index}"                 
                 >{{item}}</li>
            </ul>
        </div>
        <div class="list-fixed" v-show="fixedTitle" ref="fixed">
            <div class="fixed-title">{{fixedTitle}}</div>
        </div>
    </scroll>  
</template>
<script>
import Scroll from 'base/scroll/Scroll'
import {getData} from 'common/js/dom'
export default {
    name:'List',
    props:{
        data:{
            type:Array,
            default:[]
        }
    },
    created(){
        this.touch={}
        this.probeType=3
        this.listenScroll=true
        this.listHeight=[]
    },
    data(){
        return {
            scrollY:0,
            currentIndex:0,
            diff:0
        }
    },
    computed:{
        alphabetList(){
            return this.data.map((group)=>{
                return group.title.substr(0,1)
            })
        },
        fixedTitle(){
            if(this.scrollY>0){
                return ''
            }
            // 不判断会报错
            return this.data[this.currentIndex]? this.data[this.currentIndex].title:''
        }
    },
    methods:{
        refresh(){
            this.$refs.listView.refresh()
        },
        // 因为是一个基础组件，不参与任何业务，所以只需要告诉父组件自己被点击了，向父组件派发事件
        select(item){
            this.$emit('selectSinger',item)
        },
        handleTouchStart(e){
            let alphabetIndex=getData(e.target,'index') //得到的index是字符串
            if(alphabetIndex===null){
                return
            }
            this.currentIndex=parseInt(alphabetIndex)
            this.touch.startIndex=parseInt(alphabetIndex)
            this.touch.startY=e.touches[0].pageY
            this._scrollTo(alphabetIndex)
        },
        handleTouchMove(e){
            this.touch.endY=e.touches[0].pageY
            let delta=(this.touch.endY-this.touch.startY)/18 | 0
            let anchorIndex=delta+this.touch.startIndex
            // 处理边界情况
            if(anchorIndex>-1 && anchorIndex<this.alphabetList.length){
                this.currentIndex=anchorIndex
                this._scrollTo(anchorIndex)
            }
        },
        scroll(pos){
            this.scrollY=pos.y
        },
        _scrollTo(index){
            this.$refs.listView.scrollToElement(this.$refs.listGroup[index])
        },
        // 计算出每个group的高度，放到一个数组里
        _calculate(){
            let list=this.$refs.listGroup
            let height=0
            for(let i=0;i<list.length;i++){
                let item=list[i]
                height+=item.clientHeight  //clientHeight是每个group的高度，
                this.listHeight.push(height)
            }
            this.listHeight.unshift(0)
        }
    },
    watch:{
        data(){
            setTimeout(()=>{
                this._calculate()
            },20)
        },
        // 监听scrollY值，滚动的Y值落在了listHeight的哪个区间.
        scrollY(newY){
            const listHeight=this.listHeight
            for(let i=0;i<listHeight.length;i++){
                let height1=listHeight[i]
                let height2=listHeight[i+1]
                if((-newY)>height1 && (-newY)<height2){
                    this.currentIndex=i
                    this.diff=height2+newY
                    return
                }
            }
        },
        diff(newVal){
            let fixedTop=(newVal>0&&newVal<30)?newVal-30:0
            //console.log(this.fixedTop+'\n'+fixedTop) undefined 0
            //console.log(Boolean(undefined)) // undefined为false  0为false
            if(this.fixedTop===fixedTop){
                return
            }
            this.fixedTop=fixedTop
            this.$refs.fixed.style.transform=`translate3d(0,${fixedTop}px,0)`
        }
    },
    components:{
        Scroll
    }
}
</script>
<style lang="stylus" scoped>
    .listview
        position: relative
        width: 100%
        height: 100%
        overflow: hidden
        .list-group
            padding-bottom: 30px
        .list-group-title
            height: 30px
            line-height: 30px
            padding-left: 20px
            font-size: $font-size-small
            color: $color-text
            background: $color-theme-d
        .list-group-item
            display: flex
            align-items: center
            padding: 20px 0 0 30px
            .avatar
                width: 50px
                height: 50px
                border-radius: 50%
            .name
                margin-left: 20px
                color: $color-text
                font-size: $font-size-medium
        .list-shortcut
            position: absolute
            z-index: 30
            right: 0
            top: 50%
            transform: translateY(-50%)
            width: 20px
            padding: 20px 0
            border-radius: 10px
            text-align: center
            font-family: Helvetica
            .item
                padding: 3px
                color: white
                font-size: $font-size-small
                &.current
                    color: #edc871
        .list-fixed
            position absolute
            top 0
            left 0
            right 0
            .fixed-title
                height 30px
                line-height 30px
                padding-left 20px
                font-size $font-size-small
                color $color-text
                background $color-theme-d
</style>


