import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, findAll } from '@ember/test-helpers';
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
        '4.2k Zufriedene Kunden Privathaftpflichtversicherung Um Dein persönliches Privathaftpflichtversicherungs-Angebot zu erstellen, benötigen wir noch ein paar Informationen von Dir. dauert 2 min Lass uns anfangen! Drücken Sie Enter ↵'
      );
  });

  test('check for all images', async function (assert) {
    await render(hbs`<LandingPage @model={{this.questions}}/>`);
    assert.dom('.questn-page__container-content-layer').exists();
    assert.dom('figure').exists({ count: 3 }, '3 figures are there');
    assert.dom('img').exists({ count: 3 }, 'img tags');
    const imgList = findAll('img');
    assert
      .dom(imgList[0])
      .hasAttribute('src', '../assets/images/content-img-1.jpeg');
    assert
      .dom(imgList[1])
      .hasAttribute('src', '../assets/images/content-img-2.jpeg');
    assert
      .dom(imgList[2])
      .hasAttribute('src', '../assets/images/content-img-3.jpeg');
  });

  test('button with enter click check', async function (assert) {
    await render(hbs`<LandingPage @model={{this.questions}}/>`);
    assert.dom('.lower-box__action-wrapper').exists('button wrapper exists');
    assert.dom('button').hasAttribute('tabindex', '0', 'check tab focus');
    assert
      .dom('button .button__text_wrapper-content')
      .hasText('Lass uns anfangen!');
    assert.dom('button').hasStyle({
      backgroundColor: 'rgb(241, 137, 126)',
    });
    assert
      .dom('.action-helper__wrapper-content')
      .exists('check button acton helper');
    assert.dom('.content-block .text').hasText('Drücken Sie Enter ↵');
  });
});
