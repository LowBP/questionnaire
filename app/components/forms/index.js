import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

var start;
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
  wheelEvent = '';

  // tracked properties ----
  get getLastItemIndex() {
    return this.args.rows?.length - 1;
  }

  // actions----
  @action
  onDomInit(item, index) {
    this.wheelEvent =
      'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
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

  @action
  onDestroy() {
    this.NODE.removeEventListener(
      this.wheelEvent,
      this.wheelEventPageTransition,
      false
    );
    window.removeEventListener(
      'touchmove',
      this.wheelEventPageTransition,
      false
    );
    window.removeEventListener('touchstart', this.touchStart, false);
    this.NODE.removeEventListener(
      'DOMMouseScroll',
      this.wheelEventPageTransition,
      false
    );
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
        this.wheelEvent,
        this.wheelEventPageTransition,
        false
      );
      this.NODE.removeEventListener(
        'DOMMouseScroll',
        this.wheelEventPageTransition,
        false
      );
      window.removeEventListener(
        'touchmove',
        this.wheelEventPageTransition,
        false
      );
      window.removeEventListener('touchstart', this.touchStart, false);
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
    this.NODE = document.getElementsByClassName(
      'block-scroller__positioner'
    )?.[0];

    this.NODE.addEventListener(
      this.wheelEvent,
      this.wheelEventPageTransition,
      false
    );
    window.addEventListener('touchmove', this.wheelEventPageTransition, false);
    window.addEventListener('touchstart', this.touchStart, false);
    this.NODE.addEventListener(
      'DOMMouseScroll',
      this.wheelEventPageTransition,
      false
    );
  }

  touchStart = (e) => {
    let swipe = e.touches;
    start = swipe[0].pageY;
  };
  wheelEventPageTransition = async (e) => {
    if (this.scrollDebounce) {
      this.scrollDebounce = false;
      const dir = Math.sign(e.deltaY);
      // dir = 1 down direction
      let isUpDirection;
      // for mob devices
      if (e.touches?.length) {
        var contact = e.touches,
          end = contact[0].pageY,
          distance = end - start;
        if (distance < -8) {
          //up
          isUpDirection = false;
        } else if (distance > 0) {
          // down
          isUpDirection = true;
        } else {
          this.scrollDebounce = true;
          return;
        }
      } else {
        isUpDirection = dir === 1 ? false : true;
      }
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
      e.preventDefault();
    }
  };

  scrollEventToSwitchPage = (item, index, isUpDirection) => {
    this.onDestroy();
    this.clearTimeout1 = setTimeout(() => {
      item.isActive = false;
      this.blockListClassName =
        this.BLOCK_LIST_CLASS +
        (isUpDirection ? 'arrow-up--top-list' : 'arrow-down--top-list');

      // activate next page
      this.updateNextActiveIndex(isUpDirection ? index - 1 : index + 1);

      this.clearTimeout2 = setTimeout(() => {
        this.styles = 'top:0; opacity:1';
        setTimeout(() => {
          this.scrollDebounce = true;
        }, 300);
      }, 12);
    }, 30);
  };

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
    } else {
      if (this.checkFormValidation()) {
        // show thank you form
        this.global.isShowSubmitPage = true;
        this.global.isLandingPageVisited = false;
      } else {
        let toast = document.getElementById('toast');
        toast.className = 'show';
        setTimeout(() => {
          toast.className = toast.className.replace('show', '');
        }, 3000);
      }
    }
  }

  checkFormValidation() {
    let isFromValid = true;
    for (let i = 0; i < this.global.rows.length; i++) {
      const q = this.global.rows[i];

      if (q.question_type === 'text' && q.required && !q.value) {
        isFromValid = false;
        this.global.rows[i].meta.inValid = true; // show required alert
      } else if (q.question_type === 'multiple-choice' && q.required) {
        if (!q.choices.filter((c) => c.selected === true).length) {
          isFromValid = false;
          this.global.rows[i].meta.inValid = true; // show required alert
        }
      }
    }
    return isFromValid;
  }
}
