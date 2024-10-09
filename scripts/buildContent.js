function buildContent(data, selectedTags = [], headingLevel = 2) {
  const result = document.createDocumentFragment();

  data.forEach(nodeJSON => {
    let node, caption, body;
    const isTerminating = (typeof nodeJSON.body === 'string');
    const captionExists = nodeJSON.head || nodeJSON.desc;

    if (isTerminating) {
      const isRelevant = !selectedTags.length ||
                         (nodeJSON.tags       &&
                          nodeJSON.tags.some(tag => selectedTags.includes(tag)));
      
      // Skip node if not relevant
      if (!isRelevant) return;
      
      // Building body
      body = document.createElement('div');
      body.classList.add('nodes__body');
      body.innerHTML = converter.makeHtml(nodeJSON.body);
      addClassBySelector(body, 'img', 'nodes__img');

      // Creating node as figure
      node = document.createElement('figure');
      node.classList.add('nodes__node_terminating');

      /* if (!captionExists) {
        body.classList.add('nodes__body_no-caption');
      } */
      
    } else {

      // Building body recursively
      const relevantChildren = buildContent(nodeJSON.body,
                                            selectedTags,
                                            headingLevel + 1);
      const empty = !relevantChildren.childElementCount;

      // Skip node if it has no relevant children
      if (empty) return;
      
      body = document.createElement('div');
      body.classList.add('nodes__body', 'nodes');
      body.appendChild(relevantChildren);

      // Creating node as section or div
      node = nodeJSON.head ? document.createElement('section')
                           : document.createElement('div');
    }    
    node.classList.add('nodes__node');

    // Building caption
    if (captionExists) {

      if (isTerminating) {
        caption = document.createElement('figcaption');
      } else {
        caption = document.createElement('header');
      }

      // Add heading if present
      if (nodeJSON.head) {
        const heading = document.createElement(`h${headingLevel}`);
        heading.classList.add('nodes__heading', `h${headingLevel}`);
        heading.textContent = nodeJSON.head;
        caption.appendChild(heading);
      }

      // Add description if present
      if (nodeJSON.desc) {
        const description = document.createElement('div');
        description.classList.add('nodes__description');
        description.innerHTML = converter.makeHtml(nodeJSON.desc);
        caption.appendChild(description);
      }

      caption.classList.add('nodes__caption');
      node.appendChild(caption);
    }

    node.appendChild(body);

    // Append the node to the result
    result.appendChild(node);
  });
  
  // TODO: объединить это с converter.makeHtml(),
  // а то оно отрабатывает по миллион раз на каждую ноду
  addClassBySelector(result, 'p, ul', 'margin-reset');
  return result;
}

function addClassBySelector(element, selector, classname) {
  element.querySelectorAll(selector)
    .forEach( (item) => {
      item.classList.add(classname);
  });
}