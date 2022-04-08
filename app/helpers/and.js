import { helper } from '@ember/component/helper';

export default helper(function and(positional /*, named*/) {
  return positional[0] && positional[1];
});
