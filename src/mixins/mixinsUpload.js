/***********************
 * @name JS
 * @author Jo.gel
 * @date 2020/3/9 0009
 ***********************/
export default {
	data() {
		return {
			headers: {
				token: localStorage.getItem('token'),
			},
		};
	},
	methods: {
		handleFormatError() {
			this.$Message.error('上传文件格式错误');
		},
		
		handleMaxSize() {
			this.$Message.error('最大支持1MB');
		},
		handlerError() {
			this.$Message.error('上传失败');
		},
	}
};

