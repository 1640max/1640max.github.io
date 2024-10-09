function buildContent(data, selectedTags = [], headingLevel = 2) {
  const result = document.createDocumentFragment();

  data.forEach(nodeJSON => {
    let node, caption, body;
    const isTerminating = (typeof nodeJSON.body === 'string');
    const captionExists = nodeJSON.head || nodeJSON.desc;

    if (isTerminating) {

      // Building body
      const isRelevant = !selectedTags.length ||
                         (nodeJSON.tags       &&
                          nodeJSON.tags.some(tag => selectedTags.includes(tag)));
      if (isRelevant) {
        body = document.createElement('div');
        body.classList.add('node__body');
        body.innerHTML = converter.makeHtml(nodeJSON.body);
        body.querySelectorAll('img').forEach( (img) => {
          img.classList.add('node__img');
        });
      } else {
        return; // Skip node if not relevant
      }

      // Creating node as figure
      node = document.createElement('figure');
      node.classList.add('node_terminating');

      if (!captionExists) {
        body.classList.add('node__body_no-caption');
      }
      
    } else {

      // Building body recursively
      const relevantChildren = buildContent(nodeJSON.body,
                                            selectedTags,
                                            headingLevel + 1);
      const notEmpty = relevantChildren.childElementCount;
      if (notEmpty) {
        body = document.createElement('div');
        body.classList.add('node__body');
        body.appendChild(relevantChildren);
      } else {
        return; // Skip node if it has no relevant children
      }

      // Creating node as section or div
      node = nodeJSON.head ? document.createElement('section')
                           : document.createElement('div');
    }    
    node.classList.add('node');

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

      caption.classList.add('node__caption');
      node.appendChild(caption);
    }

    node.appendChild(body);

    // Append the node to the result
    result.appendChild(node);
  });

  return result;
}