
// on objet qui contient des fonctions
var app = {
  
  // fonction d'initialisation, lancée au chargement de la page
  init: function () {
    app.getListsFromAPI();
    app.addListenerToActions();


      const listsContainer=document.querySelector('.lists-container');
      // console.log('LALALALA',listsContainer)
      //!possibilité de déplacer les listes
      Sortable.create(listsContainer,{
        onEnd:listModule.handleListMoves
      });
    


  },
  addListenerToActions: function() {
    // mettre un écouteur d'évènement clic sur le bouton d'ajout de liste
    document.getElementById('addListButton').addEventListener('click', listModule.showAddListModal);
    // ajouter un écouteur d'évènement click sur les boutons de fermeture de modale
    const btnsCloseModal = document.getElementsByClassName('close');
    // const btnsCloseModal = document.querySelectorAll('.close');
    for(const btnClose of btnsCloseModal) {
      // pour chaque bouton close on déclencher la fonction hideModals
      btnClose.addEventListener('click', utilsModule.hideModals);
    }
    // ajouter un écouteur d'event submit sur le formulaire d'ajout de liste
    document.querySelector('#addListModal form').addEventListener('submit', listModule.handleAddListForm);
    // ajouter un écouteur d'event click sur les boutons +
    // const btnsAddCard = document.querySelectorAll('.panel a.is-pulled-right');
    // for(const btnAddCard of btnsAddCard) {
    //   btnAddCard.addEventListener('click', app.showAddCardModal);
    // }
    // ajouter un écouteur d'évènement submit sur le formulaire d'ajout de carte
    document.querySelector('#addCardModal form').addEventListener('submit', cardModule.handleAddCardForm);
  },
  // récupérer les listes depuis l'API et les afficher dans le DOM
  getListsFromAPI: async function() {
    try {
      // on fait un call API en GET sur /lists pour récupérer l'objet response avec nos listes
      const response = await fetch(`${utilsModule.base_url}/lists`);
      // on appelle la méthode json sur l'objet response obtenu pour récupérer directement notre tableau de listes (la data)
      const lists = await response.json();

      
      
      // dessiner les listes dans le DOM
      for(const list of lists) {
        listModule.makeListInDOM(list);
        for(const card of list.cards) {
          cardModule.makeCardInDOM(card);
        }
      }

    } catch(error) {
      console.error(error);
      alert('Impossible de récupérer les listes !');
    }
  },

  
} 
// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init );


