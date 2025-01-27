from flask import Flask, send_from_directory, jsonify, url_for, request, render_template, redirect
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
import cx_Oracle

login_manager = LoginManager()

# Inicjalizacja aplikacji Flask
app = Flask(__name__, static_folder='music-app/build', static_url_path='')

# Parametry połączenia z bazą danych
DB_HOST = 'localhost'
DB_PORT = 1521  # Domyślny port Oracle
DB_USER = 'SYSTEM'
DB_PASSWORD = 'testowe'

# Funkcja do nawiązywania połączenia z bazą danych Oracle
def get_db_connection():
    dsn = cx_Oracle.makedsn(DB_HOST, DB_PORT, sid="xe")
    connection = cx_Oracle.connect(DB_USER, DB_PASSWORD, dsn)
    print("Połączenie z bazą danych zostało nawiązane")
    return connection

# Sprawdzenie ścieżki folderu statycznego
print("Ścieżka folderu statycznego:", app.static_folder)

# Ustawienie klucza sekretnego dla aplikacji Flask
app.config['SECRET_KEY']= '1234'

# Inicjalizacja LoginManager i ustawienie strony logowania
login_manager = LoginManager(app)
login_manager.login_view='login'

# Klasa reprezentująca użytkownika
class User(UserMixin):
    def __init__(self, username):
        self.id = username  # Używamy nazwy użytkownika jako ID

# Funkcja ładowania użytkownika z bazy danych
@login_manager.user_loader
def load_user(user_id):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # Zapytanie sprawdzające, czy użytkownik istnieje w bazie
        query = "SELECT USERNAME FROM SYSTEM.USERS WHERE USERNAME = :user_id"
        cursor.execute(query, user_id=user_id)
        user_record = cursor.fetchone()

        if user_record:
            print(f"Użytkownik '{user_id}' znaleziony w bazie")  # Logowanie debugowe
            return User(user_id)  # Tworzymy i zwracamy obiekt User
        else:
            print(f"Użytkownik '{user_id}' nie znaleziony w bazie")  # Logowanie debugowe
            return None

    except Exception as e:
        print(f"Błąd w load_user: {e}")  # Logowanie błędów
        return None
    finally:
        cursor.close()
        connection.close()

# Obsługuje endpoint do przesyłania ocen
@app.route('/api/submit-rating', methods=['POST'])
def submit_rating():
    data = request.get_json()
    rating = data.get('rating')
    title = data.get('title')

    # Sprawdzanie, czy ocena i tytuł są obecne
    if rating is None or title is None:
        return jsonify({'message': 'Ocena i tytuł są wymagane'}), 400

    # Sprawdzanie, czy ocena jest w prawidłowym zakresie
    if int(rating) < 1 or int(rating) > 5:
        return jsonify({'message': 'Ocena musi być w zakresie od 1 do 5'}), 400

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # Użycie zapytania z parametrami w celu uniknięcia SQL Injection
        query = f"UPDATE SYSTEM.TRACKS SET RATING = '{rating}' WHERE TRACKS.TITLE = '{title}'"
        print(query)
        cursor.execute(query)
        connection.commit()

        return jsonify({'message': 'Ocena została przesłana pomyślnie'}), 200
    except Exception as e:
        print(f"Błąd: {e}")  # Logowanie błędów
        connection.rollback()
        return jsonify({'message': 'Wystąpił błąd podczas przesyłania oceny'}), 500
    finally:
        cursor.close()
        connection.close()

# Obsługuje endpoint do usuwania playlisty
@app.route('/api/remove-playlist', methods=['POST'])
def remove_playlist():
    data = request.get_json()
    print(data)
    new_name = data.get('title')

    # Sprawdzanie, czy podano nazwę playlisty
    if new_name is None:
        return jsonify({'message': 'Nazwa playlisty jest wymagana'}), 400

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # Usunięcie playlisty z bazy
        query = f"DELETE FROM PLAYLISTS WHERE TITLE='{new_name}'"
        print(query)
        cursor.execute(query)
        connection.commit()
        return jsonify({'message': 'Playlista została usunięta pomyślnie'}), 200
    except Exception as e:
        print(f"Błąd: {e}")  # Logowanie błędów
        connection.rollback()
        return jsonify({'message': 'Wystąpił błąd podczas usuwania playlisty'}), 500
    finally:
        cursor.close()
        connection.close()

