import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class FormsIndexComponent extends Component {
  @service global;

  BLOCK_LIST_CLASS = 'block-list__item ';
  @tracked blockListClassName = this.BLOCK_LIST_CLASS;
  @tracked styles = '';
  // store current rendered data and index
  @tracked renderedItemData = '';
  @tracked renderedItemIndex = '';

  scrollDebounce = true;
  NODE = '';
  clearTimeout1 = '';
  clearTimeout2 = '';

  // tracked properties ----
  get getLastItemIndex() {
    return this.args.rows?.length - 1;
  }

  // actions----
  @action
  onDomInit(item, index) {
    this.registerDomEventAction(item, index);
    this.renderedItemData = item;
    this.renderedItemIndex = index;
  }

  @action
  onPropsUpdate() {
    if (this.args.isEnabledArrowDown) {
      this.onArrowDown();
    } else {
      this.onArrowUp();
    }
  }
  onArrowUp() {
    this.blockListClassName = this.BLOCK_LIST_CLASS + 'arrow-down--transform ';
    this.styles = '';
    this.updateCurrentPage(this.renderedItemData, this.renderedItemIndex, true);
  }

  onArrowDown() {
    this.blockListClassName = this.BLOCK_LIST_CLASS + 'arrow-up--transform';
    this.styles = '';
    this.updateCurrentPage(
      this.renderedItemData,
      this.renderedItemIndex,
      false
    );
  }

  // button actions
  @action
  onTabAction() {
    this.onArrowDown();
  }

  // button click event
  @action
  onButtonAction() {
    this.pageTransitionValidation();
  }

  @action
  onSelectAction() {
    this.pageTransitionValidation();
  }
  // private functions----

  pageTransitionValidation() {
    if (this.renderedItemData.required) {
      this.performRequiredOperations();
      return;
    }
    // move next question
    this.moveToNextPage();
  }

  updateCurrentPage(item, index, isUpDirection) {
    // unregister the event
    if (this.NODE) {
      this.NODE.removeEventListener(
        'wheel',
        this.wheelEventPageTransition,
        true
      );
    }

    if (this.clearTimeout1) {
      clearTimeout(this.clearTimeout1);
      this.scrollDebounce = true;
    }

    if (this.clearTimeout2) {
      clearTimeout(this.clearTimeout2);
      this.scrollDebounce = true;
    }

    this.clearTimeout1 = setTimeout(() => {
      item.isActive = false;
      this.blockListClassName =
        this.BLOCK_LIST_CLASS +
        (isUpDirection ? 'arrow-up--top-list' : 'arrow-down--top-list');

      // activate next page
      this.updateNextActiveIndex(isUpDirection ? index - 1 : index + 1);

      this.clearTimeout2 = setTimeout(() => {
        this.styles = 'top:0; opacity:1';
        this.scrollDebounce = true;
      }, 20);
    }, 50);
  }

  registerDomEventAction() {
    this.scrollDebounce = true;
    this.NODE = document.getElementsByClassName(
      'block-scroller__positioner'
    )?.[0];

    this.NODE.addEventListener('wheel', this.wheelEventPageTransition, true);
  }

  wheelEventPageTransition = (e) => {
    if (this.scrollDebounce) {
      this.scrollDebounce = false;
      const dir = Math.sign(e.deltaY);
      // dir = 1 down direction
      const isUpDirection = dir === 1 ? false : true;
      let isNotBlockScrollAction = true;

      let scrollBlock = document.querySelector('.block-scroll__root');
      const hasScrollbar =
        scrollBlock && scrollBlock.scrollHeight > scrollBlock.clientHeight;
      // stop scrolling when index reached min and max reached
      if (isUpDirection) {
        if (hasScrollbar && scrollBlock.scrollTop != 0) {
          this.scrollDebounce = true;
          return;
        }

        if (this.renderedItemIndex - 1 == -1) {
          isNotBlockScrollAction = false;
          this.scrollDebounce = true;
        }
      } else {
        if (
          hasScrollbar &&
          scrollBlock.scrollHeight -
            scrollBlock.scrollTop -
            scrollBlock.clientHeight !=
            0
        ) {
          this.scrollDebounce = true;
          return;
        }

        if (this.renderedItemIndex + 1 == this.args.rows?.length) {
          isNotBlockScrollAction = false;
          this.scrollDebounce = true;
        }
      }

      if (isNotBlockScrollAction) {
        this.blockListClassName =
          this.BLOCK_LIST_CLASS +
          (isUpDirection ? 'arrow-down--transform ' : 'arrow-up--transform ');
        this.styles = '';
        this.scrollEventToSwitchPage(
          this.renderedItemData,
          this.renderedItemIndex,
          isUpDirection
        );
      }
    }
  };

  scrollEventToSwitchPage(item, index, isUpDirection) {
    // unregister the event
    if (this.NODE) {
      this.NODE.removeEventListener(
        'wheel',
        this.wheelEventPageTransition,
        true
      );
    }

    if (this.clearTimeout1) {
      clearTimeout(this.clearTimeout1);
      this.scrollDebounce = true;
    }

    if (this.clearTimeout2) {
      clearTimeout(this.clearTimeout2);
      this.scrollDebounce = true;
    }

    this.clearTimeout1 = setTimeout(() => {
      item.isActive = false;
      this.blockListClassName =
        this.BLOCK_LIST_CLASS +
        (isUpDirection ? 'arrow-up--top-list' : 'arrow-down--top-list');

      // activate next page
      this.updateNextActiveIndex(isUpDirection ? index - 1 : index + 1);

      this.clearTimeout2 = setTimeout(() => {
        this.styles = 'top:0; opacity:1';
        this.scrollDebounce = true;
      }, 12);
    }, 30);
  }

  updateNextActiveIndex(index) {
    this.global.rows[index].isActive = true;
  }

  //---------------------required field handling-----------------------
  performRequiredOperations() {
    // select handling with required fields
    const isChoiceSelected = this.renderedItemData?.choices?.filter(
      (c) => c.selected === true
    )?.length;

    if (this.renderedItemData.value?.trim() || isChoiceSelected) {
      this.global.rows[this.renderedItemIndex].meta.inValid = false;
      // move next question
      this.moveToNextPage();
    } else {
      this.global.rows[this.renderedItemIndex].meta.inValid = true;
    }
  }

  moveToNextPage() {
    if (this.renderedItemIndex + 1 !== this.global.rows.length) {
      this.onArrowDown();
    }
  }
}
