function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatPriceInput(event) {
    let input = event.target;
    let value = input.value.replace(/\D/g, '');
    if (value) {
        value = parseFloat(value) / 100;
        input.value = formatCurrency(value);
    } else {
        input.value = '';
    }
}

function addField() {
    var newFields = `
        <div class="form-group input-row">
            <div class="input-group">
                <input type="text" class="form-control" placeholder="Código" name="cod[]">
                <input type="text" class="form-control text-input" placeholder="Nome" name="name[]">
                <input type="text" class="form-control" placeholder="Descrição" name="description[]">
                <input type="text" class="form-control" placeholder="Valor (R$)" name="price[]" oninput="formatPriceInput(event)">
                <div class="input-group-append">
                    <button type="button" class="btn btn-danger btn-sm remove-btn" onclick="removeField(this)">x</button>
                </div>
            </div>
        </div>`;
    
    document.getElementById('forms').insertAdjacentHTML('beforeend', newFields);
}

function removeField(button) {
    var row = button.closest('.input-row'); 
    row.remove();
}

function saveProducts() {
    const form = document.querySelector('form');

    if (!form) {
        console.error('Formulário não encontrado.');
        return;
    }

    const formData = new FormData(form);
    const codes = formData.getAll('cod[]');
    const names = formData.getAll('name[]');
    const descriptions = formData.getAll('description[]');
    const prices = formData.getAll('price[]');

    const products = codes.map((code, index) => ({
        cod: code,
        name: names[index],
        description: descriptions[index],
        price: parseFloat(prices[index].replace(/\D/g, '')) / 100
    }));

    console.log('produtos: ' + JSON.stringify(products));

    fetch('http://127.0.0.1:3309', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ products }),
    })
    .then(response => response.text())
    .then(data => {
        alert('Produtos salvos com sucesso, clique em ok para continuar');
        setTimeout(function() {
            location.reload();
          }, 1500);
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao salvar produtos');
    });
}
