require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const xlsx = require("xlsx");
const fs = require("fs");

const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Test the database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Successfully connected to the database");
    release();
  }
});

// GET route to fetch data and generate Excel file
app.get("/api/export-excel", async (req, res) => {
  try {
    const client = await pool.connect();

    // Open a cursor for fetching rows in batches
    const cursor = client.query(
      new (require("pg-cursor"))("SELECT * FROM hand_gesture_data")
    );

    // Create a workbook and worksheet
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.aoa_to_sheet([
      [
        "id",
        "thumb",
        "index_finger",
        "middle_finger",
        "ring_finger",
        "little_finger",
        "x_axis",
        "y_axis",
        "z_axis",
        "target_gesture",
        "created_at",
      ],
    ]); // Column Headers

    let rowIndex = 1;

    // Fetch data in chunks of 1000 rows
    async function fetchRows() {
      return new Promise((resolve, reject) => {
        cursor.read(1000, async (err, rows) => {
          if (err) return reject(err);

          if (rows.length > 0) {
            rows.forEach((row) => {
              xlsx.utils.sheet_add_aoa(
                worksheet,
                [
                  [
                    row.id,
                    row.thumb,
                    row.index_finger,
                    row.middle_finger,
                    row.ring_finger,
                    row.little_finger,
                    row.x_axis,
                    row.y_axis,
                    row.z_axis,
                    row.target_gesture,
                    row.created_at,
                  ],
                ],
                { origin: rowIndex++ }
              );
            });

            // Fetch next batch
            return resolve(fetchRows());
          } else {
            // No more rows, resolve
            return resolve();
          }
        });
      });
    }

    // Fetch all rows in chunks
    await fetchRows();

    // Close cursor and release connection
    cursor.close(() => client.release());

    // Add worksheet to workbook
    xlsx.utils.book_append_sheet(workbook, worksheet, "Hand Gestures");

    // Write file to a buffer
    const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Set headers for file download
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=hand_gestures.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    // Send buffer as response
    res.send(buffer);
  } catch (error) {
    console.error("Error exporting data:", error);
    res.status(500).json({ error: "Failed to export data" });
  }
});
// POST route to store hand gesture data
app.post("/api/store-gesture", async (req, res) => {
  const {
    thumb,
    index_finger,
    middle_finger,
    ring_finger,
    little_finger,
    x_axis,
    y_axis,
    z_axis,
    target_gesture,
  } = req.body;

  const query = `
    INSERT INTO hand_gesture_data 
    (thumb, index_finger, middle_finger, ring_finger, little_finger, x_axis, y_axis, z_axis, target_gesture)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id
  `;

  try {
    const result = await pool.query(query, [
      thumb,
      index_finger,
      middle_finger,
      ring_finger,
      little_finger,
      x_axis,
      y_axis,
      z_axis,
      target_gesture,
    ]);

    res.status(201).json({
      message: "Data stored successfully",
      id: result.rows[0].id,
    });
  } catch (error) {
    console.error("Error storing data:", error);
    res.status(500).json({ error: "Failed to store data" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
