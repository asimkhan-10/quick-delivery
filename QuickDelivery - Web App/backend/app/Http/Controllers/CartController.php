<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller {

    // 1. GET CART ITEMS
    public function index() {
        $cartItems = Cart::with('product')->where('user_id', Auth::id())->get();

        $subTotal = $cartItems->sum(function($item) {
            return $item->product->price * $item->quantity;
        });

        $deliveryCharge = 10; // Fixed charge as per your UI

        return response()->json([
            'cart' => $cartItems,
            'sub_total' => $subTotal,
            'delivery_charge' => $deliveryCharge,
            'total' => $subTotal + $deliveryCharge
        ]);
    }

    // 2. ADD OR UPDATE QUANTITY
    public function store(Request $request) {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $cart = Cart::updateOrCreate(
            ['user_id' => Auth::id(), 'product_id' => $request->product_id],
            ['quantity' => $request->quantity]
        );

        return response()->json(['message' => 'Cart Updated', 'data' => $cart]);
    }

    // 3. REMOVE FROM CART (For Swipe-to-Delete)
    public function destroy($id) {
        Cart::where('user_id', Auth::id())->where('id', $id)->delete();
        return response()->json(['message' => 'Item removed from cart']);
    }
}
