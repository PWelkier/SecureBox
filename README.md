# 🔐 SecureBox - Password Manager

## 📌 Endpoints

### 🔑 User Authentication Endpoints

#### 🔓 **POST /login**
- **Opis**: Uwierzytelnia użytkownika i zwraca token JWT.
- **Żądanie**:
  - **Body**:
    - `login` (string): Login użytkownika.
    - `password` (string): Hasło użytkownika.
- **Odpowiedź**:
  - **Body**:
    - `user` (object):
      - `id` (string): ID użytkownika.
      - `first_name` (string): Imię użytkownika.
      - `last_name` (string): Nazwisko użytkownika.
      - `login` (string): Login użytkownika.
    - `token` (string): Token JWT.

---

### 👤 User Management Endpoints

#### ➕ **POST /users**
- **Opis**: Tworzy nowego użytkownika.
- **Żądanie**:
  - **Body**:
    - `first_name` (string): Imię użytkownika.
    - `last_name` (string): Nazwisko użytkownika.
    - `login` (string): Login użytkownika.
    - `password` (string): Hasło użytkownika.
- **Odpowiedź**:
  - **Body**:
    - `id` (string): ID nowo utworzonego użytkownika.
    - `first_name` (string): Imię użytkownika.
    - `last_name` (string): Nazwisko użytkownika.
    - `login` (string): Login użytkownika.

#### ✏️ **PATCH /users/:user_id**
- **Opis**: Aktualizuje dane użytkownika.
- **Żądanie**:
  - **Parametry**:
    - `user_id` (string): ID użytkownika.
  - **Body**:
    - `first_name` (string, opcjonalne): Nowe imię użytkownika.
    - `last_name` (string, opcjonalne): Nowe nazwisko użytkownika.
    - `login` (string, opcjonalne): Nowy login użytkownika.
    - `password` (string, opcjonalne): Nowe hasło użytkownika.
- **Odpowiedź**:
  - **Body**:
    - `id` (string): ID użytkownika.
    - `first_name` (string): Imię użytkownika.
    - `last_name` (string): Nazwisko użytkownika.
    - `login` (string): Login użytkownika.

#### 🔍 **GET /users/:user_id**
- **Opis**: Pobiera dane użytkownika.
- **Żądanie**:
  - **Parametry**:
    - `user_id` (string): ID użytkownika.
- **Odpowiedź**:
  - **Body**:
    - `id` (string): ID użytkownika.
    - `first_name` (string): Imię użytkownika.
    - `last_name` (string): Nazwisko użytkownika.
    - `login` (string): Login użytkownika.

#### 🏠 **GET /users/me/get**
- **Opis**: Pobiera dane zalogowanego użytkownika.
- **Żądanie**: Brak.
- **Odpowiedź**:
  - **Body**:
    - `id` (string): ID użytkownika.
    - `first_name` (string): Imię użytkownika.
    - `last_name` (string): Nazwisko użytkownika.
    - `login` (string): Login użytkownika.

#### 📜 **GET /users/:user_id/logins**
- **Opis**: Pobiera historię logowań użytkownika.
- **Żądanie**:
  - **Parametry**:
    - `user_id` (string): ID użytkownika.
- **Odpowiedź**:
  - **Body**:
    - `logins` (array): Lista logowań użytkownika.
      - `timestamp` (string): Czas logowania.
      - `user_id` (string): ID użytkownika.
      - `login` (string): Login użytkownika.
      - `page` (string): Strona, na którą zalogowano.

#### 📝 **POST /users/:user_id/logins**
- **Opis**: Dodaje wpis do historii logowań użytkownika.
- **Żądanie**:
  - **Parametry**:
    - `user_id` (string): ID użytkownika.
  - **Body**:
    - `login` (string): Login użytkownika.
    - `page` (string): Strona, na którą zalogowano.
- **Odpowiedź**:
  - **Body**:
    - `timestamp` (string): Czas logowania.
    - `user_id` (string): ID użytkownika.
    - `login` (string): Login użytkownika.
    - `page` (string): Strona, na którą zalogowano.

---

### 🔑 Password Management Endpoints

#### 🔎 **GET /passwords**
- **Opis**: Pobiera wszystkie hasła użytkownika.

#### 📂 **GET /passwords/:user_id/files**
- **Opis**: Pobiera wszystkie pliki z hasłami użytkownika w formacie ZIP.

#### ➕ **POST /passwords/:user_id/files**
- **Opis**: Dodaje nowe hasło użytkownika.

#### 🔄 **PUT /passwords/:user_id/passwords/:platform/:login**
- **Opis**: Aktualizuje hasło użytkownika.

#### ❌ **DELETE /passwords/:user_id/passwords/:platform/:login**
- **Opis**: Usuwa hasło użytkownika.

#### 🔄 **PUT /passwords/:user_id/passwords**
- **Opis**: Aktualizuje wszystkie hasła użytkownika.

---

### 📱 Trusted Device Management Endpoints

#### 📋 **GET /users/:user_id/trusted-devices**
- **Opis**: Pobiera listę zaufanych urządzeń użytkownika.

#### 🔧 **PATCH /users/:user_id/trusted-devices**
- **Opis**: Aktualizuje zaufane urządzenie użytkownika.

#### 🗑️ **DELETE /users/:user_id/trusted-devices/:device_id**
- **Opis**: Usuwa zaufane urządzenie użytkownika.
