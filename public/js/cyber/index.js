$(document).ready(() => {
  let scene = $('#scene')[0];
  let parallax = new Parallax(scene, {
    relativeInput: true,
    limitX: 90,
    limitY: 20,
    frictionX: 0.075,
    frictionY: 0.075,
    scalarX: 6,
    scalarY: 6,
    clipRelativeInput: true
  });

  let parallaxContainer = $('#parallax-container');
  parallaxContainer.mouseenter(() => {
    parallax.enable();
  });

  parallaxContainer.mouseleave(() => {
    parallax.disable();
  });
});
