import { ElMessage } from "element-plus";

const defaultDuration = 2500;

function error(message, duration) {
    if (!duration) {
        duration = defaultDuration
    }
    ElMessage({
        message: message,
        type: 'error',
        duration: duration
    });
}

function warn(message, duration) {
    if (!duration) {
        duration = defaultDuration
    }
    ElMessage({
        message: message,
        type: 'warn',
        duration: duration
    });
}

function success(message, duration) {
    if (!duration) {
        duration = defaultDuration
    }
    ElMessage({
        message: message,
        type: 'warn',
        duration: duration
    });
}

export default {
    success,
    warn,
    error,
};
