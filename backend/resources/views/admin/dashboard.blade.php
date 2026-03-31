<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QUICK DELIVERY - Admin Dashboard</title>
    
    <!-- Dependencies -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdn.datatables.net/1.13.4/css/dataTables.bootstrap5.min.css" rel="stylesheet">
    <link href="https://cdn.datatables.net/buttons/2.3.6/css/buttons.bootstrap5.min.css" rel="stylesheet">

    <style>
        :root {
            --primary: #0c7ce6;
            --secondary: #6c757d;
            --success: #04BE5B;
            --danger: #ee2558;
            --warning: #ffc107;
            --light: #f5f5f5;
            --sidebar-width: 250px;
            --sidebar-collapsed: 70px;
            --header-height: 70px;
        }

        body {
            font-family: 'Comfortaa', cursive;
            background-color: var(--light);
            font-size: 15px;
            overflow-x: hidden;
        }

        /* Sidebar */
        .sidebar {
            width: var(--sidebar-width);
            height: 100vh;
            background: #fff;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 1000;
            transition: all 0.3s ease;
            box-shadow: 2px 0 10px rgba(0,0,0,0.05);
            display: flex;
            flex-direction: column;
        }

        .sidebar.collapsed {
            width: var(--sidebar-collapsed);
        }

        .sidebar-header {
            height: var(--header-height);
            display: flex;
            align-items: center;
            padding: 0 1.5rem;
            border-bottom: 1px solid rgba(0,0,0,0.05);
        }

        .sidebar.collapsed .sidebar-header {
            justify-content: center;
            padding: 0;
        }

        .logo-text {
            font-weight: 700;
            color: var(--primary);
            font-size: 1.2rem;
            white-space: nowrap;
            overflow: hidden;
            transition: opacity 0.3s;
        }

        .sidebar.collapsed .logo-text {
            display: none;
        }

        .sidebar-menu {
            padding: 1rem 0;
            flex: 1;
            overflow-y: auto;
        }

        .menu-item {
            display: flex;
            align-items: center;
            padding: 0.8rem 1.5rem;
            color: #555;
            text-decoration: none;
            transition: all 0.3s;
            position: relative;
            cursor: pointer;
        }

        .menu-item:hover, .menu-item.active {
            color: var(--primary);
            background: rgba(12, 124, 230, 0.05);
        }

        .menu-item.active::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            background: var(--primary);
            border-radius: 0 4px 4px 0;
        }

        .menu-icon {
            font-size: 1.2rem;
            width: 24px;
            text-align: center;
            margin-right: 1rem;
            transition: transform 0.3s;
        }
        
        .menu-item:hover .menu-icon {
            transform: scale(1.1);
        }

        .sidebar.collapsed .menu-item {
            justify-content: center;
            padding: 0.8rem 0;
        }

        .sidebar.collapsed .menu-icon {
            margin-right: 0;
        }

        .sidebar.collapsed .menu-text {
            display: none;
        }

        /* Main Content */
        .main-content {
            margin-left: var(--sidebar-width);
            padding: 2rem;
            padding-top: calc(var(--header-height) + 2rem);
            transition: all 0.3s ease;
        }

        .main-content.expanded {
            margin-left: var(--sidebar-collapsed);
        }

        /* Top Header */
        .top-header {
            position: fixed;
            top: 0;
            right: 0;
            left: var(--sidebar-width);
            height: var(--header-height);
            background: #fff;
            z-index: 900;
            padding: 0 2rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            transition: all 0.3s ease;
        }

        .top-header.expanded {
            left: var(--sidebar-collapsed);
        }

        .toggle-btn {
            background: none;
            border: none;
            font-size: 1.2rem;
            color: #555;
            cursor: pointer;
        }

        .page-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #333;
            margin: 0;
        }

        /* Cards */
        .stat-card {
            background: #fff;
            border-radius: 10px;
            padding: 1.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s, box-shadow 0.3s;
            border: none;
            height: 100%;
        }

        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .stat-icon-wrapper {
            width: 50px;
            height: 50px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            margin-bottom: 1rem;
        }

        .bg-primary-soft { background: rgba(12, 124, 230, 0.1); color: var(--primary); }
        .bg-success-soft { background: rgba(4, 190, 91, 0.1); color: var(--success); }
        .bg-danger-soft { background: rgba(238, 37, 88, 0.1); color: var(--danger); }
        .bg-warning-soft { background: rgba(255, 193, 7, 0.1); color: var(--warning); }

        .stat-value {
            font-size: 2rem;
            font-weight: 700;
            color: #333;
        }

        .stat-label {
            color: #777;
            font-size: 0.9rem;
        }

        /* Tables */
        .content-card {
            background: #fff;
            border-radius: 10px;
            padding: 1.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            margin-bottom: 2rem;
        }

        .table thead th {
            background-color: #f8f9fa;
            border-bottom: 2px solid #e9ecef;
            font-weight: 600;
            color: #555;
            padding: 1rem;
        }

        .table tbody td {
            vertical-align: middle;
            padding: 1rem;
            color: #444;
        }

        .status-badge {
            padding: 0.35em 0.8em;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
        }

        .status-placed { background-color: #ffebee; color: #c62828; }
        .status-confirmed { background-color: #e3f2fd; color: #1565c0; }
        .status-shipped { background-color: #e8f5e9; color: #2e7d32; }
        .status-out-for-delivery { background-color: #fff8e1; color: #f57f17; }
        .status-delivered, .status-order-delivered { background-color: #e8f5e9; color: #2e7d32; }
        .status-cancelled { background-color: #ffebee; color: #c62828; }

        .btn-action {
            width: 32px;
            height: 32px;
            padding: 0;
            border-radius: 6px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin: 0 2px;
            transition: all 0.2s;
        }

        .btn-primary { background-color: var(--primary); border-color: var(--primary); }
        .btn-primary:hover { background-color: #0a69c2; border-color: #0a69c2; }
        .btn-success { background-color: var(--success); border-color: var(--success); }
        .btn-danger { background-color: var(--danger); border-color: var(--danger); }

        /* Modals */
        .modal-content {
            border-radius: 10px;
            border: none;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        .modal-header {
            border-bottom: 1px solid #eee;
            padding: 1.5rem;
        }

        .modal-body {
            padding: 1.5rem;
        }

        .modal-title {
            font-weight: 700;
        }

        /* Timeline */
        .timeline {
            position: relative;
            padding-left: 30px;
        }

        .timeline::before {
            content: '';
            position: absolute;
            left: 7px;
            top: 5px;
            bottom: 5px;
            width: 2px;
            background: #e9ecef;
        }

        .timeline-item {
            position: relative;
            margin-bottom: 2rem;
        }

        .timeline-marker {
            position: absolute;
            left: -30px;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #fff;
            border: 3px solid #e9ecef;
            z-index: 2;
        }

        .timeline-item.completed .timeline-marker {
            border-color: var(--success);
            background: var(--success);
        }

        .timeline-item.active .timeline-marker {
            border-color: var(--primary);
            background: var(--primary);
            box-shadow: 0 0 0 3px rgba(12, 124, 230, 0.2);
        }

        .timeline-content h6 {
            font-weight: 700;
            margin-bottom: 0.25rem;
        }

        .timeline-content p {
            color: #777;
            font-size: 0.9rem;
            margin: 0;
        }

        /* Utilities */
        .img-avatar {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            object-fit: cover;
        }

        .img-thumbnail-sm {
            width: 50px;
            height: 50px;
            border-radius: 8px;
            object-fit: cover;
            cursor: pointer;
            transition: transform 0.2s;
        }
        
        .img-thumbnail-sm:hover {
            transform: scale(1.1);
        }

        /* Responsive */
        @media (max-width: 768px) {
            .sidebar { transform: translateX(-100%); width: 250px; }
            .sidebar.mobile-open { transform: translateX(0); }
            .main-content, .top-header { margin-left: 0 !important; left: 0 !important; width: 100% !important; }
            .logo-text { display: block !important; }
        }

        /* Loader */
        .page-loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255,255,255,0.9);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.5s;
        }
        
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid var(--primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <!-- Page Loader -->
    <div id="pageLoader" class="page-loader">
        <div class="spinner"></div>
    </div>

    <!-- Sidebar -->
    <div class="sidebar" id="sidebar">
        <div class="sidebar-header">
            <i class="fas fa-truck-fast fa-lg text-primary me-2"></i>
            <span class="logo-text">QUICK DELIVERY</span>
        </div>
        <div class="sidebar-menu">
            <div class="menu-item active" onclick="showSection('dashboard')" id="nav-dashboard">
                <i class="fas fa-chart-pie menu-icon"></i>
                <span class="menu-text">Dashboard</span>
            </div>
            <div class="menu-item" onclick="showSection('users')" id="nav-users">
                <i class="fas fa-users menu-icon"></i>
                <span class="menu-text">Users</span>
            </div>
            <div class="menu-item" onclick="showSection('orders')" id="nav-orders">
                <i class="fas fa-shopping-bag menu-icon"></i>
                <span class="menu-text">Orders</span>
            </div>
            <div class="menu-item" onclick="showSection('locations')" id="nav-locations">
                <i class="fas fa-map-marked-alt menu-icon"></i>
                <span class="menu-text">Locations</span>
            </div>
            <div class="menu-item" onclick="showSection('products')" id="nav-products">
                <i class="fas fa-box-open menu-icon"></i>
                <span class="menu-text">Products</span>
            </div>
        </div>
    </div>

    <!-- Top Header -->
    <div class="top-header" id="topHeader">
        <div class="d-flex align-items-center">
            <button class="toggle-btn me-3" onclick="toggleSidebar()">
                <i class="fas fa-bars"></i>
            </button>
            <h4 class="page-title" id="pageTitle">Overview</h4>
        </div>
        <div class="user-profile d-flex align-items-center">
            <div class="dropdown">
                <a href="#" class="d-flex align-items-center text-decoration-none dropdown-toggle text-dark" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src="https://ui-avatars.com/api/?name=Admin&background=0c7ce6&color=fff" alt="" width="32" height="32" class="rounded-circle me-2">
                    <strong>Admin</strong>
                </a>
                <ul class="dropdown-menu dropdown-menu-end text-small shadow" aria-labelledby="dropdownUser1">
                    <li><hr class="dropdown-divider"></li>
                    <li>
                        <form method="POST" action="{{ route('admin.logout') }}">
                            @csrf
                            <button type="submit" class="dropdown-item text-danger">Sign out</button>
                        </form>
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <!-- Main Content -->
    <div class="main-content" id="mainContent">
        
        @if(session('success'))
            <div class="alert alert-success alert-dismissible fade show shadow-sm border-0" role="alert">
                <i class="fas fa-check-circle me-2"></i> {{ session('success') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        @endif

        <!-- Dashboard Section -->
        <div id="dashboard" class="section-content">
            <div class="row g-4 mb-4">
                <div class="col-xl-3 col-md-6">
                    <div class="stat-card">
                        <div class="stat-icon-wrapper bg-primary-soft">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="stat-value">{{ $users->count() }}</div>
                        <div class="stat-label">Total Users</div>
                    </div>
                </div>
                <div class="col-xl-3 col-md-6">
                    <div class="stat-card">
                        <div class="stat-icon-wrapper bg-success-soft">
                            <i class="fas fa-shopping-cart"></i>
                        </div>
                        <div class="stat-value">{{ $orders->count() }}</div>
                        <div class="stat-label">Total Orders</div>
                    </div>
                </div>
                <!-- Add more stats if needed -->
                <div class="col-xl-3 col-md-6">
                    <div class="stat-card">
                        <div class="stat-icon-wrapper bg-warning-soft">
                            <i class="fas fa-map-marker-alt"></i>
                        </div>
                        <div class="stat-value">{{ $locations->count() }}</div>
                        <div class="stat-label">Active Locations</div>
                    </div>
                </div>
                <div class="col-xl-3 col-md-6">
                    <div class="stat-card">
                        <div class="stat-icon-wrapper bg-danger-soft">
                            <i class="fas fa-box"></i>
                        </div>
                        <div class="stat-value">{{ $products->count() }}</div>
                        <div class="stat-label">Total Products</div>
                    </div>
                </div>
            </div>

            <!-- Recent Orders Snippet (Optional - reusing logic) -->
            <div class="content-card">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h5 class="mb-0 fw-bold">Recent Activity</h5>
                    <button class="btn btn-sm btn-outline-primary" onclick="showSection('orders')">View All</button>
                </div>
                 <!-- Could insert a mini table here -->
            </div>
        </div>

        <!-- Users Section -->
        <div id="users" class="section-content" style="display:none;">
            <div class="content-card">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h5 class="mb-0 fw-bold">User Management</h5>
                </div>
                <div class="table-responsive">
                    <table class="table data-table w-100" id="usersTable">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Location</th>
                                <th>Joined</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($users as $user)
                            <tr>
                                <td>
                                    @if($user->profile_photo)
                                        <img src="{{ asset('uploads/' . $user->profile_photo) }}" alt="Profile" class="img-avatar">
                                    @else
                                        <div class="img-avatar bg-light d-flex align-items-center justify-content-center text-muted">
                                            <i class="fas fa-user"></i>
                                        </div>
                                    @endif
                                </td>
                                <td class="fw-bold">{{ $user->name }}</td>
                                <td>{{ $user->email }}</td>
                                <td>{{ $user->phone ?? 'N/A' }}</td>
                                <td>{{ $user->location ?? 'N/A' }}</td>
                                <td>{{ $user->created_at->format('M d, Y') }}</td>
                                <td>
                                    <form method="POST" action="{{ route('admin.delete-user', $user->id) }}" class="d-inline" onsubmit="return confirm('Delete this user?')">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="btn btn-danger btn-action btn-sm" title="Delete">
                                            <i class="fas fa-trash-alt"></i>
                                        </button>
                                    </form>
                                </td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Orders Section -->
        <div id="orders" class="section-content" style="display:none;">
            <div class="content-card">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h5 class="mb-0 fw-bold">Order Management</h5>
                </div>
                <div class="table-responsive">
                    <table class="table data-table w-100" id="ordersTable">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Summary</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Proof</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($orders as $order)
                            <tr>
                                <td><span class="fw-bold text-primary">#{{ $order->id }}</span></td>
                                <td>{{ $order->user->name ?? 'N/A' }}</td>
                                <td>
                                    <small class="text-muted">{{ $order->items->count() }} Items</small>
                                </td>
                                <td class="fw-bold text-success">${{ number_format($order->total, 2) }}</td>
                                <td>
                                    <span class="status-badge status-{{ strtolower(str_replace(' ', '-', $order->status)) }}">
                                        {{ $order->status }}
                                    </span>
                                </td>
                                <td>{{ $order->created_at->format('M d, Y') }}</td>
                                <td>
                                    <div class="d-flex gap-1">
                                        @if($order->delivery_photo)
                                            <img src="{{ asset('uploads/' . $order->delivery_photo) }}" class="img-thumbnail-sm" title="Delivery Photo" onclick="showImage(this.src)">
                                        @endif
                                        @if($order->signature)
                                            <img src="{{ asset('uploads/' . $order->signature) }}" class="img-thumbnail-sm" title="Signature" onclick="showImage(this.src)">
                                        @endif
                                        @if(!$order->delivery_photo && !$order->signature)
                                            <span class="text-muted small">No proof</span>
                                        @endif
                                    </div>
                                </td>
                                <td>
                                    <button onclick="showOrderTimeline({{ $order->id }}, '{{ addslashes($order->status) }}')" class="btn btn-secondary btn-action btn-sm me-1" title="Timeline">
                                        <i class="fas fa-route"></i>
                                    </button>
                                    <form method="POST" action="{{ route('admin.delete-order', $order->id) }}" class="d-inline" onsubmit="return deleteOrder(event, {{ $order->id }})">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="btn btn-danger btn-action btn-sm" title="Delete">
                                            <i class="fas fa-trash-alt"></i>
                                        </button>
                                    </form>
                                </td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Locations Section -->
        <div id="locations" class="section-content" style="display:none;">
            <div class="content-card">
                 <div class="d-flex justify-content-between align-items-center mb-4">
                    <h5 class="mb-0 fw-bold">Saved Locations</h5>
                </div>
                <div class="table-responsive">
                    <table class="table data-table w-100" id="locationsTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>User</th>
                                <th>Label</th>
                                <th>Address</th>
                                <th>Added</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($locations as $location)
                            <tr>
                                <td>{{ $location->id }}</td>
                                <td>{{ $location->user->name ?? 'N/A' }}</td>
                                <td><span class="badge bg-light text-dark">{{ $location->name }}</span></td>
                                <td class="text-truncate" style="max-width: 200px;" title="{{ $location->address }}">{{ $location->address }}</td>
                                <td>{{ $location->created_at->format('M d, Y') }}</td>
                                <td>
                                    <form method="POST" action="{{ route('admin.delete-location', $location->id) }}" class="d-inline" onsubmit="return confirm('Delete this location?')">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="btn btn-danger btn-action btn-sm">
                                            <i class="fas fa-trash-alt"></i>
                                        </button>
                                    </form>
                                </td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Products Section -->
        <div id="products" class="section-content" style="display:none;">
            <div class="content-card">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h5 class="mb-0 fw-bold">Product Catalog</h5>
                    <button onclick="openModal()" class="btn btn-primary btn-sm"><i class="fas fa-plus me-1"></i> Add Product</button>
                </div>
                <div class="table-responsive">
                    <table class="table data-table w-100" id="productsTable">
                        <thead>
                            <tr>
                                <th>Details</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Created</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($products as $product)
                            <tr>
                                <td>
                                    <div class="d-flex align-items-center">
                                        @if($product->image_url)
                                            <img src="{{ $product->image_url }}" alt="Product" class="img-thumbnail-sm me-3">
                                        @else
                                            <div class="img-thumbnail-sm bg-light d-flex align-items-center justify-content-center me-3 text-muted">
                                                <i class="fas fa-box"></i>
                                            </div>
                                        @endif
                                        <div>
                                            <div class="fw-bold">{{ $product->name }}</div>
                                            <small class="text-muted">ID: {{ $product->id }}</small>
                                        </div>
                                    </div>
                                </td>
                                <td class="text-truncate" style="max-width: 250px;">{{ $product->description }}</td>
                                <td class="fw-bold text-success">${{ number_format($product->price, 2) }}</td>
                                <td>{{ $product->created_at->format('M d, Y') }}</td>
                                <td>
                                    <a href="{{ route('admin.products.edit', $product->id) }}" class="btn btn-secondary btn-action btn-sm me-1">
                                        <i class="fas fa-edit"></i>
                                    </a>
                                    <form method="POST" action="{{ route('admin.delete-product', $product->id) }}" class="d-inline" onsubmit="return confirm('Delete this product?')">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="btn btn-danger btn-action btn-sm">
                                            <i class="fas fa-trash-alt"></i>
                                        </button>
                                    </form>
                                </td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    </div>

    <!-- Timeline Modal -->
    <div class="modal fade" id="timelineModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title"><i class="fas fa-route text-primary me-2"></i>Order Timeline #<span id="timelineOrderId"></span></h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="timeline" id="timelineContent">
                         <!-- Steps will be injected via JS -->
                         <div class="timeline-item">
                            <div class="timeline-marker" id="step-placed"></div>
                            <div class="timeline-content">
                                <h6 class="text-dark">Order Placed</h6>
                                <p>Order has been successfully placed</p>
                            </div>
                        </div>

                        <div class="timeline-item">
                            <div class="timeline-marker" id="step-confirmed"></div>
                            <div class="timeline-content">
                                <h6 class="text-dark">Order Confirmed</h6>
                                <p>Order is being prepared</p>
                                <div id="action-confirmed" class="mt-2" style="display:none;">
                                    <button onclick="updateTimelineStatus('confirmed')" class="btn btn-sm btn-primary">Confirm Order</button>
                                </div>
                            </div>
                        </div>

                        <div class="timeline-item">
                            <div class="timeline-marker" id="step-shipped"></div>
                            <div class="timeline-content">
                                <h6 class="text-dark">Order Shipped</h6>
                                <p>Package is on the way</p>
                                <div id="action-shipped" class="mt-2" style="display:none;">
                                    <button onclick="updateTimelineStatus('shipped')" class="btn btn-sm btn-primary">Mark Shipped</button>
                                </div>
                            </div>
                        </div>

                        <div class="timeline-item">
                            <div class="timeline-marker" id="step-delivery"></div>
                            <div class="timeline-content">
                                <h6 class="text-dark">Out for Delivery</h6>
                                <p>Rider has picked up the order</p>
                                <div id="action-delivery" class="mt-2" style="display:none;">
                                    <button onclick="updateTimelineStatus('Out for delivery')" class="btn btn-sm btn-primary">Start Delivery</button>
                                </div>
                            </div>
                        </div>

                        <div class="timeline-item">
                            <div class="timeline-marker" id="step-delivered"></div>
                            <div class="timeline-content">
                                <h6 class="text-dark">Order Delivered</h6>
                                <p>Successfully delivered to customer</p>
                                <div id="action-delivered" class="mt-2" style="display:none;">
                                     <div class="card bg-light border-0 p-3">
                                        <h6 class="fw-bold mb-3">Delivery Confirmation</h6>
                                        <form id="deliveryForm" enctype="multipart/form-data">
                                            <div class="row g-3">
                                                <div class="col-md-6">
                                                    <label class="form-label small fw-bold">Photo Proof</label>
                                                    <input type="file" id="deliveryPhoto" accept="image/*" class="form-control form-control-sm" onchange="previewDeliveryPhoto(this)">
                                                    <img id="photoPreview" class="mt-2 rounded" style="max-height: 100px; display:none;">
                                                </div>
                                                <div class="col-md-6">
                                                    <label class="form-label small fw-bold">Signature</label>
                                                    <input type="file" id="signatureFile" accept="image/*" class="form-control form-control-sm" onchange="previewSignature(this)">
                                                    <img id="signaturePreview" class="mt-2 rounded" style="max-height: 100px; display:none;">
                                                </div>
                                            </div>
                                            <button type="button" onclick="completeDelivery()" class="btn btn-success btn-sm w-100 mt-3">Complete Delivery</button>
                                        </form>
                                     </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Add Product Modal -->
    <div class="modal fade" id="addProductModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title"><i class="fas fa-plus-circle text-primary me-2"></i> Add Product</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                     <form action="{{ route('admin.products.store') }}" method="POST" enctype="multipart/form-data">
                        @csrf
                        <div class="mb-3">
                            <label class="form-label">Product Name</label>
                            <input type="text" name="name" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Description</label>
                            <textarea name="description" class="form-control" rows="3" required></textarea>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Price ($)</label>
                            <input type="number" name="price" class="form-control" step="0.01" min="0" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Product Image</label>
                            <input type="file" name="image" class="form-control" accept="image/*" required onchange="previewImage(this)">
                            <img id="imagePreview" class="mt-2 rounded w-100" style="max-height: 200px; object-fit: contain; display:none;">
                        </div>
                        <div class="d-grid">
                            <button type="submit" class="btn btn-primary">Create Product</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Image Preview Modal -->
    <div class="modal fade" id="imageModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content bg-transparent border-0 shadow-none">
                <div class="modal-body text-center p-0">
                    <img id="modalImage" class="img-fluid rounded shadow-lg" style="max-height: 85vh;">
                    <button type="button" class="btn-close btn-close-white position-absolute top-0 end-0 m-3" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.4/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.4/js/dataTables.bootstrap5.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/2.3.6/js/dataTables.buttons.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js"></script>
    <script src="https://cdn.datatables.net/buttons/2.3.6/js/buttons.html5.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/2.3.6/js/buttons.print.min.js"></script>

    <script>
        // Init DataTables
        $(document).ready(function() {
            setTimeout(function() {
                $('#pageLoader').fadeOut();
            }, 500);

            $('.data-table').DataTable({
                dom: 'Bfrtip',
                buttons: [
                    'copy', 'csv', 'excel', 'pdf', 'print'
                ],
                language: {
                    search: "_INPUT_",
                    searchPlaceholder: "Search records..."
                },
                pageLength: 10,
                lengthChange: false
            });

            // Restore section
            const currentSection = localStorage.getItem('currentSection') || 'dashboard';
            showSection(currentSection);
        });

        // Sidebar Toggle
        function toggleSidebar() {
            $('.sidebar').toggleClass('collapsed');
            $('.main-content').toggleClass('expanded');
            $('.top-header').toggleClass('expanded');
        }

        // Section Navigation
        function showSection(sectionId) {
            $('.section-content').hide();
            $('#' + sectionId).fadeIn(300);
            
            $('.menu-item').removeClass('active');
            $('#nav-' + sectionId).addClass('active');
            
            // Update Title
            const titles = {
                'dashboard': 'Overview',
                'users': 'User Management',
                'orders': 'Order Management',
                'locations': 'Locations',
                'products': 'Product Catalog'
            };
            $('#pageTitle').text(titles[sectionId] || 'Dashboard');
            
            localStorage.setItem('currentSection', sectionId);
        }

        // Modals
        const addProductModal = new bootstrap.Modal(document.getElementById('addProductModal'));
        const timelineModal = new bootstrap.Modal(document.getElementById('timelineModal'));
        const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));

        function openModal() {
            addProductModal.show();
        }
        
        function showImage(src) {
            $('#modalImage').attr('src', src);
            imageModal.show();
        }

        // Image Previews
        function previewImage(input) {
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    $('#imagePreview').attr('src', e.target.result).show();
                }
                reader.readAsDataURL(input.files[0]);
            }
        }
        
        function previewDeliveryPhoto(input) {
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    $('#photoPreview').attr('src', e.target.result).show();
                }
                reader.readAsDataURL(input.files[0]);
            }
        }

        function previewSignature(input) {
             if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    $('#signaturePreview').attr('src', e.target.result).show();
                }
                reader.readAsDataURL(input.files[0]);
            }
        }

        // Timeline Logic
        let currentOrderId = null;

        function showOrderTimeline(orderId, currentStatus) {
            currentOrderId = orderId;
            $('#timelineOrderId').text(orderId);
            
            const steps = ['placed', 'confirmed', 'shipped', 'delivery', 'delivered'];
            const statuses = ['Order placed', 'Order confirmed', 'shipped', 'Out for delivery', 'Order delivered']; // Normalized via DB
            
            // Reset UI
            $('.timeline-item').removeClass('active completed');
            $('.timeline-marker').css({'background': '#fff', 'border-color': '#e9ecef'});
            $('[id^="action-"]').hide();

            // Find index - Helper to normalize status match
            let normalizeStatus = (s) => s.toLowerCase().replace('order ', '');
            let currentNorm = normalizeStatus(currentStatus);
            
            let statusMap = {
                'placed': 0,
                'confirmed': 1,
                'shipped': 2,
                'out for delivery': 3,
                'delivered': 4
            };
            
            let currentIndex = statusMap[currentNorm] !== undefined ? statusMap[currentNorm] : -1;
            
            // Should verify exact string match from DB if possible, simplistic fallback:
            if(currentStatus === 'Order placed') currentIndex = 0;
            if(currentStatus === 'Order confirmed') currentIndex = 1;
            if(currentStatus === 'shipped') currentIndex = 2;
            if(currentStatus === 'Out for delivery') currentIndex = 3;
            if(currentStatus === 'Order delivered') currentIndex = 4;


            steps.forEach((step, index) => {
                let el = $('#step-' + step).parent();
                let marker = $('#step-' + step);
                
                if (index <= currentIndex) {
                    el.addClass('completed');
                }
                if (index === currentIndex + 1) {
                    el.addClass('active');
                    $('#action-' + step).show();
                }
            });

            timelineModal.show();
        }

        function updateTimelineStatus(status) {
            if (confirm('Update status to: ' + status + '?')) {
                fetch(`/admin/orders/${currentOrderId}/status`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': '{{ csrf_token() }}'
                    },
                    body: JSON.stringify({ status: status })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        timelineModal.hide();
                        // Update UI dynamically instead of reloading
                        let row = $(`#ordersTable span`).filter(function() {
                            return $(this).text().trim() === '#' + currentOrderId;
                        }).closest('tr');
                        if (row.length) {
                            let badge = row.find('.status-badge');
                            badge.removeClass(function(index, className) {
                                return (className.match(/(^|\s)status-\S+/g) || []).join(' ');
                            });
                            let normalizedStatus = status.toLowerCase().replace(/ /g, '-');
                            badge.addClass(`status-${normalizedStatus}`).text(status);
                            
                            let btn = row.find('button[title="Timeline"]');
                            btn.attr('onclick', `showOrderTimeline(${currentOrderId}, '${status.replace(/'/g, "\\'")}')`);
                        }
                    } else {
                        alert('Error updating status');
                    }
                });
            }
        }

        function completeDelivery() {
            const photo = document.getElementById('deliveryPhoto').files[0];
            const signature = document.getElementById('signatureFile').files[0];
            
            if (!photo || !signature) {
                alert('Please upload both photo and signature');
                return;
            }

            const formData = new FormData();
            formData.append('delivery_photo', photo);
            formData.append('signature', signature);
            formData.append('_token', '{{ csrf_token() }}');

            fetch(`/admin/orders/${currentOrderId}/complete`, {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                 if (data.success) {
                    alert('Order completed!');
                    timelineModal.hide();
                    
                    let row = $(`#ordersTable span`).filter(function() {
                        return $(this).text().trim() === '#' + currentOrderId;
                    }).closest('tr');
                    if (row.length) {
                        let badge = row.find('.status-badge');
                        badge.removeClass(function(index, className) {
                            return (className.match(/(^|\s)status-\S+/g) || []).join(' ');
                        });
                        badge.addClass('status-order-delivered').text('Order delivered');
                        
                        let btn = row.find('button[title="Timeline"]');
                        btn.attr('onclick', `showOrderTimeline(${currentOrderId}, 'Order delivered')`);
                    }
                } else {
                    alert('Error completing order');
                }
            });
        }

        function deleteOrder(e, id) {
            e.preventDefault();
            if(confirm('Delete this order?')) {
                fetch(`/admin/orders/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': '{{ csrf_token() }}'
                    }
                })
                .then(res => res.json())
                .then(data => {
                    if(data.success) {
                        let row = $(e.target).closest('tr');
                        $('#ordersTable').DataTable().row(row).remove().draw();
                    } else {
                        alert('Error deleting order');
                    }
                });
            }
        }
    </script>
</body>
</html>