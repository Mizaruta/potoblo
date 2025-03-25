// Configuration de base de l'API
const API_URL = 'http://localhost:5000/api';

// Fonction pour récupérer le token d'authentification
const getToken = () => {
  return localStorage.getItem('authToken');
};

// Headers par défaut
const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers['x-auth-token'] = token;
    }
  }
  
  return headers;
};

// Gestionnaire d'erreurs global
const handleError = (error) => {
  console.error('Erreur API:', error);
  
  // Gérer les erreurs d'authentification
  if (error.response && error.response.status === 401) {
    // Rediriger vers la page de connexion si non authentifié
    localStorage.removeItem('authToken');
    window.location.href = '/pages/login.html';
  }
  
  return Promise.reject(error);
};

// API produits
const productAPI = {
  // Obtenir tous les produits
  getProducts: async (filters = {}) => {
    try {
      // Construire l'URL avec les paramètres de filtre
      let url = `${API_URL}/products?`;
      
      for (const key in filters) {
        if (filters[key]) {
          url += `${key}=${encodeURIComponent(filters[key])}&`;
        }
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(false)
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des produits');
      }
      
      return await response.json();
    } catch (error) {
      return handleError(error);
    }
  },
  
  // Obtenir un produit par son ID
  getProductById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'GET',
        headers: getHeaders(false)
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du produit');
      }
      
      return await response.json();
    } catch (error) {
      return handleError(error);
    }
  },
  
  // Ajouter une évaluation à un produit
  addReview: async (productId, reviewData) => {
    try {
      const response = await fetch(`${API_URL}/products/${productId}/reviews`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(reviewData)
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout de l\'évaluation');
      }
      
      return await response.json();
    } catch (error) {
      return handleError(error);
    }
  }
};

// API authentification
const authAPI = {
  // Inscription
  register: async (userData) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: getHeaders(false),
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors?.[0]?.msg || 'Erreur lors de l\'inscription');
      }
      
      const data = await response.json();
      
      // Stocker le token dans le localStorage
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      
      return data;
    } catch (error) {
      return handleError(error);
    }
  },
  
  // Connexion
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(false),
        body: JSON.stringify(credentials)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors?.[0]?.msg || 'Identifiants invalides');
      }
      
      const data = await response.json();
      
      // Stocker le token dans le localStorage
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      
      return data;
    } catch (error) {
      return handleError(error);
    }
  },
  
  // Obtenir les infos de l'utilisateur
  getUserProfile: async () => {
    try {
      const response = await fetch(`${API_URL}/auth/user`, {
        method: 'GET',
        headers: getHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des informations utilisateur');
      }
      
      return await response.json();
    } catch (error) {
      return handleError(error);
    }
  },
  
  // Déconnexion
  logout: () => {
    localStorage.removeItem('authToken');
    // Rediriger vers la page d'accueil
    window.location.href = '/index.html';
  }
};

// API commandes
const orderAPI = {
  // Créer une commande
  createOrder: async (orderData) => {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(orderData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Erreur lors de la création de la commande');
      }
      
      return await response.json();
    } catch (error) {
      return handleError(error);
    }
  },
  
  // Obtenir les commandes de l'utilisateur
  getMyOrders: async () => {
    try {
      const response = await fetch(`${API_URL}/orders/my-orders`, {
        method: 'GET',
        headers: getHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des commandes');
      }
      
      return await response.json();
    } catch (error) {
      return handleError(error);
    }
  },
  
  // Obtenir une commande par son ID
  getOrderById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/orders/${id}`, {
        method: 'GET',
        headers: getHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de la commande');
      }
      
      return await response.json();
    } catch (error) {
      return handleError(error);
    }
  }
};

// API paiement
const paymentAPI = {
  // Créer une intention de paiement
  createPaymentIntent: async (orderId) => {
    try {
      const response = await fetch(`${API_URL}/payments/create-payment-intent`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ orderId })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Erreur lors de la création du paiement');
      }
      
      return await response.json();
    } catch (error) {
      return handleError(error);
    }
  },
  
  // Confirmer un paiement
  confirmPayment: async (paymentData) => {
    try {
      const response = await fetch(`${API_URL}/payments/confirm`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(paymentData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Erreur lors de la confirmation du paiement');
      }
      
      return await response.json();
    } catch (error) {
      return handleError(error);
    }
  }
};

// Exporter les API
const API = {
  product: productAPI,
  auth: authAPI,
  order: orderAPI,
  payment: paymentAPI
};

// Exposer l'API globalement
window.API = API; 