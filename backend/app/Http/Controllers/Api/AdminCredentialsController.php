<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminCredentialsController extends Controller
{
    public function update(Request $request) {
        $request->validate([
            'new_username'     => 'required|string|max:100',
            'new_password'     => 'required|string|min:4',
            'confirm_password' => 'required|same:new_password',
        ]);
        $adminId = $request->session()->get('admin_id');
        $admin = Admin::findOrFail($adminId);
        $admin->update(['username' => $request->new_username, 'password' => Hash::make($request->new_password)]);
        $request->session()->put('admin_username', $request->new_username);
        return response()->json(['success' => true, 'message' => 'Credentials updated!']);
    }
}
