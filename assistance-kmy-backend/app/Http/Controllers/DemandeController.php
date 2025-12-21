<?php

namespace App\Http\Controllers;

use App\Models\Demande;
use Illuminate\Http\Request;

class DemandeController extends Controller
{
    /**
     * Display a listing of demandes
     */
    public function index(Request $request)
    {
        $query = Demande::with('user');

        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by user if not admin
        if ($request->user()->role !== 'admin') {
            $query->where('user_id', $request->user()->id);
        }

        $demandes = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'demandes' => $demandes,
        ]);
    }

    /**
     * Store a new SOS demande
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'telephone' => 'required|string|max:20',
            'adresse' => 'required|string',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
        ]);

        $demande = Demande::create([
            'user_id' => $request->user()->id,
            'nom' => $validated['nom'],
            'prenom' => $validated['prenom'],
            'telephone' => $validated['telephone'],
            'adresse' => $validated['adresse'],
            'latitude' => $validated['latitude'] ?? null,
            'longitude' => $validated['longitude'] ?? null,
            'status' => 'pending',
        ]);

        // TODO: Send notification to admin (Firebase/Twilio)
        // This would be implemented with your notification service
        
        return response()->json([
            'success' => true,
            'message' => 'Demande SOS envoyée avec succès',
            'demande' => $demande,
        ], 201);
    }

    /**
     * Display the specified demande
     */
    public function show(Request $request, $id)
    {
        $demande = Demande::with('user')->findOrFail($id);

        // Check if user has permission to view this demande
        if ($request->user()->role !== 'admin' && $demande->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'demande' => $demande,
        ]);
    }

    /**
     * Update the status of a demande (admin only)
     */
    public function updateStatus(Request $request, $id)
    {
        // Check if user is admin
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé',
            ], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,accepted,done',
        ]);

        $demande = Demande::findOrFail($id);
        $demande->status = $validated['status'];
        $demande->save();

        // TODO: Send notification to user about status change
        
        return response()->json([
            'success' => true,
            'message' => 'Statut mis à jour avec succès',
            'demande' => $demande,
        ]);
    }
}
