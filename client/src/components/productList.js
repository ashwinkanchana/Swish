import React, { useState, useEffect } from "react";
import axios from 'axios';
import { withRouter, useHistory } from 'react-router-dom';


function Products(props) {
    const username = props.match.params.username
    const [storeData, setStoreData] = useState([]);
    const [q, setQ] = useState("");
    const [searchColumns, setSearchColumns] = useState(["product_name"]);
    const initData = {
        productName: "",
        price: "",
        description: "",
        userName: "",
        userID: ""
    }
    const [productsData, setProductsData] = useState(initData);

    useEffect(() => {
        getProductsList()
    }, []);

    function getProductsList() {
        axios.get(`/api/store/${username}`)
            .then(function (response) {
                console.log(response)
                if (response.data.error) {
                    alert(response.data.error)
                }
                else if (response.data){
                    setStoreData(response.data)
                }
                else{
                    alert("Usename not found")
                    window.location.href = '../';
                }

            })
            .catch(function (response) {
                console.log(response);
            });
    }


    const handleStoreInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setProductsData({ ...productsData, [name]: value });
    }

    function search(rows) {
        if(!rows)
            return []
        return rows.filter((row) =>
            searchColumns.some(
                (column) =>
                    row[column].toString().toLowerCase().indexOf(q.toLowerCase()) > -1
            )
        );
    }

    const handleStoreSubmit = (e) => {

        e.preventDefault();
        const data = { ...productsData }
        console.log(storeData)
        data['userID'] = storeData.user_id
        data['userName'] = username
        console.log(data)
        axios.post('/api/product', data)
            .then(function (response) {
                if (response.data.error) {
                    alert(response.data.error)
                }
                else{
                    alert(response.data.message)
                    getProductsList()
                    setProductsData(initData)
                }
            })
            .catch(function (response) {
                console.log(response);
            });
    }
    const columns = [`product_name`, `product_price`, `product_description`]
    return (
        <div>
            <div>
                <div>
                    <form action="" onSubmit={handleStoreSubmit}>
                        <p>Add a product</p>
                        <div>
                            <label htmlFor="productName">Name</label>
                            <input type="text" name="productName"
                                value={productsData.productName} onChange={handleStoreInput} autoComplete="off" id="productName" />
                        </div>
                        <div>
                            <label htmlFor="price">Price</label>
                            <input type="text" name="price"
                                value={productsData.price} onChange={handleStoreInput} autoComplete="off" id="price" />
                        </div>
                        <div>
                            <label htmlFor="description">Description</label>
                            <textarea type="text" name="description"
                                value={productsData.description} onChange={handleStoreInput} id="description" />
                        </div>
                        <input type="hidden" name="userName"
                            value={productsData.userName} onChange={handleStoreInput} id="userName" />
                        <input type="hidden" name="userID"
                            value={productsData.userID} onChange={handleStoreInput} id="userID" />

                        <div>
                            <button type="submit" name="submit" id="submit">Add product</button>
                        </div>

                    </form>
                </div>

            </div>
            <div>
                <input type="text" placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
                {columns &&
                    columns.map((column) => (
                        <label>
                            <input
                                type="checkbox"
                                checked={searchColumns.includes(column)}
                                onChange={(e) => {
                                    const checked = searchColumns.includes(column);
                                    setSearchColumns((prev) =>
                                        checked
                                            ? prev.filter((sc) => sc !== column)
                                            : [...prev, column]
                                    );
                                }}
                            />
                            {column}
                        </label>
                    ))}
            </div>
            <div>
                <table cellPadding={0} cellSpacing={0}>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {search(storeData.products).map((row) => (
                            <tr>
                                {columns.map((column) => (
                                    <td>{row[column]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}
export default withRouter(Products);













