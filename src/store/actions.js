import * as types from './mutations-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {saveSearch,deleteItem,clearSearch} from 'common/js/cache'
function findIndex(list,song){
    return list.findIndex((item)=>{
        return item.id===song.id
    })
}
export const selectPlay=function({commit},{list,index}){
    commit(types.SET_SEQUENCE_LIST,list)
    commit(types.SET_PLAY_LIST,list)
    commit(types.SET_CURRENT_INDEX,index)
    commit(types.SET_PLAYING,true)
    commit(types.SET_FULL_SCREEN,true)
}
export const randomPlay=function({commit},{list}){
    commit(types.SET_MODE,playMode.random)
    commit(types.SET_SEQUENCE_LIST,list)
    let randomList=shuffle(list)
    commit(types.SET_PLAY_LIST,randomList)
    commit(types.SET_CURRENT_INDEX,0)
    commit(types.SET_PLAYING,true)
    commit(types.SET_FULL_SCREEN,true)
}

export const insertSong=function({commit,state},song){
    let playList=state.playList.slice()
    let sequenceList=state.sequenceList.slice()
    let currentIndex=state.currentIndex
    // 记录当前歌曲
    let currentSong=playList[currentIndex]
    // 查找当前列表有没有被插入的这首歌
    let fpIndex=findIndex(playList,song)
    //插入歌曲索引要加1
    currentIndex++
    playList.splice(currentIndex,0,song)
    // 如果有被插入的这首歌
    if(fpIndex>-1){
        if(currentIndex>fpIndex){
            playList.splice(fpIndex,1)
            currentIndex--
        }else{
            playList.splice(fpIndex+1,1)
        }
    }
    let currentSindex=findIndex(sequenceList,currentSong) + 1
    let currentFindex=findIndex(sequenceList,song)
    sequenceList.splice(currentSindex,0,song)
    if(currentFindex>-1){
        if(currentSindex > currentFindex){
            sequenceList.splice(currentFindex,1)
        }else{
            sequenceList.splice(currentFindex+1,1)
        }
    }
    commit(types.SET_SEQUENCE_LIST,playList)
    commit(types.SET_PLAY_LIST,sequenceList)
    commit(types.SET_CURRENT_INDEX,currentIndex)
    commit(types.SET_PLAYING,true)
    commit(types.SET_FULL_SCREEN,true)
}   

export const saveSearchHistory=function({commit},query){
    commit(types.SET_SEARCH_HISTORY,saveSearch(query))
}
export const deleteSearchHistory=function({commit},query){
    commit(types.SET_SEARCH_HISTORY,deleteItem(query))
}
export const clearSearchHistory=function({commit}){
    commit(types.SET_SEARCH_HISTORY,clearSearch())
}
