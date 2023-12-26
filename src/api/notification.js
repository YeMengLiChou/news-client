import { get, post, put, del, delParam, putParam} from "@/utils/request";


export default {    
    fetchUnreadNotice(userId) {
        return get('/notice/select/isread', {
            userId,
            flag: 0
        })
    },
    
    fetchReadNotice(userId) {
        return get('/notice/select/isread', {
            userId,
            flag: 1
        })
    },

    deleteNotice(notificationId) {
        return delParam('/notice/delete', {
            notificationId
        })
    },

    updateNoticeRead(notificationId) {
        return putParam('/notice/read', {
            notificationId
        })
    },

    // sendNotice()
}