export function addClass(el,className){
    let newClass=el.className.split(" ") 
    // console.log(newClass)     [""]
    newClass.push(className)
    // console.log(newClass)  ["","slider-item"]
    el.className=newClass.join(" ")
    // console.log(el.className) slider-item
}
//获取属性值或者设置属性值
export function getData(el,name,val){
    const prefix="data-"
    name=prefix+name
    if(val){
        return el.setAttribute(name,val)
    }else{
        return el.getAttribute(name)
    }
}
