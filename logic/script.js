let entityNames = new Set();
let totalEntities = 0;

function generateEntities() {

  const container = document.getElementById("entitiesContainer");
  const n = parseInt(document.getElementById("numEntities").value);

  for (let i = 1; i <= n; i++) {
    totalEntities++;
    const entityDiv = document.createElement("div");
    entityDiv.className = "border p-4 mb-4 rounded bg-gray-50 entity-container";

    entityDiv.innerHTML = `
  <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
    
    <!-- Entity Header -->
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-lg font-semibold text-gray-800">Entity ${totalEntities}</h2>
      <button type="button" 
        class="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
        onclick="deleteEntities(this)">
        <img src="/img/dustbin.png" class="h-4 w-4" alt="Delete">
      </button>
    </div>

    <!-- Entity Name -->
    <div class="mb-3">
      <label for="Entity-${totalEntities}" class="block text-sm font-medium text-gray-600 mb-1">Entity Name</label>
      <input type="text" 
        id="Entity-${totalEntities}" 
        placeholder="Enter entity name" 
        class="entityNameInput w-full border border-gray-300 rounded-md shadow-sm text-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500" 
        oninput="checkforDuplicates(this); RefreshReleationship()" 
        onblur="addBlock(this)" />
    </div>

    <!-- Entity Type -->
   <div class="mb-4">
  <label class="block text-sm font-medium text-gray-700 mb-2">Entity Type</label>
  <div class="relative">
    <select
      class="w-full appearance-none border border-gray-300 rounded-lg bg-white shadow-sm text-sm px-3 py-2 pr-10 
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 
             transition duration-150"
      onchange="applyEntityType(this)">
      <option>Strong</option>
      <option>Weak</option>
    </select>
    <!-- Custom dropdown arrow -->
    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
      <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
</div>


    <!-- Attributes Section -->
    <div class="mb-2">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-gray-700">Attributes</span>
        <button type="button" 
          class="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-green-700 shadow"
          onclick="addAttribute(this)">
          + Add Attribute
        </button>
      </div>
      <!-- Attributes will go here -->
      <div class="attributes space-y-2"></div>
    </div>
  </div>
`;

    container.appendChild(entityDiv);
  }
}

// Function to refresh the dropdown of releationShip after updating (add/delete) entities.
function RefreshReleationship() {
  const allinput = document.querySelectorAll('.entityNameInput');
  const NewEntityList = [];
  allinput.forEach(input => {
    const val = input.value.trim();
    if (val != "") {
      NewEntityList.push(val);
    }
  });

  if (NewEntityList.length === 0) return;

  const entityOptions = NewEntityList.map(name =>
    `<option value="${name}">${name}</option>`).join("");

  //Update Each releationship dropdown
  const alldropdown = document.querySelectorAll('.entitySelect');
  alldropdown.forEach(dropdown => {
    const prevValue = dropdown.value;
    dropdown.innerHTML = `<option value="">Select Entity</option>${entityOptions}`;

    if (NewEntityList.includes(prevValue)) {
      dropdown.value = prevValue;
    }
  });
}

// Function to Delete the entities
function deleteEntities(btn) {
  const closetDiv = btn.closest(".entity-container");

  // get the input value BEFORE removing the DOM
  const input = closetDiv.querySelector(".entityNameInput");
  const valueOfInput = input?.value.trim();

  if (closetDiv) {
    closetDiv.remove();
  }

  totalEntities--;
  updateCnt();
  RefreshReleationship();
  if (valueOfInput) {
    DeleteDiagram(valueOfInput);
  }
}


// Function to update the count of Entities
function updateCnt() {
  const allEntities = document.querySelectorAll('.entity-container');
  for (let i = 0; i < allEntities.length; i++) {
    const heading = allEntities[i].querySelector("h2");
    if (heading) {
      heading.textContent = `Entity ${i + 1}`;
    }
  }
}


