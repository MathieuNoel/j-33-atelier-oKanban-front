const listModule = {
    showAddListModal: function() {
        // afficher la modale à l'écran
        document.getElementById('addListModal').classList.add('is-active');
    },
    handleAddListForm: async function(event) {
        // il faut empêcher le comportement par défaut de l'event submit, à savoir l'envoi d'une requête HTTP et donc le rechargement de la page
        event.preventDefault();
        // récupérer les infos du formulaire
        const formData = new FormData(event.target);
        try {
          // on fait un call API en POST sur /lists
          const response = await fetch(`${utilsModule.base_url}/lists`, {
            method: 'POST',
            body: formData
          });
          const newList = await response.json();
          // faire apparaitre une nouvelle liste dans le DOM
          listModule.makeListInDOM(newList);
        } catch(error) {
          console.error(error);
          alert('Impossible d\'ajouter une liste !');
        }
        
        // reset les champs du formulaire
        event.target.reset();
        // cacher la modale
        utilsModule.hideModals();
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
        // je met en place un ecouteur d'événement au double-click su le titre de la carte
        cloneTemplate.querySelector("h2").addEventListener('dblclick', utilsModule.modifyNameList)        
        // ajouter un écouteur d'event sur le bouton + pour afficher la modale de carte
        cloneTemplate.querySelector('.panel a.is-pulled-right').addEventListener('click', cardModule.showAddCardModal);        
        // insérer dans la page concrètement
        document.querySelector('.card-lists').appendChild(cloneTemplate);
      },

      // je crée une fonction qui modifie le nom de la liste séléctionnée
      updateListName: async function (event){ 
        // je récupère les données du formulaire       
        const formData = new FormData(event.target); 
        // je cible l'événement       
        const origin = event.target;
        // je récupère l'élément du DOM le plus proche qui possède une id
        const idOrigine = origin.closest('[data-list-id]');
        // je récupère juste l'id
        const id = idOrigine.getAttribute('data-list-id');         
        try {
          // je lance un fetch sur l'API sur la route /lists/:id
          const response = await fetch(`${utilsModule.base_url}/lists/${id}`, {
            method: 'PATCH',
            body: formData
          }); 
          // je test si une réponce est bien reçu
          if(!response.ok){
            // sinon
            throw new Error(response.status)
          }         
        } catch (error) {
          console.log(error)
        }
      }
     
}