<!DOCTYPE html>
<html lang="fr" dir="ltr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialisation du mot de passe - Assistance KMY</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 450px;
            width: 100%;
            padding: 40px;
            animation: slideUp 0.5s ease;
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .logo {
            text-align: center;
            margin-bottom: 30px;
        }

        .logo h1 {
            color: #667eea;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 5px;
        }

        .logo p {
            color: #666;
            font-size: 14px;
        }

        .alert {
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 14px;
        }

        .alert-success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }

        .alert-error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }

        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            margin-bottom: 8px;
            color: #333;
            font-weight: 500;
            font-size: 14px;
        }

        input[type="email"],
        input[type="password"] {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e1e8ed;
            border-radius: 10px;
            font-size: 15px;
            transition: all 0.3s ease;
            background: #f8f9fa;
        }

        input[type="email"]:focus,
        input[type="password"]:focus {
            outline: none;
            border-color: #667eea;
            background: white;
            box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
        }

        input[readonly] {
            background: #e9ecef;
            cursor: not-allowed;
        }

        .error-message {
            color: #dc3545;
            font-size: 13px;
            margin-top: 5px;
        }

        button {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 10px;
        }

        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
        }

        button:active {
            transform: translateY(0);
        }

        .back-link {
            text-align: center;
            margin-top: 20px;
        }

        .back-link a {
            color: #667eea;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
        }

        .back-link a:hover {
            text-decoration: underline;
        }

        .password-requirements {
            background: #f8f9fa;
            padding: 12px;
            border-radius: 8px;
            margin-top: 10px;
            font-size: 13px;
            color: #666;
        }

        .password-requirements ul {
            margin-left: 20px;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <h1>🚑 Assistance KMY</h1>
            <p>Réinitialisation du mot de passe</p>
        </div>

        @if (session('status'))
            <div class="alert alert-success">
                {{ session('status') }}
            </div>
        @endif

        @if ($errors->any())
            <div class="alert alert-error">
                @foreach ($errors->all() as $error)
                    <div>{{ $error }}</div>
                @endforeach
            </div>
        @endif

        <form method="POST" action="{{ route('password.update') }}" id="resetForm">
            @csrf

            <input type="hidden" name="token" value="{{ $token }}">

            <div class="form-group">
                <label for="email">Adresse email</label>
                <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value="{{ $email ?? old('email') }}" 
                    readonly
                    required
                >
            </div>

            <div class="form-group">
                <label for="password">Nouveau mot de passe</label>
                <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    placeholder="Entrez votre nouveau mot de passe"
                    required
                    minlength="8"
                    autocomplete="new-password"
                >
                <div class="password-requirements">
                    <strong>Le mot de passe doit contenir :</strong>
                    <ul>
                        <li>Au moins 8 caractères</li>
                        <li>Une lettre majuscule et une minuscule</li>
                        <li>Au moins un chiffre</li>
                    </ul>
                </div>
            </div>

            <div class="form-group">
                <label for="password_confirmation">Confirmer le mot de passe</label>
                <input 
                    type="password" 
                    id="password_confirmation" 
                    name="password_confirmation" 
                    placeholder="Confirmez votre nouveau mot de passe"
                    required
                    minlength="8"
                    autocomplete="new-password"
                >
            </div>

            <button type="submit" id="submitBtn">
                Réinitialiser le mot de passe
            </button>
        </form>

        <div class="back-link">
            <a href="javascript:history.back()">← Retour</a>
        </div>
    </div>

    <script>
        // Check if passwords match
        const password = document.getElementById('password');
        const confirmation = document.getElementById('password_confirmation');
        const form = document.getElementById('resetForm');
        const submitBtn = document.getElementById('submitBtn');

        confirmation.addEventListener('input', function() {
            if (password.value !== confirmation.value) {
                confirmation.setCustomValidity('Les mots de passe ne correspondent pas');
            } else {
                confirmation.setCustomValidity('');
            }
        });

        password.addEventListener('input', function() {
            if (password.value !== confirmation.value && confirmation.value !== '') {
                confirmation.setCustomValidity('Les mots de passe ne correspondent pas');
            } else {
                confirmation.setCustomValidity('');
            }
        });

        // Handle form submission
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Réinitialisation en cours...';
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Redirect to success page
                    window.location.href = '{{ route("password.reset.success") }}';
                } else {
                    alert(result.message || 'Une erreur est survenue');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Réinitialiser le mot de passe';
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Une erreur est survenue. Veuillez réessayer.');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Réinitialiser le mot de passe';
            }
        });
    </script>
</body>
</html>
