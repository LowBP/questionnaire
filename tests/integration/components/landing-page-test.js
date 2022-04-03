import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

import questions from './utils/questions';

module('Integration | Component | landing-page', function (hooks) {
  setupRenderingTest(hooks);
  hooks.beforeEach(function () {
    this.setProperties({
      questions: questions,
    });
  });

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });
    await render(hbs`<LandingPage @model={{this.questions}}/>`);
    assert
      .dom(this.element)
      .hasText(
        "4.2k Satisfied Clients Privathaftpflichtversicherung Um Dein persönliches Privathaftpflichtversicherungs-Angebot zu erstellen, benötigen wir noch ein paar Informationen von Dir. Takes 2 mins Let's begin! press Enter ↵"
      );
  });
});
