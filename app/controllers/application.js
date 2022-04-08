import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
export default class ApplicationController extends Controller {
  @service global;
  @tracked isShowQuestionnairePage = false;
  @tracked isSpinnerActive = true;

  clearTimeout = '';
  @action
  onSpinnerInserted() {
    if (this.clearTimeout) clearTimeout(this.clearTimeout);

    setTimeout(() => {
      this.isShowQuestionnairePage = true;
      this.isSpinnerActive = false;
    }, 500);
  }
}
