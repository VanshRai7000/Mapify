// ===================== Load Relational Tables =====================
let relationalTables = JSON.parse(sessionStorage.getItem("relationalTables") || "[]");

// Add test data if nothing in sessionStorage
if (relationalTables.length === 0) {
    relationalTables = [
        {
            tableName: "Users",
            primaryKey: "id",
            columns: [
                { name: "id", type: "INT" },
                { name: "name", type: "VARCHAR(50)" },
                { name: "email", type: "VARCHAR(100)" }
            ],
            foreignKeys: []
        },
        {
            tableName: "Orders",
            primaryKey: "order_id",
            columns: [
                { name: "order_id", type: "INT" },
                { name: "user_id", type: "INT" },
                { name: "amount", type: "DECIMAL" }
            ],
            foreignKeys: [{ column: "user_id", references: "Users" }]
        }
    ];
}

// ===================== Function to Collect Sample Data from User =====================
function collectSampleData() {
    relationalTables.forEach(table => {
        const numRows = parseInt(prompt(`Enter number of sample rows for table "${table.tableName}":`)) || 0;
        table.sampleData = [];

        for (let i = 0; i < numRows; i++) {
            const row = {};
            table.columns.forEach(col => {
                row[col.name] = prompt(`Enter value for column "${col.name}" in row ${i + 1} of "${table.tableName}":`) || "";
            });
            table.sampleData.push(row);
        }
    });

    // Refresh the diagram
    updateDiagram();
}

function resetDiagram() {
    // Reset to original data and clear sample data
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
        layout: $(go.ForceDirectedLayout, {
            defaultSpringLength: 200,
            defaultElectricalCharge: 150
        }),
        "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom
    });

    
    // ===================== Node Template (Table Style) =====================
    myDiagram.nodeTemplate =
        $(go.Node, "Auto",
            {
                selectionAdorned: true,
                resizable: false,
                locationSpot: go.Spot.Center
            },
            $(go.Shape, "RoundedRectangle",
                {
                    fill: "white",
                    stroke: "#4b5563", // subtle gray border
                    strokeWidth: 1.5,
                    portId: "",
                    fromLinkable: true,
                    toLinkable: true
                }
            ),
            $(go.Panel, "Vertical", { margin: 0 },

                // 🔹 Table name header (dark purple)
                $(go.TextBlock,
                    {
                        font: "bold 14px Segoe UI, sans-serif",
                        margin: new go.Margin(6, 8, 6, 8),
                        stroke: "white",
                        alignment: go.Spot.Center,
                        minSize: new go.Size(160, 28),
                        textAlign: "center",
                        background: "#6b21a8" // deep purple
                    },
                    new go.Binding("text", "tableName")
                ),

                // 🔹 Column header row (lavender)
                $(go.Panel, "Horizontal",
                    {
                        padding: 4,
                        background: "#a78bfa" // soft lavender
                    },
                    new go.Binding("itemArray", "columnHeaders"),
                    {
                        itemTemplate:
                            $(go.Panel, "Auto",
                                { margin: 1 },
                                $(go.Shape, "Rectangle",
                                    {
                                        fill: "#8b5cf6", // medium violet
                                        stroke: "white",
                                        strokeWidth: 1
                                    }
                                ),
                                $(go.TextBlock,
                                    {
                                        font: "bold 12px Segoe UI, sans-serif",
                                        margin: 4,
                                        stroke: "white",
                                        minSize: new go.Size(70, 22),
                                        textAlign: "center"
                                    },
                                    new go.Binding("text", "name")
                                )
                            )
                    }
                ),

                // 🔹 Data rows (soft beige background, alternating)
                $(go.Panel, "Vertical",
                    {
                        margin: new go.Margin(0, 2, 4, 2),
                        defaultAlignment: go.Spot.Left
                    },
                    new go.Binding("itemArray", "sampleData"),
                    {
                        itemTemplate:
                            $(go.Panel, "Horizontal",
                                new go.Binding("itemArray", "values"),
                                {
                                    itemTemplate:
                                        $(go.Panel, "Auto",
                                            { margin: 1 },
                                            $(go.Shape, "Rectangle",
                                                new go.Binding("fill", "", (val, obj) =>
                                                    obj.panel.row % 2 === 0 ? "#fefce8" : "#f5f3ff" // beige vs very light purple
                                                ).ofObject(),
                                                {
                                                    stroke: "#e5e7eb",
                                                    strokeWidth: 1
                                                }
                                            ),
                                            $(go.TextBlock,
                                                {
                                                    font: "12px Segoe UI, sans-serif",
                                                    margin: 4,
                                                    stroke: "#111827", // dark text
                                                    minSize: new go.Size(70, 22),
                                                    textAlign: "center"
                                                },
                                                new go.Binding("text", "")
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
            { routing: go.Link.AvoidsNodes, corner: 5 },
            $(go.Shape, { strokeWidth: 2, stroke: "#64748b" }),
            $(go.Shape, { toArrow: "Standard", fill: "#64748b", stroke: "#64748b" })
        );
}

// ===================== Update Diagram Function =====================
function updateDiagram() {
    // ===================== Build Nodes =====================
    const nodes = relationalTables.map(table => {
        const columnHeaders = table.columns.map(col => ({
            name: col.name
        }));

        const processedSampleData = (table.sampleData || []).map(row => {
            const values = table.columns.map(col => row[col.name] || "");
            return { values: values };
        });

        return {
            key: table.tableName,
            tableName: table.tableName,
            columnHeaders: columnHeaders,
            sampleData: processedSampleData
        };
    });

    // ===================== Build Links =====================
    const links = [];
    relationalTables.forEach(table => {
        (table.foreignKeys || []).forEach(fk => {
            links.push({
                from: table.tableName,
                to: fk.references
            });
        });
    });

    // ===================== Set Model =====================
    const model = new go.GraphLinksModel();
    model.nodeDataArray = nodes;
    model.linkDataArray = links;
    myDiagram.model = model;

    // Debug
    console.log("Nodes:", nodes);
    console.log("Links:", links);
}

// Initialize diagram when page loads
window.addEventListener('DOMContentLoaded', function () {
    initDiagram();

    // Check if we need to collect sample data on first load
    if (relationalTables.every(table => !table.sampleData || table.sampleData.length === 0)) {
        // Show tables without data first
        updateDiagram();
        // Then prompt for data collection
        setTimeout(() => {
            const shouldCollect = confirm("No sample data found. Would you like to add sample data now?");
            if (shouldCollect) {
                collectSampleData();
            }
        }, 500);
    } else {
        updateDiagram();
    }
});