# Obsługuje endpoint do dodawania nowej playlisty
@app.route('/api/submit-new-playlist', methods=['POST'])
def submit_playlist():
    data = request.get_json()
    print(data)
    new_name = data.get('title')

    # Sprawdzanie, czy podano nazwę playlisty
    if new_name is None:
        return jsonify({'message': 'Nazwa playlisty jest wymagana'}), 400

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # Dodanie nowej playlisty do bazy
        query = f"INSERT INTO PLAYLISTS (PLAYLIST_ID,USER_ID,TITLE,PRIVACY) values (playlist_id_seq.NEXTVAL,(SELECT USER_ID FROM USERS WHERE USERNAME='{current_user.id}'),'{new_name}','public')"
        print(query)
        cursor.execute(query)
        connection.commit()

        return jsonify({'message': 'Playlista została dodana pomyślnie'}), 200
    except Exception as e:
        print(f"Błąd: {e}")  # Logowanie błędów
        connection.rollback()
        return jsonify({'message': 'Wystąpił błąd podczas dodawania playlisty'}), 500
    finally:
        cursor.close()
        connection.close()

# Obsługuje endpoint do dodawania utworów do playlisty
@app.route('/api/add-to-playlist', methods=['POST'])
def submit_addition():
    data = request.get_json()
    print(data)
    new_name = data.get('playlist')
    new_name2 = data.get('song')

    # Sprawdzanie, czy podano nazwę playlisty i utworu
    if new_name is None or new_name2 is None:
        return jsonify({'message': 'Nazwa playlisty i utworu są wymagane'}), 400

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # Dodanie utworu do playlisty
        query = f"INSERT INTO PLAYLIST_TRACKS (PLAYLIST_ID, TRACK_ID) SELECT {new_name}, TRACK_ID FROM TRACKS WHERE TITLE = '{new_name2}'"
        print(query)
        cursor.execute(query)
        connection.commit()

        return jsonify({'message': 'Utwór został dodany do playlisty pomyślnie'}), 200
    except Exception as e:
        print(f"Błąd: {e}")  # Logowanie błędów
        connection.rollback()
        return jsonify({'message': 'Wystąpił błąd podczas dodawania utworu do playlisty'}), 500
    finally:
        cursor.close()
        connection.close()

# Obsługuje endpoint do usuwania utworów z playlisty
@app.route('/api/remove-from-playlist', methods=['POST'])
def submit_removal():
    data = request.get_json()
    print(data)
    new_name = data.get('playlist')
    new_name2 = data.get('song')

    # Sprawdzanie, czy podano nazwę playlisty i utworu
    if new_name is None or new_name2 is None:
        return jsonify({'message': 'Nazwa playlisty i utworu są wymagane'}), 400

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # Usunięcie utworu z playlisty
        query = f"DELETE FROM PLAYLIST_TRACKS WHERE TRACK_ID=(SELECT TRACK_ID FROM TRACKS WHERE TITLE='{new_name2}') AND PLAYLIST_ID='{new_name}'"
        print(query)
        cursor.execute(query)
        connection.commit()

        return jsonify({'message': 'Utwór został usunięty z playlisty pomyślnie'}), 200
    except Exception as e:
        print(f"Błąd: {e}")  # Logowanie błędów
        connection.rollback()
        return jsonify({'message': 'Wystąpił błąd podczas usuwania utworu z playlisty'}), 500
    finally:
        cursor.close()
        connection.close()

