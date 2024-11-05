export function imgCorrection(context = document) {
    const images = context.querySelectorAll('.microcase__img');
    images.forEach((image, count) => {
      // Check if the image is already loaded
      if (image.complete) {
        addSizeModifier(image);
      } else {
        image.addEventListener('load', () => addSizeModifier(image));
        if (count > 2) image.setAttribute('loading', 'lazy');
        image.setAttribute('width', 720);
        image.setAttribute('height', 1500);
      }
    });
};

function addSizeModifier(image) {
  const aspectRatio = image.naturalWidth / image.naturalHeight;
  if (aspectRatio >= 5/4) {
    image.classList.add('microcase__img_width_wide');
  } else if (aspectRatio <= 2/3) {
    image.classList.add('microcase__img_width_tall');
  }
} 