// check for Duplicates entry of entities
function checkforDuplicates(input) {

  const allInput = document.querySelectorAll('.entityNameInput');
  entityNames.clear();

  let duplicateEntities = new Set();

  allInput.forEach(input => {
    let val = input.value.trim().toLowerCase();
    if (val !== "") {
      if (entityNames.has(val)) {
        duplicateEntities.add(val);
      } else {
        entityNames.add(val);
      }
    }
  })

  //For display the change in the color of input feild
  allInput.forEach(input => {
    let val = input.value.trim().toLowerCase();
    if (duplicateEntities.has(val)) {

      input.classList.add("border-red-500", "ring-2", "ring-red-500");
      input.classList.remove("border-green-500", "ring-green-500");

    } else

      input.classList.add("border-green-500", "ring-2", "ring-green-500");
    input.classList.remove("border-red-500", "ring-red-500");

  });

}

function addAttribute(btn) {
  const attrDiv = document.createElement("div");
  attrDiv.className = "flex flex-col items-start";

  attrDiv.innerHTML = `
  <input type="text" placeholder="Attribute Name" 
               class="border rounded p-2 flex-1 attribute w-full mb-1.5" onblur="makeEntities(this)" />
        <select id="keydrp" class="border rounded p-2 w-full mb-1.5" onchange="applyPrimaryKeyattribute(this)">
        <option default>Single Valued</option>
        <option>Primary Key</option>
          <option>Multi Valued</option>
          <option>Derived</option>
          <option>Stored</option>
          <option>Composite</option>
        </select>
        <button onclick="deleteAttribute(this)"
        class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 ">X</button>
      `;

  btn.parentElement.nextElementSibling.appendChild(attrDiv);
}

// Function to delete a single attribute from both form and diagram
function deleteAttribute(btn) {
  const attrDiv = btn.parentElement;
  const attrInput = attrDiv.querySelector("input.attribute");

  if (attrInput) {
    const attrName = attrInput.value.trim();

    // Delete from diagram if attribute name exists
    if (attrName) {
      DeleteDiagram(attrName);
    }

    // Also delete any sub-attributes if it's a composite attribute
    const subContainer = attrDiv.querySelector(".sub-attributes");
    if (subContainer) {
      const subInputs = subContainer.querySelectorAll("input");
      subInputs.forEach(subInput => {
        const subAttrName = subInput.value.trim();
        if (subAttrName) {
          DeleteDiagram(subAttrName);
        }
      });
    }
  }

  // Remove from DOM
  attrDiv.remove();
}

// Function to delete sub-attribute from both form and diagram
function deleteSubAttribute(btn) {
  const subInputWrapper = btn.parentElement;
  const subInput = subInputWrapper.querySelector("input");

  if (subInput) {
    const subAttrName = subInput.value.trim();
    if (subAttrName) {
      DeleteDiagram(subAttrName);
    }
  }

  subInputWrapper.remove();
}

function addRelationship() {
  // Get current entities from DOM instead of entityNames Set
  const allinput = document.querySelectorAll('.entityNameInput');
  const currentEntityNames = [];
  allinput.forEach(input => {
    const val = input.value.trim();
    if (val !== "") {
      currentEntityNames.push(val);
    }
  });

  if (currentEntityNames.length < 2) {
    alert("Please create at least 2 entities before adding a relationship.");
    return;
  }

  const container = document.getElementById("relationshipsContainer");
  const relDiv = document.createElement("div");
  relDiv.className = "border p-4 rounded bg-gray-50";

  const entityOptions = currentEntityNames.map(name => `<option value="${name}">${name}</option>`).join("");

  relDiv.innerHTML = `
    <h3 class="font-bold mb-2">Relationship</h3>
    <input type="text" placeholder="Relationship Name"
        class="border rounded p-2 w-full mb-2 relationshipNameInput" onblur="createRelationshipDiamond(this)" />
    
    <div class="flex space-x-4 mb-2">
        <div class="flex-1">
            <label class="block mb-1">Entity 1:</label>
            <select class="border rounded p-2 w-full entitySelect" onchange="checkforentities(this); updateRelationshipDiamond(this)">
                <option value="">Select Entity</option>
                ${entityOptions}
            </select>
            <label class="block mt-1 mb-1">Participation:</label>
            <select class="border rounded p-2 w-full participationSelect" onchange="updateRelationshipDiamond(this)">
                <option value="Total">Total</option>
                <option value="Partial">Partial</option>
            </select>
            <label class="block mt-1 mb-1">Cardinality:</label>
            <select class="border rounded p-2 w-full">
                <option>1</option>
                <option>N</option>
                <option>M</option>
            </select>
        </div>
        
        <div class="flex-1">
            <label class="block mb-1">Entity 2:</label>
            <select class="border rounded p-2 w-full entitySelect" onchange="checkforentities(this); updateRelationshipDiamond(this)">
                <option value="">Select Entity</option>
                ${entityOptions}
            </select>
            <label class="block mt-1 mb-1">Participation:</label>
            <select class="border rounded p-2 w-full participationSelect" onchange="updateRelationshipDiamond(this)">
                <option value="Total">Total</option>
                <option value="Partial">Partial</option>
            </select>
            <label class="block mt-1 mb-1">Cardinality:</label>
            <select class="border rounded p-2 w-full">
                <option>1</option>
                <option>N</option>
                <option>M</option>
            </select>
        </div>
    </div>
    
    <button onclick="deleteRelationship(this)"
        class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Remove Relationship</button>
`; // Enhance the UI for this section also , keep the essential function Intract


  container.appendChild(relDiv);
}

