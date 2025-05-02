document.addEventListener('DOMContentLoaded', () => {
    // Registrace
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
      registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('regUsername').value;
        const password = document.getElementById('regPassword').value;
  
        try {
          const response = await fetch('/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          });
          const data = await response.json();
          if (response.ok) {
            alert('Registrace úspěšná! Nyní se můžete přihlásit.');
            window.location.href = 'login.html';
          } else {
            alert(`Chyba: ${data.message}`);
          }
        } catch (error) {
          alert('Došlo k chybě při komunikaci se serverem');
        }
      });
    }
  
    // Přihlášení
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
  
        try {
          const response = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          });
          const data = await response.json();
          if (response.ok) {
            // Přesměrování na stránku s poznámkami
            window.location.href = 'notes.html';
          } else {
            alert(`Chyba: ${data.message}`);
          }
        } catch (error) {
          alert('Došlo k chybě při komunikaci se serverem');
        }
      });
    }
  
    // Poznámky (notes.html)
    const noteForm = document.getElementById('noteForm');
    const notesContainer = document.getElementById('notes-container');
    const currentUser = document.getElementById('currentUser');
  
    // Získání uživatelského jména z localStorage (volitelné)
    function getUsername() {
      // Pokud používáte session/localStorage, zde jej načtěte
      return '';
    }
  
    // Načtení poznámek
    async function fetchNotes() {
      if (!notesContainer) return;
      notesContainer.innerHTML = '<li>Načítám poznámky...</li>';
      try {
        const response = await fetch('/notes');
        const data = await response.json();
        notesContainer.innerHTML = '';
        if (Array.isArray(data.notes) && data.notes.length > 0) {
          data.notes.forEach(note => {
            const li = document.createElement('li');
            li.textContent = note.text || note.content || note.title || '';
            notesContainer.appendChild(li);
          });
        } else {
          notesContainer.innerHTML = '<li>Žádné poznámky.</li>';
        }
      } catch (error) {
        notesContainer.innerHTML = '<li>Chyba při načítání poznámek.</li>';
      }
    }
  
    // Přidání poznámky
    if (noteForm) {
      noteForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const noteText = document.getElementById('noteInput').value;
        if (!noteText.trim()) return;
        try {
          const response = await fetch('/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: noteText })
          });
          if (response.ok) {
            document.getElementById('noteInput').value = '';
            fetchNotes();
          } else {
            alert('Chyba při přidávání poznámky.');
          }
        } catch (error) {
          alert('Chyba při komunikaci se serverem.');
        }
      });
      // Načti poznámky při načtení stránky
      fetchNotes();
      // Zobraz uživatele pokud je k dispozici
      if (currentUser) {
        currentUser.textContent = getUsername();
      }
    }
  });