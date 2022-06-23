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
        // modifier l'id du input hidden du formulaire d'édition
        const editForm = cloneTemplate.querySelector('.edit-list-form');
        editForm.querySelector('input[name="list-id"]').value = list.id;
        // le modifier (nom de la liste)
        const h2 =  cloneTemplate.querySelector('h2');
        h2.textContent = list.name;
        // ajouter un écouteur d'event sur le titre de liste pour afficher le formulaire d'édition
        h2.addEventListener('dblclick', listModule.showEditListForm);
        // ajouter un écouteur d'event sur le formulaire d'édition pour pouvoir modifier le nom de la liste
        editForm.addEventListener('submit', listModule.handleEditListForm);
        // ajouter un écouteur d'event sur le bouton + pour afficher la modale de carte
        cloneTemplate.querySelector('.panel a.is-pulled-right').addEventListener('click', cardModule.showAddCardModal);
        // insérer dans la page concrètement
        document.querySelector('.card-lists').appendChild(cloneTemplate);
      },
      showEditListForm: function(event) {
        // cacher le h2
        event.target.classList.add('is-hidden');
        // afficher le formulaire d'édition
        event.target.nextElementSibling.classList.remove('is-hidden');
      },
      handleEditListForm: async function(event) {
        // empêcher le rechargement de la page
        event.preventDefault();
        // récupérer les infos du formulaire
        const formData = new FormData(event.target);
        const h2 = event.target.previousElementSibling;
        // faire un call API en PATCH sur /lists/:id
        try {
          const response = await fetch(`${utilsModule.base_url}/lists/${formData.get('list-id')}`, {
            method: 'PATCH',
            body: formData
          });
          // ici on récupère la data (la liste modifiée ou l'erreur)
          const json = await response.json();
          // si on a un code d'erreur on renvoie dans le catch
          if(!response.ok) throw json;
          // modifie le h2 dans le DOM (eh oui ça ne se fait pas tout seul !)
          h2.textContent = json.name;
        } catch(error) {
          alert('Impossible de modifier la liste !');
          console.error(error);
        }
        // on réaffiche le titre
        h2.classList.remove('is-hidden');
        // puis on masque le formulaire
        event.target.classList.add('is-hidden');
      }
}