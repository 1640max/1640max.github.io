function buildNode(nodeJSON, selectedTags, headingLevel = 2) {
  // Markdown to HTML converter
  // TODO: Make it global outta function
  const converter = new showdown.Converter({parseImgDimensions: true});
  // Node body
  let body;
  // Is the node terminating
  const isTerminating = (typeof nodeJSON.body === 'string');

  // We have to manage node's head, desc, and body. Let's start with the body.
  if (isTerminating) {
    // If the node is relevant
    // At least 1 tag is selected || (node has tags && at least one matches selected ones)
    if (!selectedTags.length || (nodeJSON.tags && nodeJSON.tags.some(tag => selectedTags.includes(tag)))) {
      // Since node is relevant, render its body
      body = document.createElement('div');
      body.classList.add('body');
      body.innerHTML = converter.makeHtml(nodeJSON.body);
    } else {
      // Since node is not relevant, skip it
      return null;
    }
  } else {
    // Array to collect rendered children nodes that contain relevant terminating nodes
    let relevantChildren = [];
    nodeJSON.body.forEach(childNode => {
      const childSection = buildNode(childNode, selectedTags, headingLevel + 1);
      childSection && relevantChildren.push(childSection);
    });
    // If there is at least 1 relevant child then push it to the node body
    if (relevantChildren.length) {
      body = document.createElement('div');
      body.classList.add('body');
      relevantChildren.forEach(child => body.appendChild(child));
    } else {
      // Skip this node
      return null;
    }
  }

  // Body is ready, node's head and desc remain
  const node = document.createElement('div');
  isTerminating && node.classList.add('terminating');
  node.classList.add('node');

  if (nodeJSON.head) {
    const heading = document.createElement(`h${headingLevel}`);
    heading.classList.add('heading', `h${headingLevel}`);
    heading.textContent = nodeJSON.head;
    node.appendChild(heading);
  }
  
  if (nodeJSON.desc) {
    const description = document.createElement('div');
    description.classList.add('description');
    description.innerHTML = converter.makeHtml(nodeJSON.desc);
    node.appendChild(description);
  }

  node.appendChild(body);

  return node;
}

// Function to render the YAML data into the DOM
function renderPage(data, selectedTags) {
  const contentDiv = document.querySelector('.content');
  contentDiv.innerHTML = ''; // Clear existing content

  data.forEach(nodeJSON => {
    const node = buildNode(nodeJSON, selectedTags);
    node && contentDiv.appendChild(node);
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
