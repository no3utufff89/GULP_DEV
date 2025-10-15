import del from "del";
export const reset = () => {
	return del(app.path.clean), del(app.path.docsFolder);
};
