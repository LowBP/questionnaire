import Component from '@glimmer/component';
import { action } from '@ember/object';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { inject as service } from '@ember/service';

var SCENE = {};
export default class LandingPageComponent extends Component {
  @service global;

  clearTimeout = '';
  NODE = '';

  get getQuestion() {
    return this.args.model.map((data) => {
      return { name: data.name, description: data.description };
    })[0];
  }
  @action
  onDomRender() {
    this.addRemoveModifierClass();

    gsap.registerPlugin(ScrollTrigger);
    let speed = 3;
    SCENE = gsap.timeline();

    ScrollTrigger.create({
      animation: SCENE,
      trigger: '.scrollElement',
      start: 'top top',
      end: '100% 100%',
      scrub: 1,
    });

    function runTransImgBlock() {
      SCENE.to(
        '#figure-1',
        {
          y: 3 * speed,
          x: 1 * speed + 5,
          scale: 0.9,
          ease: 'figure-2.in',
        },
        0
      );
      SCENE.to(
        '#figure-2',
        {
          y: 2 * speed,
          x: -(1 * speed + 20),
          scale: 0.9,
          ease: 'figure-1.in',
        },
        0
      );
    }

    runTransImgBlock();

    if (this.clearTimeout) {
      clearTimeout(this.clearTimeout);
    }

    SCENE.play();
    this.clearTimeout = setTimeout(() => {
      SCENE.reverse();
    }, 400);

    this.NODE = document.getElementsByClassName('ember-application')[0];
    this.NODE.addEventListener('keyup', this.registerKeyEventAction, true);
  }

  @action
  onDestroy() {
    this.addRemoveModifierClass();
    this.NODE.removeEventListener('keyup', this.registerKeyEventAction, true);
  }

  @action
  onMouseover() {
    SCENE.play();
  }

  @action
  onMouseout() {
    SCENE.reverse();
  }

  @action
  moveToNextPage() {
    this.global.isLandingPageVisited = true;
  }

  // private functions
  addRemoveModifierClass() {
    document.body.classList.toggle('landingPage');
  }

  registerKeyEventAction = (e) => {
    const keyCode = e.which || e.keyCode;
    if (e.key === 'Enter' || keyCode == 13) {
      this.moveToNextPage();
    }
  };
}
