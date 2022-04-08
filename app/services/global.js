import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
export default class GlobalService extends Service {
  @tracked isLandingPageVisited = false;
  @tracked rows = []; // store all questions and meta details
}
