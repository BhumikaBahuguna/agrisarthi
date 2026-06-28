import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const collection = {
  info: {
    _postman_id: "af68ae8e-2d8f-4671-b0f8-16c359545df2",
    name: "AgriSarthi Crop Telemetry REST API Collection (Week 4)",
    description: "Postman API testing collection for AgriSarthi backend server. Contains 8 requests verifying CRUD, stats, searching, validation, and error states.",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  item: [
    {
      name: "Get Backend Health Check",
      request: {
        method: "GET",
        header: [],
        url: {
          raw: "http://localhost:5000/",
          protocol: "http",
          host: ["localhost"],
          port: "5000",
          path: []
        },
        description: "Returns health status and list of active endpoints."
      },
      response: [
        {
          name: "Health Check Successful Response",
          originalRequest: {
            method: "GET",
            header: [],
            url: {
              raw: "http://localhost:5000/",
              protocol: "http",
              host: ["localhost"],
              port: "5000",
              path: []
            }
          },
          status: "OK",
          code: 200,
          _postman_previewlanguage: "json",
          header: [
            { key: "Content-Type", value: "application/json; charset=utf-8" }
          ],
          cookie: [],
          body: JSON.stringify({
            status: "healthy",
            message: "AgriSarthi Backend API is running smoothly.",
            endpoints: {
              listCrops: "GET /api/crops",
              searchCrops: "GET /api/crops/search?q=...",
              cropStats: "GET /api/crops/stats",
              getCrop: "GET /api/crops/:id",
              createCrop: "POST /api/crops",
              updateCrop: "PUT /api/crops/:id",
              deleteCrop: "DELETE /api/crops/:id"
            }
          }, null, 2)
        }
      ]
    },
    {
      name: "Get Crop Statistics",
      request: {
        method: "GET",
        header: [],
        url: {
          raw: "http://localhost:5000/api/crops/stats",
          protocol: "http",
          host: ["localhost"],
          port: "5000",
          path: ["api", "crops", "stats"]
        },
        description: "Fetch dynamic telemetry statistics for dashboard summary cards (Active Farms, Current Crops, Weather Alerts, Total Area)."
      },
      response: [
        {
          name: "Statistics Calculation Successful Response",
          originalRequest: {
            method: "GET",
            header: [],
            url: {
              raw: "http://localhost:5000/api/crops/stats",
              protocol: "http",
              host: ["localhost"],
              port: "5000",
              path: ["api", "crops", "stats"]
            }
          },
          status: "OK",
          code: 200,
          _postman_previewlanguage: "json",
          header: [
            { key: "Content-Type", value: "application/json; charset=utf-8" }
          ],
          cookie: [],
          body: JSON.stringify({
            activeFarms: 8,
            currentCrops: 6,
            weatherAlerts: 3,
            totalArea: 38.8
          }, null, 2)
        }
      ]
    },
    {
      name: "List All Crops",
      request: {
        method: "GET",
        header: [],
        url: {
          raw: "http://localhost:5000/api/crops",
          protocol: "http",
          host: ["localhost"],
          port: "5000",
          path: ["api", "crops"]
        },
        description: "Retrieve all crop cycles registered in the in-memory array database."
      },
      response: [
        {
          name: "All Crops Retrieved Response",
          originalRequest: {
            method: "GET",
            header: [],
            url: {
              raw: "http://localhost:5000/api/crops",
              protocol: "http",
              host: ["localhost"],
              port: "5000",
              path: ["api", "crops"]
            }
          },
          status: "OK",
          code: 200,
          _postman_previewlanguage: "json",
          header: [
            { key: "Content-Type", value: "application/json; charset=utf-8" }
          ],
          cookie: [],
          body: JSON.stringify([
            {
              id: "crop-1",
              name: "Rice",
              variety: "Basmati 370",
              type: "Grain",
              status: "Growing",
              plantedDate: "2026-06-01",
              expectedHarvestDate: "2026-10-15",
              fieldArea: 5.5
            },
            {
              id: "crop-2",
              name: "Wheat",
              variety: "Kalyan Sona",
              type: "Grain",
              status: "Planned",
              plantedDate: "",
              expectedHarvestDate: "2027-04-10",
              fieldArea: 8.0
            }
          ], null, 2)
        }
      ]
    },
    {
      name: "Get Single Crop (Found)",
      request: {
        method: "GET",
        header: [],
        url: {
          raw: "http://localhost:5000/api/crops/crop-1",
          protocol: "http",
          host: ["localhost"],
          port: "5000",
          path: ["api", "crops", "crop-1"]
        },
        description: "Retrieve complete details for a single crop entry using its ID."
      },
      response: [
        {
          name: "Single Crop Detail Found Response",
          originalRequest: {
            method: "GET",
            header: [],
            url: {
              raw: "http://localhost:5000/api/crops/crop-1",
              protocol: "http",
              host: ["localhost"],
              port: "5000",
              path: ["api", "crops", "crop-1"]
            }
          },
          status: "OK",
          code: 200,
          _postman_previewlanguage: "json",
          header: [
            { key: "Content-Type", value: "application/json; charset=utf-8" }
          ],
          cookie: [],
          body: JSON.stringify({
            id: "crop-1",
            name: "Rice",
            variety: "Basmati 370",
            type: "Grain",
            status: "Growing",
            plantedDate: "2026-06-01",
            expectedHarvestDate: "2026-10-15",
            fieldArea: 5.5
          }, null, 2)
        }
      ]
    },
    {
      name: "Get Single Crop (Not Found)",
      request: {
        method: "GET",
        header: [],
        url: {
          raw: "http://localhost:5000/api/crops/crop-999",
          protocol: "http",
          host: ["localhost"],
          port: "5000",
          path: ["api", "crops", "crop-999"]
        },
        description: "Attempt to retrieve details of a crop that does not exist."
      },
      response: [
        {
          name: "Single Crop Not Found Response",
          originalRequest: {
            method: "GET",
            header: [],
            url: {
              raw: "http://localhost:5000/api/crops/crop-999",
              protocol: "http",
              host: ["localhost"],
              port: "5000",
              path: ["api", "crops", "crop-999"]
            }
          },
          status: "Not Found",
          code: 404,
          _postman_previewlanguage: "json",
          header: [
            { key: "Content-Type", value: "application/json; charset=utf-8" }
          ],
          cookie: [],
          body: JSON.stringify({
            error: "Crop with ID 'crop-999' not found."
          }, null, 2)
        }
      ]
    },
    {
      name: "Search Crops (Query)",
      request: {
        method: "GET",
        header: [],
        url: {
          raw: "http://localhost:5000/api/crops/search?q=Cotton",
          protocol: "http",
          host: ["localhost"],
          port: "5000",
          path: ["api", "crops", "search"],
          query: [
            {
              key: "q",
              value: "Cotton"
            }
          ]
        },
        description: "Search for crop cycles containing a matching string query in name, variety, status, or type."
      },
      response: [
        {
          name: "Search Query Results Found Response",
          originalRequest: {
            method: "GET",
            header: [],
            url: {
              raw: "http://localhost:5000/api/crops/search?q=Cotton",
              protocol: "http",
              host: ["localhost"],
              port: "5000",
              path: ["api", "crops", "search"],
              query: [{ key: "q", value: "Cotton" }]
            }
          },
          status: "OK",
          code: 200,
          _postman_previewlanguage: "json",
          header: [
            { key: "Content-Type", value: "application/json; charset=utf-8" }
          ],
          cookie: [],
          body: JSON.stringify([
            {
              id: "crop-4",
              name: "Cotton",
              variety: "Bt Cotton II",
              type: "Cash Crop",
              status: "Growing",
              plantedDate: "2026-05-15",
              expectedHarvestDate: "2026-11-20",
              fieldArea: 6.2
            }
          ], null, 2)
        }
      ]
    },
    {
      name: "Create Crop Cycle (Successful)",
      request: {
        method: "POST",
        header: [
          {
            key: "Content-Type",
            value: "application/json"
          }
        ],
        body: {
          mode: "raw",
          raw: JSON.stringify({
            name: "Tomato",
            variety: "Roma",
            type: "Vegetable",
            status: "Planted",
            plantedDate: "2026-06-20",
            expectedHarvestDate: "2026-09-25",
            fieldArea: 2.5
          }, null, 2)
        },
        url: {
          raw: "http://localhost:5000/api/crops",
          protocol: "http",
          host: ["localhost"],
          port: "5000",
          path: ["api", "crops"]
        },
        description: "Record a new crop cycle with validated data structures."
      },
      response: [
        {
          name: "Create Crop Cycle Created Response",
          originalRequest: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                name: "Tomato",
                variety: "Roma",
                type: "Vegetable",
                status: "Planted",
                plantedDate: "2026-06-20",
                expectedHarvestDate: "2026-09-25",
                fieldArea: 2.5
              })
            },
            url: {
              raw: "http://localhost:5000/api/crops",
              protocol: "http",
              host: ["localhost"],
              port: "5000",
              path: ["api", "crops"]
            }
          },
          status: "Created",
          code: 201,
          _postman_previewlanguage: "json",
          header: [
            { key: "Content-Type", value: "application/json; charset=utf-8" }
          ],
          cookie: [],
          body: JSON.stringify({
            id: "crop-1688000000000",
            name: "Tomato",
            variety: "Roma",
            type: "Vegetable",
            status: "Planted",
            plantedDate: "2026-06-20",
            expectedHarvestDate: "2026-09-25",
            fieldArea: 2.5
          }, null, 2)
        }
      ]
    },
    {
      name: "Create Crop Cycle (Validation Error)",
      request: {
        method: "POST",
        header: [
          {
            key: "Content-Type",
            value: "application/json"
          }
        ],
        body: {
          mode: "raw",
          raw: JSON.stringify({
            name: "",
            variety: "Roma",
            type: "Vegetable",
            status: "Planted",
            plantedDate: "2026-06-20",
            expectedHarvestDate: "2026-09-25",
            fieldArea: -2.5
          }, null, 2)
        },
        url: {
          raw: "http://localhost:5000/api/crops",
          protocol: "http",
          host: ["localhost"],
          port: "5000",
          path: ["api", "crops"]
        },
        description: "Attempt to create a crop cycle with invalid parameters (empty name, negative fieldArea)."
      },
      response: [
        {
          name: "Create Crop Cycle Validation Error Response",
          originalRequest: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                name: "",
                variety: "Roma",
                type: "Vegetable",
                status: "Planted",
                plantedDate: "2026-06-20",
                expectedHarvestDate: "2026-09-25",
                fieldArea: -2.5
              })
            },
            url: {
              raw: "http://localhost:5000/api/crops",
              protocol: "http",
              host: ["localhost"],
              port: "5000",
              path: ["api", "crops"]
            }
          },
          status: "Bad Request",
          code: 400,
          _postman_previewlanguage: "json",
          header: [
            { key: "Content-Type", value: "application/json; charset=utf-8" }
          ],
          cookie: [],
          body: JSON.stringify({
            error: "Validation error: Crop name is required and must be a valid string. | Field area is required and must be a positive number."
          }, null, 2)
        }
      ]
    },
    {
      name: "Update Crop Cycle",
      request: {
        method: "PUT",
        header: [
          {
            key: "Content-Type",
            value: "application/json"
          }
        ],
        body: {
          mode: "raw",
          raw: JSON.stringify({
            name: "Rice",
            variety: "Basmati 370",
            type: "Grain",
            status: "Harvested",
            plantedDate: "2026-06-01",
            expectedHarvestDate: "2026-10-15",
            fieldArea: 6.0
          }, null, 2)
        },
        url: {
          raw: "http://localhost:5000/api/crops/crop-1",
          protocol: "http",
          host: ["localhost"],
          port: "5000",
          path: ["api", "crops", "crop-1"]
        },
        description: "Modify an existing crop cycle item in database."
      },
      response: [
        {
          name: "Update Crop Cycle Successful Response",
          originalRequest: {
            method: "PUT",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                name: "Rice",
                variety: "Basmati 370",
                type: "Grain",
                status: "Harvested",
                plantedDate: "2026-06-01",
                expectedHarvestDate: "2026-10-15",
                fieldArea: 6.0
              })
            },
            url: {
              raw: "http://localhost:5000/api/crops/crop-1",
              protocol: "http",
              host: ["localhost"],
              port: "5000",
              path: ["api", "crops", "crop-1"]
            }
          },
          status: "OK",
          code: 200,
          _postman_previewlanguage: "json",
          header: [
            { key: "Content-Type", value: "application/json; charset=utf-8" }
          ],
          cookie: [],
          body: JSON.stringify({
            id: "crop-1",
            name: "Rice",
            variety: "Basmati 370",
            type: "Grain",
            status: "Harvested",
            plantedDate: "2026-06-01",
            expectedHarvestDate: "2026-10-15",
            fieldArea: 6.0
          }, null, 2)
        }
      ]
    },
    {
      name: "Delete Crop Cycle",
      request: {
        method: "DELETE",
        header: [],
        url: {
          raw: "http://localhost:5000/api/crops/crop-3",
          protocol: "http",
          host: ["localhost"],
          port: "5000",
          path: ["api", "crops", "crop-3"]
        },
        description: "Delete an existing crop cycle using its unique ID."
      },
      response: [
        {
          name: "Delete Crop Cycle Successful Response",
          originalRequest: {
            method: "DELETE",
            header: [],
            url: {
              raw: "http://localhost:5000/api/crops/crop-3",
              protocol: "http",
              host: ["localhost"],
              port: "5000",
              path: ["api", "crops", "crop-3"]
            }
          },
          status: "No Content",
          code: 204,
          _postman_previewlanguage: "plain",
          header: [
            { key: "Date", value: "Sun, 28 Jun 2026 12:00:00 GMT" }
          ],
          cookie: [],
          body: ""
        }
      ]
    }
  ]
};

const outputPath = path.join(__dirname, '..', 'W4_APICollection_BhumikaBahuguna.json');
fs.writeFileSync(outputPath, JSON.stringify(collection, null, 2), 'utf8');
console.log(`✅ Postman Collection exported to: ${outputPath}`);
