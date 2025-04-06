import axios from 'axios';
import { Resource, ResourcesResponse, ResourceFilters, ResourceCategories } from '../types/Resource';

// Create axios instance with base URL
const api = axios.create({
  baseURL: '/api',
});

/**
 * Get resources with optional filters
 * @param filters - Resource filters
 * @returns Promise with resources response
 */
export const getResources = async (filters: ResourceFilters): Promise<ResourcesResponse> => {
  try {
    // Build query parameters
    const params: Record<string, string> = {
      page: filters.page.toString(),
      limit: filters.limit.toString(),
    };

    // Add name filter
    if (filters.name) {
      params.name = filters.name;
    }

    // Add type filter
    if (filters.type) {
      params.type = filters.type;
    }

    // Add planet filter
    if (filters.planet) {
      params.planet = filters.planet;
    }

    // Add stat filters
    if (filters.stats) {
      Object.entries(filters.stats).forEach(([stat, range]) => {
        if (range.min !== undefined) {
          params[`min_${stat}`] = range.min.toString();
        }
        if (range.max !== undefined) {
          params[`max_${stat}`] = range.max.toString();
        }
      });
    }

    const response = await api.get<ResourcesResponse>('/resources', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching resources:', error);
    throw error;
  }
};

/**
 * Get resource by ID
 * @param id - Resource ID
 * @returns Promise with resource
 */
export const getResourceById = async (id: number): Promise<Resource> => {
  try {
    const response = await api.get<Resource>(`/resources/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching resource with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Get resource categories
 * @returns Promise with resource categories
 */
export const getResourceCategories = async (): Promise<ResourceCategories> => {
  try {
    const response = await api.get<ResourceCategories>('/resources/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching resource categories:', error);
    throw error;
  }
};

export default api;
