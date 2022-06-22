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
      // je crée une fonction qui agis aux double-click
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

      modifyNameCard: function(event) {
        const titleCardElem = event.target;
        console.log('1111',titleCardElem);
        const cardTitle = titleCardElem.closest('[data-card-id]')
        console.log('22222',cardTitle);
        const title = cardTitle.querySelector('.is-title')
        title.classList.add('is-hidden');
        const formCardElem = cardTitle.querySelector('form')        
        console.log('333333',formCardElem);        
        formCardElem.classList.remove('is-hidden');
        formCardElem.addEventListener('submit', cardModule.updateCardName);
      }


}