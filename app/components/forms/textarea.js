import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class FormsTextareaComponent extends Component {
  @service global;

  @tracked rowsCount = 1;

  @action
  onInitDom() {
    document.getElementById('textarea_id')?.focus();
  }

  @action
  onKeyDown(evt) {
    const keyCode = evt.which || evt.keyCode;

    if (keyCode === 13 && !evt.shiftKey) {
      // required label checks
      if (this.args.onInputAction) {
        this.args.onInputAction();
      }
      // Don't generate a new line
      evt.preventDefault();
      return;
    }

    if (keyCode === 13 && evt.shiftKey) {
      this.rowsCount = this.rowsCount + 1;
    }
  }

  @action
  onKeyUp(evt) {
    const keyCode = evt.which || evt.keyCode;
    if (keyCode === 13) return;

    this.rowsCount = evt.target.value.split('\n').length;

    const index = this.args.data.index - 1;
    this.global.rows[index].meta.rowsCount = this.rowsCount;
  }

  get getRequiredFieldStatus() {
    return (
      (this.args.data.required && !this.args.data.value?.trim()
        ? true
        : false) && this.args.data.meta.inValid
    );
  }

  get textareaClassName() {
    const classNames =
      'auto-size-text-area ' +
      (this.getRequiredFieldStatus ? 'textarea-required--border' : '');
    return classNames;
  }
}
