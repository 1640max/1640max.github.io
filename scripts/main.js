function renderContent(data, selectedTags = []) {
  const contentDiv = document.querySelector('#nodes');
  contentDiv.innerHTML = ''; // Clear existing content

  const builtData = buildContent(data, selectedTags);
  contentDiv.appendChild(builtData);
}

function handleTagChange(checkboxes, skeleton) {
  const selectedTags = Array.from(checkboxes)
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.value);

  // Rebuild the page based on selected tags
  renderContent(skeleton, selectedTags);
}

async function initPage() {
  const response = await fetch('/data.yml');
  const yamlData = await response.text();
  
  // Convert YAML to JavaScript object
  const skeleton = jsyaml.load(yamlData);
  
  renderContent(skeleton);

  // Add event listeners to checkboxes for tag filtering
  const filterForm = document.querySelector('#tag-filters');
  const checkboxes = filterForm.querySelectorAll('input[type="checkbox"]');
  filterForm.addEventListener("change", () => handleTagChange(checkboxes, skeleton));
}

document.addEventListener("DOMContentLoaded", initPage);
