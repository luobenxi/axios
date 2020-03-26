/**
 * 提示与加载工具类
 */
export default class Tips {
    constructor() {
        this.isLoading = false;
    }
	
    /**
     * 弹出提示框
     */
    static success(title, duration = 500) {
        setTimeout(() => {
            uni.showToast({
                title: title,
                icon: "success",
                mask: true,
                duration: duration
            });
        }, 300);
        if (duration > 0) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve();
                }, duration);
            });
        }
    }

    /**
     * 弹出确认窗口
     */
    static confirm(text, confirmPayload = () => {}, cancelPayload = () => {}, title = "提示") {
        uni.showModal({
            title: title,
            content: text,
            showCancel: true,
            success: res => {
                if (res.confirm) {
                    confirmPayload();
                } else if (res.cancel) {
                    cancelPayload();
                }
            },
            fail: res => {
            }
        });
    }

    /**
     * 弹出窗
     */
    static alert(text, confirmPayload = () => {}, title = "提示") {
        uni.showModal({
            title: title,
            content: text,
            showCancel: false,
            success: res => {
                if (res.confirm) {
                    confirmPayload();
                }
            },
            fail: res => {
                
            }
        });
    }

	// toast
    static toast(title, icon = "none") {
        uni.showToast({
            title: title,
            icon: icon,
            mask: true,
            duration: 1000
        });
    }

    /**
     * 弹出加载提示
     */
    static loading(title = "加载中") {
        if (Tips.isLoading) {
            return;
        }
        Tips.isLoading = true;
        uni.showLoading({
            title: title,
            mask: true
        });
    }

    /**
     * 加载完毕
     */
    static loaded() {
        if (Tips.isLoading) {
            Tips.isLoading = false;
            uni.hideLoading();
        }
    }
}

/**
 * 静态变量，是否加载中
 */
Tips.isLoading = false;