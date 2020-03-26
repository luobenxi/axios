// 引入配置文件
import config from "./config.js";
import tips from './tips.js';

// 绑定到main.js中，通过this.$http.get/post方式方法接口
export default {
	config: {
		baseUrl: config.webUrl,
		header: {
			'Content-Type': 'application/json;charset=UTF-8'
		},
		data: {},
		method: "GET",
		dataType: "json"
	},
	// 统一请求
	async request(options = {}) {
		uni.showLoading({
			title: options.loadingText || '加载中',
			mask: true
		});
		options.header = options.header || this.config.header;
		options.method = options.method || this.config.method;
		options.dataType = options.dataType || this.config.dataType;
		options.url = this.config.baseUrl + options.url;
		options.header.token = uni.getStorageSync('token') || '';
		let [err, res] = await uni.request(options);
		uni.hideLoading();
		// 错误统一处理
		let error = this.errorCheck(err, res);
		if (!error) {
			return error;
		}
		return res.data; // 返回res的data
	},
	// GET请求
	async get(options = {}) {
		options.method = 'GET';
		return await this.request(options);
	},
	// POST请求
	async post(options = {}) {
		options.method = 'POST';
		return await this.request(options);
	},
	// PUT请求
	async put(options = {}) {
		options.method = 'PUT';
		return await this.request(options);
	},
	// DELETE请求
	async delete(options = {}) {
		options.method = 'DELETE';
		return await this.request(options);
	},
	// 错误统一处理
	errorCheck(err, res, errFun = false, resFun = false) {
		if (err) {
			typeof errfun === 'function' && errfun();
			tips.alert('请求失败');
			return false;
		}
		if (res.statusCode === 401) {
			tips.alert(config.statusCode401);
			return false;
		}
		if (res.statusCode === 404) {
			tips.alert(config.statusCode404);
			return false;
		}
		if (res.statusCode === 500) {
			tips.alert(config.statusCode500);
			return false;
		}
		let firstStatusCode = res.statusCode.toString().charAt(0);
		let { code, data, msg } = res.data;
		if (firstStatusCode == '2' && code === config.successCode) {
			return true;
		} else {
			tips.alert(msg);
			return false;
		}
	}
}
