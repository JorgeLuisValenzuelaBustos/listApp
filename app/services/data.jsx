export function getItemsShop(){
        return fetch("http://localhost:8000/item-shop/");
    }

export function createListShop(data){
        return fetch("http://localhost:8000/shopping-list/", {
            method: 'POST',
            body: JSON.stringify(data),
        })
}

export function getListsShop(data){
    return fetch(`http://localhost:8000/shopping-list/list_user/?email=${encodeURIComponent(data)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

export function getItemsList(data){
    return fetch(`http://localhost:8000/shopping-list/${data}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

export function deleteListShop(data){
    return fetch(`http://localhost:8000/shopping-list/${data}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

export function putItemShopList(data, id){
    return fetch(`http://localhost:8000/shopping-list/${id}/`, {
        method: 'PUT',
        body: JSON.stringify(data),
    })
}

export function getUserSeries(email){
    return fetch(`http://localhost:8000/series-list/list_user/?email=${email}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

export function getSeries(){
    return fetch(`http://localhost:8000/item-series/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

export function createSerie(data){
    return fetch("http://localhost:8000/series-list/", {
        method: 'POST',
        body: JSON.stringify(data),
    })
}

export function deleteSerie(data){
    return fetch(`http://localhost:8000/series-list/${data}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

export function modifySerie(data, id){
    return fetch(`http://localhost:8000/series-list/${id}/`, {
        method: 'PUT',
        body: JSON.stringify(data),
    })
}