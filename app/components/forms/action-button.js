import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class FormsActionButtonComponent extends Component {
  @service global;

  @action
  onClick() {
    if (this.args.onButtonAction) {
      this.args.onButtonAction();
    }
  }

  @action
  onKeyDown(evt) {
    const keyCode = evt.which || evt.keyCode;
    if (keyCode == 9 || evt.key == 'Tab') {
      // stop if not allowed enter key press
      if (!this.args.data.enablePressEnter) return;
      // don't call when reach last item
      if (this.args.data.index === this.global.rows.length) return;

      if (this.args.onTabAction) this.args.onTabAction();
    }
  }
}
