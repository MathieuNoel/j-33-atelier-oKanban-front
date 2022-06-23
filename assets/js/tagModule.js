// const tagModule = {

//   makeTagInDom(tag, cardId) {      
//       const tagTemplateElm = document.querySelector('#tagTemplate');
//       const cloneTagElm = document.importNode(tagTemplateElm.content, true);
//       const tagElm = cloneTagElm.querySelector('[data-tag-id]');
//       tagElm.dataset.tagId = tag.id;
//       const nameTagElm = cloneTagElm.querySelector('.tag-name');
//       nameTagElm.textContent = tag.name;
//       const tagContainerElm = document.querySelector(`[data-card-id="${cardId}"]`);
//       console.log(tagContainerElm)
//       tagContainerElm.append(tagElm);
//       tagElm.addEventListener('dblclick', tagModule.deleteTag)
//   },
//   async handleCloneTag(e) {
//       const tagElm = e.item;
//       const cardElm = e.to;
//       const labelId = tagElm.dataset.tagId;     
//       if (cardElm.querySelectorAll(`[data-tag-id="${labelId}"]`).length> 1) {
//           tagElm.remove();
//           return;
//       }
//       const cardId = cardElm.dataset.cardId;
//       console.log(cardId, " ", labelId)
//       const formData = new FormData();
//       formData.set("labelId", labelId);
//       tagElm.addEventListener('dblclick', tagModule.deleteTag)
//       try {          
//           const response = await fetch(`${utilsModule.base_url}/cards/${cardId}/labels`, {
//               method: 'POST',
//               body: formData
//           });
//           if (!response.ok) {
//               throw new Error(response.status);
//           }
//       } catch (error) {
//           console.log(error);
//           alert(error);
//       }
//   },
//   async deleteTag(e) {
//       if (!confirm('Êtes-vous sûr?')) {return;}
//       const tagToRemoveElm = e.currentTarget;
//       const tagId = tagToRemoveElm.dataset.tagId;
//       const cardElm = tagToRemoveElm.closest("[data-card-id");
//       const cardId = cardElm.dataset.cardId;
//       try {          
//           const response = await fetch(`${tagModule.base_url}/cards/${cardId}/labels/${tagId}`, {
//               method: 'DELETE'
//           });
//           if (!response.ok) {
//               throw new Error(response.status);
//           }
//           tagToRemoveElm.remove();
//       } catch (e) {
//           console.error(e);
//           alert(e);
//       }
//   }
// }