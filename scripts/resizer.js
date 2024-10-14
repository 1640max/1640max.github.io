function imgCorrection(context = document) {
    const images = context.querySelectorAll('.term-node__img');
    images.forEach(image => {
      // Check if the image is already loaded
      if (image.complete) {
        applyCorrection(image);
      } else {
        // Add event listener to run the logic once the image has loaded
        image.addEventListener('load', () => applyCorrection(image));
      }
    });
};

function applyCorrection(image) {
  const aspectRatio = image.naturalWidth / image.naturalHeight;
  if (aspectRatio >= 5/4) {
    image.classList.add('term-node__img_width_wide');
  } else if (aspectRatio <= 2/3) {
    image.classList.add('term-node__img_width_tall');
  }
} 