// Updated createRelationshipDiamond function with better link creation logic
function createRelationshipDiamond(input) {
  const relationshipName = input.value.trim();
  if (!relationshipName) return;

  const relationshipDiv = input.closest(".border.p-4.rounded.bg-gray-50");
  const entitySelects = relationshipDiv.querySelectorAll('.entitySelect');

  // Check if relationship diamond already exists
  const existingNode = diagram.model.nodeDataArray.find(n => n.text === relationshipName && n.category?.includes("Relationship"));
  if (existingNode) return;

  // Get entity names from dropdowns
  const entity1Name = entitySelects[0]?.value.trim();
  const entity2Name = entitySelects[1]?.value.trim();

  // Only proceed if both entities are selected
  if (!entity1Name || !entity2Name) return;

  // Find entity nodes in diagram
  const entity1Node = diagram.model.nodeDataArray.find(n => n.text === entity1Name && (n.category === "Rectangle" || n.category === "Strong" || n.category === "Weak"));
  const entity2Node = diagram.model.nodeDataArray.find(n => n.text === entity2Name && (n.category === "Rectangle" || n.category === "Strong" || n.category === "Weak"));

  // Only proceed if both entity nodes exist
  if (!entity1Node || !entity2Node) return;

  // Determine if any selected entity is weak
  let hasWeakEntity = (entity1Node.category === "Weak" || entity2Node.category === "Weak");

  // Create relationship diamond
  const relationshipNode = {
    key: "Rel-" + Math.random().toString(36).substring(2, 9),
    text: relationshipName,
    category: hasWeakEntity ? "WeakRelationship" : "Relationship"
  };

  diagram.model.startTransaction("addRelationship");

  // Add the relationship node
  diagram.model.addNodeData(relationshipNode);

  // Create links from entities to relationship
  diagram.model.addLinkData({
    from: entity1Node.key,
    to: relationshipNode.key
  });

  diagram.model.addLinkData({
    from: entity2Node.key,
    to: relationshipNode.key
  });

  diagram.model.commitTransaction("addRelationship");
}

// Updated updateRelationshipDiamond function
function updateRelationshipDiamond(select) {
  const relationshipDiv = select.closest(".border.p-4.rounded.bg-gray-50");
  const relationshipNameInput = relationshipDiv.querySelector('.relationshipNameInput');
  const relationshipName = relationshipNameInput?.value.trim();

  if (!relationshipName) return;

  const relationshipNode = diagram.model.nodeDataArray.find(n =>
    n.text === relationshipName && n.category?.includes("Relationship")
  );

  if (!relationshipNode) {
    // If relationship doesn't exist yet, try to create it
    createRelationshipDiamond(relationshipNameInput);
    return;
  }

  const entitySelects = relationshipDiv.querySelectorAll('.entitySelect');
  const participationSelects = relationshipDiv.querySelectorAll('.participationSelect'); // Get participation selects

  const entity1Name = entitySelects[0]?.value.trim();
  const entity2Name = entitySelects[1]?.value.trim();
  const entity1Participation = participationSelects[0]?.value;
  const entity2Participation = participationSelects[1]?.value;

  if (!entity1Name || !entity2Name) return;

  // Find entity nodes
  const entity1Node = diagram.model.nodeDataArray.find(n => n.text === entity1Name && (n.category === "Rectangle" || n.category === "Strong" || n.category === "Weak"));
  const entity2Node = diagram.model.nodeDataArray.find(n => n.text === entity2Name && (n.category === "Rectangle" || n.category === "Strong" || n.category === "Weak"));

  if (!entity1Node || !entity2Node) return;

  // Check if any selected entity is weak
  let hasWeakEntity = (entity1Node.category === "Weak" || entity2Node.category === "Weak");

  // Update relationship category if needed
  const newCategory = hasWeakEntity ? "WeakRelationship" : "Relationship";

  diagram.model.startTransaction("updateRelationship");

  if (relationshipNode.category !== newCategory) {
    diagram.model.setCategoryForNodeData(relationshipNode, newCategory);
  }

  // Remove all existing links to this relationship
  const linksToRemove = [];
  diagram.model.linkDataArray.forEach(link => {
    if (link.to === relationshipNode.key) {
      linksToRemove.push(link);
    }
  });
  linksToRemove.forEach(link => {
    diagram.model.removeLinkData(link);
  });

  // Add new links from both entities to relationship
  diagram.model.addLinkData({
    from: entity1Node.key,
    to: relationshipNode.key,
    isTotalParticipation: (entity1Participation === "Total") // Set the property based on selection
  });

  diagram.model.addLinkData({
    from: entity2Node.key,
    to: relationshipNode.key,
    isTotalParticipation: (entity2Participation === "Total") // Set the property based on selection
  });

  diagram.model.commitTransaction("updateRelationship");
}

