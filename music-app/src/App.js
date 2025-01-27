// Importowanie niezbędnych bibliotek React i hooków.
import React, { useState, useEffect } from 'react';

// Główny komponent aplikacji
function App() {
    // Deklarowanie zmiennych stanu dla playlist, piosenek i innych elementów interfejsu.
    const [playlists, setPlaylists] = useState([]); // Przechowuje listę playlist.
    const [songs, setSongs] = useState([]); // Przechowuje listę piosenek z wybranej playlisty.
    const [currentSong, setCurrentSong] = useState({ url: '', name: 'No song playing' }); // Przechowuje dane aktualnie odtwarzanej piosenki.
    const [selectedSong, setSelectedSong] = useState(null); // Przechowuje wybraną piosenkę.
    const [menuVisible, setMenuVisible] = useState(false); // Steruje widocznością menu dla administratora.
    const [menuVisible2, setMenuVisible2] = useState(false); // Steruje widocznością menu dla użytkownika.
    const [DeleteVisible, setDeleteVisible] = useState(false); // Steruje widocznością okna potwierdzenia usunięcia playlisty.
    const [selectedPlaylist, setSelectedPlaylist] = useState(null); // Przechowuje wybraną playlistę.
    const [UserId, setUserId] = useState(null); // Przechowuje ID aktualnie zalogowanego użytkownika.
    const [showRatingModal, setShowRatingModal] = useState(false); // Steruje widocznością okna oceny piosenki.
    const [rating, setRating] = useState(''); // Przechowuje ocenę wprowadzoną przez użytkownika.
    const [error, setError] = useState(''); // Przechowuje informacje o błędach.
    const [submitted, setSubmitted] = useState(false); // Oznacza czy formularz został przesłany.
    const [create_visible, set_create_menu_visible] = useState(false); // Steruje widocznością formularza tworzenia playlisty.
    const [new_name, set_new_name] = useState(null); // Przechowuje nazwę nowej playlisty.
    const [create_user_visible, set_create_user_menu_visible] = useState(null); // Steruje widocznością formularza tworzenia użytkownika.
    const [new_user, set_new_user] = useState(null); // Przechowuje nazwę nowego użytkownika.
    const [new_pass, set_new_pass] = useState(null); // Przechowuje hasło nowego użytkownika.
    const [show_song_add, set_show_song_add] = useState(null); // Steruje widocznością menu dodawania piosenki do playlisty.
    const [SelectedPlaylist2, setSelectedPlaylist2] = useState(null); // Przechowuje ID wybranej playlisty.

    // Hook useEffect - ładowanie początkowych danych po załadowaniu komponentu.
    useEffect(() => {
        fetch('/api/playlists')
            .then(response => response.json())
            .then(data => {
                // Formatowanie danych playlist na obiekt z ID, tytułem i właścicielem.
                const formattedPlaylists = data.map(playlist => ({
                    id: playlist.PLAYLIST_ID,
                    title: playlist.TITLE,
                    owner: playlist.USERNAME
                }));
                setPlaylists(formattedPlaylists);
            });
        // Pobieranie danych aktualnego użytkownika.
        fetch('/api/current_user')
            .then(response => response.json())
            .then(data => setUserId(data.id));
    }, []);

    // Funkcja otwierająca okno oceny piosenki.
    const openRatingModal = () => {
        setShowRatingModal(true);
    };

    // Funkcja zamykająca formularz tworzenia użytkownika.
    const close_user_visible = () => {
        set_create_user_menu_visible(false);
    };

    // Funkcja zamykająca okno oceny piosenki i resetująca jego stan.
    const closeRatingModal = () => {
        setShowRatingModal(false);
        setRating('');
        setError('');
    };

    // Obsługa zmian w polu oceny piosenki.
    const handleInputChange = (e) => {
        const value = e.target.value;
        if (value === '' || (value >= 1 && value <= 5)) {
            setRating(value);
        } else {
            setError('Please enter a number between 1 and 5');
        }
    };

    // Obsługa zmiany nazwy nowej playlisty.
    const handleInputChange2 = (e) => {
        const value = e.target.value;
        set_new_name(value);
    };

    // Obsługa zmiany nazwy nowego użytkownika.
    const handleInputChange3 = (e) => {
        const value = e.target.value;
        set_new_user(value);
    };

    // Obsługa zmiany hasła nowego użytkownika.
    const handleInputChange4 = (e) => {
        const value = e.target.value;
        set_new_pass(value);
    };

    // Obsługa zmiany wyboru playlisty.
    const handleDropdownChange = (e) => {
        setSelectedPlaylist2(e.target.value);
    };

    // Funkcja przesyłająca ocenę piosenki do serwera.
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating >= 1 && rating <= 5) {
            try {
                const response = await fetch('/api/submit-rating', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ rating, title: selectedSong.title }),
                });
                const result = await response.json();
                if (response.ok) {
                    setSubmitted(true);
                    window.location.reload();
                    setShowRatingModal(false);
                } else {
                    setError(result.message || 'Something went wrong!');
                }
            } catch (error) {
                setError('Failed to submit rating');
            }
        } else {
            setError('Please enter a number between 1 and 5');
        }
    };

    // Funkcja dodająca nową playlistę.
    const handleSubmit2 = async (e) => {
        e.preventDefault();
        console.log({
            title: new_name, // Tytuł nowej playlisty
        });

        try {
            const response = await fetch('/api/submit-new-playlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "title": new_name }),
            });

            const result = await response.json();
            if (response.ok) {
                setSubmitted(true);
                set_create_menu_visible(false);
                window.location.reload();
            }
        } catch (error) {
            setError('Failed to submit rating');
        }
    };

    // Funkcja tworzy nowego użytkownika.
    const handleSubmit3 = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/submit-new-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ new_user, new_pass }),
            });

            const result = await response.json();
            if (response.ok) {
                setSubmitted(true);
                window.location.reload();
                set_create_user_menu_visible(false);
            } else {
                setError(result.message || 'Something went wrong!');
            }
        } catch (error) {
            setError('Failed to submit rating');
        }
    };

    // Funkcja usuwa playlistę.
    const delete_playlist = async (playlist) => {
        try {
            const response = await fetch('/api/remove-playlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "title": playlist.title }),
            });

            const result = await response.json();
            if (response.ok) {
                setSubmitted(true);
            } else {
                setError(result.message || 'Something went wrong!');
            }
        } catch (error) {
            setError('Failed to submit deletion');
        }
    };

    // Funkcja dodaje piosenkę do playlisty.
    const handleSubmit5 = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/add-to-playlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "playlist": SelectedPlaylist2, "song": selectedSong.title }),
            });

            const result = await response.json();
            if (response.ok) {
                set_show_song_add(false); // Zamknięcie modal po sukcesie
            } else {
                setError(result.message || 'Failed to submit playlist');
            }
        } catch (error) {
            setError('Failed to submit playlist');
        }
    };

    // Funkcja usuwa piosenkę z playlisty.
    const delete_from_playlist = async (e) => {
        try {
            const response = await fetch('/api/remove-from-playlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "playlist": selectedPlaylist, "song": selectedSong.title }),
            });

            const result = await response.json();
            if (response.ok) {
                set_show_song_add(false); // Zamknięcie modal po sukcesie
            } else {
                setError(result.message || 'Failed to submit song removal');
            }
        } catch (error) {
            setError('Failed to submit song removal');
        }
    };

    // Funkcja zamyka formularz tworzenia playlisty.
    const close_create = () => {
        set_create_menu_visible(false);
    };

    // Funkcja ładuje piosenki z wybranej playlisty.
    const loadSongs = (playlist) => {
        fetch(`/api/songs/${playlist.id}`)
            .then(response => response.json())
            .then(data => {
                const formattedSongs = data.map(song => ({
                    title: song.TITLE,
                    FILE_PATH: song.FILE_PATH,
                    rating: song.RATING,
                    owner: song.USERNAME,
                }));
                setSongs(formattedSongs);
                setSelectedPlaylist(playlist);
            });
    };

    // Funkcja odtwarza wybraną piosenkę.
    const playSong = (url, name) => {
        setCurrentSong({ url, name });
        const audioPlayer = document.getElementById('audio-player');
        audioPlayer.src = url;
        audioPlayer.play();
        setCurrentSong(name);
    };

    // Funkcja przełącza widoczność menu dla administratora.
    const toggleMenu = (song) => {
        setSelectedSong(song);
        console.log('UserId:', UserId);
        console.log('Song Owner:', song.owner);
        console.log('Selected Playlist:', selectedPlaylist);
        console.log('Selected Playlist Owner:', selectedPlaylist?.owner);
        if (UserId === song.owner || UserId === selectedPlaylist.owner) {
            setMenuVisible(!menuVisible);
        }
    };

    // Funkcja przełącza widoczność menu dla użytkownika.
    const toggleMenu2 = (song) => {
        setSelectedSong(song);
        if (UserId !== song.owner) {
            setMenuVisible2(!menuVisible2);
        }
    };

    // Funkcja otwiera menu usunięcia playlisty.
    const playlist_delete_menu = (playlist) => {
        setSelectedPlaylist(playlist);
        console.log('deletion', playlist);
        if (UserId === playlist.owner) {
            setDeleteVisible(!DeleteVisible);
        }
    };

    // Funkcja otwiera formularz tworzenia playlisty.
    const playlist_create_menu = () => {
        set_create_menu_visible(!create_visible);
    };

    // Funkcja otwiera formularz tworzenia użytkownika.
    const user_creation_menu = () => {
        set_create_user_menu_visible(!create_user_visible);
    };

    // Funkcja przełącza widoczność menu dodawania piosenki do playlisty.
    const toggle_song_add = () => {
        set_show_song_add(!show_song_add);
    };

    return (
        <div style={{ display: 'flex', height: '100vh', margin: 0, fontFamily: 'Arial, sans-serif' }}>
            {/* Renderowanie paska bocznego */}
            <Sidebar playlists={playlists} loadSongs={loadSongs} UserId={UserId} playlist_delete_menu={playlist_delete_menu} setSelectedPlaylist={setSelectedPlaylist} selectedPlaylist={selectedPlaylist} playlist_create_menu={playlist_create_menu} user_creation_menu={user_creation_menu} />
            {/* Renderowanie głównej sekcji aplikacji */}
            <Main
                songs={songs}
                playSong={playSong}
                toggleMenu={toggleMenu}
                menuVisible={menuVisible}
                selectedSong={selectedSong}
                setMenuVisible={setMenuVisible}
                UserId={UserId}
                openRatingModal={openRatingModal}
                showRatingModal={showRatingModal}
                handleSubmit={handleSubmit}
                rating={rating}
                new_name={new_name}
                set_new_name={set_new_name}
                closeRatingModal={closeRatingModal}
                handleInputChange={handleInputChange}
                toggleMenu2={toggleMenu2}
                setMenuVisible2={setMenuVisible2}
                menuVisible2={menuVisible2}
                setSelectedPlaylist={setSelectedPlaylist}
                setDeleteVisible={setDeleteVisible}
                playlist_delete_menu={playlist_delete_menu}
                DeleteVisible={DeleteVisible}
                selectedPlaylist={selectedPlaylist}
                create_visible={create_visible}
                handleSubmit2={handleSubmit2}
                close_create={close_create}
                create_user_visible={create_user_visible}
                handleSubmit3={handleSubmit3}
                handleInputChange3={handleInputChange3}
                handleInputChange4={handleInputChange4}
                handleInputChange2={handleInputChange2}
                delete_playlist={delete_playlist}
                toggle_song_add={toggle_song_add}
                show_song_add={show_song_add}
                playlists={playlists}
                handleSubmit5={handleSubmit5}
                SelectedPlaylist2={SelectedPlaylist2}
                handleDropdownChange={handleDropdownChange}
                delete_from_playlist={delete_from_playlist}
                close_user_visible={close_user_visible}
                UserId={UserId}
            />
            {/* Renderowanie stopki aplikacji */}
            <Footer currentSong={currentSong} />
        </div>
    );
}

