import { imgCorrection } from "./resizer.js";
import { buildContent } from "./buildContent.js";
import "./style.scss";
import skeleton from './skeleton.yml';

function refreshContent(selectedTags = []) {
  const contentDiv = document.querySelector('.portfolio');
  contentDiv.innerHTML = ''; // Clear existing content

  let content = buildContent(skeleton, selectedTags);
  imgCorrection(content);
  contentDiv.appendChild(content);
}

function handleTagChange() {
  const checkboxes = filterForm.querySelectorAll('.filter__input');
  const selectedTags = Array.from(checkboxes)
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.value);

  // Rebuild the page based on selected tags
  refreshContent(selectedTags);
}

refreshContent();

// Add event listeners to checkboxes for tag filtering
const filterForm = document.querySelector('.filter');
filterForm.addEventListener("change", handleTagChange);