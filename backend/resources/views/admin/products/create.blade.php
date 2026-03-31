<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add Product - QUICK DELIVERY Admin</title>
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
        .form-control { width: 100%; padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 1rem; transition: border-color 0.3s; }
        .form-control:focus { outline: none; border-color: #667eea; }
        textarea.form-control { resize: vertical; min-height: 100px; }
        
        .btn { padding: 0.75rem 2rem; border: none; border-radius: 8px; font-size: 1rem; cursor: pointer; transition: all 0.3s; text-decoration: none; display: inline-block; }
        .btn-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); }
        .btn-secondary { background: #e2e8f0; color: #4a5568; }
        .btn-secondary:hover { background: #cbd5e0; }
        
        .error { color: #e53e3e; font-size: 0.875rem; margin-top: 0.25rem; }
        .image-preview { margin-top: 1rem; max-width: 200px; border-radius: 8px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1><i class="fas fa-plus-circle"></i> Add New Product</h1>
            <a href="{{ route('admin.dashboard') }}"><i class="fas fa-arrow-left"></i> Back to Dashboard</a>
        </div>

        <div class="form-container">
            <form action="{{ route('admin.products.store') }}" method="POST" enctype="multipart/form-data">
                @csrf
                
                <div class="form-group">
                    <label for="name">Product Name</label>
                    <input type="text" id="name" name="name" class="form-control" value="{{ old('name') }}" required>
                    @error('name')
                        <div class="error">{{ $message }}</div>
                    @enderror
                </div>

                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea id="description" name="description" class="form-control" required>{{ old('description') }}</textarea>
                    @error('description')
                        <div class="error">{{ $message }}</div>
                    @enderror
                </div>

                <div class="form-group">
                    <label for="price">Price ($)</label>
                    <input type="number" id="price" name="price" class="form-control" step="0.01" min="0" value="{{ old('price') }}" required>
                    @error('price')
                        <div class="error">{{ $message }}</div>
                    @enderror
                </div>

                <div class="form-group">
                    <label for="image">Product Image</label>
                    <input type="file" id="image" name="image" class="form-control" accept="image/*" required onchange="previewImage(this)">
                    @error('image')
                        <div class="error">{{ $message }}</div>
                    @enderror
                    <img id="imagePreview" class="image-preview" style="display: none;">
                </div>

                <div style="text-align: center; margin-top: 2rem;">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> Create Product
                    </button>
                    <a href="{{ route('admin.dashboard') }}" class="btn btn-secondary" style="margin-left: 1rem;">
                        <i class="fas fa-times"></i> Cancel
                    </a>
                </div>
            </form>
        </div>
    </div>

    <script>
        function previewImage(input) {
            const preview = document.getElementById('imagePreview');
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(input.files[0]);
            }
        }
    </script>
</body>
</html>