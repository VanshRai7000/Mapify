// ===================== Load Relational Tables =====================
let relationalTables = JSON.parse(sessionStorage.getItem("relationalTables") || "[]");

// Add test data if nothing in sessionStorage
if (relationalTables.length === 0) {
    relationalTables = [
        {
            tableName: "Employee",
            primaryKey: "E_id",
            columns: [
                { name: "E_id", type: "INT" },
                { name: "E_name", type: "VARCHAR(255)" },
                { name: "E_Salary", type: "DECIMAL(10,2)" },
                { name: "E_dept", type: "VARCHAR(100)" }
            ],
            foreignKeys: []
        },
        {
            tableName: "Department",
            primaryKey: "Dept_id",
            columns: [
                { name: "Dept_id", type: "INT" },
                { name: "Dept_name", type: "VARCHAR(255)" },
                { name: "Manager_id", type: "INT" }
            ],
            foreignKeys: [{ column: "Manager_id", references: "Employee" }]
        }
    ];
}

// ===================== Auto-Generate Sample Data =====================
function generateSampleData(numRows = 3) {
    relationalTables.forEach(table => {
        table.sampleData = [];

        for (let i = 0; i < numRows; i++) {
            const row = {};
            table.columns.forEach(col => {
                row[col.name] = generateValueForColumn(col, i + 1, table);
            });
            table.sampleData.push(row);
        }
    });

    updateDiagram();
}

// ===================== Generate Value Based on Column Type =====================
function generateValueForColumn(column, rowIndex, table) {
    const colName = column.name.toLowerCase();
    const colType = column.type.toUpperCase();

    // Check if it's a primary key
    if (column.name === table.primaryKey) {
        return rowIndex;
    }

    // Check if it's a foreign key
    const isForeignKey = table.foreignKeys?.some(fk => fk.column === column.name);
    if (isForeignKey) {
        return Math.ceil(Math.random() * 3);
    }

    // NAME FIELDS - Different formats
    if (colName.includes('firstname') || colName.includes('first_name') || colName.includes('fname') || colName === 'f_name') {
        const firstNames = ['John', 'Emma', 'Michael', 'Sophia', 'William', 'Olivia', 'James', 'Ava'];
        return firstNames[rowIndex - 1] || firstNames[rowIndex % firstNames.length];
    } else if (colName.includes('middlename') || colName.includes('middle_name') || colName.includes('mname') || colName === 'm_name') {
        const middleNames = ['David', 'Marie', 'Lee', 'Ann', 'James', 'Rose', 'Paul', 'Jane'];
        return middleNames[rowIndex - 1] || middleNames[rowIndex % middleNames.length];
    } else if (colName.includes('lastname') || colName.includes('last_name') || colName.includes('lname') || colName === 'l_name' || colName.includes('surname')) {
        const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
        return lastNames[rowIndex - 1] || lastNames[rowIndex % lastNames.length];
    } else if (colName.includes('name') && !colName.includes('username')) {
        const fullNames = ['John Smith', 'Emma Johnson', 'Michael Williams', 'Sophia Brown', 'William Jones'];
        return fullNames[rowIndex - 1] || fullNames[rowIndex % fullNames.length];
    }

    // SALARY/FINANCIAL
    if (colName.includes('salary') || colName.includes('wage')) {
        const salaries = [55000, 65000, 75000, 85000, 95000];
        return salaries[rowIndex - 1] || salaries[rowIndex % salaries.length];
    }

    // DEPARTMENT
    if (colName.includes('department') || colName.includes('dept')) {
        const departments = ['ECE', 'CIVIL', 'MECHANICAL', 'CSE', 'EEE'];
        return departments[rowIndex - 1] || departments[rowIndex % departments.length];
    }

    // EMAIL
    if (colName.includes('email')) {
        return `user${rowIndex}@email.com`;
    }

    // PHONE
    if (colName.includes('phone') || colName.includes('mobile')) {
        return `98765432${10 + rowIndex}`;
    }

    // NUMERIC
    if (colType.includes('INT') || colType.includes('INTEGER')) {
        return rowIndex;
    } else if (colType.includes('DECIMAL') || colType.includes('FLOAT')) {
        return (Math.random() * 100 + 50).toFixed(2);
    } else if (colType.includes('VARCHAR') || colType.includes('TEXT')) {
        return `Sample ${rowIndex}`;
    }

    return `Value${rowIndex}`;
}

