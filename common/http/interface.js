/**
 * 通用uni-app网络请求
 * 基于 Promise 对象实现更简单的 request 使用方式，支持请求和响应拦截
 */
import config from "@/common/config.js";

export default {
	config: {
		baseUrl: config.webUrl,
		header: {
			'Content-Type': 'application/json;charset=UTF-8'
		},
		data: {},
		method: "GET",
		dataType: "json",
		responseType: "text",
		success() {},
		fail() {},
		complete() {}
	},
	// 拦截器
	interceptor: {
		// 请求拦截
		request: (req) => Object.assign({}, req, {
			header: Object.assign({}, req.header, {
				token: uni.getStorageSync('token') || ''
			})
		}),
		// 响应拦截
		response: (res) => res.data
	},
	request(options = {}) {
		options.baseUrl  = options.baseUrl || this.config.baseUrl;
		options.dataType = options.dataType || this.config.dataType;
		options.url      = options.baseUrl + options.url;
		options.data     = options.data || {};
		options.method   = options.method || this.config.method;
		//TODO 加密数据
		//TODO 数据签名 可以将签名后的数据放入header
		options.header = Object.assign({}, options.header, this.config.header);
		return new Promise((resolve, reject) => {
			let _config = null;
			
			options.complete = (res) => {
				let statusCode = res.statusCode;
				res.config = _config;
				
				// 统一的响应日志记录
				// _reslog(res);
				
				if (this.interceptor.response) {
					res = this.interceptor.response(res);
				}
				
				if (statusCode === 200) {
					resolve(res);
				} else {
					reject(res);
				}
			}
			
			_config = Object.assign({}, this.config, options);
			_config.requestId = new Date().getTime();
			if (this.interceptor.request) {
				_config = this.interceptor.request(_config);
			}
			
			// 统一的请求日志记录
			// _reqlog(_config);
			
			uni.request(_config);
		});
	},
	get(url, data, options = {}) {
		options.url = url;
		options.data = data;
		options.method = 'GET';
		return this.request(options);
	},
	post(url, data, options = {}) {
		options.url = url;
		options.data = data;
		options.method = 'POST';
		return this.request(options);
	},
	put(url, data, options = {}) {
		options.url = url;
		options.data = data;
		options.method = 'PUT';
		return this.request(options);
	},
	delete(url, data, options = {}) {
		options.url = url;
		options.data = data;
		options.method = 'DELETE';
		return this.request(options);
	}
}

/**
 * 请求接口日志记录
 */
function _reqlog(req) {
	console.log("【" + req.requestId + "】 请求地址：" + req.url);
	if (req.data) {
		console.log("【" + req.requestId + "】 请求参数：" + JSON.stringify(req.data));
	}
	//TODO 调接口异步写入日志数据库
}

/**
 * 响应接口日志记录
 */
function _reslog(res) {
	let _statusCode = res.statusCode;
	console.log("【" + res.config.requestId + "】 响应结果：" + JSON.stringify(res.data));
	//TODO 除了接口服务错误外，其他日志调接口异步写入日志数据库
	switch(_statusCode) {
		case 401:
			break;
		case 404:
			break;
		case 500:
			break;
		default:
			break;
	}
}
