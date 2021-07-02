import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom'

export default function Home() {
    const [data, setData] = useState([]);
    const [q, setQ] = useState("");
    const [searchColumns, setSearchColumns] = useState(["store_name", "username"]);
    const initData = {
        userName: "",
        storeName: "",
        phoneNumber: ""
    }
    const [storeData, setStoreData] = useState(initData);

    useEffect(() => {
        getList()
    }, []);

    function getList() {
        axios.get("http://localhost:9000/api/store/all")
            .then(function (response) {
                if (response.data.error) {
                    alert(response.data.error)
                }
                else setData(response.data.stores)
            })
            .catch(function (response) {
                console.log(response);
            });
    }

    function search(rows) {
        return rows.filter((row) =>
            searchColumns.some(
                (column) =>
                    row[column].toString().toLowerCase().indexOf(q.toLowerCase()) > -1
            )
        );
    }


    const handleStoreInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setStoreData({ ...storeData, [name]: value });
    }

    const handleStoreSubmit = (e) => {
        e.preventDefault();
        const data = { ...storeData }


        axios.post('http://localhost:9000/api/store', data)
            .then(function (response) {
                if (response.data.error) {
                    alert(response.data.error)
                }
                else {
                    alert(response.data.message)
                    getList()
                    setStoreData(initData)
                }
            })
            .catch(function (response) {
                console.log(response);
            });
    }

    const columns = data[0] && Object.keys(data[0]);
    const headers = [`username`, `store_name`, `phone_number`]
    return (
            <div>
            <p>Add a store</p>
                <div>
                    <div>
                        <form action="" onSubmit={handleStoreSubmit}>
                            <div>
                                <label htmlFor="userName">Username</label>
                                <input type="text" name="userName"
                                    value={storeData.userName} onChange={handleStoreInput} autoComplete="off" id="userName" />
                            </div>
                            <div>
                                <label htmlFor="store">Store name</label>
                                <input type="text" name="storeName"
                                    value={storeData.storeName} onChange={handleStoreInput} autoComplete="off" id="store" />
                            </div>
                            <div>
                                <label htmlFor="phone">Phone</label>
                                <input type="text" maxLength="10" name="phoneNumber"
                                    value={storeData.phoneNumber} onChange={handleStoreInput} autoComplete="off" id="phone" />
                            </div>
                            <div>
                                <button type="submit" name="submit" id="submit">Add store</button>
                            </div>

                        </form>
                    </div>

                </div>
                <div>
                    <input type="text" placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
                    <span> Filters: </span>
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
                                <th>Username</th>
                                <th>Store Name</th>
                                <th>Phone</th>
                            </tr>
                        </thead>
                        <tbody>
                            {search(data).map((row) => (
                                <tr>
                                    {headers.map((column) => (
                                        (() => {
                                            if (column == 'username')
                                                return (<td> <Link to={row[column]}>{row[column]}</Link></td>)
                                            else return (<td>{row[column]}</td>)
                                        })()

                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
    );
}