// Function to delete relationship from both form and diagram
function deleteRelationship(btn) {
  const relationshipDiv = btn.closest(".border.p-4.rounded.bg-gray-50");
  const relationshipNameInput = relationshipDiv.querySelector('.relationshipNameInput');
  const relationshipName = relationshipNameInput?.value.trim();

  // Delete from diagram
  if (relationshipName) {
    const relationshipNode = diagram.model.nodeDataArray.find(n =>
      n.text === relationshipName && n.category?.includes("Relationship")
    );
    if (relationshipNode) {
      diagram.remove(diagram.findNodeForKey(relationshipNode.key));
    }
  }

  // Remove from DOM
  relationshipDiv.remove();
}

function checkforentities(input) {
  const relationshipDiv = input.closest(".border.p-4.rounded.bg-gray-50");
  const dropdowns = relationshipDiv.querySelectorAll('.entitySelect');

  if (dropdowns.length === 2) {
    const val1 = dropdowns[0].value.trim().toLowerCase();
    const val2 = dropdowns[1].value.trim().toLowerCase();

    // skip empty selections
    if (val1 === "" || val2 === "") return;

    // normalize pair so (A,B) == (B,A)
    const pair = [val1, val2].sort().join("_")

    // collect all existing pairs from other relationship blocks
    const allPairs = [];
    document.querySelectorAll(".border.p-4.rounded.bg-gray-50").forEach(rel => {
      if (rel !== relationshipDiv) {
        const selects = rel.querySelectorAll(".entitySelect");
        if (selects.length === 2) {
          const v1 = selects[0].value.trim().toLowerCase();
          const v2 = selects[1].value.trim().toLowerCase();
          if (v1 !== "" && v2 !== "") {
            allPairs.push([v1, v2].sort().join("_"));
          }
        }
      }
    });

    // Check if this pair already exists elsewhere
    if (val1 === val2 || allPairs.includes(pair)) {
      dropdowns.forEach(dropdown => {
        dropdown.classList.remove("border-green-500", "ring-green-500");
        dropdown.classList.add("border-red-500", "ring-2", "ring-red-500");
      });
    } else {
      dropdowns.forEach(dropdown => {
        dropdown.classList.remove("border-red-500", "ring-red-500");
        dropdown.classList.add("border-green-500", "ring-2", "ring-green-500");
      });
    }
  }
}


// ------Gojs Logic -----
const $ = go.GraphObject.make;
const diagram = $(go.Diagram, "myDiagramDiv", {
  "undoManager.isEnabled": true
});

// Define node template
diagram.nodeTemplateMap.add("Rectangle",
  $(go.Node, "Auto",
    $(go.Shape, "Rectangle",
      { fill: "Yellow", stroke: "black", strokeWidth: 2 }),
    $(go.TextBlock, { margin: 10 },
      new go.Binding("text", "text"))
  ));

