import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
export default class ApplicationController extends Controller {
  @service global;
  @tracked isShowQuestionnairePage = false;
  @tracked isSpinnerActive = true;
  @tracked isNotDarkMode = true;

  clearTimeout = '';
  @action
  onSpinnerInserted() {
    if (this.clearTimeout) clearTimeout(this.clearTimeout);

    setTimeout(() => {
      this.isShowQuestionnairePage = true;
      this.isSpinnerActive = false;
    }, 500);
  }

  @action
  domInit() {
    // check dark theme
    const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');
    if (darkThemeMq.matches) {
      this.toggleDarkModeClass();
      this.isNotDarkMode = false;
      // Theme set to dark.
    }
  }

  @action
  onUpdateSwitch() {
    this.toggleDarkModeClass();
  }

  toggleDarkModeClass() {
    document.body.classList.toggle('dark-mode');
  }
}
