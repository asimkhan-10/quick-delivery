<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller {

    // 1. PLACE ORDER (From Cart Screen)
    public function placeOrder(Request $request) {
        return DB::transaction(function () {
            $userId = Auth::id();
            $cartItems = Cart::with('product')->where('user_id', $userId)->get();

            if ($cartItems->isEmpty()) return response()->json(['message' => 'Cart is empty'], 400);

            $subTotal = $cartItems->sum(fn($item) => $item->product->price * $item->quantity);
            $deliveryCharge = 10.00;

            $order = Order::create([
                'user_id' => $userId,
                'sub_total' => $subTotal,
                'delivery_charge' => $deliveryCharge,
                'total' => $subTotal + $deliveryCharge,
                'status' => 'Order placed'
            ]);

            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->product->price
                ]);
            }

            Cart::where('user_id', $userId)->delete(); // Clear cart after order

            return response()->json(['message' => 'Order Placed Successfully', 'order_id' => $order->id]);
        });
    }

    // 2. GET ORDERS LIST & TRACKING (For Orders screen)
    public function index() {
        $orders = Order::with('items.product')->where('user_id', Auth::id())->latest()->get();
        return response()->json($orders);
    }

    public function confirmDelivery(Request $request, $id) {
        \Illuminate\Support\Facades\Log::info('Confirm Request:', $request->all());
        \Illuminate\Support\Facades\Log::info('Confirm Files:', $request->allFiles());

        $request->validate([
            'delivery_photo' => 'required|image',
            'signature' => 'required' 
        ]);

        $order = Order::where('user_id', Auth::id())->findOrFail($id);

        $path = $request->file('delivery_photo')->store('deliveries', 'public');
        $signaturePath = $request->file('signature')->store('signatures', 'public');

        $order->update([
            'delivery_photo' => $path,
            'signature' => $signaturePath,
            'status' => 'Order delivered'
        ]);

        return response()->json(['message' => 'Delivery Confirmed']);
    }

    // 3. CANCEL ORDER
    public function cancel($id) {
        $order = Order::where('user_id', Auth::id())->findOrFail($id);
        
        if ($order->status !== 'Order placed' && $order->status !== 'Order confirmed') {
            return response()->json(['message' => 'Order cannot be cancelled at this stage'], 400);
        }

        $order->update(['status' => 'Cancelled']);

        return response()->json(['message' => 'Order Cancelled Successfully']);
    }
}
