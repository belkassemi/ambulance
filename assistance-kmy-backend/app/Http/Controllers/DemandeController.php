<?php

namespace App\Http\Controllers;

use App\Models\Demande;
use App\Models\User;
use App\Notifications\NewSosNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;

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

        // Send notification to all admins
        $admins = User::where('role', 'admin')->get();
        Notification::send($admins, new NewSosNotification($demande));
        
        return response()->json([
            'success' => true,
            'message' => 'Demande SOS envoyée avec succès',
            'demande' => $demande,
        ], 201);
    }
/**
 * Store a new anonymous SOS demande (no authentication required)
 */
public function storeAnonyme(Request $request)
{
    try {
        $validated = $request->validate([
            'nom'      => 'required|string|max:255',
            'prenom'   => 'required|string|max:255',
            'telephone'=> 'required|string|max:20',
            'adresse'  => 'required|string|max:500',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude'=> 'nullable|numeric|between:-180,180',
        ]);

        $demande = Demande::create([
            'user_id'   => null, // anonymous
            'nom'       => $validated['nom'],
            'prenom'    => $validated['prenom'],
            'telephone' => $validated['telephone'],
            'adresse'   => $validated['adresse'],
            'latitude'  => $validated['latitude'] ?? null,
            'longitude' => $validated['longitude'] ?? null,
            'status'    => 'pending',
        ]);

        // Send notification to all admins
        $admins = User::where('role', 'admin')->get();
        Notification::send($admins, new NewSosNotification($demande));

        return response()->json([
            'success' => true,
            'message' => 'Demande SOS anonyme envoyée avec succès. Une ambulance a été alertée.',
            'demande' => [
                'id'        => $demande->id,
                'nom'       => $demande->nom,
                'prenom'    => $demande->prenom,
                'telephone' => $demande->telephone,
                'adresse'   => $demande->adresse,
                'status'    => $demande->status,
                'created_at'=> $demande->created_at->format('Y-m-d H:i:s'),
            ],
        ], 201);

    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'success' => false,
            'message' => 'Données invalides',
            'errors'  => $e->errors(),
        ], 422);
    } catch (\Exception $e) {
        // Log the error for debugging
        \Log::error('Anonymous SOS request failed: ' . $e->getMessage());

        return response()->json([
            'success' => false,
            'message' => 'Une erreur est survenue lors de l\'envoi de la demande. Veuillez réessayer.',
        ], 500);
    }
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

        $demande = Demande::find($id);

        if (!$demande) {
            return response()->json([
                'success' => false,
                'message' => 'Demande non trouvée (ID: ' . $id . ')',
            ], 404);
        }
        $demande->status = $validated['status'];
        $demande->save();

        return response()->json([
            'success' => true,
            'message' => 'Statut mis à jour avec succès',
            'demande' => $demande,
        ]);
    }

    /**
     * Delete a demande (Admin only)
     */
    public function destroy(Request $request, $id)
    {
        $demande = Demande::findOrFail($id);

        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $demande->delete();

        return response()->json([
            'success' => true,
            'message' => 'Demande supprimée avec succès',
        ]);
    }
}
