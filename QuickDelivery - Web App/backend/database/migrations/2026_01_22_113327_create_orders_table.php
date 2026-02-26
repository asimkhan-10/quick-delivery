<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

           $table->foreignId('user_id')->constrained();
        $table->string('status')->default('Order placed'); // Order placed, confirmed, shipped, Out for delivery, Order delivered
        $table->decimal('sub_total', 8, 2);
        $table->decimal('delivery_charge', 8, 2)->default(10.00);
        $table->decimal('total', 8, 2);
        $table->string('delivery_photo')->nullable(); // For Orders Confirmation screen
        $table->string('signature')->nullable();      // For Orders Confirmation screen
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