// Komponent Sidebar: Pasek boczny aplikacji wyświetlający listę playlist oraz umożliwiający zarządzanie nimi.
function Sidebar({ playlists, loadSongs, UserId, playlist_delete_menu, setSelectedPlaylist, SetDeleteVisible, playlist_create_menu, user_creation_menu, SelectedPlaylist2, setSelectedPlaylist2}) {
    return (
        <div style={{ width: '20%', backgroundColor: '#f1f1f1', padding: '10px' }}>
            {/* Nagłówek sekcji playlist */}
            <h3>Playlists</h3>

            {/* Tabela z informacjami o aktualnym użytkowniku */}
	    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
		    <tr>
                         <td>Logged in as {UserId}</td> {/* Wyświetlanie ID aktualnie zalogowanego użytkownika */}
                         <td><a href="#" onClick={() => user_creation_menu()}>Create new user</a></td> {/* Link do formularza tworzenia nowego użytkownika */}
	            </tr>
                </tbody>
            </table>

            {/* Tabela z listą playlist */}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                    {playlists.map((playlist, index) => (
                        <tr key={index}> {/* Użycie indeksu jako klucza (rozważ użycie unikalnego ID playlisty) */}
                            <td>
                                {/* Link do załadowania piosenek z wybranej playlisty */}
                                <a href="#" onClick={(e) => { e.preventDefault(); loadSongs(playlist); }}>
                                    {playlist.title}- by {playlist.owner}
                                </a>
                            </td>
                            <td>
                                {/* Przycisk do usuwania playlisty */}
                                <button onClick={() => playlist_delete_menu(playlist)}>delete</button>
                            </td>
                        </tr>
                ))}
            </tbody>
        </table>

        {/* Link do formularza tworzenia nowej playlisty */}
        <div style={{ marginTop: '10px' }}>
		<a href="#" onClick={() => playlist_create_menu()}>Create Playlist</a>
        </div>
    </div>
    );
}

