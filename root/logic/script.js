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
        <img src="../img/dustbin.png" class="h-4 w-4" alt="Delete">
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

// Function 4: addRelationship (ENHANCED)
// This now creates a clean, styled card matching the entity blocks.
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
  // Added 'relationship-container' class for specific selection
  relDiv.className = "bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-4 relationship-container";

  const entityOptions = currentEntityNames.map(name => `<option value="${name}">${name}</option>`).join("");

  relDiv.innerHTML = `
    <div class="flex items-center justify-between mb-3">
        <h3 class="text-lg font-semibold text-gray-800">New Relationship</h3>
        <button type="button" 
            class="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
            onclick="deleteRelationship(this)">
            <img src="../img/dustbin.png" class="h-4 w-4" alt="Delete">
        </button>
    </div>

    <div class="mb-3">
        <label class="block text-sm font-medium text-gray-600 mb-1">Relationship Name</label>
        <input type="text" placeholder="e.g., Works_On"
            class="relationshipNameInput w-full border border-gray-300 rounded-md shadow-sm text-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500" 
            onblur="createRelationshipDiamond(this)" />
    </div>
    
    <div class="flex flex-col md:flex-row md:space-x-4 mb-2">
        <div class="flex-1 mb-4 md:mb-0">
            <label class="block text-sm font-medium text-gray-700 mb-2">Entity 1</label>
            <div class="relative">
                <select class="entitySelect w-full appearance-none border border-gray-300 rounded-lg bg-white shadow-sm text-sm px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150" 
                        onchange="checkforentities(this); updateRelationshipDiamond(this)">
                    <option value="">Select Entity</option>
                    ${entityOptions}
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
            
            <label class="block text-sm font-medium text-gray-700 mt-3 mb-2">Participation</label>
            <div class="relative">
                <select class="participationSelect w-full appearance-none border border-gray-300 rounded-lg bg-white shadow-sm text-sm px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150" 
                        onchange="updateRelationshipDiamond(this)">
                    <option value="Partial">Partial</option>
                    <option value="Total">Total</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
            
            <label class="block text-sm font-medium text-gray-700 mt-3 mb-2">Cardinality</label>
            <div class="relative">
                <select class="cardinalitySelect w-full appearance-none border border-gray-300 rounded-lg bg-white shadow-sm text-sm px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150" 
                        onchange="updateRelationshipDiamond(this)">
                    <option>1</option>
                    <option>N</option>
                    <option>M</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>
        
        <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">Entity 2</label>
            <div class="relative">
                <select class="entitySelect w-full appearance-none border border-gray-300 rounded-lg bg-white shadow-sm text-sm px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150" 
                        onchange="checkforentities(this); updateRelationshipDiamond(this)">
                    <option value="">Select Entity</option>
                    ${entityOptions}
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
            
            <label class="block text-sm font-medium text-gray-700 mt-3 mb-2">Participation</label>
            <div class="relative">
                <select class="participationSelect w-full appearance-none border border-gray-300 rounded-lg bg-white shadow-sm text-sm px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150" 
                        onchange="updateRelationshipDiamond(this)">
                    <option value="Partial">Partial</option>
                    <option value="Total">Total</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
            
            <label class="block text-sm font-medium text-gray-700 mt-3 mb-2">Cardinality</label>
            <div class="relative">
                <select class="cardinalitySelect w-full appearance-none border border-gray-300 rounded-lg bg-white shadow-sm text-sm px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150" 
                        onchange="updateRelationshipDiamond(this)">
                    <option>1</option>
                    <option>N</option>
                    <option>M</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>
    </div>
  `;

  container.appendChild(relDiv);
}


// Function 2: createRelationshipDiamond (MODIFIED)
// Added a validation check at the beginning.
function createRelationshipDiamond(input) {
  const relationshipName = input.value.trim();
  if (!relationshipName) return;

  const relationshipDiv = input.closest(".relationship-container"); // Use specific class

  // --- ADDED VALIDATION GUARD ---
  // We pass one of the dropdowns (or the input itself) to checkforentities
  const entitySelects = relationshipDiv.querySelectorAll('.entitySelect');
  if (!checkforentities(entitySelects[0] || input)) {
    console.warn("Duplicate relationship blocked by createRelationshipDiamond.");
    return; // Do not create if the pair is invalid
  }
  // --- END GUARD ---

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


// Function 3: updateRelationshipDiamond (MODIFIED)
// Added a validation check at the beginning.
function updateRelationshipDiamond(select) {
  const relationshipDiv = select.closest(".relationship-container"); // Use specific class

  // --- ADDED VALIDATION GUARD ---
  // This check runs first. If it's invalid, the function stops.
  if (!checkforentities(select)) {
    console.warn("Duplicate relationship blocked by updateRelationshipDiamond.");
    return; // Do not update if the pair is invalid
  }
  // --- END GUARD ---

  const relationshipNameInput = relationshipDiv.querySelector('.relationshipNameInput');
  const cardinalitySelects = relationshipDiv.querySelectorAll('.cardinalitySelect'); // Get cardinality selects

  const relationshipName = relationshipNameInput?.value.trim();

  if (!relationshipName) return;

  const relationshipNode = diagram.model.nodeDataArray.find(n =>
    n.text === relationshipName && n.category?.includes("Relationship")
  );

  if (!relationshipNode) {
    // If relationship doesn't exist yet, try to create it
    // The createRelationshipDiamond function now has its own guard, so this is safe.
    createRelationshipDiamond(relationshipNameInput);
    return;
  }

  const entitySelects = relationshipDiv.querySelectorAll('.entitySelect');
  const participationSelects = relationshipDiv.querySelectorAll('.participationSelect'); // Get participation selects

  const entity1Name = entitySelects[0]?.value.trim();
  const entity2Name = entitySelects[1]?.value.trim();
  const entity1Participation = participationSelects[0]?.value;
  const entity2Participation = participationSelects[1]?.value;
  const entity1Cardinality = cardinalitySelects[0]?.value; // Get cardinality values
  const entity2Cardinality = cardinalitySelects[1]?.value;


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
    if (link.to === relationshipNode.key || link.from === relationshipNode.key) {
      linksToRemove.push(link);
    }
  });
  linksToRemove.forEach(link => {
    diagram.model.removeLinkData(link);
  });

  // Add new links from both entities to relationship WITH CARDINALITY
  diagram.model.addLinkData({
    from: entity1Node.key,
    to: relationshipNode.key,
    isTotalParticipation: (entity1Participation === "Total"),
    cardinality: entity1Cardinality // 👈 ADD THIS LINE
  });

  diagram.model.addLinkData({
    from: entity2Node.key,
    to: relationshipNode.key,
    isTotalParticipation: (entity2Participation === "Total"),
    cardinality: entity2Cardinality // 👈 ADD THIS LINE
  });

  diagram.model.commitTransaction("updateRelationship");
}

