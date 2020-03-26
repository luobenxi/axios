// 引入配置文件
import config from "./config.js";
import tips from '../tips.js';

// callBack形式
function ajax(params, noRefetch) {
    let that = this;
    uni.showLoading({
        title: params.loadingText || '加载中',
		mask: true
    });
    uni.request({
        url: config.webUrl + params.url || '',
        data: params.data || null,
        method: params.type || 'GET',
        dataType: params.dataType || 'json',
        header: {
            'token': uni.getStorageSync('token'),
            'content-type': 'application/json;charset=UTF-8'
        },
        success: (res) => {
    		// 判断以2（2xx)开头的状态码为正确 比如200
    		// 异常不要返回到回调中，就在request中处理，记录日志并showToast一个统一的错误即可
            let statusCode = res.statusCode;
            let firstStatusCode = statusCode.toString().charAt(0);
            if (firstStatusCode == '2' && res.data.code === config.successCode) {
                params.sCallback && params.sCallback(res.data);
            } else {
                if (statusCode === 401) {
					tips.alert(config.statusCode401);
                    // 如果返回的是401，说明token已过期，需要重新获取token，并重新请求本次失败的请求
                    if (!noRefetch) {
                        // 重新获取数据
                        _refetch(params);
                    }
                }
    			if (statusCode === 404) {
    				tips.alert(config.statusCode404);
    			}
    			if (statusCode === 500) {
					tips.alert(config.statusCode500);
    			}
                params.eCallback && params.eCallback(res.data);
            }
        },
        fail: (err) => {
    		tips.alert('请求失败');
        },
        complete: (res) => {
            uni.hideLoading();
        }
    });
}

function _refetch(param) {
    
}

export default ajax;