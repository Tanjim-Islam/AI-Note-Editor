<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Note Editor</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 400px;
            width: 90%;
        }
        .header {
            margin-bottom: 2rem;
        }
        .header h1 {
            color: #333;
            margin: 0;
            font-size: 2rem;
        }
        .user-info {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 2rem;
        }
        .user-info img {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            margin-bottom: 1rem;
        }
        .user-info h2 {
            margin: 0.5rem 0;
            color: #333;
            font-size: 1.2rem;
        }
        .user-info p {
            margin: 0;
            color: #666;
        }
        .logout-btn {
            background: #dc3545;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1rem;
            text-decoration: none;
            display: inline-block;
            transition: background-color 0.3s;
        }
        .logout-btn:hover {
            background: #c82333;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📝 Note Editor</h1>
        </div>
        
        <div class="user-info">
            @if(auth()->user()->avatar)
                <img src="{{ auth()->user()->avatar }}" alt="Profile Picture">
            @endif
            <h2>Welcome, {{ auth()->user()->name }}!</h2>
            <p>{{ auth()->user()->email }}</p>
        </div>
        
        <p>You have successfully logged in with Google OAuth!</p>
        
        <form method="POST" action="{{ route('logout') }}">
            @csrf
            <button type="submit" class="logout-btn">Logout</button>
        </form>
    </div>
</body>
</html>