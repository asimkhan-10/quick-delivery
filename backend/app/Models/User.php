<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory,HasApiTokens, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'location',
        'profile_photo',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Relationship: A user can have many saved locations
    public function locations()
    {
        return $this->hasMany(Location::class);
    }
}
