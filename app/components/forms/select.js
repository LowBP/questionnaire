import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class FormsSelectComponent extends Component {
  @service global;

  clearTimeout = '';

  get isMultiple() {
    return this.args.data.multiple == 'false' ? false : true;
  }

  get getRequiredFieldStatus() {
    return (
      (this.args.data.required &&
      !this.args.data.choices.filter((c) => c.selected === true).length
        ? true
        : false) && this.args.data.meta.inValid
    );
  }

  @action onDomInit() {
    document.addEventListener('keyup', this.registerOnKeyUpFunc, true);
  }

  @action onDestroy() {
    if (this.clearTimeout) {
      clearTimeout(this.clearTimeout);
    }
    document.removeEventListener('keyup', this.registerOnKeyUpFunc, true);
  }

  @action onClickSelectOption(data, index) {
    this.performEventAction(data, index);
  }

  @action onKeyDown(data, index, e) {
    const keyCode = e.which || e.keyCode;

    if (e.key === 'Enter' || keyCode === 13) {
      this.performEventAction(data, index);
    }
  }

  // private functions

  performEventAction(data, index) {
    const rowIndex = this.args.data.index - 1;
    const isSelected = !data.selected;

    if (!this.isMultiple) {
      this.global.rows[rowIndex].choices.forEach((element) => {
        element.selected = false;
      });
    }

    this.global.rows[rowIndex].choices[index].selected = isSelected;
    if (isSelected && this.args.onSelectAction && !this.isMultiple) {
      this.clearTimeout = setTimeout(() => {
        this.args.onSelectAction();
      }, 500);
    }
  }

  registerOnKeyUpFunc = (e) => {
    let keyCode = e.which || e.keyCode;

    // don't run if tab press event ocurred
    if (
      (keyCode == 9 || e.key == 'Tab') &&
      this.args.data.choices.filter((c) => c.selected === true).length
    )
      return;

    // keyboard key press to move next page
    const asciiValue = String.fromCharCode(keyCode).toString();
    let asciiElement = document.querySelector(`div[ascii='${asciiValue}']`);
    if (asciiElement) {
      asciiElement.click();
      return;
    }

    let allRadioList = document.querySelectorAll("div[role='radio']");
    let isAlreadyFocused = false;
    for (let i = 0; i < allRadioList.length; i++) {
      if (document.activeElement === allRadioList[i]) {
        isAlreadyFocused = true;
        break;
      }
    }

    let initialSelected = document.querySelector('div[selected="true"]');
    let initialSelectedId = '';
    if (initialSelected && !isAlreadyFocused) {
      initialSelectedId = initialSelected.getAttribute('id');
      document.getElementById(initialSelectedId)?.focus();
    } else if (!initialSelected && !isAlreadyFocused) {
      document.getElementById(allRadioList[0].getAttribute('id'))?.focus();
      return;
    }

    keyCode = e.which || e.keyCode;
    allRadioList = document.querySelectorAll("div[role='radio']");
    switch (keyCode) {
      case 38: // upKey
        for (let i = allRadioList.length - 1; i >= 0; i--) {
          if (document.activeElement === allRadioList[i]) {
            {
              if (i - 1 == -1)
                document
                  .getElementById(
                    allRadioList[allRadioList.length - 1].getAttribute('id')
                  )
                  ?.focus();
              else
                document
                  .getElementById(allRadioList[i - 1].getAttribute('id'))
                  ?.focus();

              break;
            }
          }
        }

        break;

      case 40: // downKey
        for (let i = 0; i < allRadioList.length; i++) {
          if (document.activeElement === allRadioList[i]) {
            {
              if (i + 1 < allRadioList.length)
                document
                  .getElementById(allRadioList[i + 1].getAttribute('id'))
                  ?.focus();
              else
                document
                  .getElementById(allRadioList[0].getAttribute('id'))
                  ?.focus();

              break;
            }
          }
        }
        break;
    }
  };
}
