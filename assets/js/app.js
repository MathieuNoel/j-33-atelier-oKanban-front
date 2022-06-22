
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
    // ajouter un écouteur d'event click sur les boutons +
    const btnsAddCard = document.querySelectorAll('.panel a.is-pulled-right');
    for(const btnAddCard of btnsAddCard) {
      btnAddCard.addEventListener('click', app.showAddCardModal);
    }
    // ajouter un écouteur d'évènement submit sur le formulaire d'ajout de carte
    document.querySelector('#addCardModal form').addEventListener('submit', app.handleAddCardForm);
  },
  showAddListModal: function() {
    // afficher la modale à l'écran
    document.getElementById('addListModal').classList.add('is-active');
  },
  showAddCardModal: function(event) {
    // récupérer l'id de la bonne liste
    // const idList = event.target.closest('.panel').getAttribute('data-list-id');
    // vu qu'on récupère la valeur d'un data-attribute (attribut HTML personnalisé) on peut utiliser une autre façon de faire :
    const idList = event.target.closest('.panel').dataset.listId;
    // mettre à jour l'input hidden du formulaire de la modale
    document.querySelector('#addCardModal input[name="list_id"]').value = idList;
    // afficher la modale de carte
    document.getElementById('addCardModal').classList.add('is-active');
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
    app.makeListInDOM(formData);
    // reset les champs du formulaire
    event.target.reset();
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
    // ajouter un écouteur d'event sur le bouton + pour afficher la modale de carte
    cloneTemplate.querySelector('.panel a.is-pulled-right').addEventListener('click', app.showAddCardModal);
    // insérer dans la page concrètement
    document.querySelector('.card-lists').appendChild(cloneTemplate);
  },
  handleAddCardForm: function(event) {
    // empêcher le rechargement de la page
    event.preventDefault();
    // récupérer les infos du formulaire
    const formData = new FormData(event.target);
    // créer la carte dans le DOM
    app.makeCardInDOM(formData);
    // reset les champs du formulaire
    event.target.reset();
    // cacher la modale
    app.hideModals();
  },
  makeCardInDOM: function(formData) {
    // récupérer le template de card
    const template = document.getElementById('templateCard');
    // cloner le template
    const cloneTemplate = document.importNode(template.content, true);
    // modifier le titre de la carte
    cloneTemplate.querySelector('.column').textContent = formData.get('name');
    // insérer le clone du template dans la bonne liste du DOM
    const listDOM = document.querySelector(`.panel[data-list-id="${formData.get('list_id')}"]`);
    // on insère la carte dans le block container de list
    listDOM.querySelector('.panel-block').appendChild(cloneTemplate);
  }

};


// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init );