// Komponent Main: Główna sekcja aplikacji zarządzająca piosenkami, ich wyświetlaniem i operacjami na nich.
function Main({ songs, playSong, toggleMenu, menuVisible, selectedSong, setMenuVisible, openRatingModal,showRatingModal, handleSubmit, rating, handleInputChange, closeRatingModal,toggleMenu2, menuVisible2, setMenuVisible2, playlist_delete_menu, selectedPlaylist, DeleteVisible, setDeleteVisible, create_visible, set_create_menu_visible, new_name, handleSubmit2, handleInputChange2, close_create, create_user_visible, handleSubmit3, handleInputChange3, handleInputChange4, new_user, new_pass, delete_playlist, toggle_song_add, show_song_add, handleDropdownChange, SelectedPlaylist2, playlists, handleSubmit5, delete_from_playlist, close_user_visible, UserId}) {
    return (
        <div style={{ width: '80%', padding: '10px' }}>
            {/* Nagłówek sekcji */}
            <h3>Songs</h3>
 	    {/* Tabela z listą piosenek */}
  	    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
               <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>Song Name</th> {/* Kolumna nazwy piosenki */}
                    <th style={{ textAlign: 'left' }}>Owner</th> {/* Kolumna właściciela */}
                    <th style={{ textAlign: 'left' }}>Rating</th> {/* Kolumna oceny */}
                    <th style={{ textAlign: 'left' }}>options</th> {/* Kolumna opcji */}
                 </tr>
              </thead>
              <tbody>
                {songs.map((song) => (
                   <tr key={song.url}> {/* Iteracja przez listę piosenek */}
                     <td>
                        <a href="#" onClick={() => playSong(song.FILE_PATH, song.title)}> {/* Odtwarzanie piosenki po kliknięciu */}
                          {song.title}
                        </a>
                     </td>
                     <td>{song.owner}</td>
                     <td>{song.rating}</td>
		     <td>
                        {UserId === song.owner || UserId === selectedPlaylist?.owner ? (
			    <button onClick={() => toggleMenu(song)}>Options</button> {/* Opcje dla właściciela */}
                        ) : <button onClick={() => toggleMenu2(song)}>Options</button>} {/* Opcje dla innych użytkowników */}
                     </td>
                   </tr>
            ))}
          </tbody>
        </table>

        {/* Menu opcji dla użytkowników niebędących adminami */}
        {menuVisible2 && selectedSong && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '20px', backgroundColor: '#fff', border: '1px solid #ccc', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
	    <h4>Non-admin Options for {selectedSong.title}</h4>
            <ul>
              <li><button onClick={() => playSong(selectedSong.url, selectedSong.name)}>Play</button></li> {/* Odtwarzanie */}
              <li><button onClick={() => openRatingModal()}>Rate</button></li> {/* Ocena */}
              <li><button onClick={toggle_song_add}>Add to Playlist</button></li> {/* Dodanie do playlisty */}
            </ul>
            <button onClick={() => setMenuVisible2(false)}>Close Menu</button> {/* Zamknięcie menu */}
          </div>
        )}

        {/* Menu opcji dla administratorów */}
        {menuVisible && selectedSong && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '20px', backgroundColor: '#fff', border: '1px solid #ccc', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h4>Options for {selectedSong.title}</h4>
            <ul>
              <li><button onClick={() => playSong(selectedSong.url, selectedSong.name)}>Play</button></li> {/* Odtwarzanie */}
              <li><button onClick={() => openRatingModal()}>Rate</button></li> {/* Ocena */}
              <li><button onClick={toggle_song_add}>Add to Playlist</button></li> {/* Dodanie do playlisty */}
              <li><button onClick={() => delete_from_playlist(selectedSong.title, selectedPlaylist.title)}>delete from playlist</button></li> {/* Usunięcie z playlisty */}
            </ul>
            <button onClick={() => setMenuVisible(false)}>Close Menu</button> {/* Zamknięcie menu */}
          </div>
        )}

        {/* Menu potwierdzenia usunięcia playlisty */}
        {DeleteVisible && selectedPlaylist.title && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '20px', backgroundColor: '#fff', border: '1px solid #ccc', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h4>delete {selectedPlaylist.title}?</h4>
            <ul>
              <li><button onClick={() => setDeleteVisible(false)}>no</button></li> {/* Anulowanie usuwania */}
              <li><button onClick={() => { delete_playlist(selectedPlaylist); setDeleteVisible(false);}}>yes</button></li> {/* Potwierdzenie usuwania */}
            </ul>
            <button onClick={() => setDeleteVisible(false)}>Close Menu</button> {/* Zamknięcie menu */}
          </div>
        )}

 {/* Okno modalne do oceny */}
            {showRatingModal && (
                <div style={{
                    position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '20px', backgroundColor: '#fff', border: '1px solid #ccc', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', zIndex: 1000
                }}>
                    <h4>Rate this song</h4>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Rating (1-5):</label>
                            <input
                                type="number"
                                value={rating}
                                onChange={handleInputChange}
                                min="1"
                                max="5"
                            />
                        </div>
                        <button type="submit">Submit Rating</button> {/* Przesłanie oceny */}
                        <button type="button" onClick={closeRatingModal}>Close</button> {/* Zamknięcie modal */}
                    </form>
                </div>
            )}

            {/* Formularz tworzenia nowej playlisty */}
            {create_visible && (
                <div style={{
                    position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '20px', backgroundColor: '#fff', border: '1px solid #ccc', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', zIndex: 1000
                }}>
                    <h4>Name of the playlist</h4>
                    <form onSubmit={handleSubmit2}>
                        <div>
                            <label>Name:</label>
                            <input
                                type="string"
                                value={new_name}
                                onChange={handleInputChange2}
                            />
                        </div>
                        <button type="submit">Create</button> {/* Utworzenie playlisty */}
                        <button type="button" onClick={close_create}>Close</button> {/* Zamknięcie formularza */}
                    </form>
                </div>
            )}

            {/* Formularz tworzenia nowego użytkownika */}
            {create_user_visible && (
                <div style={{
                    position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '20px', backgroundColor: '#fff', border: '1px solid #ccc', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', zIndex: 1000
                }}>
                    <h4>Name of the User</h4>
                    <form onSubmit={handleSubmit3}>
                        <div>
                            <label>Name:</label>
                            <input
                                type="string"
                                value={new_user}
                                onChange={handleInputChange3}
                            />
                            <input
                                type="string"
                                value={new_pass}
                                onChange={handleInputChange4}
                            />
                        </div>
                        <button type="submit">Create</button> {/* Utworzenie użytkownika */}
                        <button type="button" onClick={close_user_visible}>Close</button> {/* Zamknięcie formularza */}
                    </form>
                </div>
            )}

            {/* Modal dodawania piosenki do playlisty */}
            {show_song_add && (
                <div style={{
                    position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '20px', backgroundColor: '#fff', border: '1px solid #ccc', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', zIndex: 1000
                }}>
                    <h2>Select a Playlist</h2>
                    <select onChange={handleDropdownChange} value={SelectedPlaylist2}>
                      <option value="">Select a Playlist</option>
                      {playlists.map((playlist) => (
                        <option key={playlist.id} value={playlist.id}>
                          {playlist.title}
                        </option>
                       ))}
                     </select>
                     <button onClick={handleSubmit5}>Submit</button> {/* Dodanie piosenki do playlisty */}
                     <button onClick={toggle_song_add}>Close</button> {/* Zamknięcie modal */}
                   </div>
               )}
      </div>
    );
console.log(songs); 
}

// Komponent Footer, który wyświetla odtwarzacz audio oraz nazwę aktualnie odtwarzanego utworu
function Footer({ currentSong }) {
    return (
        // Kontener z tłem, przypięty do dołu ekranu, zajmujący całą szerokość
        <div style={{ position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#ddd', textAlign: 'center', padding: '10px' }}>
            <div id="playback-controls">
                {/* Odtwarzacz audio z kontrolkami */}
                <audio id="audio-player" controls>
                    {/* Źródło dźwięku z aktualnie odtwarzanego utworu */}
                    <source src={currentSong.url} type="audio/wav" />
                    {/* Informacja dla użytkownika, jeśli przeglądarka nie wspiera elementu audio */}
                    Your browser does not support the audio element.
                </audio>
                {/* Wyświetlenie nazwy aktualnie odtwarzanego utworu */}
                <span>{currentSong.name}</span>
            </div>
        </div>
    );
}

// Eksportowanie komponentu Footer do użycia w innych częściach aplikacji
export default App;



