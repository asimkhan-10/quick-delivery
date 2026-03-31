<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Location;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller {

    // 1. GET PROFILE DATA
    public function index() {
        $user = User::with('locations')->find(Auth::id());
        return response()->json($user);
    }

    // 2. UPDATE PROFILE
    public function update(Request $request) {
        $user = Auth::user();

        $request->validate([
            'name' => 'string|max:255',
            'email' => 'email|unique:users,email,'.$user->id,
            'location' => 'string',
            'password' => 'nullable|min:6|confirmed',
            'profile_photo' => 'nullable|image|mimes:jpg,png,jpeg'
        ]);

        if ($request->hasFile('profile_photo')) {
            $path = $request->file('profile_photo')->store('profiles', 'public');
            $user->profile_photo = $path;
        }

        $user->name = $request->name ?? $user->name;
        $user->email = $request->email ?? $user->email;
        $user->location = $request->location ?? $user->location;

        if ($request->password) {
            $user->password = Hash::make($request->password);
        }

        $user->save();
        return response()->json(['message' => 'Profile Updated', 'user' => $user]);
    }

    // 3. ADD NEW LOCATION
    public function addLocation(Request $request) {
        $request->validate([
            'name' => 'required|string',
            'address' => 'required|string',
            'description' => 'nullable|string'
        ]);

        $location = Location::create([
            'user_id' => Auth::id(),
            'name' => $request->name,
            'address' => $request->address,
            'description' => $request->description ?? ''
        ]);

        return response()->json(['message' => 'Location Added', 'data' => $location]);
    }
}