// Function 4: addRelationship (ENHANCED)
// This now creates a clean, styled card matching the entity blocks.
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
  // Added 'relationship-container' class for specific selection
  relDiv.className = "bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-4 relationship-container";

  const entityOptions = currentEntityNames.map(name => `<option value="${name}">${name}</option>`).join("");

  relDiv.innerHTML = `
    <div class="flex items-center justify-between mb-3">
        <h3 class="text-lg font-semibold text-gray-800">New Relationship</h3>
        <button type="button" 
            class="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
            onclick="deleteRelationship(this)">
            <img src="../img/dustbin.png" class="h-4 w-4" alt="Delete">
        </button>
    </div>

    <div class="mb-3">
        <label class="block text-sm font-medium text-gray-600 mb-1">Relationship Name</label>
        <input type="text" placeholder="e.g., Works_On"
            class="relationshipNameInput w-full border border-gray-300 rounded-md shadow-sm text-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500" 
            onblur="createRelationshipDiamond(this)" />
    </div>
    
    <div class="flex flex-col md:flex-row md:space-x-4 mb-2">
        <div class="flex-1 mb-4 md:mb-0">
            <label class="block text-sm font-medium text-gray-700 mb-2">Entity 1</label>
            <div class="relative">
                <select class="entitySelect w-full appearance-none border border-gray-300 rounded-lg bg-white shadow-sm text-sm px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150" 
                        onchange="checkforentities(this); updateRelationshipDiamond(this)">
                    <option value="">Select Entity</option>
                    ${entityOptions}
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
            
            <label class="block text-sm font-medium text-gray-700 mt-3 mb-2">Participation</label>
            <div class="relative">
                <select class="participationSelect w-full appearance-none border border-gray-300 rounded-lg bg-white shadow-sm text-sm px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150" 
                        onchange="updateRelationshipDiamond(this)">
                    <option value="Partial">Partial</option>
                    <option value="Total">Total</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
            
            <label class="block text-sm font-medium text-gray-700 mt-3 mb-2">Cardinality</label>
            <div class="relative">
                <select class="cardinalitySelect w-full appearance-none border border-gray-300 rounded-lg bg-white shadow-sm text-sm px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150" 
                        onchange="updateRelationshipDiamond(this)">
                    <option>1</option>
                    <option>N</option>
                    <option>M</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>
        
        <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">Entity 2</label>
            <div class="relative">
                <select class="entitySelect w-full appearance-none border border-gray-300 rounded-lg bg-white shadow-sm text-sm px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150" 
                        onchange="checkforentities(this); updateRelationshipDiamond(this)">
                    <option value="">Select Entity</option>
                    ${entityOptions}
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
            
            <label class="block text-sm font-medium text-gray-700 mt-3 mb-2">Participation</label>
            <div class="relative">
                <select class="participationSelect w-full appearance-none border border-gray-300 rounded-lg bg-white shadow-sm text-sm px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150" 
                        onchange="updateRelationshipDiamond(this)">
                    <option value="Partial">Partial</option>
                    <option value="Total">Total</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
            
            <label class="block text-sm font-medium text-gray-700 mt-3 mb-2">Cardinality</label>
            <div class="relative">
                <select class="cardinalitySelect w-full appearance-none border border-gray-300 rounded-lg bg-white shadow-sm text-sm px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150" 
                        onchange="updateRelationshipDiamond(this)">
                    <option>1</option>
                    <option>N</option>
                    <option>M</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>
    </div>
  `;

  container.appendChild(relDiv);
}

