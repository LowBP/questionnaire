import Component from '@glimmer/component';
import { action } from '@ember/object';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

var SCENE = {};
export default class LandingPageComponent extends Component {
  clearTimeout = '';

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
  }

  @action
  onDestroy() {
    this.addRemoveModifierClass();
  }

  @action
  onMouseover() {
    SCENE.play();
  }

  @action
  onMouseout() {
    SCENE.reverse();
  }

  // private functions
  addRemoveModifierClass() {
    document.body.classList.toggle('body--display-block');
  }
}
