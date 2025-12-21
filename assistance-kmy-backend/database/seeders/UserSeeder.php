<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin KMY',
            'email' => 'admin@assistancekmy.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        // Create regular user for testing
        User::create([
            'name' => 'Test User',
            'email' => 'user@test.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
        ]);

        // Create mobile test user
        User::create([
            'name' => 'Mobile Test',
            'email' => 'mobile@test.com',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);
    }
}
