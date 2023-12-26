function formatTime(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    if (hour < 10) hour = `0${hour}`;
    if (minute < 10) minute = `0${minute}`;
    return `${year}年${month}月${day}日 ${hour}:${minute}`;
}


export default {
    formatTime
}