// Ellipse template
diagram.nodeTemplateMap.add("Ellipse",
  $(go.Node, "Auto",
    $(go.Shape, "Ellipse",
      { fill: "lightgreen", strokeWidth: 1 }),
    $(go.TextBlock,
      { margin: 10, editable: true },
      new go.Binding("text", "text"))
  )
);

// Priamry key Template
diagram.nodeTemplateMap.add("Primary Key",
  $(go.Node, "Auto",
    $(go.Shape, "Ellipse",
      { fill: "lightgreen", strokeWidth: 1 }),
    $(go.TextBlock,
      {
        textAlign: "center",
        margin: 10,
        stroke: "black",
        isMultiline: false,
        editable: true,
        isUnderline: true
      },
      new go.Binding("text", "text"))
  )
);


//Weak Entity Template
diagram.nodeTemplateMap.add("Weak",
  $(go.Node, "Spot",
    { width: 120, height: 50 },

    // Outer rectangle
    $(go.Shape, "Rectangle",
      {
        width: 120,
        height: 50,
        fill: "lightgreen",
        stroke: "black",
        strokeWidth: 2
      }),

    // Inner rectangle
    $(go.Shape, "Rectangle",
      {
        width: 110,
        height: 40,
        fill: null,
        stroke: "black",
        strokeWidth: 2,
        alignment: go.Spot.Center
      }),

    $(go.TextBlock,
      {
        textAlign: "center",
        alignment: go.Spot.Center
      },
      new go.Binding("text", "text"))
  ));

// Multivalue Attribute (double ellipse)
diagram.nodeTemplateMap.add("Multi Valued",
  // outer Ellipse
  $(go.Node, "Spot",
    $(go.Shape, "Ellipse",
      {
        fill: "lightgreen",
        strokeWidth: 2,
        stroke: "black",
        height: 60,
        width: 120,
        alignment: go.Spot.Center
      }),
    //Inner Ellipse
    $(go.Shape, "Ellipse",
      {
        fill: "lightgreen",
        strokeWidth: 2,
        height: 45,
        width: 104,
        stroke: "black",
        alignment: go.Spot.Center
      }
    ),
    $(go.TextBlock,
      new go.Binding("text", "text")
    )
  ));

// Derived attribute Template
diagram.nodeTemplateMap.add("Derived",
  $(go.Node, "Spot",
    $(go.Shape, "Ellipse",
      {
        fill: "lightgreen",
        strokeWidth: 2,
        height: 45,
        width: 110,
        strokeDashArray: [5, 3], // 5px ka dash and 3px ka gap
        alignment: go.Spot.Center
      }
    ),
    $(go.TextBlock,
      new go.Binding("text", "text"))
  ));



diagram.nodeTemplateMap.add("Relationship",
  $(go.Node, "Auto",
    $(go.Shape, "Diamond",
      {
        fill: "yellow",
        stroke: "black",
        strokeWidth: 2,
        minSize: new go.Size(80, 50),
        maxSize: new go.Size(250, 150) // Slightly more generous
      }),
    $(go.TextBlock,
      {
        margin: 1,
        textAlign: "center",
        editable: true,
        font: "bold 11pt sans-serif",
        wrap: go.TextBlock.WrapFit
      },
      new go.Binding("text", "text"))
  )
);

// Fixed Weak Relationship Template (double diamond) - Tight spacing
diagram.nodeTemplateMap.add("WeakRelationship",
  $(go.Node, "Auto",
    {
      locationSpot: go.Spot.Center
    },
    // Outer diamond - this will auto-size based on the panel content
    $(go.Shape, "Diamond",
      {
        fill: "#FFF8DC", // Light cream color
        stroke: "#4A4A4A",
        strokeWidth: 2,
        minSize: new go.Size(100, 60)
      }),

    // Panel to hold inner diamond and text with tighter margins
    $(go.Panel, "Auto",
      {
        margin: 1
      },
      // Inner diamond
      $(go.Shape, "Diamond",
        {
          fill: "transparent",
          stroke: "#4A4A4A",
          strokeWidth: 1.5,
          minSize: new go.Size(70, 40)
        }),

      // Text block
      $(go.TextBlock,
        {
          margin: 5,
          textAlign: "center",
          editable: true,
          font: "bold 10pt Arial, sans-serif",
          stroke: "#2C2C2C",
          wrap: go.TextBlock.WrapFit,
          maxLines: 2
        },
        new go.Binding("text", "text").makeTwoWay())
    )
  )
);

