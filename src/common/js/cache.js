import storage from 'good-storage'
const SEARCH_KEY='__search__'
const SEARCH_MAX_LENGTH=15  
function insertArray(arr,val,compare,maxLen){
    const index=arr.findIndex(compare)
    // console.log(index)
    //index===0的逻辑，第一次点的许嵩，第二次又点许嵩。什么都不做。直接return掉。
    if(index===0){
        return
    }
    if(index>0){
        arr.splice(index,1)
    }
    arr.unshift(val)
    if(index>maxLen){
        arr.pop()
    }
}
export function saveSearch(query){
    let searches=storage.get(SEARCH_KEY,[]) //默认值空数组
    insertArray(searches,query,(item)=>{
        return item===query
    },SEARCH_MAX_LENGTH)
    storage.set(SEARCH_KEY,searches)
    return searches
}
export function storageSearch(){
    return storage.get(SEARCH_KEY,[])
}
export function deleteItem(query){
    let searches=storage.get(SEARCH_KEY,[])
    let index=searches.findIndex((item)=>{
        return item===query
    })
    searches.splice(index,1)
    storage.set(SEARCH_KEY,searches)
    return searches
}
export function clearSearch(){
    storage.remove(SEARCH_KEY)
    return []
}