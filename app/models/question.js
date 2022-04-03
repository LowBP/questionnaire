import Model, { attr } from '@ember-data/model';

export default class QuestionModel extends Model {
  @attr identifier;
  @attr name;
  @attr description;
  @attr questions;
  // @attr category_name_hyphenated;
}
