<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminAuth
{
    public function handle(Request $request, Closure $next) {
        if (!$request->session()->get('admin_logged_in')) {
            return response()->json(['error' => 'Unauthorized. Please login.'], 401);
        }
        return $next($request);
    }
}
