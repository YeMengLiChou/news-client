import { get, post } from '@/utils/request'

export default {

    /**
     * 
     * @param {} publisherId 
     * @param {*} sectionId 
     * @param {*} title 
     * @param {*} content 
     * @returns 
     */
    createNews(publisherId, sectionId, title, content) {
        return post('/news/create', {
            publisherId,
            sectionId,
            title,
            content
        })
    }
}