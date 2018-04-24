//时间string转date
function stringToDate(str){
  return new Date(Date.parse(str.replace(/-/g, "/")));
}
