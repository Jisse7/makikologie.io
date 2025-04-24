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


let selectedUser = null;


const nameSearchInput = document.getElementById('nameSearch');
const suggestionsContainer = document.getElementById('suggestions');
const nextBtn = document.getElementById('nextBtn');
const validateBtn = document.getElementById('validateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const nameError = document.getElementById('nameError');
const passwordError = document.getElementById('passwordError');
const passwordInputs = document.querySelectorAll('.password-input:not(.fixed-letter)');


const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');


let highlightedIndex = -1;
let filteredUsers = [];


nameSearchInput.addEventListener('input', function() {
    const searchQuery = this.value.toLowerCase();
    
    
    suggestionsContainer.innerHTML = '';
    selectedUser = null;
    nextBtn.disabled = true;
    highlightedIndex = -1;
    
    if (searchQuery.length < 2) return;
    
    
    filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchQuery)
    );
    
    
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


function selectUser(user) {
    nameSearchInput.value = user.name;
    selectedUser = user;
    suggestionsContainer.innerHTML = '';
    nextBtn.disabled = false;
    nameError.textContent = '';
    highlightedIndex = -1;
    filteredUsers = [];
}


nameSearchInput.addEventListener('keydown', function(e) {
    const suggestions = document.querySelectorAll('.suggestion-item');
    
    if (e.key === 'Tab' && suggestions.length > 0) {
        e.preventDefault(); 
        
        
        suggestions.forEach(item => item.classList.remove('highlighted'));
        
        if (e.shiftKey) {
            
            highlightedIndex = highlightedIndex <= 0 ? suggestions.length - 1 : highlightedIndex - 1;
        } else {
            
            highlightedIndex = (highlightedIndex + 1) % suggestions.length;
        }
        
        
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


nextBtn.addEventListener('click', function() {
    if (!selectedUser) {
        nameError.textContent = "Veuillez sélectionner un nom dans la liste";
        return;
    }
    
    step1.classList.remove('active');
    step2.classList.add('active');
    
    
    passwordInputs[0].focus();
});


window.addEventListener('load', function() {
    passwordInputs.forEach(input => {
        input.value = '';
        input.classList.remove('correct', 'incorrect');
    });
});


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
};

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

downloadBtn.addEventListener('click', function() {
    if (!selectedUser) return;
    
    
    const userName = selectedUser.name;
    const nameParts = userName.split(" ");
    let fileName;
    
    
    if (nameParts.length >= 2) {
        const prenom = nameParts[0];
        const nom = nameParts.slice(1).join("");
        fileName = prenom + nom + ".pdf";
    } else {
        fileName = userName.replace(/\s+/g, '') + ".pdf";
    }
    
    const certificatePath = "Certificats/" + fileName;
    
    const a = document.createElement('a');
    a.href = certificatePath;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});

document.addEventListener('click', function(e) {
    if (!suggestionsContainer.contains(e.target) && e.target !== nameSearchInput) {
        suggestionsContainer.innerHTML = '';
    }
});