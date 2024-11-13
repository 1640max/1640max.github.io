import { imgCorrection } from "./resizer.js";
import { buildContent } from "./buildContent.js";
import "./style.scss";
import skeleton from './skeleton.yml';

/**
 * Расставляет чекбоксы на основе GET-параметра filter
 */
function initFilter() {
  const urlParams = new URLSearchParams(window.location.search);
  const filterParam = urlParams.get('filter');

  if (filterParam) {
    const filterValues = filterParam.split(',');
    filterValues.forEach(tag => {
      const checkbox = document.querySelector(`.filter__input[value="${tag}"]`);
      if (checkbox) {
        checkbox.checked = true;
      }
    })
  }
}

/**
 * Обновляет выборку кейсов и GET-параметр filter на основе чекбоксов
 */
function refreshContent() {
  const contentDiv = document.querySelector('.portfolio');
  contentDiv.innerHTML = '';

  const selectedTags = Array.from(checkboxes)
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.value);

  let content = buildContent(skeleton, selectedTags);
  imgCorrection(content);
  contentDiv.appendChild(content);

  const filterString = selectedTags.length > 0 ? `?filter=${selectedTags.join(',')}` : '/';
  window.history.replaceState(null, '', filterString);
}

const filterForm = document.querySelector('.filter');
const checkboxes = filterForm.querySelectorAll('.filter__input');

initFilter();
refreshContent();
filterForm.addEventListener("change", refreshContent);