function getCustomVerifyObj() {
	// 这里既可以是函数，也可以是数组
	// 函数接收两个参数：value：表单的值、item：表单的DOM对象
	// 数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
	var obj = {
		space: function (value, dom) {
			if (value == '') { return false; }
			if (value.indexOf(' ') !== -1) {
				return '不能包含空格';
			}
		},
		zh: function (value, dom) {
			if (value == '') { return false; }
			var reg = /[\u4e00-\u9fa5]/;
			if (reg.test(value)) {
				return '不能包含中文';
			}
		},
		symbol: function (value, dom) {
			if (value == '') { return false; }
			var reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
			if (!reg.test(value)) {
				return '不能包含特殊字符、标点符号';
			}
		},
		length_2_6: function (value, dom) {
			if (value == '') { return false; }
			var reg = /^.{2,6}$/;
			if (!reg.test(value)) {
				return '请输入 2 -6 个字符';
			}
		},
		length_4_10: function (value, dom) {
			if (value == '') { return false; }
			var reg = /^.{4,10}$/;
			if (!reg.test(value)) {
				return '请输入 4 -10 个字符';
			}
		},
		length_4_20: function (value, dom) {
			if (value == '') { return false; }
			var reg = /^.{4,20}$/;
			if (!reg.test(value)) {
				return '请输入 4 -20 个字符';
			}
		},
		length_6_30: function (value, dom) {
			if (value == '') { return false; }
			var reg = /^.{6,30}$/;
			if (!reg.test(value)) {
				return '请输入 6 -30 个字符';
			}
		},
		length_8_50: function (value, dom) {
			if (value == '') { return false; }
			var reg = /^.{8,50}$/;
			if (!reg.test(value)) {
				return '请输入 8 - 50 个字符';
			}
		},
		length_17: function (value, dom) {
			if (value == '') { return false; }
			var reg = /^.{17}$/;
			if (!reg.test(value)) {
				return '请输入 17 个字符';
			}
		},
		length_max_1000: function (value, dom) {
			if (value == '') { return false; }
			var reg = /^.{0,1000}$/;
			if (!reg.test(value)) {
				return '最多填写 1000 个字符';
			}
		},
		myphone: function (value, dom) {
			if (value == '') { return false; }
			if (value.length != 11) {
				return '请输入正确的手机号';
			}
			var phoneBlankList = [
				'01234567891',
				'12345678910',
				'12345678911',
				'12345678912',
			]
			if (phoneBlankList.indexOf(value) !== -1) {
				return '请输入正确的手机号';
			}

			// 重复数字判断
			var temp = value.split('');
			var obj = {};
			temp.forEach(function(item) {
				obj[item] = typeof obj[item] == "undefined" ? 1 : obj[item] + 1;
			})
			for (prop in obj) {
				// 重复出现4次，判断为异常手机号，可以修改这个值去改变判断范围
				if (obj[prop] >= 4) {
					return '请输入正确的手机号';
				}
			}
		},
	}
	return obj;
}