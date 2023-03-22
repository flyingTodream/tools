import { isUrl } from "./util";

function recommendHook(str) {
  if (isUrl(str)) {
    return 3;
  } else {
    return 0;
  }
}

function conversionHook(input){
   return decodeURI(input)
}

export default {
  recommendHook,
  conversionHook
};