// Function 5: deleteRelationship (MODIFIED)
// Updated to use the new '.relationship-container' class.
function deleteRelationship(btn) {
  const relationshipDiv = btn.closest(".relationship-container"); // Use specific class
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

// Function 1: checkforentities (MODIFIED)
// This function now returns 'false' if the pair is invalid, and 'true' otherwise.
function checkforentities(input) {
  const relationshipDiv = input.closest(".relationship-container"); // Use specific class
  const dropdowns = relationshipDiv.querySelectorAll('.entitySelect');

  if (dropdowns.length < 2) return true; // Not a pair, can't be invalid

  const val1 = dropdowns[0].value.trim().toLowerCase();
  const val2 = dropdowns[1].value.trim().toLowerCase();

  // skip empty selections - they aren't "invalid", just incomplete
  if (val1 === "" || val2 === "") {
    // Clear styles if one is empty
    dropdowns.forEach(dropdown => {
      dropdown.classList.remove("border-red-500", "ring-red-500", "border-green-500", "ring-green-500");
    });
    return true; // Allow change, it's not an invalid state
  }

  // normalize pair so (A,B) == (B,A)
  const pair = [val1, val2].sort().join("_");

  // collect all existing pairs from other relationship blocks
  const allPairs = [];
  document.querySelectorAll(".relationship-container").forEach(rel => { // Use specific class
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

  // Check if this pair already exists elsewhere OR is the same entity
  if (val1 === val2 || allPairs.includes(pair)) {
    dropdowns.forEach(dropdown => {
      dropdown.classList.remove("border-green-500", "ring-green-500");
      dropdown.classList.add("border-red-500", "ring-2", "ring-red-500");
    });
    return false; // <-- BUG FIX: Return false
  } else {
    dropdowns.forEach(dropdown => {
      dropdown.classList.remove("border-red-500", "ring-red-500");
      dropdown.classList.add("border-green-500", "ring-2", "ring-green-500");
    });
    return true; // <-- BUG FIX: Return true
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

    // --- MODIFIED BLOCK ---
    // Main line: strokeWidth is 4 for Total, 2 for Partial
    $(go.Shape,
      { stroke: "black" }, // Default color
      new go.Binding("strokeWidth", "isTotalParticipation", function (total) {
        return total ? 4 : 2; // 4px if total, 2px if partial
      })
    ),
    // --- END MODIFIED BLOCK ---

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
      }).ofObject()),

    // Cardinality label ON the line near the entity
    $(go.TextBlock,
      {
        segmentIndex: 0,
        segmentFraction: 0.15, // Position near the start (entity side)
        segmentOffset: new go.Point(0, 0), // Directly on the line
        font: "bold 16px sans-serif",
        stroke: "black",
        background: "white",
        margin: 2
      },
      new go.Binding("text", "cardinality"),
      new go.Binding("visible", "cardinality", function (card) {
        return card ? true : false;
      }))

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

// function applyEntityType(selectEl) {
//   const newType = selectEl.value; // "Strong" or "Weak"
//   const entityDiv = selectEl.closest('.entity-container');
//   const entityNamefeild = entityDiv.querySelector('.entityNameInput');
//   const entityName = entityNamefeild.value.trim();

//   const node = diagram.model.nodeDataArray.find(n => n.text === entityName);
//   if (node) {
//     diagram.model.startTransaction("changeEntityType");
//     diagram.model.setCategoryForNodeData(node, newType);
//     diagram.model.commitTransaction("changeEntityType");
//   }
// }

/**
 * Applies the selected entity type (Strong or Weak) to the GoJS diagram node.
 * * --- FIX APPLIED ---
 * This function now correctly maps the "Strong" option in the dropdown
 * to the "Rectangle" category in GoJS, which is your template for
 * a strong entity. The "Weak" option correctly maps to the "Weak" category.
 */
function applyEntityType(selectEl) {
  // Get the selected value ("Strong" or "Weak")
  const selectedValue = selectEl.value;

  // Find the parent entity card and get its name
  const entityDiv = selectEl.closest('.entity-container');
  const entityNamefeild = entityDiv.querySelector('.entityNameInput');
  const entityName = entityNamefeild.value.trim();

  // Determine the correct GoJS category name
  // 💡 THE FIX: "Strong" maps to "Rectangle", "Weak" maps to "Weak"
  const newCategory = (selectedValue === "Weak") ? "Weak" : "Rectangle";

  // Find the corresponding node in the diagram
  const node = diagram.model.nodeDataArray.find(n => n.text === entityName);

  // If the node exists, update its category
  if (node) {
    diagram.model.startTransaction("changeEntityType");
    diagram.model.setCategoryForNodeData(node, newCategory);
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


// ==================== PDF Export Functions (Silent Download) ====================

// Quick PDF Export
async function exportDiagramToPDF() {
  try {
    const { jsPDF } = window.jspdf;

    // Show loading indicator
    const originalText = event.target.innerHTML;
    event.target.innerHTML = '<i data-feather="loader" class="w-4 h-4 animate-spin"></i> Exporting...';
    feather.replace();

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: 'a4'
    });

    const imgData = await new Promise((resolve) => {
      diagram.makeImageData({
        background: 'white',
        returnType: 'string',
        callback: (img) => resolve(img)
      });
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Add title
    pdf.setFontSize(22);
    pdf.setTextColor(124, 58, 237);
    pdf.text('Entity Relationship Diagram', 20, 30);

    // Add metadata
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, 45);

    // Count entities and relationships
    const entities = diagram.model.nodeDataArray.filter(n =>
      ["Rectangle", "Strong", "Weak"].includes(n.category)
    );
    const relationships = diagram.model.nodeDataArray.filter(n =>
      n.category?.includes("Relationship")
    );

    pdf.text(`Entities: ${entities.length} | Relationships: ${relationships.length}`, 20, 55);

    // Add diagram image
    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pdfWidth - 40;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    if (imgHeight > pdfHeight - 90) {
      const scaledHeight = pdfHeight - 90;
      const scaledWidth = (imgProps.width * scaledHeight) / imgProps.height;
      pdf.addImage(imgData, 'PNG', (pdfWidth - scaledWidth) / 2, 70, scaledWidth, scaledHeight);
    } else {
      pdf.addImage(imgData, 'PNG', (pdfWidth - imgWidth) / 2, 70, imgWidth, imgHeight);
    }

    // Add footer
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text('ER Model Builder - Enterprise Edition', pdfWidth / 2, pdfHeight - 10, { align: 'center' });

    // Save PDF silently
    const timestamp = new Date().toISOString().slice(0, 10);
    pdf.save(`ER_Diagram_${timestamp}.pdf`);

    // Restore button
    event.target.innerHTML = originalText;
    feather.replace();

  } catch (error) {
    console.error('Error exporting PDF:', error);
    // Silent error - just restore button
    event.target.innerHTML = originalText;
    feather.replace();
  }
}

// ==================== Advanced Multi-page PDF Export with Full Details ====================
async function exportAdvancedPDF() {
  try {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const nodes = diagram.model.nodeDataArray;
    const links = diagram.model.linkDataArray;

    // ========== Page 1: Cover Page ==========
    pdf.setFillColor(124, 58, 237);
    pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(45);
    pdf.text('ER Diagram', pdfWidth / 2, pdfHeight / 2 - 80, { align: 'center' });

    pdf.setFontSize(20);
    pdf.text('Entity Relationship Model', pdfWidth / 2, pdfHeight / 2 - 35, { align: 'center' });

    pdf.setFontSize(14);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, pdfWidth / 2, pdfHeight / 2 + 10, { align: 'center' });

    // Statistics
    const entities = nodes.filter(n => ["Rectangle", "Strong", "Weak"].includes(n.category));
    const relationships = nodes.filter(n => n.category?.includes("Relationship"));
    const attributes = nodes.filter(n => ["Ellipse", "Primary Key", "Multi Valued", "Derived"].includes(n.category));

    pdf.setFontSize(16);
    pdf.text(`${entities.length} Entities | ${relationships.length} Relationships | ${attributes.length} Attributes`,
      pdfWidth / 2, pdfHeight / 2 + 50, { align: 'center' });

    // ========== Page 2: ER Diagram ==========
    pdf.addPage();

    const imgData = await new Promise((resolve) => {
      diagram.makeImageData({
        background: 'white',
        returnType: 'string',
        callback: (img) => resolve(img)
      });
    });

    pdf.setFontSize(22);
    pdf.setTextColor(124, 58, 237);
    pdf.text('Entity Relationship Diagram', pdfWidth / 2, 30, { align: 'center' });

    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pdfWidth - 40;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    if (imgHeight > pdfHeight - 80) {
      const scaledHeight = pdfHeight - 80;
      const scaledWidth = (imgProps.width * scaledHeight) / imgProps.height;
      pdf.addImage(imgData, 'PNG', (pdfWidth - scaledWidth) / 2, 60, scaledWidth, scaledHeight);
    } else {
      pdf.addImage(imgData, 'PNG', (pdfWidth - imgWidth) / 2, 60, imgWidth, imgHeight);
    }

    // Add footer
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text('ER Model Builder - Enterprise Edition', pdfWidth / 2, pdfHeight - 10, { align: 'center' });

    // ========== Page 3: Summary Statistics ==========
    pdf.addPage();
    pdf.setFontSize(24);
    pdf.setTextColor(124, 58, 237);
    pdf.text('Diagram Summary', 20, 35);

    let yPos = 70;
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);

    // Count different types
    const strongEntities = nodes.filter(n => n.category === "Strong" || n.category === "Rectangle").length;
    const weakEntities = nodes.filter(n => n.category === "Weak").length;
    const primaryKeys = nodes.filter(n => n.category === "Primary Key").length;
    const multiValued = nodes.filter(n => n.category === "Multi Valued").length;
    const derived = nodes.filter(n => n.category === "Derived").length;
    // MODIFIED: Removed 'composite' count

    // Draw statistics table
    const stats = [
      { label: 'Total Entities', value: entities.length, color: [124, 58, 237] },
      { label: '  • Strong Entities', value: strongEntities, color: [100, 100, 100] },
      { label: '  • Weak Entities', value: weakEntities, color: [100, 100, 100] },
      { label: 'Total Relationships', value: relationships.length, color: [124, 58, 237] },
      { label: 'Total Attributes', value: attributes.length, color: [124, 58, 237] },
      { label: '  • Primary Keys', value: primaryKeys, color: [100, 100, 100] },
      { label: '  • Multi-valued', value: multiValued, color: [100, 100, 100] },
      { label: '  • Derived', value: derived, color: [100, 100, 100] },
      // MODIFIED: Removed 'Composite' line
      { label: 'Total Connections', value: links.length, color: [124, 58, 237] }
    ];

    stats.forEach(stat => {
      pdf.setTextColor(...stat.color);
      pdf.setFontSize(stat.label.startsWith('  •') ? 11 : 13);
      const isBold = !stat.label.startsWith('  •');
      pdf.setFont(undefined, isBold ? 'bold' : 'normal');

      pdf.text(stat.label, 40, yPos);
      pdf.text(String(stat.value), pdfWidth - 80, yPos, { align: 'right' });

      yPos += 22;

      if (yPos > pdfHeight - 50) {
        pdf.addPage();
        yPos = 50;
      }
    });

    // ========== Page 4+: Detailed Entity Information ==========
    pdf.addPage();
    pdf.setFontSize(24);
    pdf.setTextColor(124, 58, 237);
    pdf.text('Entity Details', 20, 35);

    yPos = 70;

    entities.forEach((entity, idx) => {
      if (yPos > pdfHeight - 150) {
        pdf.addPage();
        yPos = 50;
      }

      // Entity name with box
      pdf.setFillColor(240, 240, 255);
      pdf.rect(20, yPos - 15, pdfWidth - 40, 25, 'F');

      pdf.setFontSize(16);
      pdf.setTextColor(124, 58, 237);
      pdf.setFont(undefined, 'bold');
      pdf.text(`${idx + 1}. ${entity.text}`, 30, yPos);

      yPos += 30;

      // Entity type
      pdf.setFontSize(11);
      pdf.setTextColor(80, 80, 80);
      pdf.setFont(undefined, 'normal');
      pdf.text(`Type: ${entity.category === "Rectangle" ? "Strong Entity" : entity.category + " Entity"}`, 40, yPos);
      yPos += 20;

      // Get attributes for this entity
      const entityAttributes = links
        .filter(l => l.from === entity.key || l.to === entity.key)
        .map(l => {
          const attrKey = l.from === entity.key ? l.to : l.from;
          return nodes.find(n => n.key === attrKey);
        })
        .filter(n => n && ["Ellipse", "Primary Key", "Multi Valued", "Derived"].includes(n.category));

      if (entityAttributes.length > 0) {
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        pdf.setFont(undefined, 'bold');
        pdf.text('Attributes:', 40, yPos);
        yPos += 18;

        entityAttributes.forEach(attr => {
          // MODIFIED: Removed 'subAttributes' constant

          pdf.setFontSize(11);
          pdf.setTextColor(60, 60, 60);
          pdf.setFont(undefined, 'normal');

          // MODIFIED: Removed check for subAttributes.length
          let attrType = '';
          if (attr.category === "Primary Key") attrType = ' [PK]';
          else if (attr.category === "Multi Valued") attrType = ' [Multi-valued]';
          else if (attr.category === "Derived") attrType = ' [Derived]';

          pdf.text(`  • ${attr.text}${attrType}`, 50, yPos);
          yPos += 16;

          // MODIFIED: Removed 'if (subAttributes.length > 0)' block

        });
      } else {
        pdf.setFontSize(11);
        pdf.setTextColor(150, 150, 150);
        pdf.setFont(undefined, 'italic');
        pdf.text('No attributes defined', 40, yPos);
        yPos += 18;
      }

      // Get relationships for this entity
      const entityRelationships = links
        .filter(l => l.from === entity.key || l.to === entity.key)
        .map(l => {
          const relKey = l.from === entity.key ? l.to : l.from;
          const relNode = nodes.find(n => n.key === relKey && n.category?.includes("Relationship"));
          if (!relNode) return null;

          const otherLink = links.find(link =>
            (link.from === relKey || link.to === relKey) &&
            link.from !== entity.key && link.to !== entity.key
          );

          const otherEntityKey = otherLink ? (otherLink.from === relKey ? otherLink.to : otherLink.from) : null;
          const otherEntity = nodes.find(n => n.key === otherEntityKey);

          return {
            name: relNode.text,
            type: relNode.category,
            otherEntity: otherEntity?.text || 'Unknown',
            cardinality: l.cardinality || 'N/A',
            participation: l.isTotalParticipation ? 'Total' : 'Partial'
          };
        })
        .filter(Boolean);

      if (entityRelationships.length > 0) {
        yPos += 5;
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        pdf.setFont(undefined, 'bold');
        pdf.text('Relationships:', 40, yPos);
        yPos += 18;

        entityRelationships.forEach(rel => {
          pdf.setFontSize(11);
          pdf.setTextColor(60, 60, 60);
          pdf.setFont(undefined, 'normal');

          const relType = rel.type === "WeakRelationship" ? "Identifying" : "Regular";
          pdf.text(`  • ${rel.name} (${relType})`, 50, yPos);
          yPos += 15;

          pdf.setFontSize(10);
          pdf.setTextColor(100, 100, 100);
          pdf.text(`    Connected to: ${rel.otherEntity}`, 60, yPos);
          yPos += 13;
          pdf.text(`    Cardinality: ${rel.cardinality} | Participation: ${rel.participation}`, 60, yPos);
          yPos += 16;
        });
      }

      yPos += 15;
    });

    // ========== Page: Relationship Details ==========
    if (relationships.length > 0) {
      pdf.addPage();
      pdf.setFontSize(24);
      pdf.setTextColor(124, 58, 237);
      pdf.text('Relationship Details', 20, 35);

      yPos = 70;

      relationships.forEach((rel, idx) => {
        if (yPos > pdfHeight - 120) {
          pdf.addPage();
          yPos = 50;
        }

        // Relationship name with box
        pdf.setFillColor(255, 250, 240);
        pdf.rect(20, yPos - 15, pdfWidth - 40, 25, 'F');

        pdf.setFontSize(16);
        pdf.setTextColor(124, 58, 237);
        pdf.setFont(undefined, 'bold');
        pdf.text(`${idx + 1}. ${rel.text}`, 30, yPos);

        yPos += 30;

        // Relationship type
        pdf.setFontSize(11);
        pdf.setTextColor(80, 80, 80);
        pdf.setFont(undefined, 'normal');
        const relType = rel.category === "WeakRelationship" ? "Identifying Relationship" : "Regular Relationship";
        pdf.text(`Type: ${relType}`, 40, yPos);
        yPos += 20;

        // Find connected entities
        const connectedLinks = links.filter(l => l.from === rel.key || l.to === rel.key);
        const connectedEntities = connectedLinks.map(l => {
          const entityKey = l.from === rel.key ? l.to : l.from;
          const entityNode = nodes.find(n => n.key === entityKey &&
            ["Rectangle", "Strong", "Weak"].includes(n.category));
          return entityNode ? {
            name: entityNode.text,
            cardinality: l.cardinality || 'N/A',
            participation: l.isTotalParticipation ? 'Total' : 'Partial'
          } : null;
        }).filter(Boolean);

        if (connectedEntities.length > 0) {
          pdf.setFontSize(12);
          pdf.setTextColor(0, 0, 0);
          pdf.setFont(undefined, 'bold');
          pdf.text('Connected Entities:', 40, yPos);
          yPos += 18;

          connectedEntities.forEach(ent => {
            pdf.setFontSize(11);
            pdf.setTextColor(60, 60, 60);
            pdf.setFont(undefined, 'normal');
            pdf.text(`  • ${ent.name}`, 50, yPos);
            yPos += 15;
            pdf.setFontSize(10);
            pdf.setTextColor(100, 100, 100);
            pdf.text(`    Cardinality: ${ent.cardinality} | Participation: ${ent.participation}`, 60, yPos);
            yPos += 18;
          });
        }

        // Relationship attributes
        const relAttributes = links
          .filter(l => l.from === rel.key)
          .map(l => nodes.find(n => n.key === l.to &&
            ["Ellipse", "Primary Key", "Multi Valued", "Derived"].includes(n.category)))
          .filter(Boolean);

        if (relAttributes.length > 0) {
          pdf.setFontSize(12);
          pdf.setTextColor(0, 0, 0);
          pdf.setFont(undefined, 'bold');
          pdf.text('Attributes:', 40, yPos);
          yPos += 18;

          relAttributes.forEach(attr => {
            pdf.setFontSize(11);
            pdf.setTextColor(60, 60, 60);
            pdf.setFont(undefined, 'normal');
            pdf.text(`  • ${attr.text}`, 50, yPos);
            yPos += 16;
          });
        }

        yPos += 15;
      });
    }

    // Save PDF silently
    const timestamp = new Date().toISOString().slice(0, 10);
    pdf.save(`ER_Diagram_Complete_${timestamp}.pdf`);

  } catch (error) {
    console.error('Error exporting advanced PDF:', error);
  }
}

// Full Page Screenshot Export
async function exportPageToPDF() {
  try {
    const { jsPDF } = window.jspdf;
    const diagramDiv = document.getElementById('myDiagramDiv');

    const canvas = await html2canvas(diagramDiv, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);

    const timestamp = new Date().toISOString().slice(0, 10);
    pdf.save(`ER_Diagram_Full_${timestamp}.pdf`);

  } catch (error) {
    console.error('Error:', error);
  }
}


// --- ER TO RELATIONAL & SQL CONVERSION LOGIC ---

/**
 * HELPER FUNCTION
 * Provides simple data type inference based on attribute names.
 */
function inferDataType(attrName) {
  const name = attrName.toLowerCase();

  if (name.endsWith('_id') || name === 'id' || name.startsWith('num_') || name.endsWith('count')) {
    return 'INT';
  }
  if (name.includes('date') || name.endsWith('_at')) {
    return 'DATETIME';
  }
  if (name.startsWith('is_') || name.startsWith('has_')) {
    return 'BOOLEAN'; // Or TINYINT(1) for MySQL
  }
  if (name.includes('price') || name.includes('amount') || name.includes('salary')) {
    return 'DECIMAL(10, 2)';
  }
  if (name.includes('text') || name.includes('description') || name.includes('comment')) {
    return 'TEXT';
  }
  return 'VARCHAR(255)';
}

/**
 * HELPER FUNCTION
 * Finds all attributes for a given entity or relationship node.
 */
function getAttributes(nodeKey, allNodes, allLinks) {
  const attrs = [];
  allLinks.forEach(link => {
    let attrKey = null;
    if (link.from === nodeKey) attrKey = link.to;
    if (link.to === nodeKey) attrKey = link.from;

    if (attrKey) {
      const attrNode = allNodes.find(n => n.key === attrKey);

      // Stop if the linked node is not an attribute
      if (!attrNode || !["Ellipse", "Primary Key", "Multi Valued", "Derived"].includes(attrNode.category)) {
        return;
      }

      // Ignore derived attributes
      if (attrNode.category === "Derived") return;

      // Check for composite attributes
      const subLinks = allLinks.filter(l => l.from === attrNode.key && l.to !== nodeKey);

      if (subLinks.length > 0 && attrNode.category === "Ellipse") {
        // It's composite: expand its children
        subLinks.forEach(subLink => {
          const subAttrNode = allNodes.find(n => n.key === subLink.to);
          if (subAttrNode && subAttrNode.category === "Ellipse") { // Only allow simple sub-attributes
            const attrName = `${attrNode.text}_${subAttrNode.text}`;
            attrs.push({
              name: attrName,
              type: inferDataType(attrName),
              category: "Ellipse",
              isPartialKey: false
            });
          }
        });
      } else {
        // It's a simple, PK, or multi-valued attribute
        attrs.push({
          name: attrNode.text,
          type: inferDataType(attrNode.text),
          category: attrNode.category,
          // Check if it's a partial key of a weak entity
          isPartialKey: attrNode.category === "Primary Key"
        });
      }
    }
  });
  return attrs;
}

/**
 * REBUILT ROBUST FUNCTION
 * This function builds the complete relational schema as a JavaScript object.
 * It now correctly handles 1:1, 1:N, M:N, and Weak Entity relationships.
 *
 * --- FIX APPLIED ---
 * The logic for adding a default Primary Key (Step 1) now checks
 * if a column with that name (case-insensitive) already exists.
 * If it does, it promotes the existing column to PK.
 */
function buildRelationalSchema() {
  const nodes = diagram.model.nodeDataArray;
  const links = diagram.model.linkDataArray;
  const tables = {};
  const processedRelationships = new Set();

  // --- Step 1: Process all Entities (Strong and Weak) ---
  // Create initial table structures and identify primary/partial keys.
  nodes.forEach(node => {
    if (["Rectangle", "Strong", "Weak"].includes(node.category)) {
      const attributes = getAttributes(node.key, nodes, links);
      let primaryKey = null;
      let partialKey = null;
      const columns = [];

      attributes.forEach(attr => {
        // Multi-valued attributes are handled in Step 3
        if (attr.category === "Multi Valued") return;

        columns.push({
          name: attr.name,
          type: attr.type,
          isNotNull: attr.isPartialKey, // Partial keys must be NOT NULL
          isUnique: false
        });

        if (attr.isPartialKey) {
          partialKey = attr.name;
        }
      });

      if (node.category === "Weak") {
        // Weak entities use their partial key for now.
        // It will be combined with the owner's PK in Step 2.
        primaryKey = partialKey;
      } else {
        // Strong entities: find explicit PK or create a default one
        primaryKey = columns.find(c => c.name === partialKey)?.name;

        // --- MODIFIED BLOCK ---
        if (!primaryKey) {
          const defaultPkName = node.text.toLowerCase() + "_id";

          // Check if a column with this name (or case-variant) already exists
          const existingCol = columns.find(c => c.name.toLowerCase() === defaultPkName);

          if (existingCol) {
            // A column like "Course_id" or "course_id" already exists.
            // Promote it to be the Primary Key.
            existingCol.isNotNull = true;
            existingCol.isUnique = true; // PKs must be unique
            primaryKey = existingCol.name;
          } else {
            // No existing column, so create the default one
            columns.unshift({
              name: defaultPkName,
              type: "INT",
              isNotNull: true,
              isUnique: true
            });
            primaryKey = defaultPkName;
          }
        }
        // --- END MODIFIED BLOCK ---
      }

      // Set explicit NOT NULL for the final PK
      const pkCol = columns.find(c => c.name === primaryKey);
      if (pkCol) pkCol.isNotNull = true;

      tables[node.text] = {
        tableName: node.text,
        columns: columns,
        primaryKey: primaryKey,
        foreignKeys: []
      };
    }
  });

  // --- Step 2: Process all Relationships ---
  // This loop now handles weak, M:N, 1:N, and 1:1 relationships.
  nodes.forEach(relNode => {
    if (!relNode.category?.includes("Relationship") || processedRelationships.has(relNode.key)) {
      return;
    }

    const relLinks = links.filter(l => l.from === relNode.key || l.to === relNode.key);
    const connectedEntities = relLinks.map(l => {
      const entityKey = (l.from === relNode.key) ? l.to : l.from;
      const entityNode = nodes.find(n => n.key === entityKey);
      // Return both node and its link properties (cardinality, participation)
      return { node: entityNode, link: l };
    }).filter(e => e.node && ["Rectangle", "Strong", "Weak"].includes(e.node.category));

    if (connectedEntities.length < 2) return; // Skip incomplete relationships

    const [e1, e2] = connectedEntities;
    const card1 = e1.link.cardinality;
    const card2 = e2.link.cardinality;

    const table1 = tables[e1.node.text];
    const table2 = tables[e2.node.text];

    const relAttributes = getAttributes(relNode.key, nodes, links)
      .filter(attr => attr.category !== "Multi Valued"); // No MVs on relationships

    // Rule 1: Weak Relationship (Identifying)
    if (relNode.category === "WeakRelationship") {
      // Identify owner (Strong) and weak entity
      const owner = (e1.node.category === "Weak") ? e2 : e1;
      const weak = (e1.node.category === "Weak") ? e1 : e2;
      const ownerTable = tables[owner.node.text];
      const weakTable = tables[weak.node.text];

      const ownerPk = ownerTable.primaryKey;
      const weakPartialPk = weakTable.primaryKey; // This is just the partial key

      const ownerPkCol = ownerTable.columns.find(c => c.name === ownerPk);
      const fkColName = `${owner.node.text}_${ownerPk}`;

      // Add owner's PK as a column to the weak table
      weakTable.columns.push({
        name: fkColName,
        type: ownerPkCol.type,
        isNotNull: true, // FK part of a PK is always NOT NULL
        isUnique: false
      });

      // Create the composite PK: (owner_pk, partial_pk)
      weakTable.primaryKey = [fkColName, weakPartialPk];

      // Add the FK constraint
      weakTable.foreignKeys.push({
        column: fkColName,
        referencesTable: ownerTable.tableName,
        referencesColumn: ownerPk
        // Consider adding ON DELETE CASCADE
      });

    }
    // Rule 2: M:N Relationship
    else if ((card1 === 'N' || card1 === 'M') && (card2 === 'N' || card2 === 'M')) {
      const pk1 = table1.primaryKey;
      const pk2 = table2.primaryKey;
      const pk1Col = table1.columns.find(c => c.name === pk1);
      const pk2Col = table2.columns.find(c => c.name === pk2);

      const fkColName1 = `${table1.tableName}_${pk1}`;
      const fkColName2 = `${table2.tableName}_${pk2}`;

      const newTable = {
        tableName: relNode.text,
        columns: [
          { name: fkColName1, type: pk1Col.type, isNotNull: true, isUnique: false },
          { name: fkColName2, type: pk2Col.type, isNotNull: true, isUnique: false },
          ...relAttributes // Add attributes from the relationship
        ],
        primaryKey: [fkColName1, fkColName2], // Composite PK
        foreignKeys: [
          { column: fkColName1, referencesTable: table1.tableName, referencesColumn: pk1 },
          { column: fkColName2, referencesTable: table2.tableName, referencesColumn: pk2 }
        ]
      };
      tables[newTable.tableName] = newTable;

    }
    // Rule 3: 1:N or 1:1 Relationship
    else {
      let oneSide, manySide;

      if ((card1 === 'N' || card1 === 'M') && card2 === '1') {
        oneSide = e2;
        manySide = e1;
      } else {
        // Default to e1 as 'one' side (covers 1-N and 1-1)
        oneSide = e1;
        manySide = e2;
      }

      const oneTable = tables[oneSide.node.text];
      const manyTable = tables[manySide.node.text];
      const onePk = oneTable.primaryKey;
      const onePkCol = oneTable.columns.find(c => c.name === onePk);

      const fkColName = `${oneTable.tableName}_${onePk}`;

      // Add 'one' side's PK as a foreign key column in the 'many' side's table
      manyTable.columns.push({
        name: fkColName,
        type: onePkCol.type,
        // Total participation on the 'many' side means the FK cannot be null
        isNotNull: manySide.link.isTotalParticipation,
        // If it's a 1:1 relationship, the FK must also be unique
        isUnique: (card1 === '1' && card2 === '1')
      });

      // Add the FK constraint
      manyTable.foreignKeys.push({
        column: fkColName,
        referencesTable: oneTable.tableName,
        referencesColumn: onePk
      });

      // Add relationship attributes to the 'many' side table
      manyTable.columns.push(...relAttributes);
    }

    processedRelationships.add(relNode.key);
  });

  // --- Step 3: Process Multi-valued Attributes ---
  nodes.forEach(node => {
    if (node.category === "Multi Valued") {
      // Find its parent entity
      const parentLink = links.find(l => l.to === node.key);
      if (!parentLink) return;

      const parentNode = nodes.find(n => n.key === parentLink.from);
      if (!parentNode || !tables[parentNode.text]) return; // Not attached to a valid table

      const parentTable = tables[parentNode.text];
      const parentPk = parentTable.primaryKey;
      const parentPkCol = parentTable.columns.find(c => c.name === parentPk);

      const mvTableName = `${parentTable.tableName}_${node.text}`;
      const parentFkColName = `${parentTable.tableName}_${parentPk}`;

      const mvTable = {
        tableName: mvTableName,
        columns: [
          { name: parentFkColName, type: parentPkCol.type, isNotNull: true, isUnique: false },
          { name: node.text, type: inferDataType(node.text), isNotNull: true, isUnique: false }
        ],
        primaryKey: [parentFkColName, node.text], // Composite PK
        foreignKeys: [{
          column: parentFkColName,
          referencesTable: parentTable.tableName,
          referencesColumn: parentPk
          // Consider adding ON DELETE CASCADE
        }]
      };

      tables[mvTableName] = mvTable;
    }
  });

  return tables;
}

/**
 * UPDATED SQL Generation Function
 * Converts the schema object into a SQL string.
 *
 * --- MODIFIED ---
 * Now calls the new `generateDummyData` helper for
 * context-aware sample INSERT statements.
 */
function generateSQL() {
  const tables = buildRelationalSchema();
  let sqlOutput = "/* --- Generated SQL from ER Model Builder --- */\n\n";

  for (const tableName in tables) {
    const table = tables[tableName];
    let columnDefinitions = [];

    sqlOutput += `CREATE TABLE \`${tableName}\` (\n`;

    // Add Columns
    table.columns.forEach(column => {
      let colString = `  \`${column.name}\` ${column.type}`;

      // Handle single-column Primary Key
      if (typeof table.primaryKey === 'string' && column.name === table.primaryKey) {
        colString += " PRIMARY KEY";
      }

      // Add NOT NULL constraint (from PK or total participation)
      if (column.isNotNull) {
        colString += " NOT NULL";
      }

      // Add UNIQUE constraint (for 1:1 relationships)
      if (column.isUnique) {
        colString += " UNIQUE";
      }

      columnDefinitions.push(colString);
    });

    // Handle composite Primary Key
    if (Array.isArray(table.primaryKey)) {
      const pkCols = table.primaryKey.map(pk => `\`${pk}\``).join(", ");
      columnDefinitions.push(`  PRIMARY KEY (${pkCols})`);
    }

    // Add Foreign Keys
    if (table.foreignKeys && table.foreignKeys.length > 0) {
      table.foreignKeys.forEach(fk => {
        let fkString = `  FOREIGN KEY (\`${fk.column}\`) REFERENCES \`${fk.referencesTable}\`(\`${fk.referencesColumn}\`)`;
        // Optional: Add ON DELETE / ON UPDATE actions
        // fkString += " ON DELETE CASCADE"; // e.g., for weak entities
        columnDefinitions.push(fkString);
      });
    }

    // Join all definitions
    sqlOutput += columnDefinitions.join(",\n");
    sqlOutput += `\n);\n\n`;

    // --- MODIFIED BLOCK ---

    // Generate dummy INSERT statements as a template
    const columnNames = table.columns.map(col => `\`${col.name}\``).join(", ");

    sqlOutput += `-- Example INSERTs for \`${tableName}\`:\n`;

    // Generate 3 sample statements
    for (let i = 1; i <= 3; i++) {
      // NEW: Call the smart data generator for each column
      const placeholders = table.columns.map(col => {
        return generateDummyData(col.name, col.type, i);
      }).join(", ");

      // Add the commented-out INSERT statement
      sqlOutput += `-- INSERT INTO \`${tableName}\` (${columnNames}) VALUES (${placeholders});\n`;
    }
    sqlOutput += `\n\n`; // Add the final spacing

    // --- END OF MODIFIED BLOCK ---
  }

  return sqlOutput;
}

/**
 * NEW HELPER FUNCTION
 * Generates context-aware dummy data based on column name and type.
 */
function generateDummyData(columnName, dataType, index) {
  const name = columnName.toLowerCase();
  const i = index - 1; // 0-based index for arrays

  // Sample data arrays (expand these as you like)
  const firsts = ['John', 'Jane', 'Peter'];
  const lasts = ['Doe', 'Smith', 'Jones'];
  const cities = ['New York', 'London', 'Tokyo'];
  const jobs = ['Developer', 'Manager', 'Analyst'];

  // --- Name-based Logic ---
  if (name.includes('name')) {
    if (name.includes('first')) return `'${firsts[i % firsts.length]}'`;
    if (name.includes('last')) return `'${lasts[i % lasts.length]}'`;
    return `'${firsts[i % firsts.length]} ${lasts[i % lasts.length]}'`;
  }
  if (name.includes('email')) {
    return `'${firsts[i % firsts.length].toLowerCase()}.${lasts[i % lasts.length].toLowerCase()}@example.com'`;
  }
  if (name.includes('age')) {
    return 25 + (i * 5); // e.g., 25, 30, 35
  }
  if (name.includes('salary')) {
    return (50000 + (i * 15000)).toFixed(2); // e.g., 50000.00, 65000.00, 80000.00
  }
  if (name.includes('city')) {
    return `'${cities[i % cities.length]}'`;
  }
  if (name.includes('address') && !name.includes('email')) {
    return `'${100 + i} Main St'`; // e.g., 101 Main St, 102 Main St
  }
  if (name.includes('job') || name.includes('title')) {
    return `'${jobs[i % jobs.length]}'`;
  }
  if (name.startsWith('is_') || name.startsWith('has_')) {
    return (i % 2 === 0) ? 'true' : 'false'; // Alternates true, false, true
  }
  if (name.includes('date') || name.endsWith('_at')) {
    return `'2025-01-0${index}'`; // e.g., '2025-01-01'
  }
  if (name.endsWith('_id') || name.endsWith('id')) {
    return index; // 1, 2, 3
  }

  // --- Type-based Fallback ---
  if (dataType.includes('INT')) return index;
  if (dataType.includes('DECIMAL')) return (10.50 * index).toFixed(2);
  if (dataType.includes('BOOLEAN')) return (i % 2 === 0) ? 'true' : 'false';
  if (dataType.includes('DATE') || dataType.includes('TIME')) return `'2025-01-0${index}'`;

  // Default fallback
  return `'value_${index}'`;
}

// --- SQL MODAL UI FUNCTIONS ---

/**
 * NEW UI FUNCTION
 * This is the function your button should call.
 * It handles the loading and display of the SQL modal.
 */
function handleGenerateSQL() {
  showLoadingModal("Generating SQL...");

  // Use a timeout to allow the loading modal to render
  setTimeout(() => {
    try {
      const sqlCode = generateSQL(); // Calls the function you already have
      hideLoadingModal();
      showSQLModal(sqlCode);
    } catch (error) {
      hideLoadingModal();
      console.error("Error generating SQL:", error);
      alert("An error occurred while generating the SQL code. Check the console for details.");
    }
  }, 300); // 300ms delay
}

/**
 * NEW UI FUNCTION
 * This creates and shows the modal for displaying the SQL code.
 */
function showSQLModal(sqlCode) {
  // Simple syntax highlighting (keywords)
  const keywords = ['CREATE', 'TABLE', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'INT', 'VARCHAR', 'NOT', 'NULL', 'DECIMAL', 'DATETIME', 'BOOLEAN', 'TEXT', 'UNIQUE'];
  let highlightedCode = sqlCode.replace(
    new RegExp(`\\b(${keywords.join('|')})\\b`, 'g'),
    '<span class="text-blue-500 font-bold">$1</span>'
  );
  highlightedCode = highlightedCode.replace(/(`[^`]+`)/g, '<span class="text-purple-500">$1</span>'); // Table/col names
  highlightedCode = highlightedCode.replace(/(\/\*.*\*\/)/g, '<span class="text-gray-400">$1</span>'); // Comments

  const modal = document.createElement('div');
  modal.id = 'sqlModal';
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4';
  modal.style.animation = 'fadeIn 0.2s ease-out';

  modal.innerHTML = `
    <div class="absolute inset-0 bg-black bg-opacity-60" onclick="closeSQLModal()"></div>
    <div class="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 flex flex-col" style="animation: slideIn 0.3s ease-out; max-height: 80vh;">
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <div class="flex items-center gap-3">
          <i data-feather="database" class="w-6 h-6 text-blue-600"></i>
          <h3 class="text-xl font-bold text-gray-800">Generated SQL Code</h3>
        </div>
        <button onclick="closeSQLModal()" class="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600">
          <i data-feather="x" class="w-5 h-5"></i>
        </button>
      </div>
      
      <div class="p-4 flex-1 overflow-y-auto">
        <pre class="bg-slate-900 text-white p-4 rounded-lg custom-scrollbar overflow-x-auto" style="font-family: 'Courier New', Courier, monospace; font-size: 14px; line-height: 1.6;"><code>${highlightedCode}</code></pre>
      </div>
      
      <div class="flex gap-3 p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
        <button onclick="copySqlToClipboard()" 
          class="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
          <i data-feather="copy" class="w-4 h-4"></i>
          Copy to Clipboard
        </button>
        <button onclick="closeSQLModal()" 
          class="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all">
          Close
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  feather.replace();
}

/**
 * NEW UI HELPER
 * Closes the SQL modal.
 */
function closeSQLModal() {
  const modal = document.getElementById('sqlModal');
  if (modal) {
    modal.style.animation = 'fadeOut 0.2s ease-out';
    setTimeout(() => modal.remove(), 200);
  }
}

/**
 * NEW UI HELPER
 * Copies the SQL code to the clipboard.
 */
function copySqlToClipboard() {
  const sqlCode = generateSQL(); // Regenerate plain text
  navigator.clipboard.writeText(sqlCode).then(() => {
    alert('SQL code copied to clipboard!');
  }, (err) => {
    alert('Failed to copy text.');
    console.error('Clipboard copy failed:', err);
  });
}
/* ========================================== */
/* CONFIG & INITIALIZATION          */
/* ========================================== */
const HISTORY_KEY = 'er_builder_history';
const CURRENT_ID_KEY = 'er_builder_active_id';
let currentSessionId = null;
let autoSaveTimer = null;
let isRenaming = false;

document.addEventListener('DOMContentLoaded', () => {
  checkDeviceAndShowWarning();
  renderHistoryList();

  const lastId = localStorage.getItem(CURRENT_ID_KEY);
  if (lastId) {
    loadSession(lastId, false);
  } else {
    startNewSession(false);
  }

  if (typeof diagram !== 'undefined') {
    diagram.addModelChangedListener((e) => {
      if (e.isTransactionFinished) debounceSave();
    });
  }
  document.body.addEventListener('input', (e) => {
    if (e.target.matches('input, select') && !e.target.id.startsWith('input-')) {
      debounceSave();
    }
  });

  if (typeof feather !== 'undefined') feather.replace();
});

/* ========================================== */
/* HISTORY & SIDEBAR LOGIC          */
/* ========================================== */
function toggleHistorySidebar() {
  const sb = document.getElementById('historySidebar');
  const overlay = document.getElementById('historyOverlay');
  if (!sb.classList.contains('-translate-x-full')) {
    sb.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
    overlay.classList.add('opacity-0');
  } else {
    sb.classList.remove('-translate-x-full');
    overlay.classList.remove('hidden');
    setTimeout(() => overlay.classList.remove('opacity-0'), 10);
    renderHistoryList();
  }
}

function debounceSave() {
  if (isRenaming) return;
  clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(saveCurrentState, 1000);
}

function saveCurrentState() {
  if (!currentSessionId || isRenaming) return;

  const diagramData = diagram.model.toJson();
  const entities = [];
  document.querySelectorAll("#entitiesContainer .entity-block").forEach(block => {
    const name = block.querySelector(".entityNameInput")?.value || "Unnamed";
    entities.push({ name });
  });
  const relationships = [];
  document.querySelectorAll("#relationshipsContainer .relationship-container").forEach(block => {
    const rName = block.querySelector(".relationshipNameInput")?.value || "Unnamed";
    relationships.push({ name: rName });
  });

  let history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  const index = history.findIndex(h => h.id === currentSessionId);

  let sessionName = "Untitled Diagram";
  let isCustom = false;

  if (index > -1) {
    if (history[index].customName === true) {
      sessionName = history[index].name;
      isCustom = true;
    } else if (entities.length > 0) {
      sessionName = `${entities[0].name} Model`;
    }
  } else if (entities.length > 0) {
    sessionName = `${entities[0].name} Model`;
  }

  const sessionData = {
    id: currentSessionId,
    name: sessionName,
    customName: isCustom,
    timestamp: Date.now(),
    data: { diagramData, entities, relationships }
  };

  if (index > -1) {
    history[index] = sessionData;
  } else {
    history.unshift(sessionData);
  }

  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));

  const sb = document.getElementById('historySidebar');
  if (!sb.classList.contains('-translate-x-full')) renderHistoryList();
}