function resetDiagram() {
    relationalTables.forEach(table => {
        table.sampleData = [];
    });
    updateDiagram();
}

// ===================== Init GoJS Diagram =====================
const $ = go.GraphObject.make;
let myDiagram;

function initDiagram() {
    myDiagram = $(go.Diagram, "relationalDiagramDiv", {
        initialContentAlignment: go.Spot.Center,
        "undoManager.isEnabled": true,
        layout: $(go.GridLayout, {
            wrappingWidth: Infinity,
            spacing: new go.Size(100, 80),
            alignment: go.GridLayout.Position
        }),
        "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
        initialScale: 0.7  // Default zoom out to 70%
    });

    // ===================== IMPROVED Node Template =====================
    myDiagram.nodeTemplate =
        $(go.Node, "Auto",
            {
                selectionAdorned: true,
                resizable: false,
                locationSpot: go.Spot.Center,
                shadowVisible: true,
                shadowColor: "rgba(0,0,0,0.15)",
                shadowOffset: new go.Point(3, 3),
                shadowBlur: 8
            },
            
            // Outer rounded rectangle border
            $(go.Shape, "RoundedRectangle",
                {
                    fill: "white",
                    stroke: "#D1D5DB",
                    strokeWidth: 2,
                    parameter1: 12
                }
            ),
            
            $(go.Panel, "Vertical",
                { margin: 0, stretch: go.GraphObject.Fill },

                // ========== TABLE HEADER (Purple Gradient) ==========
                $(go.Panel, "Auto",
                    { stretch: go.GraphObject.Horizontal },
                    $(go.Shape, "RoundedRectangle",
                        {
                            fill: $(go.Brush, "Linear", { 0: "#7C3AED", 1: "#6D28D9" }),
                            stroke: null,
                            parameter1: 10,
                            parameter2: 0,
                            height: 50
                        }
                    ),
                    $(go.TextBlock,
                        {
                            font: "bold 18px 'Segoe UI', Inter, sans-serif",
                            stroke: "white",
                            margin: 14,
                            textAlign: "center"
                        },
                        new go.Binding("text", "tableName")
                    )
                ),

                // ========== COLUMN HEADERS ROW (Light Purple) ==========
                $(go.Panel, "Table",
                    {
                        background: "#EEF2FF",
                        stretch: go.GraphObject.Horizontal,
                        margin: 0,
                        defaultAlignment: go.Spot.Center
                    },
                    new go.Binding("itemArray", "columnHeaders"),
                    {
                        itemTemplate:
                            $(go.Panel, "Auto",
                                {
                                    row: 0,
                                    stretch: go.GraphObject.Vertical
                                },
                                new go.Binding("column", "index"),
                                $(go.Shape, "Rectangle",
                                    {
                                        fill: "#E0E7FF",
                                        stroke: "#C7D2FE",
                                        strokeWidth: 1,
                                        width: 140,
                                        height: 40
                                    }
                                ),
                                $(go.TextBlock,
                                    {
                                        font: "bold 13px 'Segoe UI', Inter, sans-serif",
                                        stroke: "#4338CA",
                                        margin: 8,
                                        textAlign: "center",
                                        overflow: go.TextBlock.OverflowEllipsis,
                                        maxLines: 1
                                    },
                                    new go.Binding("text", "name")
                                )
                            )
                    }
                ),

                // ========== DATA ROWS (Alternating Colors) ==========
                $(go.Panel, "Vertical",
                    {
                        stretch: go.GraphObject.Horizontal,
                        margin: 0,
                        defaultAlignment: go.Spot.Left
                    },
                    new go.Binding("itemArray", "sampleData"),
                    {
                        itemTemplate:
                            $(go.Panel, "Table",
                                {
                                    stretch: go.GraphObject.Horizontal,
                                    defaultAlignment: go.Spot.Center
                                },
                                new go.Binding("background", "rowIndex", function(idx) {
                                    return idx % 2 === 0 ? "#FEFCE8" : "#FFFFFF";
                                }),
                                new go.Binding("itemArray", "values"),
                                {
                                    itemTemplate:
                                        $(go.Panel, "Auto",
                                            {
                                                row: 0,
                                                stretch: go.GraphObject.Vertical
                                            },
                                            new go.Binding("column", "index"),
                                            $(go.Shape, "Rectangle",
                                                {
                                                    stroke: "#E5E7EB",
                                                    strokeWidth: 1,
                                                    width: 140,
                                                    height: 36
                                                },
                                                new go.Binding("fill", "", function(val, shape) {
                                                    const panel = shape.part;
                                                    if (!panel) return "white";
                                                    const row = panel.data;
                                                    return row.rowIndex % 2 === 0 ? "#FEFCE8" : "#FFFFFF";
                                                })
                                            ),
                                            $(go.TextBlock,
                                                {
                                                    font: "13px 'Segoe UI', Inter, sans-serif",
                                                    stroke: "#1F2937",
                                                    margin: 8,
                                                    textAlign: "center",
                                                    overflow: go.TextBlock.OverflowEllipsis,
                                                    maxLines: 1,
                                                    maxSize: new go.Size(130, NaN)
                                                },
                                                new go.Binding("text", "value")
                                            )
                                        )
                                }
                            )
                    }
                )
            )
        );

    // ===================== Link Template =====================
    myDiagram.linkTemplate =
        $(go.Link,
            {
                routing: go.Link.AvoidsNodes,
                curve: go.Link.JumpOver,
                corner: 8
            },
            $(go.Shape, { strokeWidth: 2.5, stroke: "#3B82F6" }),
            $(go.Shape, { toArrow: "Standard", fill: "#3B82F6", stroke: null, scale: 1.4 }),
            $(go.TextBlock,
                {
                    segmentOffset: new go.Point(0, -12),
                    font: "bold 12px 'Segoe UI', Inter, sans-serif",
                    stroke: "#1E40AF",
                    background: "white",
                    margin: 4
                },
                new go.Binding("text", "relationship")
            )
        );
}

