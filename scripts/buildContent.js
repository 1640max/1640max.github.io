function buildContent(data, relevantTags = [], headingLevel = 2) {
  const result = document.createDocumentFragment();

  data.forEach(nodeJSON => {
    let node,           // resulting element
        caption, body; // parts of node
    const captionExists = nodeJSON.head || nodeJSON.desc;

    const isTerminating = (typeof nodeJSON.body === 'string');
    if (isTerminating) {

      // Terminating node is relevant if:
      // - there are no relevant tags
      // - or at least one of it is in node's list
      // Terminating node is not relevant if:
      // - there is at least one relevant tag but no node's tag
      const isRelevant = !relevantTags.length ||
                          nodeJSON.tags &&
                          nodeJSON.tags.some(tag => relevantTags.includes(tag));
      
      // Skip node if not relevant
      if (!isRelevant) return;
      
      // Building body
      body = document.createElement('div');
      body.classList.add('microcase__body');
      body.innerHTML = converter.makeHtml(nodeJSON.body);
      addClassBySelector(body, 'img', 'microcase__img');

      // Creating node as figure
      node = document.createElement('figure');
      node.classList.add('microcase', 'portfolio__microcase');

    } else {

      // All children are automatically relevant if at least one
      // node's tag intersect with relevant ones.
      const allChildrenRelevant = 
        relevantTags.length &&
        nodeJSON.tags &&
        nodeJSON.tags.some(tag => relevantTags.includes(tag));
      
      // If so let's pass an empty array instead of relevant tags.
      // This way each descending terminating nоde will be relevant.
      let relevantTagsToPass;
      if (allChildrenRelevant)
        relevantTagsToPass = [];
      else
        relevantTagsToPass = relevantTags;

      // Building body
      const relevantChildren = buildContent(nodeJSON.body,
                                            relevantTagsToPass,
                                            headingLevel + 1);
      const empty = !relevantChildren.childElementCount;

      // Skip node if it has no relevant children
      if (empty) return;
      
      // If no caption then simply pass the children.
      // This node is probably only for tags nesting
      if (!captionExists) {
        result.appendChild(relevantChildren);
        return;
      }

      body = document.createDocumentFragment();
      body.appendChild(relevantChildren);
    
      node = document.createDocumentFragment();
    }    

    // Building caption
    if (captionExists) {

      let blockName;
      if (isTerminating) {
        caption = document.createElement('figcaption');
        blockName = 'microcase';
      } else {
        caption = document.createElement('hgroup');
        blockName = 'portfolio';
      }

      // Add heading if present
      if (nodeJSON.head) {
        const heading = document.createElement(`h${headingLevel}`);
        heading.classList.add(`h${headingLevel}`);
        heading.textContent = nodeJSON.head;
        caption.appendChild(heading);
      }

      // Add description if present
      if (nodeJSON.desc) {
        const description = document.createElement('div');
        description.classList.add(`${blockName}__description`);
        description.innerHTML = converter.makeHtml(nodeJSON.desc);
        caption.appendChild(description);
      }

      caption.classList.add(`${blockName}__caption`);
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