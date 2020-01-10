import Vue from 'vue'
import Router from 'vue-router'
import Recommend from 'components/recommend/Recommend'
import Disc from 'components/disc/Disc'
import Singer from 'components/singer/Singer'
import Detail from 'components/singer-detail/Detail'
import Rank from 'components/rank/Rank'
import RankSecond from 'components/rank-second/RankSecond'
import Search from 'components/search/Search'
Vue.use(Router)
export default new Router({
    routes:[
        {
            path:'/',
            redirect:'/recommend'
        },
        {
            path:'/recommend',
            name:'Recommend',
            component:Recommend,
            children:[
                {
                    path:':id',
                    component:Disc
                }
            ]
        },
        {
            path:'/singer',
            name:'Singer',
            component:Singer,
            children:[
                {
                    path:':id',
                    component:Detail
                }
            ]
        },
        {
            path:'/rank',
            name:'Rank',
            component:Rank,
            children:[
                {
                    path:':id',
                    component:RankSecond
                }
            ]
        },
        {
            path:'/search',
            name:'Search',
            component:Search,
            children:[
                {
                    path:':id',
                    component:Detail
                }
            ]
        }
    ]
})