function loadSession(id, closeSidebar = true) {
  const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  const session = history.find(h => h.id === id);
  if (!session) return;

  currentSessionId = session.id;
  localStorage.setItem(CURRENT_ID_KEY, currentSessionId);

  if (diagram) diagram.model = go.Model.fromJson(session.data.diagramData);
  rebuildUIFromDiagram(diagram.model);

  if (closeSidebar) toggleHistorySidebar();
  renderHistoryList();
}

function startNewSession(refreshUI = true) {
  currentSessionId = 'sess_' + Date.now() + Math.random().toString(36).substr(2, 5);
  localStorage.setItem(CURRENT_ID_KEY, currentSessionId);

  if (refreshUI) {
    if (diagram) diagram.model.clear();
    document.getElementById("entitiesContainer").innerHTML = '';
    document.getElementById("relationshipsContainer").innerHTML = '';
    const numInput = document.getElementById("numEntities");
    if (numInput) numInput.value = '';
    if (typeof totalEntities !== 'undefined') totalEntities = 0;
    toggleHistorySidebar();
  }
  saveCurrentState();
}

function deleteSession(e, id) {
  e.stopPropagation();
  // Confirmation removed - deletes immediately
  let history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  history = history.filter(h => h.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));

  if (currentSessionId === id) {
    startNewSession();
  } else {
    renderHistoryList();
  }
}

