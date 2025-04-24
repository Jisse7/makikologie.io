// Base de données des utilisateurs
const users = [
    { name: "Lucas NOFFRAY" },
    { name: "Yamileth TERAN PETAQUERO" },
    { name: "Faranak SARAFNIA" },
    { name: "Hazel ÖNDER" },
    { name: "Rachid AMMARTI" },
    { name: "Cindy PLANCHENAULT" },
    { name: "Mickael BILLARD" },
    { name: "Amélie VERHAEGHE" },
    { name: "Casey HEAGERTY" }
];

// Variables d'état
let selectedUser = null;

// Elements DOM
const nameSearchInput = document.getElementById('nameSearch');
const suggestionsContainer = document.getElementById('suggestions');
const nextBtn = document.getElementById('nextBtn');
const validateBtn = document.getElementById('validateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const nameError = document.getElementById('nameError');
const passwordError = document.getElementById('passwordError');
const passwordInputs = document.querySelectorAll('.password-input:not(.fixed-letter)');

// Étapes
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');

// Variable pour suivre l'index sélectionné lors de la navigation avec Tab
let highlightedIndex = -1;
let filteredUsers = [];

// Fonction de recherche
nameSearchInput.addEventListener('input', function() {
    const searchQuery = this.value.toLowerCase();
    
    // Effacer les suggestions précédentes
    suggestionsContainer.innerHTML = '';
    selectedUser = null;
    nextBtn.disabled = true;
    highlightedIndex = -1;
    
    if (searchQuery.length < 2) return;
    
    // Filtrer les résultats
    filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchQuery)
    );
    
    // Afficher les suggestions
    filteredUsers.forEach((user, index) => {
        const item = document.createElement('div');
        item.classList.add('suggestion-item');
        item.textContent = user.name;
        item.dataset.index = index;
        
        item.addEventListener('click', function() {
            selectUser(user);
        });
        
        suggestionsContainer.appendChild(item);
    });
});

// Fonction pour sélectionner un utilisateur
function selectUser(user) {
    nameSearchInput.value = user.name;
    selectedUser = user;
    suggestionsContainer.innerHTML = '';
    nextBtn.disabled = false;
    nameError.textContent = '';
    highlightedIndex = -1;
    filteredUsers = [];
}

// Gérer la navigation avec Tab dans les suggestions
nameSearchInput.addEventListener('keydown', function(e) {
    const suggestions = document.querySelectorAll('.suggestion-item');
    
    if (e.key === 'Tab' && suggestions.length > 0) {
        e.preventDefault(); // Empêcher le comportement par défaut de Tab
        
        // Supprimer la mise en évidence précédente
        suggestions.forEach(item => item.classList.remove('highlighted'));
        
        if (e.shiftKey) {
            // Tab + Shift (navigation en arrière)
            highlightedIndex = highlightedIndex <= 0 ? suggestions.length - 1 : highlightedIndex - 1;
        } else {
            // Tab (navigation en avant)
            highlightedIndex = (highlightedIndex + 1) % suggestions.length;
        }
        
        // Mettre en évidence la nouvelle sélection
        const highlightedItem = suggestions[highlightedIndex];
        highlightedItem.classList.add('highlighted');
        highlightedItem.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
        // Sélectionner l'élément en surbrillance avec Enter
        e.preventDefault();
        if (filteredUsers[highlightedIndex]) {
            selectUser(filteredUsers[highlightedIndex]);
        }
    }
});

// Passer à l'étape suivante
nextBtn.addEventListener('click', function() {
    if (!selectedUser) {
        nameError.textContent = "Veuillez sélectionner un nom dans la liste";
        return;
    }
    
    step1.classList.remove('active');
    step2.classList.add('active');
    
    // Focus sur le premier champ du mot de passe
    passwordInputs[0].focus();
});

// S'assurer que les champs sont vides au chargement de la page
window.addEventListener('load', function() {
    passwordInputs.forEach(input => {
        input.value = '';
        input.classList.remove('correct', 'incorrect');
    });
});

// Configuration des champs de mot de passe
passwordInputs.forEach((input, index) => {
    // Passer au champ suivant quand une lettre est saisie
    input.addEventListener('input', function() {
        this.value = this.value.toUpperCase();
        
        // Vérifier si la lettre est correcte
        checkPasswordInput(this);
        
        // Passer au champ suivant s'il existe
        if (this.value.length === 1 && index < passwordInputs.length - 1) {
            passwordInputs[index + 1].focus();
        }
    });
    
    // Gérer les touches spéciales (Backspace, flèches)
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Backspace' && this.value.length === 0 && index > 0) {
            // Revenir au champ précédent si backspace est pressé sur un champ vide
            passwordInputs[index - 1].focus();
        } else if (e.key === 'ArrowLeft' && index > 0) {
            // Naviguer vers le champ précédent avec la flèche gauche
            passwordInputs[index - 1].focus();
        } else if (e.key === 'ArrowRight' && index < passwordInputs.length - 1) {
            // Naviguer vers le champ suivant avec la flèche droite
            passwordInputs[index + 1].focus();
        }
    });
});

// Vérifier si la lettre saisie est correcte
function checkPasswordInput(input) {
    const correctValue = input.getAttribute('data-correct');
    
    if (input.value === '') {
        input.classList.remove('correct', 'incorrect');
    } else if (input.value === correctValue) {
        input.classList.add('correct');
        input.classList.remove('incorrect');
    } else {
        input.classList.add('incorrect');
        input.classList.remove('correct');
    }
}

// Valider le mot de passe complet
validateBtn.addEventListener('click', function() {
    // Vérifier si tous les champs sont remplis correctement
    let allCorrect = true;
    let isEmpty = false;
    
    passwordInputs.forEach(input => {
        if (input.value === '') {
            isEmpty = true;
        } else if (input.value !== input.getAttribute('data-correct')) {
            allCorrect = false;
        }
    });
    
    if (isEmpty) {
        passwordError.textContent = "Veuillez compléter tous les champs";
    } else if (!allCorrect) {
        passwordError.textContent = "Certaines lettres sont incorrectes";
    } else {
        passwordError.textContent = '';
        step2.classList.remove('active');
        step3.classList.add('active');
    }
});

// Télécharger le certificat
downloadBtn.addEventListener('click', function() {
    if (!selectedUser) return;
    
    // Formatage du nom de fichier selon les conventions observées dans l'image
    const userName = selectedUser.name;
    const nameParts = userName.split(" ");
    let fileName;
    
    // Format spécial observé dans l'image (sans espace entre prénom et nom)
    if (nameParts.length >= 2) {
        const prenom = nameParts[0];
        const nom = nameParts.slice(1).join("");
        fileName = prenom + nom + ".pdf";
    } else {
        fileName = userName.replace(/\s+/g, '') + ".pdf";
    }
    
    // Chemin vers le certificat
    const certificatePath = "Certificats/" + fileName;
    
    // Créer un lien pour télécharger le fichier
    const a = document.createElement('a');
    a.href = certificatePath;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});

// Cliquer en dehors des suggestions pour les fermer
document.addEventListener('click', function(e) {
    if (!suggestionsContainer.contains(e.target) && e.target !== nameSearchInput) {
        suggestionsContainer.innerHTML = '';
    }
});