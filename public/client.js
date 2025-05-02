document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const username = document.getElementById('regUsername').value;
      const password = document.getElementById('regPassword').value;
      
      try {
        const response = await fetch('/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        if (response.ok) {
          alert('Registrace úspěšná!');
        } else {
          alert(`Chyba: ${data.message}`);
        }
      } catch (error) {
        alert('Došlo k chybě při komunikaci se serverem');
      }
    });
    
    // Kód pro přihlášení
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const username = document.getElementById('loginUsername').value;
      const password = document.getElementById('loginPassword').value;
      
      try {
        const response = await fetch('/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        if (response.ok) {
          document.querySelector('.auth-section').classList.add('hidden');
          document.getElementById('noteApp').classList.remove('hidden');
          document.getElementById('currentUser').textContent = username;
          fetchNotes(); // Funkce pro načtení poznámek
        } else {
          alert(`Chyba: ${data.message}`);
        }
      } catch (error) {
        alert('Došlo k chybě při komunikaci se serverem');
      }
    });
    
    // Funkce pro načtení poznámek - implementujte podle vašeho API
    async function fetchNotes() {
      // Kód pro načtení poznámek...
    }
    
    // Kód pro přidání poznámky
    document.getElementById('noteForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const noteText = document.getElementById('noteInput').value;
      
      // Kód pro přidání poznámky...
    });
  });