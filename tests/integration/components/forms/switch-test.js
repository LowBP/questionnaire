import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | forms/switch', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders with default behaviour', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<Forms::Switch />`);
    assert.dom('.switch_box').exists();
    assert.dom('.toggle_switch').hasStyle({
      width: '100px',
    });
    assert.dom('input').exists();
    assert.dom('svg.checkbox').exists();
    assert.dom(this.element).hasText('');
    assert.dom('svg.checkbox .is_unchecked').hasStyle({
      opacity: '1',
    });
    assert.dom('svg.checkbox .is_checked').hasStyle({
      opacity: '0',
    });
  });

  test('switch with checked true', async function (assert) {
    await render(hbs`<Forms::Switch  @checked={{true}} />`);
    assert.dom('.switch_box').exists();
    assert.dom('svg.checkbox .is_unchecked').hasStyle({
      opacity: '0',
    });
    assert.dom('svg.checkbox .is_checked').hasStyle({
      opacity: '1',
    });
  });
});
