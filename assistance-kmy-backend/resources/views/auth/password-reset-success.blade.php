<!DOCTYPE html>
<html lang="fr" dir="ltr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mot de passe réinitialisé - Assistance KMY</title>
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
            text-align: center;
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

        .success-icon {
            font-size: 64px;
            margin-bottom: 20px;
            animation: bounce 1s ease;
        }

        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-20px);
            }
            60% {
                transform: translateY(-10px);
            }
        }

        h1 {
            color: #333;
            font-size: 24px;
            margin-bottom: 15px;
        }

        p {
            color: #666;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 30px;
        }

        .button {
            display: inline-block;
            padding: 14px 32px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            transition: all 0.3s ease;
        }

        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
        }

        .app-info {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e1e8ed;
            color: #999;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="success-icon">✅</div>
        <h1>Mot de passe réinitialisé avec succès!</h1>
        <p>
            Votre mot de passe a été modifié avec succès.<br>
            Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
        </p>
        <a href="#" class="button" onclick="closeWindow()">Retourner à l'application</a>
        <div class="app-info">
            Ouvrez l'application Assistance KMY et connectez-vous
        </div>
    </div>

    <script>
        // Try to communicate with mobile app or close window
        function closeWindow() {
            // Try to send message to React Native WebView
            if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage('PASSWORD_RESET_SUCCESS');
            }
            
            // Try to close window (works if opened by JS)
            window.close();
            
            // If can't close, redirect to homepage
            setTimeout(() => {
                window.location.href = 'about:blank';
            }, 1000);
        }

        // Auto-close after 3 seconds
        setTimeout(() => {
            closeWindow();
        }, 3000);
    </script>
</body>
</html>