diagram.linkTemplate =
  $(go.Link,
    { routing: go.Link.Normal, curve: go.Link.JumpOver },
    // First line (always visible)
    $(go.Shape,
      { strokeWidth: 2, stroke: "black" }),

    // Second line for total participation
    $(go.Shape,
      {
        strokeWidth: 2,
        stroke: "black",
        segmentOffset: new go.Point(0, 5), // Create a small offset
        visible: false // Initially invisible
      },
      new go.Binding("visible", "isTotalParticipation")), // Bind visibility to a new property

    // Conditional arrow - only show for entity-attribute connections
    $(go.Shape, {
      toArrow: "Standard",
      fill: "black",
      stroke: "black"
    },
      new go.Binding("visible", "", function (link) {
        const fromNode = link.fromNode;
        const toNode = link.toNode;

        // Hide arrow if either node is a relationship (diamond)
        if (fromNode && toNode) {
          const fromCategory = fromNode.data.category;
          const toCategory = toNode.data.category;

          if (fromCategory?.includes("Relationship") || toCategory?.includes("Relationship")) {
            return false;
          }
        }
        return true; // Show arrow for entity-attribute connections
      }).ofObject())
  );


// Start with empty model
diagram.model = new go.GraphLinksModel([], []);
// Function to add new block dynamically
let nodeID = 1;

let existing = [];
function addBlock(input) {
  const val = input.value.trim();
  if (val === "") return;
  existing = diagram.model.nodeDataArray.find(node => node.text === val)
  if (existing) return;

  diagram.model.addNodeData({
    key: "Entity-" + nodeID++,
    text: val,
    color: "lightblue",
    category: "Rectangle"
  });
}


// To add the shape for the attribute.
function makeEntities(element) {
  const val = element.value.trim();
  if (val === "") return;

  const entityDiv = element.closest('.entity-container');
  const entityName = entityDiv.querySelector(".entityNameInput").value.trim();

  if (!entityName) return;

  const entityNode = diagram.model.nodeDataArray.find(n => n.text === entityName);
  if (!entityNode) return;

  const attrNode = {
    key: "No-" + Math.random().toString(36).substring(2, 9),
    text: val,
    category: "Ellipse"
  };

  //adding link between attribute and entities
  diagram.model.startTransaction("addAttribute");
  diagram.model.addNodeData(attrNode);
  diagram.model.addLinkData({
    from: entityNode.key,
    to: attrNode.key
  });
  diagram.model.commitTransaction("addAttribute");
}

function applyEntityType(selectEl) {
  const newType = selectEl.value; // "Strong" or "Weak"
  const entityDiv = selectEl.closest('.entity-container');
  const entityNamefeild = entityDiv.querySelector('.entityNameInput');
  const entityName = entityNamefeild.value.trim();

  const node = diagram.model.nodeDataArray.find(n => n.text === entityName);
  if (node) {
    diagram.model.startTransaction("changeEntityType");
    diagram.model.setCategoryForNodeData(node, newType);
    diagram.model.commitTransaction("changeEntityType");
  }
}

// Delete diagram node by text
function DeleteDiagram(value) {
  if (!diagram || !diagram.model) return;

  const node = diagram.model.nodeDataArray.find(n =>
    (n.text || "").trim().toLowerCase() === value.trim().toLowerCase()
  );

  if (node) {
    // This will automatically remove connected links too
    diagram.remove(diagram.findNodeForKey(node.key));
  }
}

