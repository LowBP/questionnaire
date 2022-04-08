import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class FormsInputComponent extends Component {
  get getRequiredFieldStatus() {
    return (
      (this.args.data.required && !this.args.data.value?.trim()
        ? true
        : false) && this.args.data.meta.inValid
    );
  }

  @action
  onInitDom() {
    document.getElementById('input_box_id')?.focus();
  }

  @action
  onKeyDown(evt) {
    const keyCode = evt.which || evt.keyCode;

    if (evt.key === 'Enter' || keyCode == 13) {
      if (this.args.onInputAction) {
        this.args.onInputAction();
      }
    }
  }
}
