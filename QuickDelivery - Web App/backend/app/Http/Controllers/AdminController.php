<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Location;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminController extends Controller
{
    public function dashboard()
    {
        $users = User::all();
        $locations = Location::with('user')->latest()->get();
        $products = Product::latest()->get();
        $orders = Order::with(['user', 'items.product'])->latest()->get();
        return view('admin.dashboard', compact('users', 'locations', 'products', 'orders'));
    }

    public function createProduct()
    {
        return view('admin.products.create');
    }

    public function storeProduct(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'image' => 'required|image|mimes:jpg,png,jpeg|max:2048'
        ]);

        $path = $request->file('image')->store('products', 'public');

        Product::create([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'image_url' => 'storage/' . $path,
        ]);

        return redirect()->route('admin.dashboard')->with('success', 'Product created successfully');
    }

    public function editProduct($id)
    {
        $product = Product::findOrFail($id);
        return view('admin.products.edit', compact('product'));
    }

    public function updateProduct(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|image|mimes:jpg,png,jpeg|max:2048'
        ]);

        $data = [
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
        ];

        if ($request->hasFile('image')) {
            if ($product->image_url && file_exists(public_path($product->image_url))) {
                unlink(public_path($product->image_url));
            }
            $path = $request->file('image')->store('products', 'public');
            $data['image_url'] = 'storage/' . $path;
        }

        $product->update($data);

        return redirect()->route('admin.dashboard')->with('success', 'Product updated successfully');
    }

    public function deleteUser($id)
    {
        User::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'User deleted successfully');
    }

    public function createUser()
    {
        return view('admin.users.create');
    }

    public function storeUser(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|string|min:6',
            'profile_photo' => 'nullable|image|mimes:jpg,png,jpeg|max:2048'
        ]);

        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => bcrypt($request->password)
        ];

        if ($request->hasFile('profile_photo')) {
            $path = $request->file('profile_photo')->store('profiles', 'public');
            $data['profile_photo'] = $path;
        }

        User::create($data);

        return redirect()->route('admin.dashboard')->with('success', 'User created successfully');
    }

    public function deleteLocation($id)
    {
        Location::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Location deleted successfully');
    }

    public function deleteProduct($id)
    {
        $product = Product::findOrFail($id);
        if ($product->image_url && file_exists(public_path($product->image_url))) {
            unlink(public_path($product->image_url));
        }
        $product->delete();
        return redirect()->back()->with('success', 'Product deleted successfully');
    }

    public function updateOrderStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:Order placed,confirmed,shipped,Out for delivery,Order delivered'
        ]);

        $order = Order::findOrFail($id);
        $order->update(['status' => $request->status]);
        
        return response()->json(['success' => true, 'message' => 'Order status updated successfully']);
    }

    public function createOrder()
    {
        $users = User::all();
        $products = Product::all();
        return view('admin.orders.create', compact('users', 'products'));
    }

    public function storeOrder(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id'
        ]);

        // Filter products with quantity > 0
        $selectedProducts = [];
        if ($request->has('products')) {
            foreach ($request->products as $productId => $productData) {
                if (isset($productData['quantity']) && $productData['quantity'] > 0) {
                    $selectedProducts[] = [
                        'id' => $productId,
                        'quantity' => $productData['quantity']
                    ];
                }
            }
        }

        if (empty($selectedProducts)) {
            return redirect()->back()->with('error', 'Please select at least one product');
        }

        $subTotal = 0;
        foreach ($selectedProducts as $productData) {
            $product = Product::find($productData['id']);
            $subTotal += $product->price * $productData['quantity'];
        }

        $deliveryCharge = 10.00;
        $order = Order::create([
            'user_id' => $request->user_id,
            'sub_total' => $subTotal,
            'delivery_charge' => $deliveryCharge,
            'total' => $subTotal + $deliveryCharge,
            'status' => 'Order placed'
        ]);

        foreach ($selectedProducts as $productData) {
            $product = Product::find($productData['id']);
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'quantity' => $productData['quantity'],
                'price' => $product->price
            ]);
        }

        return redirect()->route('admin.dashboard')->with('success', 'Order created successfully');
    }

    public function completeOrder(Request $request, $id)
    {
        $request->validate([
            'delivery_photo' => 'required|image|mimes:jpg,png,jpeg|max:2048',
            'signature' => 'required|image|mimes:jpg,png,jpeg|max:2048'
        ]);

        $order = Order::findOrFail($id);
        
        // Save delivery photo
        $photoPath = $request->file('delivery_photo')->store('deliveries', 'public');
        
        // Save signature image
        $signaturePath = $request->file('signature')->store('signatures', 'public');
        
        $order->update([
            'delivery_photo' => $photoPath,
            'signature' => $signaturePath,
            'status' => 'Order delivered'
        ]);

        return response()->json(['success' => true, 'message' => 'Order completed successfully']);
    }

    public function deleteOrder($id)
    {
        $order = Order::findOrFail($id);
        
        // Delete associated files
        if ($order->delivery_photo && Storage::disk('public')->exists($order->delivery_photo)) {
            Storage::disk('public')->delete($order->delivery_photo);
        }
        if ($order->signature && Storage::disk('public')->exists($order->signature)) {
            Storage::disk('public')->delete($order->signature);
        }
        
        $order->delete();
        return response()->json(['success' => true, 'message' => 'Order deleted successfully']);
    }
}