import { isUrl } from "./util";

function recommendHook(str) {
  if (isUrl(str)) {
    return 3;
  } else {
    return 0;
  }
}

function conversionHook(input){
  return encodeURI(input)
}


export default {
  conversionHook,
  recommendHook,
};