// Function To make an attribute as Primary Key, Multivalued, Derived, or Composite
function applyPrimaryKeyattribute(selectEl) {
  const selectedValue = selectEl.value;

  // Find the attribute name (input before the select dropdown)
  const attrInput = selectEl.closest("div").querySelector("input.attribute");
  if (!attrInput) return;
  const attrName = attrInput.value.trim();
  if (!attrName) return;

  // ---------- Extra logic for Composite (UI only) ----------

  const row = selectEl.parentElement;

  // remove old sub-attributes container if user switches away
  const old = row.querySelector(".sub-attributes");
  if (old) {
    // Delete all sub-attributes from diagram before removing the container
    const subInputs = old.querySelectorAll("input");
    subInputs.forEach(subInput => {
      const subAttrName = subInput.value.trim();
      if (subAttrName) {
        DeleteDiagram(subAttrName);
      }
    });
    old.remove();
  }

  if (selectedValue === "Composite") {
    const subContainer = document.createElement("div");
    subContainer.className =
      "sub-attributes flex flex-col space-y-2 ml-10 mt-2 pl-4 border-l-2 border-dashed border-gray-400";

    // add button for new sub-attributes
    const addBtn = document.createElement("button");
    addBtn.textContent = "+ Add Sub-Attribute";
    addBtn.className =
      "px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600";
    addBtn.onclick = () => {
      const subInputWrapper = document.createElement("div");
      subInputWrapper.className = "flex items-center space-x-2"; // input + delete in row

      const subInput = document.createElement("input");
      subInput.type = "text";
      subInput.placeholder = "Sub-Attribute";
      subInput.className = "border rounded p-1 flex-1";

      subInput.onblur = () => {
        const parentNode = diagram.model.nodeDataArray.find(n => n.text === attrName);
        if (!parentNode) return;

        const subName = subInput.value.trim();
        if (!subName) return;

        //  Validation: check other sub-inputs in the same composite block
        const allSubInputs = subContainer.querySelectorAll("input");
        let duplicate = false;
        allSubInputs.forEach(inp => {
          if (inp !== subInput && inp.value.trim().toLowerCase() === subName.toLowerCase()) {
            duplicate = true;
          }
        });

        if (duplicate) {
          //  Mark red border
          subInput.classList.remove("border-green-500", "ring-green-500");
          subInput.classList.add("border-red-500", "ring-2", "ring-red-500");
          return;
        } else {
          //  Mark green border
          subInput.classList.remove("border-red-500", "ring-red-500");
          subInput.classList.add("border-green-500", "ring-2", "ring-green-500");
        }


        // create sub-attribute node + link in GoJS
        diagram.model.commit(m => {
          const subAttrNode = {
            key: "No-" + Math.random().toString(36).substring(2, 9),
            text: subInput.value.trim(),
            category: "Ellipse"
          };
          m.addNodeData(subAttrNode);
          m.addLinkData({ from: parentNode.key, to: subAttrNode.key });
        }, "addSubAttribute");
      };

      const delBtn = document.createElement("button");
      delBtn.textContent = "X";
      delBtn.className =
        "px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600";
      delBtn.onclick = () => deleteSubAttribute(delBtn);

      subInputWrapper.appendChild(subInput);
      subInputWrapper.appendChild(delBtn);

      // insert before Add button
      subContainer.insertBefore(subInputWrapper, addBtn);
    };

    subContainer.appendChild(addBtn);
    row.appendChild(subContainer);
  }

  // ---------- Update GoJS node category ----------
  const node = diagram.model.nodeDataArray.find(n => n.text === attrName);
  if (!node) return;

  diagram.model.commit(m => {
    if (selectedValue === "Primary Key") {
      m.setCategoryForNodeData(node, "Primary Key");
    } else if (selectedValue === "Multi Valued") {
      m.setCategoryForNodeData(node, "Multi Valued");
    } else if (selectedValue === "Derived") {
      m.setCategoryForNodeData(node, "Derived");
    } else {
      m.setCategoryForNodeData(node, "Ellipse"); // default
    }
  }, "changeAttributeType");
}

/*Logic for Conversion of ER model to Relational Model*/

