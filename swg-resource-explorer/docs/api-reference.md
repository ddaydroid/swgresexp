# SWG Resource Explorer - API Reference

This document provides detailed information about the REST API endpoints available in the SWG Resource Explorer. These endpoints allow developers to programmatically access resource data and integrate it with other applications.

## Base URL

All API endpoints are relative to the base URL:

```
http://localhost:5000/api
```

## Authentication

The API currently does not require authentication. This is suitable for local development but should be enhanced with proper authentication if deployed publicly.

## Response Format

All API responses are in JSON format with the appropriate content-type header.

## Endpoints

### Get Resources

Retrieves a paginated list of resources with optional filtering.

```
GET /resources
```

#### Query Parameters

| Parameter  | Type    | Required | Description |
|------------|---------|----------|-------------|
| page       | Integer | No       | Page number (default: 1) |
| limit      | Integer | No       | Number of resources per page (default: 50) |
| name       | String  | No       | Filter resources by name (case-insensitive, partial match) |
| type       | String  | No       | Filter resources by type (case-insensitive, partial match) |
| planet     | String  | No       | Filter resources by planet (exact match, case-insensitive) |
| min_dr     | Integer | No       | Minimum Damage Resistance value |
| max_dr     | Integer | No       | Maximum Damage Resistance value |
| min_ma     | Integer | No       | Minimum Malleability value |
| max_ma     | Integer | No       | Maximum Malleability value |
| min_oq     | Integer | No       | Minimum Overall Quality value |
| max_oq     | Integer | No       | Maximum Overall Quality value |
| min_sr     | Integer | No       | Minimum Shock Resistance value |
| max_sr     | Integer | No       | Maximum Shock Resistance value |
| min_ut     | Integer | No       | Minimum Unit Toughness value |
| max_ut     | Integer | No       | Maximum Unit Toughness value |
| min_fl     | Integer | No       | Minimum Flavor value |
| max_fl     | Integer | No       | Maximum Flavor value |
| min_pe     | Integer | No       | Minimum Potential Energy value |
| max_pe     | Integer | No       | Maximum Potential Energy value |

#### Example Request

```
GET /api/resources?name=alumin&planet=naboo&min_oq=800&page=1&limit=10
```

#### Response

```json
{
  "total": 42,
  "page": 1,
  "limit": 10,
  "resources": [
    {
      "id": 123,
      "name": "Raykian Aluminum",
      "type": "Naboo Aluminum",
      "typeId": "aluminum_naboo",
      "stats": {
        "dr": 873,
        "ma": 423,
        "oq": 825,
        "sr": 512,
        "ut": 750,
        "pe": 0,
        "fl": 0
      },
      "planets": ["naboo"],
      "availableTimestamp": 1617304800000,
      "availableBy": "Galaxy Harvester"
    },
    // More resources...
  ]
}
```

#### Status Codes

| Status Code | Description |
|-------------|-------------|
| 200         | Success     |
| 400         | Bad Request (invalid parameters) |
| 500         | Server Error |

### Get Resource Categories

Retrieves resource categories organized by base type and planet.

```
GET /resources/categories
```

#### Example Request

```
GET /api/resources/categories
```

#### Response

```json
{
  "categories": {
    "Aluminum": ["Naboo Aluminum", "Tatooine Aluminum", "Corellia Aluminum"],
    "Iron": ["Naboo Iron", "Tatooine Iron", "Corellia Iron"],
    "Steel": ["Naboo Steel", "Tatooine Steel", "Corellia Steel"]
    // More categories...
  },
  "planetTypes": {
    "Naboo": ["Aluminum", "Iron", "Steel"],
    "Tatooine": ["Aluminum", "Iron", "Steel"],
    "Corellia": ["Aluminum", "Iron", "Steel"]
    // More planet types...
  }
}
```

#### Status Codes

| Status Code | Description |
|-------------|-------------|
| 200         | Success     |
| 500         | Server Error |

### Get Resource by ID

Retrieves detailed information about a specific resource.

```
GET /resources/:id
```

#### Path Parameters

| Parameter | Type    | Required | Description |
|-----------|---------|----------|-------------|
| id        | Integer | Yes      | Resource ID |

#### Example Request

```
GET /api/resources/123
```

#### Response

