import { helper } from '@ember/component/helper';

export default helper(function ascii(positional /*, named*/) {
  return String.fromCharCode(65 + positional[0]).toString();
});
