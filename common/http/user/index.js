import http from '@/common/http/interface';
import config from "@/common/config.js";

/**
 * 将业务所有接口统一起来便于维护
 * 如果项目很大可以将 url 独立成文件，接口分成不同的模块
 */

// test
export const test = (data) => http.get('/user/1', data);
// testNewBaseUrl
export const testNewBaseUrl = (data) => http.post('/ajax/echo/json', data, { baseUrl: config.webUrl2 });

export default {
	test,
	testNewBaseUrl,
}
