const listModule = {
    showAddListModal: function() {
        // afficher la modale à l'écran
        document.getElementById('addListModal').classList.add('is-active');
    },
    handleAddListForm: async function(event) {
        // il faut empêcher le comportement par défaut de l'event submit, à savoir l'envoi d'une requête HTTP et donc le rechargement de la page
        event.preventDefault();
        //je met en place un compteur pour donner une position à la liste
        const position = document.querySelectorAll('.column.is-one-quarter.panel').length 
        console.log(position);       
        // récupérer les infos du formulaire
        const formData = new FormData(event.target);
        // j'incrémente position contenu dans formData
        formData.append("position", position+1)
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
        // console.log(list);
        // créer une nouvelle liste dans le DOM
        // récupérer le template
        const template = document.getElementById('templateList');
        // en faire un clone
        const cloneTemplate = document.importNode(template.content, true);
        // modifier son data attribute id
        cloneTemplate.querySelector('.panel').dataset.listId = list.id;
        const cardsContainer = cloneTemplate.querySelector('.cards-Container');
        Sortable.create(cardsContainer, { group:"cartes",
          onEnd: cardModule.handleCardMoves
        });
        // modifier son data attribute position
        cloneTemplate.querySelector('.panel').dataset.listPosition = list.position;
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
        cloneTemplate.querySelector('.add-list-icon').addEventListener('click', cardModule.showAddCardModal);
        // ajouter un écouteur d'event sur le bouton poubelle pour supprimer la liste
        cloneTemplate.querySelector('.delete-list-icon').addEventListener('click', listModule.deleteList);
        // insérer dans la page concrètement
        document.querySelector('.card-lists').appendChild(cloneTemplate);
        const cardContainer = document.querySelector('.card-lists')
        new Sortable.create(cardContainer);
        
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
      },
      deleteList: async function(event) {
        // si l'utilisateur refuse de supprimer la liste sort de la fonction
        if(!confirm('Voulez-vous vraiment supprimer cette liste ?')) return;
        // récupérer la liste dans le DOM
        const listDOM = event.target.closest('.panel');
        // faire un call API en DELETE sur /lists/:id
        try {
          const response = await fetch(`${utilsModule.base_url}/lists/${listDOM.dataset.listId}`, {
            method: 'DELETE'
          });
          const json = await response.json();
          if(!response.ok) throw json;
          // supprimer la liste dans le DOM
          listDOM.remove();
        } catch(error) {
          alert('Impossible de supprimer la liste !');
          console.error(error);
        }
      },

      
    async handleListMoves(e) {
    const containerElm = e.target;
    const listsElms = containerElm.children
    for (let i = 0; i < listsElms.length; i++) {
      const element = listsElms[i];
      const formData = new FormData();
      formData.set("position", i);

      console.log(Object.fromEntries(formData));
      try {
        const response = await fetch(`${utilsModule.base_url}/lists/${element.dataset.listId}`, {
          method: 'PATCH',
          body: formData
        });
        if (!response.ok) throw new Error(response.status)
      } catch (error) {
        console.log(error);
        alert(error);
      }

    }
  }
}


