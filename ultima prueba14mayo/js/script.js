document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('product-form');
    const clearBtn = document.getElementById('clear-btn');
    const recordsContainer = document.getElementById('records-container');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const price = document.getElementById('price').value;
        const imageUrl = document.getElementById('image').value; // Obtener la URL de la imagen

        addRecord(name, price, imageUrl); // Pasar la URL de la imagen en lugar del archivo
        form.reset();
    });

    clearBtn.addEventListener('click', function() {
        form.reset();
    });

    function addRecord(name, price, imageUrl) {
        const recordDiv = document.createElement('div');
        recordDiv.classList.add('record');

        const img = document.createElement('img');
        img.src = imageUrl; // Usar la URL de la imagen
        img.alt = name;

        const namePara = document.createElement('p');
        namePara.textContent = name;

        const pricePara = document.createElement('p');
        pricePara.textContent = `Precio: $${price}`;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.addEventListener('click', function() {
            recordsContainer.removeChild(recordDiv);
        });

        recordDiv.appendChild(img);
        recordDiv.appendChild(namePara);
        recordDiv.appendChild(pricePara);
        recordDiv.appendChild(deleteBtn);

        recordsContainer.appendChild(recordDiv);
    }
});
