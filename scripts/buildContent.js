function buildContent(data, relevantTags = [], headingLevel = 2) {
  const result = document.createDocumentFragment();

  data.forEach(nodeJSON => {
    let node,           // resulting element
        caption, body, // parts of node
        blockName;    // 'term-node' or 'nodes'

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
      body.classList.add('term-node__body');
      body.innerHTML = converter.makeHtml(nodeJSON.body);
      addClassBySelector(body, 'img', 'term-node__img');

      // Creating node as figure
      node = document.createElement('figure');
      node.classList.add('term-node');

      blockName = 'term-node';
    } else {

      // Building body
      const relevantChildren = buildContent(nodeJSON.body,
                                            relevantTags,
                                            headingLevel + 1);
      const empty = !relevantChildren.childElementCount;

      // Skip node if it has no relevant children
      if (empty) return;
      
      body = document.createElement('div');
      body.appendChild(relevantChildren);
      body.classList.add('nodes__body', 'nodes');
      
      const allChildrenTerminating =
        Array.from(body.children).every(child => 
          child.classList.contains('term-node')
        );
      if (allChildrenTerminating) {
        body.classList.add('nodes_terminating');
      }
    

      // Creating node as section or div
      node = nodeJSON.head ? document.createElement('section')
                           : document.createElement('div');
      node.classList.add('nodes__node');
      blockName = 'nodes';
    }    

    // Building caption
    if (nodeJSON.head || nodeJSON.desc) {

      if (isTerminating) {
        caption = document.createElement('figcaption');
      } else {
        caption = document.createElement('header');
      }

      // Add heading if present
      if (nodeJSON.head) {
        const heading = document.createElement(`h${headingLevel}`);
        heading.classList.add(`${blockName}__heading`, `h${headingLevel}`);
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