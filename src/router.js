
const url = "http://localhost:3300";

export default {
    getUserState: url + "/getuserstate",
    getLoginState: url + '/login',
    userLogout: url + '/logout',
    getRoomInfo: url + '/getroominfo',
    getRecentRecord: url + '/getrecentroomexpense'
}