function clearAllHistory() {
  // Confirmation removed - deletes immediately
  localStorage.removeItem(HISTORY_KEY);
  startNewSession();
}

/* ========================================== */
/* RENAME & UI LOGIC                */
/* ========================================== */
function enableRenaming(e, id) {
  e.stopPropagation();
  isRenaming = true;
  const titleEl = document.getElementById(`title-${id}`);
  const inputEl = document.getElementById(`input-${id}`);
  if (titleEl && inputEl) {
    titleEl.classList.add('hidden');
    inputEl.classList.remove('hidden');
    inputEl.classList.add('block');
    inputEl.focus();
    inputEl.select();
  }
}

function handleRenameKey(e, id) {
  if (e.key === 'Enter') { e.preventDefault(); saveNewName(id); }
  if (e.key === 'Escape') { isRenaming = false; renderHistoryList(); }
}

function saveNewName(id) {
  const inputEl = document.getElementById(`input-${id}`);
  if (!inputEl) { isRenaming = false; return; }
  const newName = inputEl.value.trim();
  if (newName.length > 0) {
    let history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    const index = history.findIndex(h => h.id === id);
    if (index > -1) {
      history[index].name = newName;
      history[index].customName = true;
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }
  }
  isRenaming = false;
  renderHistoryList();
}