# Obsługuje endpoint do dodawania nowego użytkownika
@app.route('/api/submit-new-user', methods=['POST'])
def submit_user_addition():
    data = request.get_json()
    print(data)
    new_name = data.get('new_user')
    new_name2 = data.get('new_pass')

    # Sprawdzanie, czy podano nazwę użytkownika i hasło
    if new_name is None or new_name2 is None:
        return jsonify({'message': 'Nazwa użytkownika i hasło są wymagane'}), 400

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # Dodanie nowego użytkownika do bazy
        query = f"INSERT INTO SYSTEM.USERS(USER_ID, USERNAME, PASSWORD, ROLE_ID) VALUES (playlist_id_seq.NEXTVAL, '{new_name}', '{new_name2}', '1')"
        print(query)
        cursor.execute(query)
        connection.commit()

        return jsonify({'message': 'Użytkownik został dodany pomyślnie'}), 200
    except Exception as e:
        print(f"Błąd: {e}")  # Logowanie błędów
        connection.rollback()
        return jsonify({'message': 'Wystąpił błąd podczas dodawania użytkownika'}), 500
    finally:
        cursor.close()
        connection.close()

# Obsługuje endpoint logowania
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        try:
            connection = get_db_connection()
            cursor = connection.cursor()

            # Sprawdzenie, czy dane logowania są poprawne
            query = "SELECT PASSWORD FROM SYSTEM.USERS WHERE USERNAME = :username"
            print(query)
            cursor.execute(query, username=username)
            user_record = cursor.fetchone()

            if user_record and user_record[0] == password:
                user = User(username)
                login_user(user)
                return redirect(url_for('dashboard'))
            else:
                return 'Logowanie nie powiodło się. Sprawdź nazwę użytkownika i/lub hasło.'

        except Exception as e:
            print(f"Błąd: {e}")  # Logowanie błędów
            return 'Wystąpił błąd podczas próby logowania.'
        finally:
            cursor.close()
            connection.close()

    return render_template('login.html')

# Obsługuje endpoint zwracający dane bieżącego użytkownika
@app.route('/api/current_user', methods=['GET'])
@login_required
def current_user_info():
    return {'id': current_user.id}

# Obsługuje endpoint wylogowania
@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

# Obsługuje stronę dashboard
@app.route('/dashboard')
@login_required
def dashboard():
    return send_from_directory(app.static_folder, 'index.html')

# Obsługuje endpoint do pobierania playlist
@app.route('/api/playlists')
@login_required
def get_playlists():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # Pobranie wszystkich playlist z bazy
        cursor.execute("SELECT PLAYLISTS.PLAYLIST_ID, PLAYLISTS.TITLE, USERS.USERNAME FROM PLAYLISTS INNER JOIN USERS ON PLAYLISTS.USER_ID = USERS.USER_ID")
        print("Kolumny:", cursor.description)
        rows = cursor.fetchall()
        print(rows)

        # Formatowanie wyników w postaci słownika
        columns = [col[0] for col in cursor.description]
        result = [dict(zip(columns, row)) for row in rows]

        cursor.close()
        connection.close()
        return jsonify(result)
    except Exception as e:
        print(e)
        return jsonify({str(e)})

# Obsługuje endpoint do pobierania utworów z danej playlisty
@app.route('/api/songs/<int:playlist_id>')
def get_songs(playlist_id):
    connection = get_db_connection()
    cursor = connection.cursor()
    query = f"SELECT TRACKS.TITLE, TRACKS.FILE_PATH, TRACKS.RATING, USERS.USERNAME FROM TRACKS INNER JOIN USERS ON TRACKS.USER_ID=USERS.USER_ID WHERE TRACKS.TRACK_ID IN (SELECT TRACK_ID FROM PLAYLIST_TRACKS WHERE PLAYLIST_ID={playlist_id})"
    print(query)
    cursor.execute(query)
    rows = cursor.fetchall()
    print("Surowe dane:", rows)

    # Formatowanie wyników w postaci słownika
    columns = [col[0] for col in cursor.description]
    result = [dict(zip(columns, row)) for row in rows]

    cursor.close()
    connection.close()
    return jsonify(result)

# Inicjalizacja LoginManager
login_manager.init_app(app)

# Uruchomienie aplikacji Flask
if __name__ == '__main__':
    app.run(host='192.168.0.166', port=5012, debug=True)
