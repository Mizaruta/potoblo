const axios = require('axios');

// Configuration de base
const suppliers = {
  // Exemple de configuration pour différents fournisseurs
  '61fcd59a4e66c32b8a3c4567': {
    name: 'FournisseurA',
    apiUrl: process.env.SUPPLIER_A_API_URL,
    apiKey: process.env.SUPPLIER_A_API_KEY
  },
  '61fcd59a4e66c32b8a3c4568': {
    name: 'FournisseurB',
    apiUrl: process.env.SUPPLIER_B_API_URL,
    apiKey: process.env.SUPPLIER_B_API_KEY
  }
};

// Placer une commande chez un fournisseur
exports.placeOrder = async (supplierId, items, orderDetails) => {
  const supplier = suppliers[supplierId];
  
  if (!supplier) {
    throw new Error(`Fournisseur inconnu: ${supplierId}`);
  }
  
  try {
    const response = await axios.post(
      `${supplier.apiUrl}/orders`,
      {
        items,
        reference: orderDetails.orderRef,
        shipping: orderDetails.shippingAddress
      },
      {
        headers: {
          'Authorization': `Bearer ${supplier.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error(`Erreur API fournisseur ${supplier.name}:`, error.response?.data || error.message);
    throw error;
  }
};

// Vérifier le stock chez un fournisseur
exports.checkStock = async (supplierId, productId) => {
  const supplier = suppliers[supplierId];
  
  if (!supplier) {
    throw new Error(`Fournisseur inconnu: ${supplierId}`);
  }
  
  try {
    const response = await axios.get(
      `${supplier.apiUrl}/products/${productId}/stock`,
      {
        headers: {
          'Authorization': `Bearer ${supplier.apiKey}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error(`Erreur API fournisseur ${supplier.name}:`, error.response?.data || error.message);
    throw error;
  }
}; 