// 6. UI HELPERS (ENHANCED)
function getRelativeDateLabel(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  const dStr = date.toDateString();
  const nStr = now.toDateString();
  const yStr = yesterday.toDateString();

  if (dStr === nStr) return "Today";
  if (dStr === yStr) return "Yesterday";

  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays <= 7) return "Previous 7 Days";

  return "Older";
}

function renderHistoryList() {
  const container = document.getElementById('historyList');
  const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');

  if (history.length === 0) {
    container.innerHTML = `
            <div class="flex flex-col items-center justify-center h-64 text-center opacity-50">
                <div class="bg-slate-800 p-4 rounded-full mb-3">
                    <i data-feather="wind" class="w-6 h-6 text-slate-400"></i>
                </div>
                <p class="text-slate-400 text-sm font-medium">No history yet</p>
                <p class="text-slate-600 text-xs mt-1">Your saved diagrams will<br>appear here.</p>
            </div>
        `;
    if (typeof feather !== 'undefined') feather.replace();
    return;
  }

  container.innerHTML = '';
  history.sort((a, b) => b.timestamp - a.timestamp);

  let lastGroup = "";

  history.forEach(item => {
    const isActive = item.id === currentSessionId;
    const dateLabel = getRelativeDateLabel(item.timestamp);

    if (dateLabel !== lastGroup) {
      container.innerHTML += `<div class="history-group-label">${dateLabel}</div>`;
      lastGroup = dateLabel;
    }

    const html = `
          <div onclick="loadSession('${item.id}')" class="history-item group ${isActive ? 'active' : 'inactive'}">
              <i data-feather="message-square" class="w-4 h-4 flex-shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-600'}"></i>
              <div class="flex-1 min-w-0">
                  <h4 id="title-${item.id}" class="text-sm font-medium truncate" title="${item.name}">${item.name}</h4>
                  <input type="text" id="input-${item.id}" value="${item.name}" class="hidden history-rename-input" onclick="event.stopPropagation()" onkeydown="handleRenameKey(event, '${item.id}')" onblur="saveNewName('${item.id}')">
              </div>
              <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button onclick="enableRenaming(event, '${item.id}')" class="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors" title="Rename"><i data-feather="edit-2" class="w-3 h-3"></i></button>
                  <button onclick="deleteSession(event, '${item.id}')" class="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors" title="Delete"><i data-feather="trash" class="w-3 h-3"></i></button>
              </div>
          </div>
        `;
    container.innerHTML += html;
  });

  if (typeof feather !== 'undefined') feather.replace();
}

