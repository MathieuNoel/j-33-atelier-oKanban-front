
// on objet qui contient des fonctions
var app = {
  
  
  // fonction d'initialisation, lancée au chargement de la page
  init: function () {
    app.base_url='http://localhost:3000',
    app.addListenerToActions();
    // call de getListsFromAPI pour charger les listes déjà présente dans l'API
    app.getListsFromAPI();    
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
  handleAddListForm: async function(event) {
    // il faut empêcher le comportement par défaut de l'event submit, à savoir l'envoi d'une requête HTTP et donc le rechargement de la page
    event.preventDefault();
    //je met en place un compteur pour donner une position à la liste
    const position = document.querySelectorAll('.column.is-one-quarter.panel').length  
    // récupérer les infos du formulaire
    const formData = new FormData(event.target);
    // j'incrémente position contenu dans formData 
    formData.append("position", position+1)
    // j'initie un await fetch qui check l'URL de l'API en method POST et envoi les données sur le ody pour créer une list en BDD 
    const response = await fetch(`${app.base_url}/lists`, {method: 'POST', body:formData})
    // je transform res en json
    const listData = await response.json()
    // faire apparaitre une nouvelle liste dans le DOM    
    app.makeListInDOM(listData);
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
    // le modifier (nom de la liste)
    cloneTemplate.querySelector('h2').textContent = list.name;  
    // je change la valeur contenu dans l'atribut data-list-id ="" par la valeur de list.id
    cloneTemplate.querySelector('.column[data-list-id=""]').dataset.listId = list.id;
    // ajouter un écouteur d'event click sur le boutons + de la nouvelle carte
    cloneTemplate.querySelector('.panel a.is-pulled-right').addEventListener('click', app.showAddCardModal);    
    // insérer dans la page concrètement
    document.querySelector('.card-lists').appendChild(cloneTemplate);  
  },

  handleAddCardForm: async function(event) {
    // empêcher le rechargement de la page
    event.preventDefault();
    //je met en place un compteur pour donner une position à la carte dans la liste
    const position = document.querySelectorAll('.box[data-card-id=""]').length
    // récupérer les infos du formulaire
    const formData = new FormData(event.target);
    // j'incrémente position contenu dans formData
    formData.append("position", position+1)
    // j'initie un await fetch qui check l'URL de l'API en method POST et envoi les données sur le ody pour créer une list en BDD
    const response = await fetch(`${app.base_url}/cards`, {method: 'POST', body:formData})
    // je transform res en json
    const cardData = await response.json()    
    // créer la carte dans le DOM  
    app.makeCardInDOM(cardData);
    // reset les champs du formulaire
    event.target.reset();
    // cacher la modale
    app.hideModals();
  },

  makeCardInDOM: async function(card) {    
    // récupérer le template de card
    const template = document.getElementById('templateCard');
    // cloner le template
    const cloneTemplate = document.importNode(template.content, true);
    // modifier le titre de la carte
    cloneTemplate.querySelector('.column').textContent = card.title;

    cloneTemplate.querySelector('.box').style.backgroundColor = card.color
    // insérer le clone du template dans la bonne liste du DOM
    cloneTemplate.querySelector(`.box[data-card-id=""]`).dataset.cardId = card.id
    //j'initie listDOM dans makCardInDOM pour donner la card à la list qui possède la bonne list_id
    const listDOM =document.querySelector(`.panel[data-list-id="${card.list_id}"]`);    
    // on insère la carte dans le block container de list
    listDOM.querySelector('.panel-block').appendChild(cloneTemplate);    

  },

  getListsFromAPI: async function(req, res) {

    try {
      // je lance un fetch pour interoger l'API sur la route /list en method GET par déffaut
      const response = await fetch(`${app.base_url}/lists`);  
      // je transform res en json
      const lists = await response.json();
      // je boucle sur la reponse pour récupérer une list à chaque itération
      lists.forEach( (list) => { 
        // je crée une liste à chaque boucle
        app.makeListInDOM(list); 
        // puis je récupére une les cartes dans le tableau d'objet cards 
        list.cards.forEach( (card) =>{ 
          // et je les crées le DOM
          app.makeCardInDOM(card)
        })
      })
    } catch (error) {
      console.log(error)
    }
  },

};


// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init );