<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller {

    public function register(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'location' => 'required|string',
            'phone' => 'required|string|digits:11',
            'password' => 'required|min:6|confirmed', 
            'profile_photo' => 'nullable|image|mimes:jpeg,webp,png,jpg|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        
        $photoPath = null;
        if ($request->hasFile('profile_photo')) {
            $photoPath = $request->file('profile_photo')->store('profile_photos', 'public');
        }

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'location' => $request->location,
            'phone' => $request->phone,
            'profile_photo' => $photoPath,
            'password' => Hash::make($request->password),
        ]);

        return response()->json(['message' => 'Account Created Successfully']);
    }

    public function login(Request $request) {
        $user = User::where('email', $request->email)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid Login'], 401);
        }

        $token = $user->createToken('quick_delivery_token')->plainTextToken;
        return response()->json([
            'token' => $token,
            'user' => $user
        ]);
    }

    public function sendOtp(Request $request) {
        $request->validate(['email' => 'required|email']);
        $code = rand(1000, 9999); // 4-digit code as per UI

        DB::table('password_otps')->updateOrInsert(
            ['email' => $request->email],
            ['otp_code' => $code, 'created_at' => now()]
        );

        Mail::raw("Your Quick Delivery code is $code", function($m) use ($request) {
            $m->to($request->email)->subject('Verification Code');
        });

        return response()->json(['message' => 'Code Sent']);
    }

    public function verifyOtp(Request $request) {
        $check = DB::table('password_otps')
            ->where('email', $request->email)
            ->where('otp_code', $request->otp)
            ->first();

        return $check
            ? response()->json(['message' => 'Verified'])
            : response()->json(['message' => 'Invalid OTP'], 400);
    }

    public function resetPassword(Request $request) {
        $request->validate([
            'email' => 'required|email|exists:users',
            'password' => 'required|min:6|confirmed' // Matches "New Password" screen
        ]);

        User::where('email', $request->email)->update([
            'password' => Hash::make($request->password)
        ]);

        DB::table('password_otps')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Password Updated']);
    }
}
