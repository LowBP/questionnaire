import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

class Choice {
  @tracked label;
  @tracked value;
  @tracked selected;
  constructor(args) {
    this.label = args.label;
    this.value = args.value;
    this.selected = args.selected;
  }
}

class Properties {
  @tracked rowsCount;
  @tracked inValid;
  @tracked placeholder;
  constructor(args) {
    this.rowsCount = args.rowsCount || 1;
    this.inValid = false;
    this.enablePressEnter = args.question_type === 'text' ? true : false;
    this.placeholder =
      args.question_type === 'text'
        ? 'Geben Sie hier Ihre Antwort ein...'
        : false;
  }
}

class Questionnaire {
  @tracked question_type;
  @tracked identifier;
  @tracked headline;
  @tracked description;
  @tracked required;
  @tracked multiple;
  @tracked choices;
  @tracked multiline;

  // extra fields
  @tracked index;
  @tracked value;
  @tracked isActive;
  @tracked meta;

  constructor(args) {
    this.question_type = args.question_type;
    this.identifier = args.identifier;
    this.headline = args.headline;
    this.description = args.description;
    this.required = args.required;
    this.multiple = args.multiple;
    this.multiline = args.multiline;
    this.choices =
      args.choices?.map((d) => {
        return new Choice(d);
      }) || [];

    this.index = args.index;
    this.value = '';
    this.isActive = args.isActive;
    this.meta = new Properties(args);
  }
}

export default class QuestionnairePageComponent extends Component {
  @service global;
  @tracked isEnabledArrowDown = false;

  @action
  onDomInit() {
    this.args.model.forEach((data) => {
      const q = data.questions || [];

      this.global.rows = q.map((d, index) => {
        const isActive = index == 0 ? true : false;
        return new Questionnaire({
          index: index + 1,
          ...d,
          isActive: isActive,
        });
      });
    });
  }

  @action onArrowAction(isArrowDown) {
    this.isEnabledArrowDown = isArrowDown;
  }

  get getRows() {
    return this.global.rows;
  }

  get getActiveIndex() {
    return this.global.rows.filter((d) => d.isActive === true)?.[0]?.index - 1;
  }

  get getRenderedItemNumber() {
    return this.getActiveIndex + 1;
  }
}
