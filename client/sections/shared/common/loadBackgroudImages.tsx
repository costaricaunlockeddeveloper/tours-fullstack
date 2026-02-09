export default function loadBackgroudImages() {
  const backgroudImages = document.querySelectorAll("[data-background]");

  if (backgroudImages.length > 0) {
    backgroudImages.forEach(element => {
      if (element instanceof HTMLElement) {
        const image = element.dataset.background;
        if (image) {
          element.style.backgroundImage = `url('${image}')`;
        }
      }
    });
  }
}
