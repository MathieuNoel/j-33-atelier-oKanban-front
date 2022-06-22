const cardModule = {
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
    handleAddCardForm: async function(event) {
        // empêcher le rechargement de la page
        event.preventDefault();
        // récupérer les infos du formulaire
        const formData = new FormData(event.target);
        // faire un call API en POST sur /cards
        const response = await fetch(`${utilsModule.base_url}/cards`, {
          method: 'POST',
          body: formData
        });
        // on récupère la nouvelle carte
        const newCard = await response.json();
    
        // créer la carte dans le DOM
        cardModule.makeCardInDOM(newCard);
        // reset les champs du formulaire
        event.target.reset();
        // cacher la modale
        utilsModule.hideModals();
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
}