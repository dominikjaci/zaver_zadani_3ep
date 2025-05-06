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
          // Uložení userId do localStorage (předpokládá se, že backend vrací userId)
          if (data.userId) {
            localStorage.setItem('userId', data.userId);
          } else {
            localStorage.setItem('userId', username);
          }
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
  let editId = null;

  function getUserId() {
    return localStorage.getItem('userId') || '';
  }

  function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleString('cs-CZ');
  }

  async function fetchNotes(onlyImportant = false) {
    if (!notesContainer) return;
    notesContainer.innerHTML = '<li>Načítám poznámky...</li>';
    try {
      const params = new URLSearchParams();
      if (onlyImportant) params.append('important', 'true');
      const response = await fetch('/notes?' + params.toString());
      const data = await response.json();
      notesContainer.innerHTML = '';
      const myUserId = getUserId();
      if (Array.isArray(data.notes) && data.notes.length > 0) {
        data.notes.forEach(note => {
          const li = document.createElement('li');
          let buttons = `
            <button class="important-btn" data-id="${note.id}" style="color:${note.important ? 'orange' : '#888'}">
              ${note.important ? 'Odebrat důležitost' : 'Označit jako důležité'}
            </button>
          `;
          // Jen autor vidí Upravit/Smazat
          if (note.userId === myUserId) {
            buttons = `
              <button class="edit-btn" data-id="${note.id}">Upravit</button>
              <button class="delete-btn" data-id="${note.id}">Smazat</button>
            ` + buttons;
          }
          li.innerHTML = `
            <div>
              <strong>${note.title || '(bez nadpisu)'}</strong>
              <div>${note.text}</div>
              <div style="font-size:0.9em;color:#888;margin-top:2px;">${formatDate(note.created)}</div>
              <div style="margin-top:6px;">
                ${buttons}
              </div>
            </div>
          `;
          li.style.marginBottom = '18px';
          notesContainer.appendChild(li);
        });
      } else {
        notesContainer.innerHTML = '<li>Žádné poznámky.</li>';
      }
    } catch (error) {
      notesContainer.innerHTML = '<li>Chyba při načítání poznámek.</li>';
    }
  }

  // Přidání nebo úprava poznámky
  if (noteForm && notesContainer) {
    noteForm.innerHTML = `
      <input type="text" id="noteTitle" placeholder="Nadpis poznámky" required>
      <input type="text" id="noteInput" placeholder="Text poznámky" required>
      <button type="submit">Přidat poznámku</button>
      <button type="button" id="showImportant">Zobrazit pouze důležité</button>
      <button type="button" id="showAll">Zobrazit všechny</button>
    `;
    noteForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const noteTitle = document.getElementById('noteTitle').value;
      const noteText = document.getElementById('noteInput').value;
      if (!noteText.trim()) return;
      try {
        if (editId) {
          // Úprava poznámky
          const response = await fetch(`/notes/${editId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: getUserId(), title: noteTitle, text: noteText })
          });
          if (!response.ok) throw new Error();
          editId = null;
          noteForm.querySelector('button[type="submit"]').textContent = 'Přidat poznámku';
        } else {
          // Přidání poznámky
          const response = await fetch('/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: getUserId(), title: noteTitle, text: noteText })
          });
          if (!response.ok) throw new Error();
        }
        document.getElementById('noteTitle').value = '';
        document.getElementById('noteInput').value = '';
        fetchNotes();
      } catch {
        alert('Chyba při ukládání poznámky.');
      }
    });

    // Delegace pro mazání, úpravu, důležitost
    notesContainer.addEventListener('click', async (e) => {
      const id = e.target.getAttribute('data-id');
      if (e.target.classList.contains('delete-btn')) {
        if (confirm('Opravdu chcete poznámku smazat?')) {
          await fetch(`/notes/${id}?userId=${getUserId()}`, { method: 'DELETE' });
          fetchNotes();
        }
      }
      if (e.target.classList.contains('edit-btn')) {
        // Všichni vidí všechny poznámky, ale upravit může jen autor (backend to ohlídá)
        const response = await fetch('/notes');
        const data = await response.json();
        const note = data.notes.find(n => n.id == id);
        if (note) {
          document.getElementById('noteTitle').value = note.title || '';
          document.getElementById('noteInput').value = note.text || '';
          editId = id;
          noteForm.querySelector('button[type="submit"]').textContent = 'Uložit změnu';
        }
      }
      if (e.target.classList.contains('important-btn')) {
        await fetch(`/notes/${id}/important`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ important: e.target.textContent.includes('Označit') })
        });
        fetchNotes();
      }
    });

    // Filtrování
    noteForm.querySelector('#showImportant').onclick = () => fetchNotes(true);
    noteForm.querySelector('#showAll').onclick = () => fetchNotes(false);

    fetchNotes();
    if (currentUser) {
      currentUser.textContent = getUserId();
    }
  }
});