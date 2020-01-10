import * as types from './mutations-types'
const mutations={
    [types.SET_SINGER](state,singer){
        state.singer=singer
    },
    [types.SET_PLAYING](state,flag){
        state.playing=flag
    },
    [types.SET_FULL_SCREEN](state,flag){
        state.fullScreen=flag
    },
    [types.SET_PLAY_LIST](state,list){
        state.playList=list
    },
    [types.SET_SEQUENCE_LIST](state,list){
        state.sequenceList=list
    },
    [types.SET_MODE](state,number){
        state.mode=number
    },
    [types.SET_CURRENT_INDEX](state,index){
        state.currentIndex=index
    },
    [types.SET_DISC](state,disc){
        state.disc=disc
    },
    [types.SET_RANK_DISC](state,rankDisc){
        state.rankDisc=rankDisc
    },
    [types.SET_SEARCH_HISTORY](state,searchHistory){
        state.searchHistory=searchHistory
    },
    // [types.DELETE_SEARCH_HISTORY](state,newList){
    //     state.searchHistory=deleteItem(newList)
    // }
}
export default mutations