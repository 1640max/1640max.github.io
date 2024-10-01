// Function to build HTML recursively, filtering based on tags
function buildSection(node, selectedTags, headingLevel = 2) {
  var converter = new showdown.Converter(); // Markdown to HTML
  let body;

  // If the body is a string, it's a terminating node
  if (typeof node.body === 'string') {
    // If a terminating node has no tags it's never relevant.
    if (!selectedTags.length || (node.tags && node.tags.some(tag => selectedTags.includes(tag)))) {
      // Node is relevant, so create HTML for it
      body = document.createElement('div');
      body.classList.add('microcase-body');
      body.innerHTML = converter.makeHtml(node.body);
    } else {
      return null; // Node is not relevant, skip it
    }
  } 
  
  // If the body is an array, it's a recursive node, so process children
  else {
    let relevantChildren = [];
    node.body.forEach(childNode => {
      const childSection = buildSection(childNode, selectedTags, headingLevel + 1);
      childSection && relevantChildren.push(childSection);
    });
    // If there are no relevant children, return null to skip this section
    if (!relevantChildren.length) {
      return null;
    } else {
      body = document.createElement('div');
      body.classList.add('node-body');
      relevantChildren.forEach(child => body.appendChild(child));
    }
  }

  // Create section and add heading, description, and body
  const section = document.createElement('div');
  section.classList.add('node');

  if (node.head) {
    const heading = document.createElement(`h${headingLevel}`);
    heading.textContent = node.head;
    section.appendChild(heading);
  }
  
  if (node.desc) {
    const description = document.createElement('p');
    description.innerHTML = converter.makeHtml(node.desc);
    section.appendChild(description);
  }

  section.appendChild(body);

  return section;
}

// Function to render the YAML data into the DOM
function renderPage(data, selectedTags) {
  const contentDiv = document.querySelector('.content');
  contentDiv.innerHTML = ''; // Clear existing content

  data.forEach(node => {
    const section = buildSection(node, selectedTags);
    section && contentDiv.appendChild(section);
  });
}

// Function to handle tag checkbox changes
function handleTagChange(skeleton) {
  const checkboxes = document.querySelectorAll('#tag-filters input[type="checkbox"]');
  const selectedTags = Array.from(checkboxes)
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.value);

  // Rebuild the page based on selected tags
  renderPage(skeleton, selectedTags);
}

async function initPage() {
  const response = await fetch('/data.yml');
  const yamlData = await response.text();
  
  // Convert YAML to JavaScript object
  const skeleton = jsyaml.load(yamlData);
  
  // Initially render the page with no filtering (or apply a default set of selected tags)
  renderPage(skeleton, []);

  // Add event listeners to checkboxes for tag filtering
  document.querySelectorAll('#tag-filters input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', () => handleTagChange(skeleton));
  });
}

document.addEventListener("DOMContentLoaded", initPage);
