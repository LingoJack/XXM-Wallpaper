import uviewPlus from 'uview-plus'

import {
	createSSRApp
} from "vue";
import App from "./App.vue";
export function createApp() {
	const app = createSSRApp(App);
	// app.use(uviewPlus)
	return {
		app,
	};
}