/* ========================================== */
/* OTHER UI HELPERS                 */
/* ========================================== */
function checkDeviceAndShowWarning() {
  if (window.innerWidth < 768) {
    const modal = document.getElementById('mobileWarningModal');
    if (modal) { modal.classList.remove('hidden'); modal.classList.add('flex'); }
    if (typeof feather !== 'undefined') feather.replace();
  }
}
function closeMobileWarning() {
  const modal = document.getElementById('mobileWarningModal');
  if (modal) {
    modal.style.transition = 'opacity 0.3s ease'; modal.style.opacity = '0';
    setTimeout(() => { modal.classList.add('hidden'); modal.classList.remove('flex'); modal.style.opacity = '1'; }, 300);
  }
}
function toggleMobileSidebar() {
  document.getElementById('sidebar').classList.toggle('mobile-open');
  document.getElementById('mobileOverlay').classList.toggle('active');
}
function closeMobileSidebar() {
  document.getElementById('sidebar').classList.remove('mobile-open');
  document.getElementById('mobileOverlay').classList.remove('active');
}
function toggleMobileActionsMenu() {
  const menu = document.getElementById('mobileActionsMenu');
  menu.style.transform = (menu.style.transform === 'translateY(0px)') ? 'translateY(100%)' : 'translateY(0)';
}
function toggleActionSidebar() {
  const sb = document.getElementById('actionSidebar');
  const toggle = document.getElementById('actionSidebarToggle');
  const icon = document.getElementById('action-sidebar-icon');
  const main = document.getElementById('mainContent');

  if (sb.classList.contains('translate-x-full')) {
    sb.classList.remove('translate-x-full'); toggle.style.right = '16rem'; main.style.paddingRight = '16rem'; icon.setAttribute('data-feather', 'chevron-right');
  } else {
    sb.classList.add('translate-x-full'); toggle.style.right = '0rem'; main.style.paddingRight = '0rem'; icon.setAttribute('data-feather', 'chevron-left');
  }
  feather.replace();
}

