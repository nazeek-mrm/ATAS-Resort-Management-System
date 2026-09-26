<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminAuthController extends Controller
{
    public function login(Request $request) {
        $request->validate(['username' => 'required', 'password' => 'required']);
        $admin = Admin::where('username', $request->username)->first();
        if (!$admin) {
            return response()->json(['error' => 'Wrong username or password.'], 401);
        }
        $ok = Hash::check($request->password, $admin->password) || $admin->password === $request->password;
        if (!$ok) {
            return response()->json(['error' => 'Wrong username or password.'], 401);
        }
        $request->session()->put('admin_logged_in', true);
        $request->session()->put('admin_id', $admin->id);
        $request->session()->put('admin_username', $admin->username);
        return response()->json(['success' => true, 'username' => $admin->username]);
    }

    public function logout(Request $request) {
        $request->session()->flush();
        return response()->json(['success' => true]);
    }

    public function me(Request $request) {
        if (!$request->session()->get('admin_logged_in')) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        return response()->json(['username' => $request->session()->get('admin_username')]);
    }
}
