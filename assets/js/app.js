// on objet qui contient des fonctions
var app = {

  // fonction d'initialisation, lancée au chargement de la page
  init: function () {
    console.log('app.init !');
    app.addListeners();
  },

  addListeners: function () {
    // Ajout d'un event listener sur le bouton "Ajouter une liste".
    const addListBtnElm = document.querySelector('#addListButton');
    addListBtnElm.addEventListener('click', app.displayAddListModal);

    // Ajout d'un event listener sur les boutons permettant d'ajouter une carte à une liste.
    const addCardBtnElm = document.querySelectorAll('.is-pulled-right');
    addCardBtnElm.forEach(button => button.addEventListener('click', app.displayAddCardModal));

    // Ajout d'un event listener sur les boutons permettant de fermer les modales.
    const closeModalButtonsElm = document.querySelectorAll('.close');
    closeModalButtonsElm.forEach(button => button.addEventListener('click', app.closeModals));

    // Ajout d'un event listener sur le bouton de validation du formulaire permettant d'ajouter une liste.
    const listModalFormElm = document.querySelector('#addListModal form');
    listModalFormElm.addEventListener('submit', app.handleListForm);

    // Ajout d'un event listener sur le bouton de validation du formulaire permettant d'ajouter une carte.
    const cardModalFormElm = document.querySelector('#addCardModal form');
    cardModalFormElm.addEventListener('submit', app.handleCardForm);
  },

  // Méthode permettant d'afficher la modale "Ajouter une liste".
  displayAddListModal: function () {
    const addListModalElm = document.querySelector('#addListModal');
    addListModalElm.classList.add('is-active');
  },

  // Méthode permettant de gérer la validation du formulaire "Ajouter une liste".
  handleListForm: function (e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newListName = formData.get('name');
    app.makeListInDOM(newListName);
  },

  // Méthode permettant d'ajouter la nouvelle liste au DOM.
  makeListInDOM: function (list) {
    // On sélectionne l'élément parent, qui contiendra notre nouvelle liste.
    const parentDiv = document.querySelector('#lists-container');

    // On sélectionne le template et on le clone.
    const listTemplate = document.querySelector('#list-template');
    const clone = document.importNode(listTemplate.content, true);

    // On sélectionne la balise HTML correspondant au titre de la liste, puis on modifie son contenu.
    const listTitle = clone.querySelector('#list-template_h2');
    listTitle.textContent = `${list}`;

    // On remplace la valeur de "data-list-id" par le nom de la nouvelle liste (sans whitespace grâce à un regex).
    const mainDiv = clone.querySelector('#main-div');
    mainDiv.setAttribute("data-list-id", `${list.replace(/ /g, "")}`);

    // On intègre notre clone au début de l'élément parent (avant le premier élément).
    parentDiv.firstElementChild.before(clone);

    // On ajoute un event listener à cette nouvelle liste afin de pouvoir y ajouter des cartes.
    const createdList = document.querySelector('.is-pulled-right');
    createdList.addEventListener('click', app.displayAddCardModal);
    
    // On ferme toutes les modales.
    app.closeModals();
  },

  // Méthode permettant d'afficher la modale "Ajouter une carte".
  displayAddCardModal: function (e) {
    const addCardModalElm = document.querySelector('#addCardModal');
    addCardModalElm.classList.add('is-active');
    const list = e.target.closest('.panel');
    const listId = list.getAttribute('data-list-id');
    const listIdInput = document.querySelector('#listIdInput');
    listIdInput.value = listId;
    
  },

  // Méthode permettant de gérer la validation du formulaire "Ajouter une carte".
  handleCardForm: function (e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newCardName = formData.get('name');
    const newCardListId = formData.get('list_id');
    app.makeCardInDOM(newCardName, newCardListId);
  },

// Méthode permettant d'ajouter la nouvelle carte dans la bonne liste.
  makeCardInDOM: function (cardName, id) {
    const parentList = document.querySelector(`[data-list-id = ${id}] .panel-block`);
    const cardTemplate = document.querySelector('#card-template');
    const clone = document.importNode(cardTemplate.content, true);
    const cardTitle = clone.querySelector('#card-template_title');
    cardTitle.textContent = `${cardName}`;
    parentList.append(clone);
    app.closeModals();
  },

  // Méthode permettant de fermer la (les) modales et de vider les champs.
  closeModals: function () {
    const allModalsElm = document.querySelectorAll('.modal');
    const modalsInputs = document.querySelectorAll('.modal input');
    allModalsElm.forEach(modal => modal.classList.remove('is-active'));
    modalsInputs.forEach(input => input.value = "");
  },

};


// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init );