// Rebuild UI Helper
function rebuildUIFromDiagram(model) {
  const eContainer = document.getElementById("entitiesContainer");
  const rContainer = document.getElementById("relationshipsContainer");
  eContainer.innerHTML = ''; rContainer.innerHTML = '';
  if (typeof totalEntities !== 'undefined') totalEntities = 0;

  const entityNodes = model.nodeDataArray.filter(n => ["Rectangle", "Strong", "Weak"].includes(n.category));
  const numInput = document.getElementById("numEntities");
  if (numInput) numInput.value = entityNodes.length;

  entityNodes.forEach(node => {
    totalEntities++;
    const div = document.createElement("div");
    div.className = "border p-4 mb-4 rounded bg-gray-50 entity-container";
    div.innerHTML = `<div class="bg-white border border-gray-200 rounded-lg shadow-sm p-4"><div class="flex items-center justify-between mb-3"><h2 class="text-lg font-semibold text-gray-800">Entity ${totalEntities}</h2><button type="button" class="p-1.5 rounded-full bg-red-100 text-red-600" onclick="deleteEntities(this)"><img src="../img/dustbin.png" class="h-4 w-4"></button></div><div class="mb-3"><label class="block text-sm font-medium text-gray-600 mb-1">Entity Name</label><input type="text" value="${node.text}" class="entityNameInput w-full border border-gray-300 rounded-md shadow-sm text-sm px-3 py-2" oninput="RefreshReleationship()" onblur="addBlock(this)"></div><div class="text-xs text-gray-400 italic mt-2">Attributes loaded in diagram</div></div>`;
    eContainer.appendChild(div);
  });

  model.nodeDataArray.filter(n => n.category?.includes("Relationship")).forEach(node => {
    const div = document.createElement("div");
    div.className = "bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-4 relationship-container";
    div.innerHTML = `<div class="flex items-center justify-between mb-2"><h3 class="font-semibold text-gray-700">Relationship</h3><button onclick="deleteRelationship(this)" class="text-red-500 text-xs">Delete</button></div><input type="text" value="${node.text}" class="relationshipNameInput w-full border p-2 rounded text-sm" readonly><div class="text-xs text-gray-400 mt-1">Details loaded in diagram</div>`;
    rContainer.appendChild(div);
  });
}
