// Unified category system for consistent use across all components
export const CATEGORIES = [
  { 
    id: 'all', 
    name: 'All Categories', 
    icon: '🌟',
    shortName: 'All'
  },
  { 
    id: 'Food & Drink', 
    name: 'Food & Drink', 
    icon: '🍕',
    shortName: 'Food'
  },
  { 
    id: 'Shopping', 
    name: 'Shopping', 
    icon: '🛍️',
    shortName: 'Shopping'
  },
  { 
    id: 'Arts & Culture', 
    name: 'Arts & Culture', 
    icon: '🎨',
    shortName: 'Arts'
  },
  { 
    id: 'Nightlife & Events', 
    name: 'Nightlife & Events', 
    icon: '🌙',
    shortName: 'Nightlife'
  },
  { 
    id: 'Services', 
    name: 'Services', 
    icon: '⚡',
    shortName: 'Services'
  },
  { 
    id: 'Hardware & Home', 
    name: 'Hardware & Home', 
    icon: '🔧',
    shortName: 'Hardware'
  },
  { 
    id: 'Food & Shopping', 
    name: 'Food & Shopping', 
    icon: '🛒',
    shortName: 'Food & Shop'
  }
];

// Get category by ID
export const getCategoryById = (id) => {
  return CATEGORIES.find(cat => cat.id === id) || CATEGORIES[0];
};

// Get all category IDs except 'all'
export const getCategoryIds = () => {
  return CATEGORIES.filter(cat => cat.id !== 'all').map(cat => cat.id);
};

// Get categories for filter components (excluding 'all')
export const getFilterCategories = () => {
  return CATEGORIES.filter(cat => cat.id !== 'all');
};
