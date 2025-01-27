import React, { useState, useEffect } from 'react';

function App() {
    const [playlists, setPlaylists] = useState([]);
    const [songs, setSongs] = useState([]);
    const [currentSong, setCurrentSong] = useState({ url: '', name: 'No song playing' });
    const [selectedSong, setSelectedSong] = useState(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuVisible2, setMenuVisible2] = useState(false);
    const [DeleteVisible, setDeleteVisible] = useState(false);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null)
    const [UserId, setUserId] = useState(null);
    const [showRatingModal, setShowRatingModal] = useState(false); // To control visibility of rating modal
    const [rating, setRating] = useState('');
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [create_visible, set_create_menu_visible]=useState(false);
    const [new_name, set_new_name]=useState(null);
    const [create_user_visible, set_create_user_menu_visible]=useState(null);
    const [new_user, set_new_user]=useState(null);
    const [new_pass, set_new_pass]=useState(null);
    const [show_song_add, set_show_song_add]=useState(null);
    const [SelectedPlaylist2, setSelectedPlaylist2]=useState(null);
    useEffect(() => {
        fetch('/api/playlists')
            .then(response => response.json())
            .then(data => {
                // Assuming data is an array of objects with PLAYLIST_ID and TITLE
                const formattedPlaylists = data.map(playlist => ({
                    id: playlist.PLAYLIST_ID,
                    title: playlist.TITLE,
                    owner: playlist.USERNAME
                }));
                setPlaylists(formattedPlaylists);
            });
        fetch('/api/current_user')
	    .then(response => response.json())
	    .then(data => setUserId(data.id));
    }, []);
    const openRatingModal = () => {
        setShowRatingModal(true);
    };
    const close_user_visible = () => {
        set_create_user_menu_visible(false);
    };
    const closeRatingModal = () => {
        setShowRatingModal(false);
        setRating('');
        setError('');
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        if (value === '' || (value >= 1 && value <= 5)) {
            setRating(value);
        } else {
            setError('Please enter a number between 1 and 5');
        }
    };
    const handleInputChange2 = (e) => {
        const value = e.target.value;
        set_new_name(value);
    };
    const handleInputChange3 = (e) => {
        const value = e.target.value;
        set_new_user(value);
    };
    const handleInputChange4 = (e) => {
        const value = e.target.value;
        set_new_pass(value);
    };
    const handleDropdownChange = (e) => {
      setSelectedPlaylist2(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // If input is valid, send data to the server
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
    const handleSubmit2 = async (e) => {
        e.preventDefault();
        console.log({
            title: new_name,  // Playlist title
            });

            try {
                const response = await fetch('/api/submit-new-playlist', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({"title": new_name}),
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
        }
    const handleSubmit3 = async (e) => {
        e.preventDefault();
            try {
                const response = await fetch('/api/submit-new-user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ new_user,new_pass }),
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
        }
    const delete_playlist = async (playlist) => {
            try {
                const response = await fetch('/api/remove-playlist', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({"title": playlist.title }),
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
        }
    const handleSubmit5 = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch('/api/add-to-playlist', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "playlist": SelectedPlaylist2,"song":selectedSong.title }),
          });
          const result = await response.json();
          if (response.ok) {
            set_show_song_add(false); // Close the modal after success
          } else {
            setError(result.message || 'Failed to submit playlist');
          }
        } catch (error) {
          setError('Failed to submit playlist');
        }
    };
    const delete_from_playlist = async (e) => {
        try {
          const response = await fetch('/api/remove-from-playlist', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "playlist": selectedPlaylist,"song":selectedSong.title }),
          });
          const result = await response.json();
          if (response.ok) {
            set_show_song_add(false); // Close the modal after success
          } else {
            setError(result.message || 'Failed to submit song removal');
          }
        } catch (error) {
          setError('Failed to submit song removal');
          }
  };
    const close_create = () => {
     set_create_menu_visible(false);
     }
    const loadSongs = (playlist) => {
        fetch(`/api/songs/${playlist.id}`)
            .then(response => response.json())
            .then(data => {                
                const formattedSongs = data.map(song => ({
                    title: song.TITLE,
                    FILE_PATH: song.FILE_PATH,
                    rating: song.RATING,
                    owner: song.USERNAME
                }));
                setSongs(formattedSongs);
                setSelectedPlaylist(playlist);
             });
    };
    const playSong = (url, name) => {
        setCurrentSong({ url, name });
        const audioPlayer = document.getElementById('audio-player');
        audioPlayer.src = url;
        audioPlayer.play();
	setCurrentSong(name);
    };
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
    const toggleMenu2 = (song) => {
        setSelectedSong(song);
        if (UserId !== song.owner) {
          setMenuVisible2(!menuVisible2);
        }

    };
    const playlist_delete_menu = (playlist) => {
        setSelectedPlaylist(playlist);
        console.log('deletion', playlist);
        if (UserId === playlist.owner) {
          setDeleteVisible(!DeleteVisible);
        }
    };
    const playlist_create_menu = () => {
        set_create_menu_visible(!create_visible);
    };
    const user_creation_menu = () => {
        set_create_user_menu_visible(!create_user_visible);
    };
    const toggle_song_add = () => {
        set_show_song_add(!show_song_add);
    };
    return (
        <div style={{ display: 'flex', height: '100vh', margin: 0, fontFamily: 'Arial, sans-serif' }}>
            <Sidebar playlists={playlists} loadSongs={loadSongs} UserId={UserId} playlist_delete_menu={playlist_delete_menu} setSelectedPlaylist={setSelectedPlaylist} selectedPlaylist={selectedPlaylist} playlist_create_menu={playlist_create_menu} user_creation_menu={user_creation_menu}/>
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
            <Footer currentSong={currentSong} />
        </div>
    );
}


