import { get, post, del, put } from "@/utils/request";

export default {
    upload(file) {
        post('/upload', file)
    }   
}