function convertAndOpenRelationalPage() {
  const nodes = diagram.model.nodeDataArray;
  const links = diagram.model.linkDataArray;

  const tables = {}; // store tables by entity name
  const processedRelationships = new Set();
  
  function getAttributes(entityNode) {
    const attrs = [];

    links.forEach(link => {
      if (link.from === entityNode.key || link.to === entityNode.key) {
        const attrKey = (link.from === entityNode.key) ? link.to : link.from;
        const attrNode = nodes.find(n => n.key === attrKey);
        if (!attrNode) return;

        // if the attribute is derived ignore it for relational schema
        if (attrNode.category === "Derived") return;

        // 🔎 Check if this attribute has children (sub-attributes)
        const subLinks = links.filter(l =>
          (l.from === attrNode.key || l.to === attrNode.key) &&
          (l.from !== entityNode.key && l.to !== entityNode.key)
        );

        if (subLinks.length > 0) {
          // It's a composite → expand its children
          subLinks.forEach(subLink => {
            const subAttrKey = (subLink.from === attrNode.key) ? subLink.to : subLink.from;
            const subAttrNode = nodes.find(n => n.key === subAttrKey);
            if (subAttrNode) {
              attrs.push({
                name: subAttrNode.text,
                type: "VARCHAR(255)",
                category: subAttrNode.category
              });
            }
          });
        } else {
          // Simple attribute
          attrs.push({
            name: attrNode.text,
            type: "VARCHAR(255)",
            category: attrNode.category
          });
        }
      }
    });

    console.log("Entity:", entityNode.text, "→ Attributes:", attrs);

    return attrs;
  }

  // 1️⃣ Process entities (Strong and Weak)
  nodes.forEach(node => {
    if (["Rectangle", "Strong", "Weak"].includes(node.category)) {
      const table = {
        tableName: node.text,
        columns: [],
        primaryKey: null,
        foreignKeys: []
      };

      const attributes = getAttributes(node);
      attributes.forEach(attr => {
        table.columns.push({ name: attr.name, type: "VARCHAR(255)" });
        if (attr.category === "Primary Key") table.primaryKey = attr.name;
      });

      // default PK if none defined
      if (!table.primaryKey && table.columns.length > 0) table.primaryKey = table.columns[0].name;

      tables[node.text] = table;
    }
  });

  // 2️⃣ Process relationships
  nodes.forEach(node => {
    if ((node.category === "Relationship" || node.category === "WeakRelationship") && !processedRelationships.has(node.key)) {
      processedRelationships.add(node.key);

      const connectedLinks = links.filter(l => l.from === node.key || l.to === node.key);
      const connectedEntities = connectedLinks.map(l => {
        const otherKey = l.from === node.key ? l.to : l.from;
        return nodes.find(n => ["Rectangle", "Strong", "Weak"].includes(n.category) && n.key === otherKey);
      }).filter(Boolean);

      if (connectedEntities.length < 2) return;

      const [entity1, entity2] = connectedEntities;

      const link1 = links.find(l => (l.from === entity1.key && l.to === node.key) || (l.to === entity1.key && l.from === node.key));
      const link2 = links.find(l => (l.from === entity2.key && l.to === node.key) || (l.to === entity2.key && l.from === node.key));

      const participation1 = link1?.isTotalParticipation ? "Total" : "Partial";
      const participation2 = link2?.isTotalParticipation ? "Total" : "Partial";

      // Determine relationship type: M:N if both are multi
      const mNRelationship = true; // treat all as M:N for simplicity

      if (mNRelationship) {
        const relTable = {
          tableName: node.text,
          columns: [],
          primaryKey: null,
          foreignKeys: []
        };

        relTable.columns.push({ name: entity1.text + "_id", type: "INT" });
        relTable.columns.push({ name: entity2.text + "_id", type: "INT" });
        relTable.foreignKeys.push({ column: entity1.text + "_id", references: entity1.text });
        relTable.foreignKeys.push({ column: entity2.text + "_id", references: entity2.text });

        // Relationship attributes
        links.forEach(l => {
          if (l.from === node.key) {
            const attrNode = nodes.find(n => n.key === l.to);
            if (attrNode) relTable.columns.push({ name: attrNode.text, type: "VARCHAR(255)" });
          }
        });

        tables[relTable.tableName] = relTable;
      }
    }
  });

  // 3️⃣ Process multi-valued attributes
  nodes.forEach(node => {
    if (node.category === "Multi Valued") {
      const parentLink = links.find(l => l.to === node.key);
      if (!parentLink) return;
      const parentNode = nodes.find(n => n.key === parentLink.from);
      if (!parentNode) return;

      const mvTableName = parentNode.text + "_" + node.text;
      const mvTable = {
        tableName: mvTableName,
        columns: [
          { name: parentNode.text + "_id", type: "INT" },
          { name: node.text, type: "VARCHAR(255)" }
        ],
        primaryKey: parentNode.text + "_id",
        foreignKeys: [{ column: parentNode.text + "_id", references: parentNode.text }]
      };

      tables[mvTableName] = mvTable;
    }
  });

  console.log("Generated Relational Tables:", tables);

  // Store relational tables in sessionStorage
  sessionStorage.setItem("relationalTables", JSON.stringify(Object.values(tables)));

  // Open relational model page
  window.open("relational.html", "_blank");
}
