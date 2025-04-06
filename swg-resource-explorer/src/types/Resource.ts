/**
 * Resource stats interface
 */
export interface ResourceStats {
  dr?: number; // Damage Resistance
  ma?: number; // Malleability
  oq?: number; // Overall Quality
  sr?: number; // Shock Resistance
  ut?: number; // Unit Toughness
  fl?: number; // Flavor
  pe?: number; // Potential Energy
  [key: string]: number | undefined; // Allow for dynamic stats
}

/**
 * Resource interface
 */
export interface Resource {
  id: number;
  name: string;
  type: string;
  typeId: string;
  stats: ResourceStats;
  planets: string[];
  availableTimestamp: number;
  availableBy: string;
}

/**
 * Resource category mappings
 */
export interface ResourceCategories {
  categories: {
    [baseType: string]: string[]; // Base type -> Full types
  };
  planetTypes: {
    [planetPrefix: string]: string[]; // Planet prefix -> Base types
  };
}

/**
 * Resource response from API
 */
export interface ResourcesResponse {
  total: number;
  page: number;
  limit: number;
  resources: Resource[];
}

/**
 * Resource filter options
 */
export interface ResourceFilters {
  name?: string;
  type?: string;
  planet?: string;
  stats?: {
    [stat: string]: {
      min?: number;
      max?: number;
    };
  };
  page: number;
  limit: number;
}
