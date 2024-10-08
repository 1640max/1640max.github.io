// https://postsandprograms.com/posts/20210722/
showdown.extension("remove-p-from-img", function () {
  return [
    {
      type: "output",
      filter: function (text) {
        text = text.replace(
          // match all <p>'s before and after an <img> tag
          /(<\/?p[^>]*>)((?=<img.+>)|(?<=<img.+>))/g,
          ""
        );
        return text;
      },
    },
  ];
});

// Markdown to HTML converter with extensions and parameters
var converter = new showdown.Converter({
  extensions: ["remove-p-from-img"],
  parseImgDimensions: true,
  openLinksInNewWindow: true,
  simpleLineBreaks: true,
});


function buildContent(data, selectedTags, headingLevel = 2) {
  const result = document.createDocumentFragment();

  data.forEach(nodeJSON => {
    let body;
    const isTerminating = (typeof nodeJSON.body === 'string');
    let node, caption;

    // Handle terminating node
    if (isTerminating) {
      if (!selectedTags.length || (nodeJSON.tags && nodeJSON.tags.some(tag => selectedTags.includes(tag)))) {
        body = document.createElement('div');
        body.classList.add('node__body');
        body.innerHTML = converter.makeHtml(nodeJSON.body);
      } else {
        return; // Skip node if not relevant
      }
      node = document.createElement('figure');
      node.classList.add('node_terminating');
      if (!nodeJSON.head && !nodeJSON.desc) {
        body.classList.add('node__body_no-caption');
      }
      caption = document.createElement('figcaption');

    } else {
      // Recursively build children
      let relevantChildren = buildContent(nodeJSON.body, selectedTags, headingLevel + 1);
      if (relevantChildren.childElementCount) {
        body = document.createElement('div');
        body.classList.add('node__body');
        body.appendChild(relevantChildren);
      } else {
        return; // Skip node if it has no relevant children
      }
      node = nodeJSON.head ? document.createElement('section')
                           : document.createElement('div');
      caption = document.createElement('header');
    }

    node.classList.add('node');
    caption.classList.add('node__caption');

    // Add heading if present
    if (nodeJSON.head) {
      const heading = document.createElement(`h${headingLevel}`);
      heading.classList.add('node__heading', `h${headingLevel}`);
      heading.textContent = nodeJSON.head;
      caption.appendChild(heading);
    }

    // Add description if present
    if (nodeJSON.desc) {
      const description = document.createElement('div');
      description.classList.add('node__description');
      description.innerHTML = converter.makeHtml(nodeJSON.desc);
      caption.appendChild(description);
    }

    // Append caption and body to the node
    if (nodeJSON.head || nodeJSON.desc) {
      node.appendChild(caption);
    }
    node.appendChild(body);

    // Append the node to the result
    result.appendChild(node);
  });

  return result;
}


// Function to render the YAML data into the DOM
function renderContent(data, selectedTags = []) {
  const contentDiv = document.querySelector('.content');
  contentDiv.innerHTML = ''; // Clear existing content

  const builtData = buildContent(data, selectedTags);
  contentDiv.appendChild(builtData);
}

// Function to handle tag checkbox changes
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
