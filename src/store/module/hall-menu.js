/***********************
 * @name JS
 * @author Jo.gel
 * @date 2020/3/2 0002
 ***********************/
import hallRouter from "../../router/router-hall";
import {showAllBackRouters} from './menu';

export default {
	state: {},
	getters: {
		hallMenuList: () => {
			return showAllBackRouters(hallRouter);
		},
	}
};
