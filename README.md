<div align="center">
<img src="flappy-bird/assets/favicon.ico" width="96" alt="Flappy Bird" />

# Flappy Bird

Klasyczny *Flappy Bird* napisany w czystym JavaScripcie (HTML5 Canvas).
Klikaj, aby utrzymać ptaka w powietrzu, i przelatuj między rurami.
</div>

---

## 🚀 Uruchomienie

Gra korzysta z modułów ES, dlatego musi zostać uruchomiona przez lokalny serwer HTTP.
W zupełności wystarczy do tego **Python 3**.

Najpierw przejdź do katalogu z grą, a następnie uruchom serwer.

### Linux / macOS

```bash
cd flappy-bird
python3 -m http.server 8000
```

### Windows

```powershell
cd flappy-bird
python -m http.server 8000
```

Następnie otwórz w przeglądarce adres **<http://localhost:8000>**.

Aby zatrzymać serwer, wciśnij `Ctrl+C` w terminalu.