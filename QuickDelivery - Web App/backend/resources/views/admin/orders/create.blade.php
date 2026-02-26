<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Order - QUICK DELIVERY Admin</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8fafc; }
        
        .container { max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
        .header { text-align: center; margin-bottom: 2rem; }
        .header h1 { color: #2d3748; font-size: 2rem; margin-bottom: 0.5rem; }
        .header a { color: #667eea; text-decoration: none; }
        
        .form-container { background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); padding: 2rem; }
        .form-group { margin-bottom: 1.5rem; }
        .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #4a5568; }
        .form-control { width: 100%; padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 1rem; }
        .form-control:focus { outline: none; border-color: #667eea; }
        
        .product-item { border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 1rem; }
        .product-img { width: 60px; height: 60px; border-radius: 8px; object-fit: cover; }
        .product-info { flex: 1; }
        .product-name { font-weight: 600; margin-bottom: 0.25rem; }
        .product-price { color: #38a169; font-weight: 600; }
        .quantity-input { width: 80px; padding: 0.5rem; border: 1px solid #e2e8f0; border-radius: 4px; text-align: center; }
        
        .btn { padding: 0.75rem 2rem; border: none; border-radius: 8px; font-size: 1rem; cursor: pointer; text-decoration: none; display: inline-block; }
        .btn-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .btn-secondary { background: #e2e8f0; color: #4a5568; }
        
        .total-section { background: #f7fafc; padding: 1.5rem; border-radius: 8px; margin-top: 2rem; }
        .total-row { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
        .total-final { font-weight: 700; font-size: 1.2rem; border-top: 2px solid #e2e8f0; padding-top: 0.5rem; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1><i class="fas fa-plus-circle"></i> Create New Order</h1>
            <a href="{{ route('admin.dashboard') }}"><i class="fas fa-arrow-left"></i> Back to Dashboard</a>
        </div>

        <div class="form-container">
            <form action="{{ route('admin.orders.store') }}" method="POST" id="orderForm">
                @csrf
                
                <div class="form-group">
                    <label for="user_id">Select Customer</label>
                    <select id="user_id" name="user_id" class="form-control" required>
                        <option value="">Choose a customer...</option>
                        @foreach($users as $user)
                            <option value="{{ $user->id }}">{{ $user->name }} ({{ $user->email }})</option>
                        @endforeach
                    </select>
                </div>

                <div class="form-group">
                    <label>Select Products</label>
                    <div id="products-container">
                        @foreach($products as $product)
                            <div class="product-item">
                                <img src="{{ asset($product->image_url) }}" alt="{{ $product->name }}" class="product-img">
                                <div class="product-info">
                                    <div class="product-name">{{ $product->name }}</div>
                                    <div class="product-price">${{ number_format($product->price, 2) }}</div>
                                </div>
                                <input type="number" 
                                       name="products[{{ $product->id }}][quantity]" 
                                       class="quantity-input" 
                                       min="0" 
                                       value="0" 
                                       data-price="{{ $product->price }}"
                                       onchange="updateTotal()">
                                <input type="hidden" name="products[{{ $product->id }}][id]" value="{{ $product->id }}">
                            </div>
                        @endforeach
                    </div>
                </div>

                <div class="total-section">
                    <div class="total-row">
                        <span>Subtotal:</span>
                        <span id="subtotal">$0.00</span>
                    </div>
                    <div class="total-row">
                        <span>Delivery Charge:</span>
                        <span>$10.00</span>
                    </div>
                    <div class="total-row total-final">
                        <span>Total:</span>
                        <span id="total">$10.00</span>
                    </div>
                </div>

                <div style="text-align: center; margin-top: 2rem;">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-shopping-cart"></i> Create Order
                    </button>
                    <a href="{{ route('admin.dashboard') }}" class="btn btn-secondary" style="margin-left: 1rem;">
                        <i class="fas fa-times"></i> Cancel
                    </a>
                </div>
            </form>
        </div>
    </div>

    <script>
        function updateTotal() {
            let subtotal = 0;
            const quantityInputs = document.querySelectorAll('.quantity-input');
            
            quantityInputs.forEach(input => {
                const quantity = parseInt(input.value) || 0;
                const price = parseFloat(input.dataset.price);
                subtotal += quantity * price;
            });
            
            const deliveryCharge = 10.00;
            const total = subtotal + deliveryCharge;
            
            document.getElementById('subtotal').textContent = '$' + subtotal.toFixed(2);
            document.getElementById('total').textContent = '$' + total.toFixed(2);
        }

        document.getElementById('orderForm').addEventListener('submit', function(e) {
            const quantityInputs = document.querySelectorAll('.quantity-input');
            let hasProducts = false;
            
            // Remove products with 0 quantity and check if any products selected
            quantityInputs.forEach(input => {
                if (parseInt(input.value) > 0) {
                    hasProducts = true;
                } else {
                    input.remove();
                    input.nextElementSibling.remove(); // Remove hidden input too
                }
            });
            
            if (!hasProducts) {
                e.preventDefault();
                alert('Please select at least one product');
                return false;
            }
        });
    </script>
</body>
</html>