function Sidebar({ playlists, loadSongs, UserId, playlist_delete_menu, setSelectedPlaylist, SetDeleteVisible, playlist_create_menu, user_creation_menu, SelectedPlaylist2, setSelectedPlaylist2}) {
    return (
        <div style={{ width: '20%', backgroundColor: '#f1f1f1', padding: '10px' }}>
            <h3>Playlists</h3>
	    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
		    <tr>
                         <td>Logged in as {UserId}</td>
                         <td><a href="#" onClick={() => user_creation_menu()}>Create new user</a></td>
	            </tr>
                </tbody>
            </table>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                    {playlists.map((playlist, index) => (
                        <tr key={index}>
                            <td>
                                <a href="#" onClick={(e) => { e.preventDefault(); loadSongs(playlist); }}>
                                    {playlist.title}- by {playlist.owner}
                                </a>
                            </td>
                            <td>
                                <button onClick={() => playlist_delete_menu(playlist)}>delete</button>
                            </td>
                        </tr>
                ))}
            </tbody>
        </table>
        <div style={{ marginTop: '10px' }}>
		<a href="#" onClick={() => playlist_create_menu()}>Create Playlist</a>
        </div>
    </div>
    );
}

function Main({ songs, playSong, toggleMenu, menuVisible, selectedSong, setMenuVisible, openRatingModal,showRatingModal, handleSubmit, rating, handleInputChange, closeRatingModal,toggleMenu2, menuVisible2, setMenuVisible2, playlist_delete_menu, selectedPlaylist, DeleteVisible, setDeleteVisible, create_visible, set_create_menu_visible, new_name, handleSubmit2, handleInputChange2, close_create, create_user_visible, handleSubmit3, handleInputChange3, handleInputChange4, new_user, new_pass, delete_playlist, toggle_song_add, show_song_add, handleDropdownChange, SelectedPlaylist2, playlists, handleSubmit5, delete_from_playlist, close_user_visible, UserId}) {
    return (
        <div style={{ width: '80%', padding: '10px' }}>
            <h3>Songs</h3>
 	    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
               <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>Song Name</th>
                    <th style={{ textAlign: 'left' }}>Owner</th>
                    <th style={{ textAlign: 'left' }}>Rating</th>
                    <th style={{ textAlign: 'left' }}>options</th>
                 </tr>
              </thead>
              <tbody>
                {songs.map((song) => (
                   <tr key={song.url}>
                     <td>
                        <a href="#" onClick={() => playSong(song.FILE_PATH, song.title)}>
                          {song.title}
                        </a>
                     </td>
                     <td>{song.owner}</td>
                     <td>{song.rating}</td>
		     <td>
                        {UserId === song.owner || UserId === selectedPlaylist?.owner ? (
			    <button onClick={() => toggleMenu(song)}>Options</button>
                        ) : <button onClick={() => toggleMenu2(song)}>Options</button>}
                     </td>
                   </tr>
            ))}
          </tbody>
        </table>
        {menuVisible2 && selectedSong && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '20px', backgroundColor: '#fff', border: '1px solid #ccc', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
	    <h4>Non-admin Options for {selectedSong.title}</h4>
            <ul>
              <li><button onClick={() => playSong(selectedSong.url, selectedSong.name)}>Play</button></li>
              <li><button onClick={() => openRatingModal()}>Rate</button></li>
              <li><button onClick={toggle_song_add}>Add to Playlist</button></li>
            </ul>
            <button onClick={() => setMenuVisible2(false)}>Close Menu</button>
          </div>
        )}

        {menuVisible && selectedSong && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '20px', backgroundColor: '#fff', border: '1px solid #ccc', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h4>Options for {selectedSong.title}</h4>
            <ul>
              <li><button onClick={() => playSong(selectedSong.url, selectedSong.name)}>Play</button></li>
              <li><button onClick={() => openRatingModal()}>Rate</button></li>
              <li><button onClick={toggle_song_add}>Add to Playlist</button></li>
              <li><button onClick={() => delete_from_playlist(selectedSong.title, selectedPlaylist.title)}>delete from playlist</button></li>
            </ul>
            <button onClick={() => setMenuVisible(false)}>Close Menu</button>
          </div>
        )}
        {DeleteVisible && selectedPlaylist.title && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '20px', backgroundColor: '#fff', border: '1px solid #ccc', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h4>delete {selectedPlaylist.title}?</h4>
            <ul>
              <li><button onClick={() => setDeleteVisible(false)}>no</button></li>
              <li><button onClick={() => { delete_playlist(selectedPlaylist); setDeleteVisible(false);}}>yes</button></li>
            </ul>
            <button onClick={() => setDeleteVisible(false)}>Close Menu</button>
          </div>
        )}

 {/* Rating Modal Pop-up */}
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
                        <button type="submit">Submit Rating</button>
                        <button type="button" onClick={closeRatingModal}>Close</button>
                    </form>
                </div>
            )}

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
                        <button type="submit">Create</button>
                        <button type="button" onClick={close_create}>Close</button>
                    </form>
                </div>
            )}
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
                        <button type="submit">Create</button>
                        <button type="button" onClick={close_user_visible}>Close</button>
                    </form>
                </div>
            )}
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
                     <button onClick={handleSubmit5}>Submit</button>
                     <button onClick={toggle_song_add}>Close</button>
                   </div>
               )}
      </div>
    );
console.log(songs); 
}

function Footer({ currentSong }) {
    return (
        <div style={{ position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#ddd', textAlign: 'center', padding: '10px' }}>
            <div id="playback-controls">
                <audio id="audio-player" controls>
                    <source src={currentSong.url} type="audio/wav" />
                    Your browser does not support the audio element.
                </audio>
                <span>{currentSong.name}</span>
            </div>
        </div>
    );
}

export default App;

