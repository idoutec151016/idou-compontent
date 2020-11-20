//深度克隆
export function deepClone(obj){
  var result,oClass=isClass(obj); //确定result的类型
  if(oClass === 'Object'){
    result={};
  }else if(oClass === 'Array'){
    result=[];
  }else{
    return obj;
  }
  if(oClass==='Object'){
    for(var key in obj){
      result[key] = deepClone(obj[key])
    }
  }else if(oClass==='Array'){
    for(var i=0;i<obj.length;i++){
      result.push(deepClone(obj[i]))
    }
  }
  return result;
}
//返回传递给他的任意对象的类
function isClass(o){
  if(o===null) return 'Null';
  if(o===undefined) return 'Undefined';
  return Object.prototype.toString.call(o).slice(8,-1);
}

// 车牌校验规则
export const regexCarNumber = function (num) {
  if(num === '新车') {
    return true
  }
  var regex = /^([冀豫云辽黑湘皖鲁苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼渝京津沪新京军空海北沈兰济南广成使领A-Z]{1}[a-zA-Z0-9]{5,6}[a-zA-Z0-9挂学警港澳]{1})$/;
  return regex.test(num)
}

/* 校验车主名称有效性（2-15位中文或者4-30位英文字母） */
export function checkName(carOwner) {
  var regName1 = /^[\u4e00-\u9fa5 ]{2,50}$/;
  var regName2 = /^[A-Za-z ]{4}$/;
  if (!regName1.test(carOwner) && !regName2.test(carOwner)) {
    return false;
  }
  return true;
}