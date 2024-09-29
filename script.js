// Example recursive YAML data (replace with your fetch call later)
const yamlData = `
- head: "Introduction"
  desc: "Overview of the project."
  body:
    - head: "Project Goals"
      desc: "The primary objectives."
      tags: ["main"]
      body: "<p>The goals include improving performance and user engagement.</p>"
    - head: "Scope"
      desc: "Project boundaries and exclusions."
      body:
        - head: "In Scope"
          desc: "What is included in the project."
          tags: ["subsection"]
          body: "<p>Feature A and Feature B are included.</p>"
        - head: "Out of Scope"
          body:
            - head: "Excluded Features"
              tags: ["subsection"]
              body: "<p>Feature C is excluded from the project scope.</p>"
- head: "Implementation"
  desc: "How the project is executed."
  body:
    - head: "Phase 1"
      desc: "Initial phase focusing on research."
      tags: ["main"]
      body: "<p>Research on competitors and market analysis.</p>"
    - head: "Phase 2"
      desc: "Development phase."
      body:
        - head: "Frontend Development"
          desc: "Building the user interface."
          tags: ["subsection"]
          body: "<p>React was used for the frontend.</p>"
        - head: "Backend Development"
          body:
            - head: "API Design"
              tags: ["subsection"]
              body: "<p>REST API was designed using Node.js.</p>"
            - head: "Database Setup"
              body: "<p>MongoDB was chosen as the database.</p>"
- head: "Conclusion"
  desc: "Final remarks on the project."
  tags: ["section"]
  body: "<p>The project met all objectives and was completed on time.</p>"`;

// Convert YAML to JavaScript object
const parsedData = jsyaml.load(yamlData);

// Function to build HTML recursively, filtering based on tags
function buildSection(node, selectedTags, headingLevel = 2) {

  let body;

  // If the body is a string, it's a terminating node
  if (typeof node.body === 'string') {
    // If a terminating node has no tags it's never relevant.
    if (!selectedTags.length || (node.tags && node.tags.some(tag => selectedTags.includes(tag)))) {
      // Node is relevant, so create HTML for it
      body = document.createElement('div');
      body.innerHTML = node.body;
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
      body = document.createElement('section');
      relevantChildren.forEach(child => body.appendChild(child));
    }
  }

  // Create section and add heading, description, and body
  const section = document.createElement('section');

  if (node.head) {
    const heading = document.createElement(`h${headingLevel}`);
    heading.textContent = node.head;
    section.appendChild(heading);
  }
  
  if (node.desc) {
    const description = document.createElement('p');
    description.textContent = node.desc;
    section.appendChild(description);
  }

  section.appendChild(body);

  return section;
}

// Function to render the YAML data into the DOM
function renderPage(data, selectedTags) {
  const contentDiv = document.getElementById('content');
  contentDiv.innerHTML = ''; // Clear existing content

  data.forEach(node => {
    const section = buildSection(node, selectedTags);
    section && contentDiv.appendChild(section);
  });
}

// Function to handle tag checkbox changes
function handleTagChange() {
  const checkboxes = document.querySelectorAll('#tag-filters input[type="checkbox"]');
  const selectedTags = Array.from(checkboxes)
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.value);

  // Rebuild the page based on selected tags
  renderPage(parsedData, selectedTags);
}

// Add event listeners to checkboxes for tag filtering
document.querySelectorAll('#tag-filters input[type="checkbox"]').forEach(checkbox => {
  checkbox.addEventListener('change', handleTagChange);
});

// Initially render the page with no filtering (or apply a default set of selected tags)
renderPage(parsedData, []);