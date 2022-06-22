// module utilitaire utilisé par bon nombre d'autres modules
const utilsModule = {
    base_url: 'http://localhost:3000',
    hideModals: function() {
        // cacher les modales
        const modals = document.getElementsByClassName('modal');
        for(const modal of modals) {
          // on cache toutes les modals
          modal.classList.remove('is-active');
        }
      },
      // je crée une fonction qui agis aux double-click du nom de la liste
      modifyNameList: function(event) { 
        // cible l'élément qui vient d'être double-clicker 
        const titleListElm = event.currentTarget;
        // j'ajoute la classe qui cache le titre de la liste 
        titleListElm.classList.add('is-hidden');
        // je récupère l'élément du DOM le plus proche qui passède une id lié a event
        const listId = titleListElm.closest('[data-list-id]');
        // je récupère le formulaire dans cette même liste
        const formElem = listId.querySelector('form');
        // je retire la class qui cache le form
        formElem.classList.remove('is-hidden');
        // je soumet mon formulair dans FormData
        formElem.addEventListener('submit', listModule.updateListName);
      },

      // je crée une fonction qui agis au click du crayon
      updateCard: function(event) {
        // cible l'élément qui vient d'être clicker
        const titleCardElem = event.target;
        // je récupère l'élément du DOM le plus proche qui passède une id lié a event
        const cardTitle = titleCardElem.closest('[data-card-id]')
        // je récupère le titre que je veux modifier
        const title = cardTitle.querySelector('.is-title')
        // j'ajoute la classe qui cache le titre de la liste  
        title.classList.add('is-hidden');
        // je récupère le formulaire dans cette même carte
        const formCardElem = cardTitle.querySelector('form')        
        // je retire la class qui cache le form     
        formCardElem.classList.remove('is-hidden');
        // je soumet mon formulair dans FormData
        formCardElem.addEventListener('submit', cardModule.updateCard);
      },

      // je crée une fonction qui agis au click de la poubelle pour une cartes
      deleteCard: function(event) {
        // cible l'élément qui vient d'être clicker
        const cardElem = event.target;        
        // je récupère l'élément du DOM le plus proche qui passède une id lié a event
        const cardSelect = cardElem.closest('[data-card-id]');
        // je retouve juste l'id 
        const id = cardSelect.dataset.cardId;
        // je call la fonction deleteCard
        cardModule.deleteCard(id);
      },

      // je crée une fonction qui agis au click de la poubelle pour une liste
      deleteList: function(event) {
        // cible l'élément qui vient d'être clicker
        const listElem = event.target;  
        // je récupère l'élément du DOM le plus proche qui passède une id lié a event
        const listSelect = listElem.closest('[data-list-id]');        
        // je retouve juste l'id 
        const id = listSelect.dataset.listId;  
        // je call la fonction deleteCard
        listModule.deleteList(id);
      }


}