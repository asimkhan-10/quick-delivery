<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('products')->insert([
            [
                'name' => 'Gourmet Burger',
                'description' => 'Juicy beef patty with fresh lettuce, tomatoes, and cheddar cheese.',
                'price' => 12.99,
                'image_url' => 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Pepperoni Pizza',
                'description' => 'Classic pizza topped with mozzarella cheese and pepperoni.',
                'price' => 18.50,
                'image_url' => 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Fresh Sushi Platter',
                'description' => 'A variety of fresh sushi and sashimi.',
                'price' => 24.00,
                'image_url' => 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Avocado Toast',
                'description' => 'Healthy artisanal avocado toast with poached eggs.',
                'price' => 9.50,
                'image_url' => 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Wireless Headphones',
                'description' => 'Noise-cancelling over-ear wireless headphones.',
                'price' => 199.99,
                'image_url' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Smart Watch',
                'description' => 'A smart watch to track your fitness and notifications.',
                'price' => 149.00,
                'image_url' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Running Shoes',
                'description' => 'Comfortable and lightweight running shoes for daily workouts.',
                'price' => 85.00,
                'image_url' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Coffee Beans',
                'description' => 'Freshly roasted arabica coffee beans.',
                'price' => 22.50,
                'image_url' => 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Matcha Green Tea',
                'description' => 'Premium organic matcha powder from Japan.',
                'price' => 30.00,
                'image_url' => 'https://images.unsplash.com/photo-1582793988951-9aed550c1154?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Organic Honey',
                'description' => 'Raw, unfiltered organic honey jar.',
                'price' => 15.00,
                'image_url' => 'https://images.unsplash.com/photo-1587049352847-4d4b1ed7b4d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Skincare Serum',
                'description' => 'Vitamin C serum for a radiant glowing skin.',
                'price' => 45.00,
                'image_url' => 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sunglasses',
                'description' => 'Stylish polarized sunglasses with UV protection.',
                'price' => 55.00,
                'image_url' => 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
