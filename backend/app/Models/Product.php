<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model {
    protected $fillable = ['name', 'description', 'price', 'image_url' , 'location'];

    public function getImageUrlAttribute($value)
    {
        // If value is a full URL (e.g. from seeder), return it
        if (filter_var($value, FILTER_VALIDATE_URL)) {
            return $value;
        }

        if ($value) {
            // Fix for Windows 403 issue: rewrite 'storage/' path to 'uploads/'
            $path = str_replace('storage/', 'uploads/', $value);
            
            // If path doesn't start with uploads/ and doesn't start with http, prepend uploads/
            if (!str_starts_with($path, 'uploads/') && !str_starts_with($path, 'http')) {
                $path = 'uploads/' . $path;
            }
            
            return asset($path);
        }
        return null;
    }
}
