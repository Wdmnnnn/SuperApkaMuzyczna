# Aplikacja Muzyczna

## Opis
Aplikacja jest dostępna na zewnętrznym serwerze jednego z autorów. Umożliwia:
- Dodawanie nowych użytkowników.
- Tworzenie nowych playlist (działają po odświeżeniu strony).
- Zarządzanie utworami na playlistach.
- Dodawanie ocen (rating) do utworów.
- Odtwarzanie utworu (w obecnej wersji działa jedynie "Numb").

---

## Jak uruchomić aplikację?
1. Wejdź na stronę aplikacji pod adresem:
   
   **[http://91.207.68.151:5012/login](http://91.207.68.151:5012/login)**

2. Podaj login i hasło w celu rejestracji (login i hasło takie samo - wdmn)

---

## Funkcjonalności aplikacji

### 1. Dodawanie użytkowników
Po zalogowaniu/rejestracji możliwe jest dodanie nowych użytkowników.

### 2. Tworzenie nowych playlist
- Po stworzeniu nowej playlisty należy **odświeżyć stronę**, aby została poprawnie wyświetlona.

### 3. Zarządzanie utworami
- **Odtwarzanie utworu:**
  Możliwe jest odtwarzanie utworów poprzez opcje w playlistach (działa obecnie tylko utwór "Numb").

- **Dodawanie ocen (rating):**
  Możesz dodać opinię do utworu.

- **Dodawanie utworu do playlisty:**
  Istnieje możliwość przenoszenia utworów do już istniejących playlist.

---

## Struktura aplikacji
- W pliku **`main2.py`** znajduje się kod backendu oparty na Flask.
- W pliku **`music-app/src/App.js`** znajduje się główny kod frontendowy oparty na React.
- Pozostałe pliki w projekcie zostały wygenerowane automatycznie i wspierają działanie tych dwóch głównych plików.

---

## Ograniczenia
- W obecnej wersji aplikacji jedynym działającym utworem jest **"Numb"**.

---
