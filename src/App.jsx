
import React, { useState, useEffect } from 'react';

const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  VIEWER: 'VIEWER'
};

const USER_PERMISSIONS = {
  ADMIN: {
    canView: ['DASHBOARD', 'PRODUCTS', 'ORDERS', 'SETTINGS', 'USERS'],
    canEdit: ['PRODUCTS', 'ORDERS', 'USERS'],
    canDelete: ['PRODUCTS', 'ORDERS', 'USERS']
  },
  USER: {
    canView: ['DASHBOARD', 'PRODUCTS', 'ORDERS'],
    canEdit: ['ORDERS'],
    canDelete: []
  },
  VIEWER: {
    canView: ['DASHBOARD', 'PRODUCTS'],
    canEdit: [],
    canDelete: []
  }
};

const MOCK_AUTH_USER = {
  id: 'user-123',
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  role: ROLES.ADMIN, // Set to ADMIN for full access in prototype
};

const MOCK_ORDERS = [
  { id: 'ORD001', customerName: 'Alice Johnson', product: 'Laptop Pro', quantity: 1, amount: '$1500.00', status: 'Completed', date: '2023-10-20' },
  { id: 'ORD002', customerName: 'Bob Williams', product: 'Wireless Mouse', quantity: 2, amount: '$50.00', status: 'Pending', date: '2023-10-21' },
  { id: 'ORD003', customerName: 'Charlie Brown', product: 'Monitor 27"', quantity: 1, amount: '$300.00', status: 'Shipped', date: '2023-10-22' },
  { id: 'ORD004', customerName: 'Diana Prince', product: 'Keyboard RGB', quantity: 1, amount: '$120.00', status: 'Completed', date: '2023-10-23' },
  { id: 'ORD005', customerName: 'Eve Adams', product: 'Webcam HD', quantity: 3, amount: '$180.00', status: 'Cancelled', date: '2023-10-24' },
];

const MOCK_PRODUCTS = [
  { id: 'PROD001', name: 'Laptop Pro X1', unitPrice: '$1500.00', availableUnits: 50, description: 'High-performance laptop for professionals with a sleek design and powerful processor.' },
  { id: 'PROD002', name: 'Wireless Ergonomic Mouse', unitPrice: '$50.00', availableUnits: 200, description: 'Comfortable mouse for extended use, designed to reduce wrist strain.' },
  { id: 'PROD003', name: '34-inch Ultrawide Monitor', unitPrice: '$600.00', availableUnits: 30, description: 'Immersive display for productivity and gaming, offering stunning visuals.' },
  { id: 'PROD004', name: 'Mechanical Keyboard RGB', unitPrice: '$120.00', availableUnits: 100, description: 'Gaming keyboard with customizable RGB lighting and satisfying key presses.' },
  { id: 'PROD005', name: 'HD Webcam 1080p', unitPrice: '$70.00', availableUnits: 150, description: 'Crystal clear video calls and streaming with auto-focus and low-light correction.' },
  { id: 'PROD006', name: 'USB-C Hub Multiport', unitPrice: '$45.00', availableUnits: 180, description: 'Expand your laptop\'s connectivity with multiple ports for data, display, and charging.' },
  { id: 'PROD007', name: 'Noise-Cancelling Headphones', unitPrice: '$250.00', availableUnits: 75, description: 'Premium audio experience with active noise cancellation for undisturbed listening.' },
  { id: 'PROD008', name: 'Portable SSD 1TB', unitPrice: '$130.00', availableUnits: 90, description: 'Fast and reliable external storage solution for all your files.' },
  { id: 'PROD009', name: 'Smart Home Speaker', unitPrice: '$99.00', availableUnits: 120, description: 'Voice-controlled speaker with integrated AI assistant for smart home management.' },
  { id: 'PROD010', name: 'Travel Power Adapter Kit', unitPrice: '$35.00', availableUnits: 300, description: 'Universal power adapter with various plugs for international travel.' },
];

