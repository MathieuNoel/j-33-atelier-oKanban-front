
// on objet qui contient des fonctions
var app = {
  base_url: 'http://localhost:3000',

  // fonction d'initialisation, lancée au chargement de la page
  init: function () {
    app.getListsFromAPI();
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
    // const btnsAddCard = document.querySelectorAll('.panel a.is-pulled-right');
    // for(const btnAddCard of btnsAddCard) {
    //   btnAddCard.addEventListener('click', app.showAddCardModal);
    // }
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
  handleAddListForm: async function(event) {
    // il faut empêcher le comportement par défaut de l'event submit, à savoir l'envoi d'une requête HTTP et donc le rechargement de la page
    event.preventDefault();
    // récupérer les infos du formulaire
    const formData = new FormData(event.target);
    try {
      // on fait un call API en POST sur /lists
      const response = await fetch(`${app.base_url}/lists`, {
        method: 'POST',
        body: formData
      });
      const newList = await response.json();
      // faire apparaitre une nouvelle liste dans le DOM
      app.makeListInDOM(newList);
    } catch(error) {
      console.error(error);
      alert('Impossible d\'ajouter une liste !');
    }
    
    // reset les champs du formulaire
    event.target.reset();
    // cacher la modale
    app.hideModals();
  },
  makeListInDOM: function(list) {
    // créer une nouvelle liste dans le DOM
    // récupérer le template
    const template = document.getElementById('templateList');
    // en faire un clone
    const cloneTemplate = document.importNode(template.content, true);
    // modifier son data attribute id
    cloneTemplate.querySelector('.panel').dataset.listId = list.id;
    // le modifier (nom de la liste)
    cloneTemplate.querySelector('h2').textContent = list.name;
    // ajouter un écouteur d'event sur le bouton + pour afficher la modale de carte
    cloneTemplate.querySelector('.panel a.is-pulled-right').addEventListener('click', app.showAddCardModal);
    // insérer dans la page concrètement
    document.querySelector('.card-lists').appendChild(cloneTemplate);
  },
  handleAddCardForm: async function(event) {
    // empêcher le rechargement de la page
    event.preventDefault();
    // récupérer les infos du formulaire
    const formData = new FormData(event.target);
    // faire un call API en POST sur /cards
    const response = await fetch(`${app.base_url}/cards`, {
      method: 'POST',
      body: formData
    });
    // on récupère la nouvelle carte
    const newCard = await response.json();

    // créer la carte dans le DOM
    app.makeCardInDOM(newCard);
    // reset les champs du formulaire
    event.target.reset();
    // cacher la modale
    app.hideModals();
  },
  makeCardInDOM: function(card) {
    // récupérer le template de card
    const template = document.getElementById('templateCard');
    // cloner le template
    const cloneTemplate = document.importNode(template.content, true);
    // modifie l'identifiant de la carte dans le DOM
    const cardDOM = cloneTemplate.querySelector('.box');
    cardDOM.dataset.cardId = card.id;
    // modifier le titre de la carte
    cloneTemplate.querySelector('.column').textContent = card.title;
    // modifier sa couleur de fond
    cardDOM.style.backgroundColor = card.color;
    // insérer le clone du template dans la bonne liste du DOM
    const listDOM = document.querySelector(`.panel[data-list-id="${card.list_id}"]`);
    // on insère la carte dans le block container de list
    listDOM.querySelector('.panel-block').appendChild(cloneTemplate);
  },
  // récupérer les listes depuis l'API et les afficher dans le DOM
  getListsFromAPI: async function() {
    try {
      // on fait un call API en GET sur /lists pour récupérer l'objet response avec nos listes
      const response = await fetch(`${app.base_url}/lists`);
      // on appelle la méthode json sur l'objet response obtenu pour récupérer directement notre tableau de listes (la data)
      const lists = await response.json();

      console.log(lists);
      
      // dessiner les listes dans le DOM
      for(const list of lists) {
        app.makeListInDOM(list);
        for(const card of list.cards) {
          app.makeCardInDOM(card);
        }
      }

    } catch(error) {
      console.error(error);
      alert('Impossible de récupérer les listes !');
    }
  }

};


// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init );