```json
{
  "id": 123,
  "name": "Raykian Aluminum",
  "type": "Naboo Aluminum",
  "typeId": "aluminum_naboo",
  "stats": {
    "dr": 873,
    "ma": 423,
    "oq": 825,
    "sr": 512,
    "ut": 750,
    "pe": 0,
    "fl": 0
  },
  "planets": ["naboo"],
  "availableTimestamp": 1617304800000,
  "availableBy": "Galaxy Harvester"
}
```

#### Status Codes

| Status Code | Description |
|-------------|-------------|
| 200         | Success     |
| 404         | Resource Not Found |
| 500         | Server Error |

## Error Responses

Error responses follow a consistent format:

```json
{
  "error": "Error message description"
}
```

## Rate Limiting

There is currently no rate limiting implemented. However, for production deployment, it's recommended to implement rate limiting to prevent abuse.

## Pagination

Pagination is implemented using the `page` and `limit` parameters:

- Default page size is 50 resources
- Page numbers start at 1
- The response includes `total`, `page`, and `limit` fields

## Filtering

The API supports various filtering options:

1. **Text-based filtering**: For `name` and `type` fields, filtering is case-insensitive and matches substrings.
2. **Exact matching**: For `planet` field, matching is exact but case-insensitive.
3. **Range filtering**: For all stat fields, you can specify minimum and maximum values.

## Sorting

The API currently does not support sorting via parameters. Sorting is implemented client-side in the application.

## XML Data Structure

For reference, the backend parses an XML file with the following structure:

```xml
<resource_data>
  <resources>
    <resource swgaide_id="123">
      <name>Raykian Aluminum</name>
      <type>Naboo Aluminum</type>
      <swgaide_type_id>aluminum_naboo</swgaide_type_id>
      <stats>
        <dr>873</dr>
        <ma>423</ma>
        <oq>825</oq>
        <sr>512</sr>
        <ut>750</ut>
        <pe>0</pe>
        <fl>0</fl>
      </stats>
      <planets>
        <planet>
          <name>naboo</name>
        </planet>
      </planets>
      <available_timestamp>1617304800000</available_timestamp>
      <available_by>Galaxy Harvester</available_by>
    </resource>
    <!-- More resources... -->
  </resources>
</resource_data>
```

## Implementation Notes

### Caching

The API implements server-side caching to improve performance:

- Resources are cached in memory for 1 hour (configurable)
- Cached data is used for all filtering operations
- Cache is refreshed when it expires or when the server restarts

### Error Handling

- The API includes proper error handling for all endpoints
- Specific error messages are provided when possible
- Stack traces are never exposed in responses

### Performance Considerations

- For large datasets, consider using more specific filters
- The pagination system helps manage response sizes
- Server-side filtering reduces the amount of data transferred

## Example Usage

### Curl Examples

#### Get all resources:

```bash
curl http://localhost:5000/api/resources
```

#### Get resources with filters:

```bash
curl http://localhost:5000/api/resources?planet=tatooine&min_oq=900
```

#### Get resource categories:

```bash
curl http://localhost:5000/api/resources/categories
```

#### Get specific resource:

```bash
curl http://localhost:5000/api/resources/123
```

### JavaScript Example (using fetch):

```javascript
// Get resources with filters
async function getResources(filters) {
  const params = new URLSearchParams();
  
  if (filters.name) params.append('name', filters.name);
  if (filters.type) params.append('type', filters.type);
  if (filters.planet) params.append('planet', filters.planet);
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  
  // Add stat filters
  if (filters.stats) {
    Object.entries(filters.stats).forEach(([stat, range]) => {
      if (range.min !== undefined) {
        params.append(`min_${stat}`, range.min.toString());
      }
      if (range.max !== undefined) {
        params.append(`max_${stat}`, range.max.toString());
      }
    });
  }
  
  const response = await fetch(`http://localhost:5000/api/resources?${params}`);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return await response.json();
}

// Usage
getResources({
  planet: 'naboo',
  stats: {
    oq: { min: 800 }
  },
  page: 1,
  limit: 10
})
  .then(data => console.log(`Found ${data.total} resources`))
  .catch(error => console.error(error));
```

## Future Enhancements

Potential API enhancements for future versions:

1. **Authentication**: Add JWT or API key authentication
2. **Sorting**: Add server-side sorting parameters
3. **Advanced Filtering**: Support more complex filter operations
4. **HATEOAS Links**: Include navigation links in responses
5. **Bulk Operations**: Add endpoints for batch processing
6. **WebSocket Support**: Real-time updates for resource data changes