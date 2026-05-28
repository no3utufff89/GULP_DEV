import {deleteAsync} from 'del';

import {appPath} from "../config/path.js";
export const reset = async () => {
   await deleteAsync([appPath.clean],{force:true})
};