const App = () => {
  const [user, setUser] = useState(MOCK_AUTH_USER);
  const [view, setView] = useState({ screen: 'DASHBOARD', params: {} });
  const [isAuthenticated, setIsAuthenticated] = useState(true); // For prototype, start authenticated
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false); // State for mobile sidebar
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [products, setProducts] = useState(MOCK_PRODUCTS);

  const canAccess = (screen, action = 'canView') => {
    if (!user || !user.role) return false;
    const permissions = USER_PERMISSIONS[user.role];
    return permissions?.[action]?.includes(screen) || false;
  };

  useEffect(() => {
    // Simulate auth check on mount
    if (!isAuthenticated) {
      setView({ screen: 'LOGIN', params: {} });
    }
  }, [isAuthenticated]);

  const handleLogin = (credentials) => {
    // In a real app, this would involve API calls
    console.log('Attempting login with:', credentials);
    setIsAuthenticated(true);
    setUser(MOCK_AUTH_USER); // Assume successful login for prototype
    setView({ screen: 'DASHBOARD', params: {} });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setView({ screen: 'LOGIN', params: {} });
    setIsMobileSidebarOpen(false); // Close sidebar on logout
  };

  const handleNavClick = (screenName, params = {}) => {
    if (canAccess(screenName)) {
      setView({ screen: screenName, params });
      setIsMobileSidebarOpen(false); // Close sidebar after navigation on mobile
    } else {
      alert(`Access Denied: You do not have permission to view ${screenName}.`);
    }
  };

  const handleToggleMobileSidebar = () => {
    setIsMobileSidebarOpen(prev => !prev);
  };

  const handleCreateNewOrderClick = () => {
    if (canAccess('ORDERS', 'canEdit')) {
      setView({ screen: 'ORDERS', params: { mode: 'new' } });
      setIsMobileSidebarOpen(false);
    } else {
      alert('Access Denied: You do not have permission to create orders.');
    }
  };

  const handleSaveNewOrder = (newOrderData) => {
    // In a real app, this would involve an API call to save the order
    const newId = `ORD${String(orders.length + 1).padStart(3, '0')}`; // Simple ID generation
    const currentDate = new Date().toISOString().split('T')[0];
    const savedOrder = {
      id: newId,
      ...newOrderData,
      amount: `$${(parseFloat(newOrderData.amount)).toFixed(2)}`, // Format amount
      date: currentDate,
    };
    setOrders(prevOrders => [...prevOrders, savedOrder]);
    setView({ screen: 'ORDERS', params: {} }); // Go back to order list
  };

  const handleCancelNewOrder = () => {
    setView({ screen: 'ORDERS', params: {} }); // Go back to order list
  };


  // --- Mock Data for Dashboard ---
  const keyMetrics = [
    { title: 'Total Revenue', value: '$124,567', trend: '+12% vs last month', icon: '💰' },
    { title: 'New Orders', value: '1,234', trend: '+8% vs last month', icon: '📦' },
    { title: 'Active Users', value: '876', trend: '+5% vs last month', icon: '👤' },
    { title: 'Conversion Rate', value: '3.4%', trend: '-0.2% vs last month', icon: '📈' },
  ];

  const recentTransactions = [
    { id: 'T001', item: 'Product A', amount: '$49.99', status: 'Completed', date: '2023-10-26' },
    { id: 'T002', item: 'Service B', amount: '$199.00', status: 'Pending', date: '2023-10-25' },
    { id: 'T003', item: 'Product C', amount: '$12.50', status: 'Completed', date: '2023-10-25' },
    { id: 'T004', item: 'Product D', amount: '$24.99', status: 'Shipped', date: '2023-10-24' },
    { id: 'T005', item: 'Service E', amount: '$50.00', status: 'Cancelled', date: '2023-10-23' },
  ];

  // --- Utility Components (Simplified for prototype) ---
  const Card = ({ children, className = '', style = {} }) => (
    <div className={`card ${className}`} style={style}>
      {children}
    </div>
  );

  const Table = ({ data, columns }) => (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns?.map(col => <th key={col}>{col}</th>)}
          </tr>
        </thead>
        <tbody>
          {data?.map(row => (
            <tr key={row.id}>
              {Object.keys(row).filter(key => key !== 'id').map((key, index) => (
                <td key={`${row.id}-${key}`}>
                  {key === 'status' ? (
                    <span className={`status-badge ${row[key]?.toLowerCase()}`}>
                      {row[key]}
                    </span>
                  ) : (
                    row[key]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // --- Screen Components ---
  const DashboardScreen = () => (
    <div className="dashboard-content">
      <h1 style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--text-main)' }}>Dashboard Overview</h1>

      <div className="dashboard-grid">
        {/* Key Metrics */}
        <div className="metric-cards-container">
          {keyMetrics?.map((metric, index) => (
            <Card key={`metric-${index}`} className="metric-card">
              <span className="metric-icon">{metric.icon}</span>
              <div style={{ flexGrow: 1 }}>
                <h3 style={{ marginBottom: 'var(--spacing-xs)', color: 'var(--text-secondary)' }}>{metric.title}</h3>
                <p className="metric-value">{metric.value}</p>
                <p className={`metric-trend ${metric.trend.includes('-') ? 'negative' : 'positive'}`}>{metric.trend}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Sales Overview Chart (simple representation) */}
        <Card className="sales-overview-card">
          <h2 style={{ marginBottom: 'var(--spacing-md)', color: 'var(--text-main)' }}>Sales Overview (Q4)</h2>
          <div className="sales-chart">
            <div className="chart-bar" style={{ height: '70%', backgroundColor: 'var(--primary-color)' }} title="October Sales"></div>
            <div className="chart-bar" style={{ height: '85%', backgroundColor: 'var(--secondary-color)' }} title="November Sales"></div>
            <div className="chart-bar" style={{ height: '60%', backgroundColor: 'var(--accent-color)' }} title="December Sales"></div>
            <div className="chart-bar" style={{ height: '95%', backgroundColor: 'var(--primary-hover)' }} title="Q4 Target"></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 'var(--spacing-sm)', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
            <span>Target</span>
          </div>
        </Card>

        {/* Recent Transactions */}
        <Card className="recent-transactions-card">
          <h2 style={{ marginBottom: 'var(--spacing-md)', color: 'var(--text-main)' }}>Recent Transactions</h2>
          <Table data={recentTransactions} columns={['Item', 'Amount', 'Status', 'Date']} />
        </Card>
      </div>
    </div>
  );

  const ProductsScreen = ({ params, allProducts }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = allProducts?.filter(product =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="products-screen-container">
        <h1 style={{ color: 'var(--text-main)', marginBottom: 'var(--spacing-md)' }}>Product Catalog {params?.id ? `(ID: ${params.id})` : ''}</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>Browse and search through all available products in your inventory.</p>

        <div className="product-search-bar">
          <input
            type="text"
            placeholder="Search products by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="product-search-input"
          />
        </div>

        <Card className="product-list-card" style={{ marginTop: 'var(--spacing-lg)' }}>
          {filteredProducts?.length > 0 ? (
            <Table
              data={filteredProducts}
              columns={['Product Name', 'Unit Price', 'Available Units', 'Description']}
            />
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 'var(--spacing-md)' }}>No products found matching your search term: "{searchTerm}".</p>
          )}
        </Card>
      </div>
    );
  };

  const OrderList = ({ orders, onCreateNewOrder, canEditOrders }) => (
    <div>
      <div className="order-screen-header">
        <h1 style={{ color: 'var(--text-main)', margin: '0' }}>Orders</h1>
        {canEditOrders && (
          <button className="primary-button" onClick={onCreateNewOrder}>
            + New Order
          </button>
        )}
      </div>
      <Card className="order-list-card">
        <Table
          data={orders}
          columns={['Customer Name', 'Product', 'Quantity', 'Amount', 'Status', 'Date']}
        />
      </Card>
    </div>
  );

  const NewOrderForm = ({ onSave, onCancel }) => {
    const [customerName, setCustomerName] = useState('');
    const [product, setProduct] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [amount, setAmount] = useState('');
    const [status, setStatus] = useState('Pending');

    const handleSubmit = (e) => {
      e.preventDefault();
      if (parseFloat(amount) <= 0 || quantity <= 0) {
        alert('Amount and Quantity must be positive numbers.');
        return;
      }
      onSave({ customerName, product, quantity: parseInt(quantity), amount: parseFloat(amount), status });
    };

    return (
      <div className="new-order-form-container">
        <h1 style={{ color: 'var(--text-main)', marginBottom: 'var(--spacing-lg)' }}>Create New Order</h1>
        <Card>
          <form onSubmit={handleSubmit} className="new-order-form">
            <div className="form-group">
              <label htmlFor="customerName">Customer Name</label>
              <input
                id="customerName"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="product">Product</label>
              <input
                id="product"
                type="text"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="Enter product name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="amount">Amount ($)</label>
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 150.00"
                step="0.01"
                min="0.01"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Shipped">Shipped</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="button" className="secondary-button" onClick={onCancel}>Cancel</button>
              <button type="submit" className="primary-button">Create Order</button>
            </div>
          </form>
        </Card>
      </div>
    );
  };

  const OrdersScreen = ({ orders, currentView, onCreateNewOrder, onSaveNewOrder, onCancelNewOrder, canEditOrders }) => {
    if (currentView.params.mode === 'new') {
      return <NewOrderForm onSave={onSaveNewOrder} onCancel={onCancelNewOrder} />;
    }
    return <OrderList orders={orders} onCreateNewOrder={onCreateNewOrder} canEditOrders={canEditOrders} />;
  };

  const UsersScreen = () => (
    <div className="content-placeholder">
      <h1 style={{ color: 'var(--text-main)' }}>Users</h1>
      <p style={{ color: 'var(--text-secondary)' }}>Administer user accounts and roles.</p>
    </div>
  );

  const SettingsScreen = () => (
    <div className="content-placeholder">
      <h1 style={{ color: 'var(--text-main)' }}>Settings</h1>
      <p style={{ color: 'var(--text-secondary)' }}>Configure application settings.</p>
    </div>
  );

  const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      handleLogin({ username, password });
    };

    return (
      <div className="login-container">
        <Card className="login-form-card">
          <form onSubmit={handleSubmit} className="login-form">
            <h1>Login to Dashboard</h1>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit" className="login-button">Login</button>
          </form>
        </Card>
      </div>
    );
  };

  const renderScreen = () => {
    switch (view.screen) {
      case 'DASHBOARD':
        return <DashboardScreen />;
      case 'PRODUCTS':
        return <ProductsScreen params={view.params} allProducts={products} />;
      case 'ORDERS':
        return (
          <OrdersScreen
            orders={orders}
            currentView={view}
            onCreateNewOrder={handleCreateNewOrderClick}
            onSaveNewOrder={handleSaveNewOrder}
            onCancelNewOrder={handleCancelNewOrder}
            canEditOrders={canAccess('ORDERS', 'canEdit')}
          />
        );
      case 'SETTINGS':
        return <SettingsScreen />;
      case 'USERS':
        return <UsersScreen />;
      case 'LOGIN':
        return <LoginScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <div className="app-container">
      {isMobileSidebarOpen && <div className="overlay" onClick={handleToggleMobileSidebar}></div>}
      <div className={`sidebar ${isMobileSidebarOpen ? 'open' : ''}`}>
        <div>
          <div className="sidebar-header">
            Ocean View HQ
          </div>
          <ul className="nav-menu">
            {canAccess('DASHBOARD') && (
              <li className="nav-item">
                <button
                  onClick={() => handleNavClick('DASHBOARD')}
                  className={`nav-button ${view.screen === 'DASHBOARD' ? 'active' : ''}`}
                >
                  <span className="nav-button-icon">📊</span> Dashboard
                </button>
              </li>
            )}
            {canAccess('PRODUCTS') && (
              <li className="nav-item">
                <button
                  onClick={() => handleNavClick('PRODUCTS')}
                  className={`nav-button ${view.screen === 'PRODUCTS' ? 'active' : ''}`}
                >
                  <span className="nav-button-icon">📦</span> Products
                </button>
              </li>
            )}
            {canAccess('ORDERS') && (
              <li className="nav-item">
                <button
                  onClick={() => handleNavClick('ORDERS')}
                  className={`nav-button ${view.screen === 'ORDERS' ? 'active' : ''}`}
                >
                  <span className="nav-button-icon">📋</span> Orders
                </button>
              </li>
            )}
            {canAccess('USERS') && (
              <li className="nav-item">
                <button
                  onClick={() => handleNavClick('USERS')}
                  className={`nav-button ${view.screen === 'USERS' ? 'active' : ''}`}
                >
                  <span className="nav-button-icon">👥</span> Users
                </button>
              </li>
            )}
            {canAccess('SETTINGS') && (
              <li className="nav-item">
                <button
                  onClick={() => handleNavClick('SETTINGS')}
                  className={`nav-button ${view.screen === 'SETTINGS' ? 'active' : ''}`}
                >
                  <span className="nav-button-icon">⚙️</span> Settings
                </button>
              </li>
            )}
          </ul>
        </div>
        <div className="sidebar-footer">
          {user?.name && <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Logged in as {user.name} ({user.role})</p>}
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </div>
      <div className="main-content">
        <div className="header">
          <button className="sidebar-toggle-button" onClick={handleToggleMobileSidebar}>
            ☰
          </button>
          <h2 style={{ color: 'var(--text-main)' }}>{view.screen.charAt(0) + view.screen.slice(1).toLowerCase()}</h2>
          {user && (
            <div className="user-info">
              <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
              <span style={{ color: 'var(--text-secondary)' }}>{user.name}</span>
            </div>
          )}
        </div>
        {renderScreen()}
      </div>
    </div>
  );
};

export default App;