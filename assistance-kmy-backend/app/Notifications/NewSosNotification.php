<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use App\Models\Demande;
use Kreait\Laravel\Firebase\Notifications\FirebaseMessage;

class NewSosNotification extends Notification
{
    use Queueable;

    public $demande;

    public function __construct($demande)
    {
        $this->demande = $demande;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toFirebase($notifiable)
    {
        return FirebaseMessage::create()
            ->title('Nouvelle demande SOS !')
            ->body("{$this->demande->prenom} {$this->demande->nom} a demandé une ambulance à {$this->demande->adresse}")
            ->data([
                'demande_id' => (string)$this->demande->id,
                'type' => 'new_sos',
            ]);
    }

    public function toArray($notifiable)
    {
        return [
            'demande_id' => $this->demande->id,
            'prenom' => $this->demande->prenom,
            'nom' => $this->demande->nom,
            'telephone' => $this->demande->telephone,
            'adresse' => $this->demande->adresse,
            'type' => 'new_sos',
        ];
    }
}
