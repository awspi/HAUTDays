function timeFormat(date) {
    if (!date || typeof(date) === "string") {
        this.error("参数异常，请检查...");
    }
    const m = date.getMonth() + 1; //月
    const d = date.getDate(); //日

    return m + "/" + d;
}
function getFirstDayOfWeek (date,offset=0) {
    //获取星期几,getDay()返回值是 0（周日） 到 6（周六） 之间的一个整数。0||7为7，即weekday的值为1-7
    var weekday = date.getDay()||7; 
    date.setDate(date.getDate()-weekday+1+offset);//往前算（weekday-1）天，年份、月份会自动变化
    return timeFormat(date);
}
module.exports={
    timeFormat,
    getFirstDayOfWeek
}