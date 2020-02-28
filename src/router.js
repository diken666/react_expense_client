
const url = "http://localhost:3300";

export default {
    getUserState: url + "/getuserstate",
    getLoginState: url + '/login',
    userLogout: url + '/logout',
    getRoomInfo: url + '/getroominfo',
    getRecentRecord: url + '/getrecentroomexpense',
    getAllRoomUser: url + '/getallroomuser',      // 获取所有住户信息
    getRecentRecordDate: url + '/getRecentRecordDate',  // 获取最近统计日期
    saveTableCtn: url + '/saveTableCtn',   // 保存表格内容
    getDefaultRoomInfo: url + '/getDefaultRoomInfo',  // 获取默认的房间信息
}