// ===================== Update Diagram Function =====================
function updateDiagram() {
    const nodes = relationalTables.map(table => {
        // Column headers with index
        const columnHeaders = table.columns.map((col, idx) => ({
            name: col.name,
            index: idx
        }));

        // Process sample data with row index and cell values
        const processedSampleData = (table.sampleData || []).map((row, rowIdx) => {
            const values = table.columns.map((col, colIdx) => ({
                value: row[col.name] || "",
                index: colIdx
            }));
            return {
                values: values,
                rowIndex: rowIdx
            };
        });

        return {
            key: table.tableName,
            tableName: table.tableName,
            columnHeaders: columnHeaders,
            sampleData: processedSampleData
        };
    });

    // Build Links
    const links = [];
    relationalTables.forEach(table => {
        (table.foreignKeys || []).forEach(fk => {
            links.push({
                from: table.tableName,
                to: fk.references,
                relationship: "1:N"
            });
        });
    });

    // Set Model
    const model = new go.GraphLinksModel();
    model.nodeDataArray = nodes;
    model.linkDataArray = links;
    myDiagram.model = model;
}

// Initialize diagram when page loads
window.addEventListener('DOMContentLoaded', function () {
    initDiagram();

    // Auto-generate sample data if none exists
    if (relationalTables.every(table => !table.sampleData || table.sampleData.length === 0)) {
        generateSampleData(3);
    } else {
        updateDiagram();
    }
});