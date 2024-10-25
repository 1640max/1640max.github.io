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

async function initPage() {
  const response = await fetch('/skeleton.yml');
  const yamlSkeleton = await response.text();
  
  // Convert YAML to JavaScript object
  skeleton = jsyaml.load(yamlSkeleton);
  
  refreshContent();
}

let skeleton;
initPage();

// Add event listeners to checkboxes for tag filtering
const filterForm = document.querySelector('.filter');
filterForm.addEventListener("change", handleTagChange);