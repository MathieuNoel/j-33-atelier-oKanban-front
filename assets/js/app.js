
// on objet qui contient des fonctions
var app = {

  // fonction d'initialisation, lancée au chargement de la page
  init: function () {
    app.addListenerToActions();
  },
  addListenerToActions: function() {
    // mettre un écouteur d'évènement clic sur le bouton d'ajout de liste
    document.getElementById('addListButton').addEventListener('click', app.showAddListModal);
    // ajouter un écouteur d'évènement click sur les boutons de fermeture de modale
    const btnsCloseModal = document.getElementsByClassName('close');
    // const btnsCloseModal = document.querySelectorAll('.close');
    for(const btnClose of btnsCloseModal) {
      // pour chaque bouton close on déclencher la fonction hideModals
      btnClose.addEventListener('click', app.hideModals);
    }
    // ajouter un écouteur d'event submit sur le formulaire d'ajout de liste
    document.querySelector('#addListModal form').addEventListener('submit', app.handleAddListForm);

  },
  showAddListModal: function() {
    // afficher la modale à l'écran
    document.getElementById('addListModal').classList.add('is-active');
  },
  hideModals: function() {
    // cacher les modales
    const modals = document.getElementsByClassName('modal');
    for(const modal of modals) {
      // on cache toutes les modals
      modal.classList.remove('is-active');
    }
  },
  handleAddListForm: function(event) {
    // il faut empêcher le comportement par défaut de l'event submit, à savoir l'envoi d'une requête HTTP et donc le rechargement de la page
    event.preventDefault();
    // récupérer les infos du formulaire
    const formData = new FormData(event.target);
    // faire apparaitre une nouvelle liste dans le DOM
    app.makeListInDOM(formData)
    // cacher la modale
    app.hideModals();
    
  },
  makeListInDOM: function(formData) {
    // créer une nouvelle liste dans le DOM
    // récupérer le template
    const template = document.getElementById('templateList');
    // en faire un clone
    const cloneTemplate = document.importNode(template.content, true);
    // le modifier (nom de la liste)
    cloneTemplate.querySelector('h2').textContent = formData.get('name');
    // insérer dans la page concrètement
    document.querySelector('.card-lists').appendChild(cloneTemplate);
  }

};


// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init );